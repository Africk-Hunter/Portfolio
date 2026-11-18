// /.netlify/functions/admin-templates: list, save and delete intake templates. Every call needs the admin password
// (env var ADMIN_PASSWORD) in the x-admin-password header.
//   GET            -> { templates: [...] }   (the built-in default is included unless you have saved your own "default")
//   PUT  {template} -> { template }
//   DELETE ?id=<id> -> { ok: true }
//   POST {link: {template, name, email, client?}} -> { code }   (a short link: /intake?c=<code>)
import { createHash, randomBytes, timingSafeEqual } from 'node:crypto';
import { DEFAULT_TEMPLATE, TEMPLATE_ID_RE } from '../../src/data/intake.js';
import { templateStore, linkStore, sanitizeTemplate } from '../lib/templates.mjs';

const json = (status, body) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });
const digest = (s) => createHash('sha256').update(String(s)).digest();
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

export default async (req) => {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return json(500, { error: 'ADMIN_PASSWORD is not set in Netlify.' });
  if (!timingSafeEqual(digest(req.headers.get('x-admin-password') || ''), digest(expected))) {
    await wait(700); // slows down guessing
    return json(401, { error: 'Wrong password.' });
  }

  const store = templateStore();
  try {
    if (req.method === 'GET') {
      const { blobs } = await store.list();
      const templates = (await Promise.all(blobs.map((b) => store.get(b.key, { type: 'json' })))).filter(Boolean);
      if (!templates.some((t) => t.id === 'default')) templates.unshift({ ...DEFAULT_TEMPLATE, builtin: true });
      return json(200, { templates });
    }
    if (req.method === 'PUT') {
      const body = await req.json().catch(() => null);
      const out = sanitizeTemplate(body && body.template);
      if (out.error) return json(400, { error: out.error });
      await store.setJSON(out.template.id, out.template);
      return json(200, { template: out.template });
    }
    if (req.method === 'POST') {
      const body = await req.json().catch(() => null);
      const l = body && body.link;
      const clean = (v, max) => (typeof v === 'string' ? v.replace(/[\r\n]+/g, ' ').trim().slice(0, max) : '');
      const template = clean(l && l.template, 40).toLowerCase();
      const name = clean(l && l.name, 200);
      const email = clean(l && l.email, 254);
      const client = clean(l && l.client, 80).replace(/[^\w\- ]/g, '');
      if (!TEMPLATE_ID_RE.test(template) || !name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return json(400, { error: 'Add their name and a valid email.' });
      const links = linkStore();
      const letters = 'abcdefghjkmnpqrstuvwxyz23456789';
      let code = '';
      do { code = Array.from(randomBytes(10), (b) => letters[b % letters.length]).join(''); } while (await links.get(code));
      await links.setJSON(code, { template, name, email, client, created: new Date().toISOString() });
      return json(200, { code });
    }
    if (req.method === 'DELETE') {
      const id = new URL(req.url).searchParams.get('id') || '';
      if (!TEMPLATE_ID_RE.test(id)) return json(400, { error: 'Bad id.' });
      await store.delete(id);
      return json(200, { ok: true });
    }
  } catch {
    return json(500, { error: 'Storage error. Try again.' });
  }
  return json(405, { error: 'Method not allowed' });
};
