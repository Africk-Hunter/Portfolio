// GET /.netlify/functions/intake-template?t=<id>: the template the intake page should show. Public (a client's browser calls it).
import { loadTemplate } from '../lib/templates.mjs';

export default async (req) => {
  const t = new URL(req.url).searchParams.get('t') || 'default';
  const template = await loadTemplate(t);
  return new Response(JSON.stringify(template), { status: 200, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });
};
