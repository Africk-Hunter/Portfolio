import React, { useState } from 'react';
import { links } from './data';

// The zine's back cover: the contact form and the elsewhere links. Used by the Zine.
export default function ContactBlock({ innerRef }) {
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  // Same EmailJS service and template as the live portfolio's contact form.
  const send = (e) => {
    e.preventDefault();
    setSending(true);
    const form = e.target;
    // emailjs is only needed on submit, so it stays out of the initial bundle.
    import('emailjs-com')
      .then(({ default: emailjs }) => emailjs.sendForm('service_cxyb1s5', 'template_oylvcbn', form, 'CBZDxMNtzcxxOowCO'))
      .then(() => setSent(true), (err) => { setSending(false); alert('Error: ' + ((err && err.text) || 'could not send, please try again')); });
  };
  return (
    <section className="tz-page tz-back" ref={innerRef}>
      <p className="tz-kicker">Contact</p>
      <h2>Get in touch</h2>
      <p className="tz-stand">Commissions, collaborations, a song you think I&rsquo;d like. All welcome.</p>
      <p className="tz-mail">Or write me directly at <a href="mailto:HunterAfrick@Gmail.com">HunterAfrick@gmail.com</a></p>
      {sent ? (
        <p className="tz-sent">Thanks for your message! I&rsquo;ll get back to you soon.</p>
      ) : (
        <form className="tz-form" onSubmit={send}>
          <input name="name" placeholder="Your name" aria-label="Your name" autoComplete="name" enterKeyHint="next" required />
          <input name="email" type="email" placeholder="Your email address" aria-label="Your email address" autoComplete="email" enterKeyHint="next" required />
          <textarea name="message" rows="5" placeholder="Your message" aria-label="Your message" required />
          <button type="submit" className="tz-jelly" disabled={sending}>{sending ? 'Sending…' : 'Send message'}</button>
        </form>
      )}
      <div className="tz-row">{links.map((l, i) => <a key={l.name} className={`tz-jelly${i ? ' tz-jelly-pale' : ''}`} href={l.href} target="_blank" rel="noopener noreferrer">{l.name}</a>)}</div>
    </section>
  );
}
