// POST /.netlify/functions/intake: validates an intake submission and emails the owner a readable copy through Gmail.
// Env vars (Netlify > Site settings > Environment variables): GMAIL_USER, GMAIL_APP_PASSWORD, and optionally INTAKE_TO
// (defaults to GMAIL_USER, i.e. the mail goes to yourself).
// Answers are never logged and never stored; the email is the only copy that leaves this function.
import nodemailer from 'nodemailer';
import { INTAKE_LIMITS as L } from '../../src/data/intake.js';
import { loadTemplate } from '../lib/templates.mjs';

const json = (status, body) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });
const str = (v, max) => (typeof v === 'string' ? v.replace(/\r\n/g, '\n').trim().slice(0, max) : '');
const oneLine = (s) => s.replace(/[\r\n]+/g, ' ');

export default async (req) => {
  if (req.method !== 'POST') return json(405, { error: 'Method not allowed' });
  const text = await req.text();
  if (text.length > 300000) return json(413, { error: 'Too large' });

  let data;
  try { data = JSON.parse(text || '{}'); } catch { return json(400, { error: 'Bad request' }); }
  if (!data || typeof data !== 'object') return json(400, { error: 'Bad request' });

  // Honeypot: real people never see this field. Pretend it worked so bots learn nothing.
  if (typeof data.website === 'string' && data.website.trim() !== '') return json(200, { ok: true });

  const name = oneLine(str(data.name, L.name));
  const email = oneLine(str(data.email, L.email));
  const client = oneLine(str(data.client, L.client)).replace(/[^\w\- ]/g, '');
  if (!name) return json(400, { error: 'Please add your name.' });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return json(400, { error: 'Please add a valid email address.' });

  const answers = data.answers && typeof data.answers === 'object' ? data.answers : {};
  const { GMAIL_USER, GMAIL_APP_PASSWORD, INTAKE_TO } = process.env;
  if (!GMAIL_USER || !GMAIL_APP_PASSWORD) return json(500, { error: 'Delivery is not set up yet.' });

  // Questions come from the stored template, never from the request, so the email can't be made to say something else.
  const tpl = await loadTemplate(typeof data.template === 'string' ? data.template : 'default');
  const lines = [
    'New client intake', '=================', '',
    `Name:      ${name}`, `Email:     ${email}`, `Client:    ${client || '(none)'}`, `Template:  ${tpl.name || tpl.id}`, `Submitted: ${new Date().toISOString()}`, '',
  ];
  tpl.questions.forEach((q, i) => {
    const a = answers[q.id] || {};
    lines.push('-----------------------------------------', `${i + 1}. ${q.prompt}`, '', str(a.answer, L.answer) || '(no answer)', '');
    const why = str(a.why, L.answer);
    if (why) lines.push('Why:', why, '');
  });

  try {
    // Gmail shows app passwords in groups of four with spaces; both forms work, so strip them.
    const mail = nodemailer.createTransport({ service: 'gmail', auth: { user: GMAIL_USER, pass: GMAIL_APP_PASSWORD.replace(/\s+/g, '') } });
    await mail.sendMail({
      from: `Intake <${GMAIL_USER}>`,
      to: INTAKE_TO || GMAIL_USER,
      replyTo: email,
      subject: `Intake: ${name}${client ? ` (${client})` : ''}`,
      text: lines.join('\n'),
    });
  } catch { return json(502, { error: 'Could not send.' }); }
  return json(200, { ok: true });
};
