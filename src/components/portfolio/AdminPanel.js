import React, { useCallback, useEffect, useState } from 'react';
import { TEMPLATE_LIMITS as T } from '../../data/intake';
import { Drift } from './SubPage';

const PW = 'admin-pw';
const getPw = () => { try { return sessionStorage.getItem(PW) || ''; } catch { return ''; } };
const setPw = (v) => { try { v ? sessionStorage.setItem(PW, v) : sessionStorage.removeItem(PW); } catch { /* ignore */ } };
const slug = (s, max) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+/, '').slice(0, max);

async function api(pw, method, path = '', body) {
  const res = await fetch(`/.netlify/functions/admin-templates${path}`, {
    method, headers: { 'x-admin-password': pw, ...(body ? { 'Content-Type': 'application/json' } : {}) }, body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw Object.assign(new Error(data.error || 'Something went wrong.'), { status: res.status });
  return data;
}

const blank = () => ({
  isNew: true, id: '', name: '',
  intro: { heading: 'Web Design intake form', blurb: '' },
  thanks: { heading: 'Thank you.', blurb: 'I’ve got your answers and I’ll be in touch at {email}. You can close this page.' },
  questions: [{ id: 'q1', prompt: '' }],
});
const toDraft = (t) => ({ ...t, isNew: false, intro: { heading: '', blurb: '', ...t.intro }, thanks: { heading: '', blurb: '', ...t.thanks } });

export default function AdminPanel() {
  const [pw, setPass] = useState('');
  const [entered, setEntered] = useState('');
  const [templates, setTemplates] = useState(null); // null = signed out
  const [draft, setDraft] = useState(null);
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState(false);
  const [clientSlug, setClientSlug] = useState('');
  const [copied, setCopied] = useState(false);

  const signIn = useCallback(async (password) => {
    setBusy(true); setNote('');
    try {
      const { templates: list } = await api(password, 'GET');
      setPass(password); setPw(password); setTemplates(list);
    } catch (e) {
      setPw(''); setNote(e.status === 401 ? 'That password isn’t right.' : e.message);
    } finally { setBusy(false); }
  }, []);

  useEffect(() => { const p = getPw(); if (p) signIn(p); }, [signIn]);

  const signOut = () => { setPw(''); setPass(''); setEntered(''); setTemplates(null); setDraft(null); };
  const edit = (t) => { setDraft(toDraft(t)); setNote(''); setCopied(false); };
  const set = (patch) => setDraft((d) => ({ ...d, ...patch }));
  const setQ = (i, prompt) => set({ questions: draft.questions.map((q, j) => (j === i ? { ...q, prompt } : q)) });
  const move = (i, by) => {
    const qs = draft.questions.slice(); const j = i + by;
    if (j < 0 || j >= qs.length) return;
    [qs[i], qs[j]] = [qs[j], qs[i]]; set({ questions: qs });
  };
  const addQ = () => {
    if (draft.questions.length >= T.questions) return;
    const n = Math.max(0, ...draft.questions.map((q) => Number(q.id.slice(1)))) + 1;
    set({ questions: [...draft.questions, { id: `q${n}`, prompt: '' }] });
  };

  const saveDraft = async () => {
    setBusy(true); setNote('');
    try {
      const { template } = await api(pw, 'PUT', '', { template: draft });
      setTemplates((list) => (list.some((t) => t.id === template.id) ? list.map((t) => (t.id === template.id ? template : t)) : [...list, template]));
      setDraft(toDraft(template)); setNote('Saved.');
    } catch (e) { setNote(e.message); } finally { setBusy(false); }
  };

  const remove = async () => {
    const builtin = draft.id === 'default';
    if (!window.confirm(builtin ? 'Reset the default template to the built-in one?' : `Delete “${draft.name}”? Links that use it will fall back to the default template.`)) return;
    setBusy(true); setNote('');
    try {
      await api(pw, 'DELETE', `?id=${encodeURIComponent(draft.id)}`);
      const { templates: list } = await api(pw, 'GET');
      setTemplates(list); setDraft(null);
    } catch (e) { setNote(e.message); } finally { setBusy(false); }
  };

  const link = draft && draft.id ? `${window.location.origin}/intake${draft.id === 'default' ? '' : `?t=${draft.id}`}${clientSlug ? `${draft.id === 'default' ? '?' : '&'}client=${clientSlug}` : ''}` : '';
  const copy = async () => {
    try { await navigator.clipboard.writeText(link); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch { setNote('Couldn’t copy. Select the link and copy it.'); }
  };

  // ── signed out ──
  if (templates === null) {
    return (
      <div className="in-wrap">
        <p className="tz-strip"><span>Hunter Africk &middot; Admin</span><span>Private</span></p>
        <form className="in-card tz-tank in-tank" onSubmit={(e) => { e.preventDefault(); signIn(entered); }}>
          <Drift bubbles={5} />
          <p className="tz-kicker">Backstage</p>
          <h1>Intake templates</h1>
          <label className="in-label" htmlFor="ad-pw">Password</label>
          <input id="ad-pw" className="in-input" type="password" autoComplete="current-password" value={entered} onChange={(e) => setEntered(e.target.value)} />
          <p className={`in-note${note ? ' is-on' : ''}`} role="status" aria-live="polite">{note}</p>
          <div className="tz-row in-nav"><button type="submit" className="tz-jelly" disabled={busy || !entered}>{busy ? 'Checking…' : 'Open'}</button></div>
        </form>
      </div>
    );
  }

  // ── signed in ──
  return (
    <div className="in-wrap ad-wrap">
      <p className="tz-strip"><span>Hunter Africk &middot; Admin</span><button type="button" className="ad-out" onClick={signOut}>Sign out</button></p>
      <div className="ad-grid">
        <aside className="ad-list" aria-label="Templates">
          <p className="tz-kicker">Templates</p>
          <ul>
            {templates.map((t) => (
              <li key={t.id}><button type="button" className={draft && draft.id === t.id && !draft.isNew ? 'is-on' : ''} onClick={() => edit(t)}>
                <b>{t.name}</b><span>{t.questions.length} questions{t.builtin ? ' · built-in' : ''}</span></button></li>
            ))}
          </ul>
          <button type="button" className="tz-jelly tz-jelly-s" onClick={() => { setDraft(blank()); setNote(''); }}>+ New template</button>
        </aside>

        {draft ? (
          <section className="in-sheet ad-editor" aria-label="Edit template">
            <p className="in-tape"><span>{draft.isNew ? 'New' : 'Editing'}</span></p>
            <label className="in-label" htmlFor="ad-name">Template name</label>
            <input id="ad-name" className="in-input" maxLength={T.name} value={draft.name} onChange={(e) => set({ name: e.target.value, ...(draft.isNew ? { id: slug(e.target.value, T.id) } : {}) })} />
            <label className="in-label" htmlFor="ad-id">Link name</label>
            <input id="ad-id" className="in-input" maxLength={T.id} value={draft.id} readOnly={!draft.isNew} onChange={(e) => set({ id: slug(e.target.value, T.id) })} />
            <p className="in-fine">Used in the link. {draft.isNew ? 'It can’t be changed after saving.' : ''}</p>

            <h2 className="ad-h">Welcome screen</h2>
            <label className="in-label" htmlFor="ad-ih">Heading</label>
            <input id="ad-ih" className="in-input" maxLength={T.heading} value={draft.intro.heading} onChange={(e) => set({ intro: { ...draft.intro, heading: e.target.value } })} />
            <label className="in-label" htmlFor="ad-ib">Intro text (optional)</label>
            <textarea id="ad-ib" className="in-input" rows={3} maxLength={T.blurb} value={draft.intro.blurb} onChange={(e) => set({ intro: { ...draft.intro, blurb: e.target.value } })} />

            <h2 className="ad-h">Questions</h2>
            <ol className="ad-qs">
              {draft.questions.map((q, i) => (
                <li key={q.id}>
                  <label className="in-label" htmlFor={`ad-${q.id}`}>Question {i + 1}</label>
                  <textarea id={`ad-${q.id}`} className="in-input" rows={2} maxLength={T.prompt} value={q.prompt} onChange={(e) => setQ(i, e.target.value)} />
                  <div className="ad-qbtns">
                    <button type="button" aria-label={`Move question ${i + 1} up`} disabled={i === 0} onClick={() => move(i, -1)}>&uarr;</button>
                    <button type="button" aria-label={`Move question ${i + 1} down`} disabled={i === draft.questions.length - 1} onClick={() => move(i, 1)}>&darr;</button>
                    <button type="button" aria-label={`Remove question ${i + 1}`} disabled={draft.questions.length === 1} onClick={() => set({ questions: draft.questions.filter((_, j) => j !== i) })}>&times;</button>
                  </div>
                </li>
              ))}
            </ol>
            <button type="button" className="tz-jelly tz-jelly-pale tz-jelly-s" onClick={addQ} disabled={draft.questions.length >= T.questions}>+ Add question</button>

            <h2 className="ad-h">Thank-you screen</h2>
            <label className="in-label" htmlFor="ad-th">Heading</label>
            <input id="ad-th" className="in-input" maxLength={T.heading} value={draft.thanks.heading} onChange={(e) => set({ thanks: { ...draft.thanks, heading: e.target.value } })} />
            <label className="in-label" htmlFor="ad-tb">Text (use {'{email}'} for their address)</label>
            <textarea id="ad-tb" className="in-input" rows={3} maxLength={T.blurb} value={draft.thanks.blurb} onChange={(e) => set({ thanks: { ...draft.thanks, blurb: e.target.value } })} />

            <p className={`in-note${note ? ' is-on' : ''}`} role="status" aria-live="polite">{note}</p>
            <div className="tz-row in-nav">
              <button type="button" className="tz-jelly" onClick={saveDraft} disabled={busy}>{busy ? 'Saving…' : 'Save template'}</button>
              {!draft.isNew && <button type="button" className="tz-jelly tz-jelly-pale" onClick={remove} disabled={busy}>{draft.id === 'default' ? 'Reset to built-in' : 'Delete'}</button>}
            </div>

            {!draft.isNew && (
              <div className="ad-share">
                <h2 className="ad-h">Send it</h2>
                <label className="in-label" htmlFor="ad-client">Who is it for? (optional tag, shows up in the email)</label>
                <input id="ad-client" className="in-input" maxLength={80} placeholder="e.g. dr-smith" value={clientSlug} onChange={(e) => setClientSlug(slug(e.target.value, 80))} />
                <label className="in-label" htmlFor="ad-link">Link</label>
                <input id="ad-link" className="in-input" readOnly value={link} onFocus={(e) => e.target.select()} />
                <div className="tz-row in-nav">
                  <button type="button" className="tz-jelly tz-jelly-s" onClick={copy}>{copied ? 'Copied' : 'Copy link'}</button>
                  <a className="tz-jelly tz-jelly-pale tz-jelly-s" href={link} target="_blank" rel="noopener noreferrer">Preview</a>
                </div>
              </div>
            )}
          </section>
        ) : (
          <section className="in-sheet ad-empty"><p className="tz-stand">Pick a template to edit, or make a new one.</p>{note && <p className="in-note is-on" role="status">{note}</p>}</section>
        )}
      </div>
    </div>
  );
}

