// The built-in intake template. Templates you make in /admin are stored in Netlify Blobs; this one is the fallback that is
// always available (used when no template is named in the link, when a template is missing, and when the store can't be reached).
// The page and the Netlify functions both read this file, so the email always carries the exact text the client saw.
export const QUESTIONS = [
  { id: 'q1', prompt: 'Describe a room where you instantly relax. What’s in it, and what time of day is it?' },
  { id: 'q2', prompt: 'If your practice were a type of weather, which would it be?' },
  { id: 'q3', prompt: 'Picture a bookshelf you love. How is it organized, and what’s on it?' },
  { id: 'q4', prompt: 'Name a person or brand whose way of talking you love. What about it?' },
  { id: 'q5', prompt: 'What’s something popular in your field that makes you cringe a little?' },
  { id: 'q6', prompt: 'Think of a place that’s technically “nice” but makes you tense. What’s wrong with it?' },
  { id: 'q7', prompt: 'When you walk into a new space, do you want to be guided, or left alone to wander?' },
  { id: 'q8', prompt: 'Think of the last person who said your work made a difference. How did they arrive, and how did they leave?' },
];

export const DEFAULT_TEMPLATE = {
  id: 'default',
  name: 'Default',
  intro: {
    heading: 'Web Design intake form',
    blurb: '',
  },
  thanks: {
    heading: 'Thank you.',
    blurb: 'I’ve got your answers and I’ll be in touch at {email}. You can close this page.',
  },
  questions: QUESTIONS,
};

export const INTAKE_LIMITS = { answer: 10000, name: 200, email: 254, client: 80 };
// What an admin may put in a template.
export const TEMPLATE_LIMITS = { id: 40, name: 80, heading: 200, blurb: 2000, prompt: 500, questions: 30 };
export const TEMPLATE_ID_RE = /^[a-z0-9][a-z0-9-]{0,39}$/;
