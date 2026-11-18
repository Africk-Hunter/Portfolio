import React, { useEffect, useRef, useState } from 'react';
import { DEFAULT_TEMPLATE, INTAKE_LIMITS } from '../../data/intake';
import { Drift } from './SubPage';

const keyFor = (id) => `intake-v2-${id}`;
const load = (id) => { try { return JSON.parse(localStorage.getItem(keyFor(id))) || {}; } catch { return {}; } };
const save = (id, v) => { try { localStorage.setItem(keyFor(id), JSON.stringify(v)); } catch { /* storage unavailable: the form still works */ } };
const wipe = (id) => { try { localStorage.removeItem(keyFor(id)); } catch { /* ignore */ } };
const EMAIL_OK = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Which template this link asks for (?t=<id>), falling back to the built-in one if it can't be fetched (e.g. local dev).
async function fetchTemplate(id, code) {
  try {
    const res = await fetch(`/.netlify/functions/intake-template?${code ? `c=${encodeURIComponent(code)}` : `t=${encodeURIComponent(id)}`}`);
    const t = res.ok ? await res.json() : null;
    return t && Array.isArray(t.questions) && t.questions.length ? t : DEFAULT_TEMPLATE;
  } catch { return DEFAULT_TEMPLATE; }
}

// step 0 = welcome, 1..total = questions, total + 1 = thank you.
export default function IntakeForm() {
  const [tpl, setTpl] = useState(null);
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [answers, setAnswers] = useState({});
  const [client, setClient] = useState('');
  const [known, setKnown] = useState(false); // name and email came with the link
  const [website, setWebsite] = useState(''); // honeypot
  const [note, setNote] = useState('');        // inline message (validation, empty warning, send error)
  const [warned, setWarned] = useState({});
  const [sending, setSending] = useState(false);
  const [ready, setReady] = useState(false);
  const head = useRef(null);
  const questions = (tpl || DEFAULT_TEMPLATE).questions;
  const total = questions.length;

  // Fetch the template, then restore saved answers for it (the page is prerendered, so neither is available at first render).
  useEffect(() => {
    let live = true;
    const params = new URLSearchParams(window.location.search);
    (async () => {
      const t = await fetchTemplate(params.get('t') || 'default', params.get('c'));
      if (!live) return;
      const s = load(t.id);
      // A link made in /admin can carry the client's name and email (?name=&email=), so they don't have to type them.
      // A short link (?c=) has them stored server-side; older long links carry them in the URL (?name=&email=).
      const pf = t.prefill || {};
      const pn = String(pf.name || params.get('name') || '').trim().slice(0, INTAKE_LIMITS.name);
      const pe = String(pf.email || params.get('email') || '').trim().slice(0, INTAKE_LIMITS.email);
      if (pn && EMAIL_OK.test(pe)) { setKnown(true); setName(pn); setEmail(pe); } else {
        if (s.name) setName(s.name);
        if (s.email) setEmail(s.email);
      }
      if (s.answers) setAnswers(s.answers);
      // With name and email already known there is nothing to ask on the welcome screen, so open on the first question.
      const saved = Number.isInteger(s.step) && s.step >= 0 && s.step <= t.questions.length ? s.step : 0;
      setStep(pn && EMAIL_OK.test(pe) ? Math.max(1, saved) : saved);
      const q = pf.client || params.get('client');
      setClient(q ? String(q).slice(0, INTAKE_LIMITS.client) : (s.client || ''));
      setTpl(t);
      setReady(true);
    })();
    return () => { live = false; };
  }, []);

  useEffect(() => { if (ready && step <= total) save(tpl.id, { name, email, answers, step, client }); }, [ready, tpl, total, name, email, answers, step, client]);
  // Move focus to the new screen's heading so keyboard and screen-reader users land at the top of it.
  useEffect(() => { if (ready && head.current) head.current.focus({ preventScroll: true }); }, [step, ready]);

  const go = (n) => { setNote(''); setStep(n); document.querySelector('.tz-shell')?.scrollTo?.(0, 0); };
  const setField = (id, key, value) => setAnswers((a) => ({ ...a, [id]: { ...a[id], [key]: value } }));

  const submit = async () => {
    setSending(true); setNote('');
    try {
      const res = await fetch('/.netlify/functions/intake', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, client, answers, website, template: tpl.id }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.error || 'send failed');
      wipe(tpl.id); setStep(total + 1);
    } catch (e) {
      setNote(`That didn’t go through${e.message && e.message !== 'send failed' ? ` (${e.message})` : ''}. Your answers are still here, so nothing is lost. Please try again in a moment.`);
    } finally { setSending(false); }
  };

  const next = () => {
    if (step === 0) {
      if (!name.trim()) return setNote('Please add your name.');
      if (!EMAIL_OK.test(email.trim())) return setNote('Please add a valid email address.');
      return go(1);
    }
    const q = questions[step - 1];
    const empty = !(answers[q.id]?.answer || '').trim();
    if (empty && !warned[q.id]) { setWarned((w) => ({ ...w, [q.id]: true })); return setNote('Press Next again to skip it.'); }
    return step === total ? submit() : go(step + 1);
  };

  if (!ready) return <div className="in-card" aria-hidden="true" style={{ minHeight: 320 }} />;

  const folio = <p className="tz-strip"><span>Hunter Africk &middot; Intake</span><span>{step > total ? 'Fin.' : `${total} questions`}</span></p>;

  if (step === total + 1) {
    return (
      <div className="in-wrap">
        {folio}
        <div className="in-card tz-tank in-tank in-done">
          <Drift bubbles={7} />
          <p className="tz-kicker">All done</p>
          <h1 ref={head} tabIndex={-1}>{tpl.thanks?.heading || 'Thank you.'}</h1>
          {tpl.thanks?.blurb && <p className="tz-novel-dek">{tpl.thanks.blurb.replace('{email}', email)}</p>}
        </div>
      </div>
    );
  }

  const q = step > 0 ? questions[step - 1] : null;
  const intro = step === 0;
  return (
    <div className="in-wrap">
      {folio}
      <form key={step} className={`in-card ${intro ? 'tz-tank in-tank' : 'in-sheet'}`} onSubmit={(e) => { e.preventDefault(); next(); }} noValidate>
        {/* honeypot: hidden from people and from assistive tech (inline, so the tank's own rules can't un-hide it) */}
        <div className="in-hp" aria-hidden="true" style={{ position: 'absolute' }}><label>Website<input tabIndex={-1} autoComplete="off" name="website" value={website} onChange={(e) => setWebsite(e.target.value)} /></label></div>

        {intro ? (
          <>
            <p className="tz-kicker">Before we begin</p>
            <h1 ref={head} tabIndex={-1}>{tpl.intro?.heading || 'Intake form'}</h1>
            {tpl.intro?.blurb && <p className="tz-novel-dek">{tpl.intro.blurb}</p>}
            {known ? (
              <p className="tz-novel-dek">Hi {name}. Press Begin whenever you&rsquo;re ready.</p>
            ) : (
              <div className="in-who">
                <div><label className="in-label" htmlFor="in-name">Your name</label>
                  <input id="in-name" className="in-input" autoComplete="name" required maxLength={INTAKE_LIMITS.name} value={name} onChange={(e) => setName(e.target.value)} /></div>
                <div><label className="in-label" htmlFor="in-email">Your email</label>
                  <input id="in-email" className="in-input" type="email" autoComplete="email" required maxLength={INTAKE_LIMITS.email} value={email} onChange={(e) => setEmail(e.target.value)} /></div>
              </div>
            )}
            <p className="in-fine">Your answers are used only to shape your website.</p>
          </>
        ) : (
          <>
            <p className="in-tape" aria-live="polite"><span>{step} of {total}</span></p>
            <ol className="in-dots" role="progressbar" aria-label="Progress" aria-valuemin={0} aria-valuemax={total} aria-valuenow={step}>
              {questions.map((x, i) => <li key={x.id} className={i + 1 < step ? 'is-done' : i + 1 === step ? 'is-now' : ''} />)}
            </ol>
            <h1 ref={head} tabIndex={-1} className="in-q">{q.prompt}</h1>
            <label className="in-label" htmlFor={`${q.id}-a`}>Your answer</label>
            <textarea id={`${q.id}-a`} className="in-input in-big" rows={7} maxLength={INTAKE_LIMITS.answer} value={answers[q.id]?.answer || ''} onChange={(e) => setField(q.id, 'answer', e.target.value)} />
            <label className="in-label" htmlFor={`${q.id}-w`}>Why? (optional)</label>
            <textarea id={`${q.id}-w`} className="in-input" rows={4} maxLength={INTAKE_LIMITS.answer} value={answers[q.id]?.why || ''} onChange={(e) => setField(q.id, 'why', e.target.value)} />
          </>
        )}

        <p className={`in-note${note ? ' is-on' : ''}`} role="status" aria-live="polite">{note}</p>
        <div className="tz-row in-nav">
          {step > (known ? 1 : 0) && <button type="button" className="tz-jelly tz-jelly-pale" onClick={() => go(step - 1)} disabled={sending}>Back</button>}
          <button type="submit" className="tz-jelly" disabled={sending}>{intro ? 'Begin' : step === total ? (sending ? 'Sending…' : 'Send') : 'Next'}</button>
        </div>
      </form>
    </div>
  );
}
