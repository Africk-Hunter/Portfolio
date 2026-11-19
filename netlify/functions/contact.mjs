// POST /.netlify/functions/contact: the site's contact form. Emails the owner the message through Gmail.
// Uses the same env vars as the intake function: GMAIL_USER, GMAIL_APP_PASSWORD, and optionally CONTACT_TO
// (defaults to GMAIL_USER, i.e. the mail goes to yourself). Replying to the email replies to the sender.
import nodemailer from 'nodemailer';

const LIMITS = { name: 200, email: 254, message: 10000 };
const json = (status, body) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });
const str = (v, max) => (typeof v === 'string' ? v.replace(/\r\n/g, '\n').trim().slice(0, max) : '');
const oneLine = (s) => s.replace(/[\r\n]+/g, ' ');

export default async (req) => {
  if (req.method !== 'POST') return json(405, { error: 'Method not allowed' });
  const text = await req.text();
  if (text.length > 50000) return json(413, { error: 'Too large' });

  let data;
  try { data = JSON.parse(text || '{}'); } catch { return json(400, { error: 'Bad request' }); }
  if (!data || typeof data !== 'object') return json(400, { error: 'Bad request' });

  // Honeypot: real people never see this field. Pretend it worked so bots learn nothing.
  if (typeof data.website === 'string' && data.website.trim() !== '') return json(200, { ok: true });

  const name = oneLine(str(data.name, LIMITS.name));
  const email = oneLine(str(data.email, LIMITS.email));
  const message = str(data.message, LIMITS.message);
  if (!name) return json(400, { error: 'Please add your name.' });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return json(400, { error: 'Please add a valid email address.' });
  if (!message) return json(400, { error: 'Please add a message.' });

  const { GMAIL_USER, GMAIL_APP_PASSWORD, CONTACT_TO } = process.env;
  if (!GMAIL_USER || !GMAIL_APP_PASSWORD) return json(500, { error: 'Delivery is not set up yet.' });

  try {
    // Gmail shows app passwords in groups of four with spaces; both forms work, so strip them.
    const mail = nodemailer.createTransport({ service: 'gmail', auth: { user: GMAIL_USER, pass: GMAIL_APP_PASSWORD.replace(/\s+/g, '') } });
    await mail.sendMail({
      from: `Portfolio contact <${GMAIL_USER}>`,
      to: CONTACT_TO || GMAIL_USER,
      replyTo: email,
      subject: `Contact: ${name}`,
      text: [`Name:      ${name}`, `Email:     ${email}`, `Submitted: ${new Date().toISOString()}`, '', message].join('\n'),
    });
  } catch { return json(502, { error: 'Could not send.' }); }
  return json(200, { ok: true });
};
