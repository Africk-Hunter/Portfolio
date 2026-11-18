// GET /.netlify/functions/intake-template?t=<id>   the template the intake page should show. Public (a client's browser calls it).
// GET /.netlify/functions/intake-template?c=<code> a short link made in /admin: the template plus the name, email and tag it was made for.
import { loadTemplate, linkStore, CODE_RE } from '../lib/templates.mjs';

const reply = (body) => new Response(JSON.stringify(body), { status: 200, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });

export default async (req) => {
  const params = new URL(req.url).searchParams;
  const code = params.get('c');
  if (code && CODE_RE.test(code)) {
    try {
      const link = await linkStore().get(code, { type: 'json' });
      if (link) return reply({ ...(await loadTemplate(link.template)), prefill: { name: link.name, email: link.email, client: link.client } });
    } catch { /* fall through to the default template */ }
  }
  return reply(await loadTemplate(params.get('t') || 'default'));
};
