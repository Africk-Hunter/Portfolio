import React, { useState } from 'react';
import { links } from './data';

// Hides the honeypot field from people but not from bots. Inline so it doesn't depend on intake.scss being loaded.
const HONEYPOT = { position: 'absolute', left: '-9999px', width: 1, height: 1, overflow: 'hidden' };

// The zine's back cover: the contact form and the elsewhere links. Used by the Zine.
export default function ContactBlock({ innerRef }) {
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [note, setNote] = useState('');
  // Posts to the contact Netlify function, which emails the message through Gmail (same setup as the intake form).
  const send = async (e) => {
    e.preventDefault();
    setSending(true); setNote('');
    const f = new FormData(e.target);
    try {
      const res = await fetch('/.netlify/functions/contact', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: f.get('name'), email: f.get('email'), message: f.get('message'), website: f.get('website') }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.error || '');
      setSent(true);
    } catch (err) {
      setNote(`That didn’t go through${err.message ? ` (${err.message})` : ''}. Please try again, or email me directly.`);
    } finally { setSending(false); }
  };
  return (
    <section className="tz-page tz-back" ref={innerRef}>
      <p className="tz-kicker">Contact</p>
      <h2>Get in touch</h2>
      <p className="tz-stand">Commissions, collaborations, or even a song you think I&rsquo;d like.</p>
      <p className="tz-mail">Or write me directly at <a href="mailto:HunterAfrick@Gmail.com">HunterAfrick@gmail.com</a></p>
      {sent ? (
        <p className="tz-sent">Thanks for your message! I&rsquo;ll get back to you soon.</p>
      ) : (
        <form className="tz-form" onSubmit={send}>
          <div aria-hidden="true" style={HONEYPOT}><label>Website<input tabIndex={-1} autoComplete="off" name="website" /></label></div>
          <input name="name" placeholder="Your name" aria-label="Your name" autoComplete="name" enterKeyHint="next" required />
          <input name="email" type="email" placeholder="Your email address" aria-label="Your email address" autoComplete="email" enterKeyHint="next" required />
          <textarea name="message" rows="5" placeholder="Your message" aria-label="Your message" required />
          {note && <p className="tz-mail" role="alert">{note}</p>}
          <button type="submit" className="tz-jelly" disabled={sending}>{sending ? 'Sending…' : 'Send message'}</button>
        </form>
      )}
      <div className="tz-row">{links.map((l) => <a key={l.name} className="tz-jelly tz-jelly-pale" href={l.href} target="_blank" rel="noopener noreferrer">{l.name}</a>)}</div>
    </section>
  );
}
