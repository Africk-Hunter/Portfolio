// Shared by the intake functions: template validation and lookup. Lives outside netlify/functions so it isn't deployed as an endpoint.
import { getStore } from '@netlify/blobs';
import { DEFAULT_TEMPLATE, TEMPLATE_LIMITS as T, TEMPLATE_ID_RE } from '../../src/data/intake.js';

export const templateStore = () => getStore('intake-templates');
// Short links made in /admin: code -> { template, name, email, client }. Keeps the client's details out of the URL.
export const linkStore = () => getStore('intake-links');
export const CODE_RE = /^[a-z0-9]{10}$/;

const clean = (v, max) => (typeof v === 'string' ? v.replace(/\r\n/g, '\n').trim().slice(0, max) : '');

// Turns whatever the admin panel sent into a template we are willing to store, or says what is wrong with it.
export function sanitizeTemplate(raw) {
  if (!raw || typeof raw !== 'object') return { error: 'Bad template.' };
  const id = typeof raw.id === 'string' ? raw.id.trim().toLowerCase() : '';
  if (!TEMPLATE_ID_RE.test(id)) return { error: 'The link name may only use lowercase letters, numbers and dashes (up to 40).' };
  const name = clean(raw.name, T.name);
  if (!name) return { error: 'Give the template a name.' };
  if (!Array.isArray(raw.questions) || raw.questions.length === 0) return { error: 'Add at least one question.' };
  if (raw.questions.length > T.questions) return { error: `At most ${T.questions} questions.` };
  const seen = new Set();
  const questions = [];
  for (const q of raw.questions) {
    const qid = q && typeof q.id === 'string' ? q.id : '';
    const prompt = clean(q && q.prompt, T.prompt);
    if (!/^q\d{1,3}$/.test(qid) || seen.has(qid)) return { error: 'Bad question list.' };
    if (!prompt) return { error: 'Every question needs some text.' };
    seen.add(qid);
    questions.push({ id: qid, prompt });
  }
  return {
    template: {
      id, name,
      intro: { heading: clean(raw.intro && raw.intro.heading, T.heading), blurb: clean(raw.intro && raw.intro.blurb, T.blurb) },
      thanks: { heading: clean(raw.thanks && raw.thanks.heading, T.heading), blurb: clean(raw.thanks && raw.thanks.blurb, T.blurb) },
      questions,
      updatedAt: new Date().toISOString(),
    },
  };
}

// The template for a link: the stored one, else the built-in default. Never throws, so a storage hiccup can't break a client's form.
export async function loadTemplate(id) {
  if (typeof id === 'string' && TEMPLATE_ID_RE.test(id)) {
    try {
      const t = await templateStore().get(id, { type: 'json' });
      if (t && Array.isArray(t.questions)) return t;
    } catch { /* fall through to the default */ }
  }
  return DEFAULT_TEMPLATE;
}
