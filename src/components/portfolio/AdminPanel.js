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
const core = (d) => JSON.stringify({ id: d.id, name: d.name, intro: d.intro, thanks: d.thanks, questions: d.questions }); // what counts as an edit
const toDraft = (t) => ({ ...t, isNew: false, intro: { heading: '', blurb: '', ...t.intro }, thanks: { heading: '', blurb: '', ...t.thanks } });

export default function AdminPanel() {
  const [pw, setPass] = useState('');
  const [entered, setEntered] = useState('');
  const [templates, setTemplates] = useState(null); // null = signed out
  const [draft, setDraft] = useState(null);
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState(false);
  const [clientSlug, setClientSlug] = useState('');
  const [toName, setToName] = useState('');
  const [toEmail, setToEmail] = useState('');
  const [copied, setCopied] = useState(false);
  const [made, setMade] = useState({ key: '', code: '' }); // the short code last made, and the fields it was made for
  const [tab, setTab] = useState('q');   // q = questions, s = screens, send
  const [snap, setSnap] = useState('');   // the draft as last saved, to tell when there are unsaved changes

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
  const open = (d, fresh) => { setDraft(d); setSnap(fresh ? '' : core(d)); };
  const edit = (t) => { open(toDraft(t)); setTab('q'); setNote(''); setCopied(false); };
  const dirty = !!draft && core(draft) !== snap;
  const set = (patch) => { setNote(''); setDraft((d) => ({ ...d, ...patch })); };
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

  // Saves an exact copy right away and opens it. The copy gets "Copy of" in its name and a free "-copy" link name.
  // It copies what is on screen, so unsaved edits come along too.
  const duplicate = async () => {
    const taken = new Set(templates.map((t) => t.id));
    let id = slug(`${draft.id}-copy`, T.id); let n = 2;
    while (taken.has(id)) id = slug(`${draft.id}-copy-${n++}`, T.id);
    setBusy(true); setNote('');
    try {
      const { template } = await api(pw, 'PUT', '', { template: { ...draft, id, name: `Copy of ${draft.name}`.slice(0, T.name) } });
      setTemplates((list) => [...list, template]);
      open(toDraft(template)); setCopied(false); setNote('Copied. You’re now editing the copy.');
    } catch (e) { setNote(e.message); } finally { setBusy(false); }
  };

  const saveDraft = async () => {
    setBusy(true); setNote('');
    try {
      const { template } = await api(pw, 'PUT', '', { template: draft });
      setTemplates((list) => (list.some((t) => t.id === template.id) ? list.map((t) => (t.id === template.id ? template : t)) : [...list, template]));
      open(toDraft(template)); setNote('Saved.');
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

  // Name and email only go into the link when both are filled in (the form then skips asking for them).
  // With a name and email the link is a short code (/intake?c=k7m2x9qpwa) made on request; without them it is already short.
  const needsCode = !!(toName.trim() && toEmail.trim());
  const key = [draft && draft.id, toName.trim(), toEmail.trim(), clientSlug].join('|');
  const code = made.key === key ? made.code : ''; // editing any of those fields retires the old code
  const link = (() => {
    if (!draft || !draft.id) return '';
    if (needsCode) return code ? `${window.location.origin}/intake?c=${code}` : '';
    const p = new URLSearchParams();
    if (draft.id !== 'default') p.set('t', draft.id);
    if (clientSlug) p.set('client', clientSlug);
    const qs = p.toString();
    return `${window.location.origin}/intake${qs ? `?${qs}` : ''}`;
  })();
  const makeLink = async () => {
    setBusy(true); setNote('');
    try {
      const { code: c } = await api(pw, 'POST', '', { link: { template: draft.id, name: toName.trim(), email: toEmail.trim(), client: clientSlug } });
      setMade({ key, code: c });
    } catch (e) { setNote(e.message); } finally { setBusy(false); }
  };
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
          <button type="button" className="tz-jelly tz-jelly-s" onClick={() => { open(blank(), true); setTab('q'); setNote(''); }}>+ New template</button>
        </aside>

        {draft ? (
          <section className="ad-editor" aria-label="Edit template">
            <header className="ad-head">
              <div className="ad-title">
                <label className="ad-lab" htmlFor="ad-name">Template name</label>
                <input id="ad-name" className="ad-name" placeholder="Name this template" maxLength={T.name} value={draft.name} onChange={(e) => set({ name: e.target.value, ...(draft.isNew ? { id: slug(e.target.value, T.id) } : {}) })} />
              </div>
              {!draft.isNew && <button type="button" className="tz-jelly tz-jelly-pale tz-jelly-s" onClick={duplicate} disabled={busy}>Duplicate</button>}
              <div className="ad-linkname">
                <label htmlFor="ad-id">Link name</label>
                <span aria-hidden="true">/intake?t=</span>
                <input id="ad-id" maxLength={T.id} value={draft.id} readOnly={!draft.isNew} size={Math.max(8, draft.id.length + 1)} onChange={(e) => set({ id: slug(e.target.value, T.id) })} />
                {draft.isNew && <small>Can’t be changed after saving.</small>}
              </div>
            </header>

            <div className="ad-tabs" role="tablist" aria-label="Template sections">
              {[['q', 'Questions'], ['s', 'Welcome & thank-you'], ['send', 'Send']].map(([id, label]) => (
                <button key={id} type="button" role="tab" id={`ad-tab-${id}`} aria-selected={tab === id} aria-controls={`ad-panel-${id}`} className={tab === id ? 'is-on' : ''}
                  disabled={id === 'send' && draft.isNew} title={id === 'send' && draft.isNew ? 'Save the template first' : undefined} onClick={() => setTab(id)}>
                  {label}{id === 'q' && <i>{draft.questions.length}</i>}
                </button>
              ))}
            </div>

            {tab === 'q' && (
              <div role="tabpanel" id="ad-panel-q" aria-labelledby="ad-tab-q" className="ad-panel">
                <ol className="ad-qs">
                  {draft.questions.map((q, i) => (
                    <li key={q.id} className="ad-q">
                      <span className="ad-num" aria-hidden="true">{i + 1}</span>
                      <div className="ad-qbody">
                        <label className="ad-sr" htmlFor={`ad-${q.id}`}>Question {i + 1}</label>
                        <textarea id={`ad-${q.id}`} className="ad-field ad-qfield" rows={3} maxLength={T.prompt} placeholder="Type the question the client will see" value={q.prompt} onChange={(e) => setQ(i, e.target.value)} />
                      </div>
                      <div className="ad-qbtns">
                        <button type="button" aria-label={`Move question ${i + 1} up`} disabled={i === 0} onClick={() => move(i, -1)}>&uarr;</button>
                        <button type="button" aria-label={`Move question ${i + 1} down`} disabled={i === draft.questions.length - 1} onClick={() => move(i, 1)}>&darr;</button>
                        <button type="button" aria-label={`Remove question ${i + 1}`} disabled={draft.questions.length === 1} onClick={() => set({ questions: draft.questions.filter((_, j) => j !== i) })}>&times;</button>
                      </div>
                    </li>
                  ))}
                </ol>
                <button type="button" className="tz-jelly tz-jelly-pale tz-jelly-s" onClick={addQ} disabled={draft.questions.length >= T.questions}>+ Add question</button>
              </div>
            )}

            {tab === 's' && (
              <div role="tabpanel" id="ad-panel-s" aria-labelledby="ad-tab-s" className="ad-panel ad-two">
                <section className="ad-card">
                  <h2>Welcome screen</h2>
                  <p className="ad-hint">The first thing they see. Clients with a name and email in their link skip it.</p>
                  <label className="ad-lab" htmlFor="ad-ih">Heading</label>
                  <input id="ad-ih" className="ad-field" maxLength={T.heading} value={draft.intro.heading} onChange={(e) => set({ intro: { ...draft.intro, heading: e.target.value } })} />
                  <label className="ad-lab" htmlFor="ad-ib">Intro text <em>(optional)</em></label>
                  <textarea id="ad-ib" className="ad-field" rows={5} maxLength={T.blurb} value={draft.intro.blurb} onChange={(e) => set({ intro: { ...draft.intro, blurb: e.target.value } })} />
                </section>
                <section className="ad-card">
                  <h2>Thank-you screen</h2>
                  <p className="ad-hint">Shown after they send it. Write {'{email}'} to include their address.</p>
                  <label className="ad-lab" htmlFor="ad-th">Heading</label>
                  <input id="ad-th" className="ad-field" maxLength={T.heading} value={draft.thanks.heading} onChange={(e) => set({ thanks: { ...draft.thanks, heading: e.target.value } })} />
                  <label className="ad-lab" htmlFor="ad-tb">Text</label>
                  <textarea id="ad-tb" className="ad-field" rows={5} maxLength={T.blurb} value={draft.thanks.blurb} onChange={(e) => set({ thanks: { ...draft.thanks, blurb: e.target.value } })} />
                </section>
              </div>
            )}

            {tab === 'send' && !draft.isNew && (
              <div role="tabpanel" id="ad-panel-send" aria-labelledby="ad-tab-send" className="ad-panel">
                <section className="ad-card">
                  <h2>Make a link for someone</h2>
                  <p className="ad-hint">Fill in their name and email and they won’t be asked for them; the form opens on the first question.</p>
                  <div className="ad-two">
                    <div><label className="ad-lab" htmlFor="ad-toname">Their name <em>(optional)</em></label>
                      <input id="ad-toname" className="ad-field" autoComplete="off" maxLength={200} value={toName} onChange={(e) => setToName(e.target.value)} /></div>
                    <div><label className="ad-lab" htmlFor="ad-toemail">Their email <em>(optional)</em></label>
                      <input id="ad-toemail" className="ad-field" type="email" autoComplete="off" maxLength={254} value={toEmail} onChange={(e) => setToEmail(e.target.value)} /></div>
                  </div>
                  <label className="ad-lab" htmlFor="ad-client">Tag <em>(optional, shows up in the email you receive)</em></label>
                  <input id="ad-client" className="ad-field" maxLength={80} placeholder="e.g. dr-smith" value={clientSlug} onChange={(e) => setClientSlug(slug(e.target.value, 80))} />
                  <label className="ad-lab" htmlFor="ad-link">Link</label>
                  <input id="ad-link" className="ad-field ad-link" readOnly value={link} placeholder={needsCode ? 'Press “Make short link” below' : ''} onFocus={(e) => e.target.select()} />
                  <div className="tz-row">
                    {needsCode && !link && <button type="button" className="tz-jelly tz-jelly-s" onClick={makeLink} disabled={busy}>{busy ? 'Making…' : 'Make short link'}</button>}
                    {link && <button type="button" className="tz-jelly tz-jelly-s" onClick={copy}>{copied ? 'Copied' : 'Copy link'}</button>}
                    {link && <a className="tz-jelly tz-jelly-pale tz-jelly-s" href={link} target="_blank" rel="noopener noreferrer">Preview</a>}
                  </div>
                  {needsCode && <p className="ad-hint">Their name and email are kept on the server, not in the link.</p>}
                  {dirty && <p className="ad-hint ad-warn">You have unsaved changes. The link shows the last saved version.</p>}
                </section>
              </div>
            )}

            <div className="ad-bar">
              <p className="ad-status" role="status" aria-live="polite">{note || (dirty ? 'Unsaved changes' : '')}</p>
              {!draft.isNew && <button type="button" className="ad-danger" onClick={remove} disabled={busy}>{draft.id === 'default' ? 'Reset to built-in' : 'Delete'}</button>}
              <button type="button" className="tz-jelly" onClick={saveDraft} disabled={busy || (!dirty && !draft.isNew)}>{busy ? 'Saving…' : draft.isNew ? 'Create template' : 'Save changes'}</button>
            </div>
          </section>
        ) : (
          <section className="in-sheet ad-empty"><p className="tz-stand">Pick a template to edit, or make a new one.</p>{note && <p className="in-note is-on" role="status">{note}</p>}</section>
        )}
      </div>
    </div>
  );
}

