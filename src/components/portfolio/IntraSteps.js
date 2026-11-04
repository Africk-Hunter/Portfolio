import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

// The four steps under the Intraconnected spotlight: card icons, and the little "app window" that opens on a click
// with a looping animation of that step. Icons are drawn in currentColor. Pen, padlock are from Intraconnected's own
// icon set; the branch and checklist glyphs were drawn to match.
export const steps = [
  {
    title: 'Start rough',
    short: 'Begin with a rough thought, nothing more.',
    long: 'Every map begins as a single node. Type whatever is in your head, half-formed is fine. There is no structure to set up and nothing to name properly yet; you can sharpen it later.',
    color: '#2B701D',
    light: true,
  },
  {
    title: 'Break it down',
    short: 'Split it into parts that branch off.',
    long: 'Pull a thought apart by branching it into smaller ones. Each part is its own node, still connected to where it came from, so the map grows outward like a tree you can rearrange.',
    color: '#00A9D8',
  },
  {
    title: 'Add the detail',
    short: 'To-dos and links, right on the node.',
    long: 'Give any node a checklist or a link. The detail lives with the idea instead of in some other app, so the plan and the work stay in the same place.',
    color: '#2049C5',
    light: true,
  },
  {
    title: 'Lock it away',
    short: 'Keep whatever is private out of sight.',
    long: 'Lock a node and what is inside it is hidden from view. It keeps its place on your map, but the contents stay private.',
    color: '#4B1F8F',
    light: true,
  },
];

const ico = [
  // pen
  <svg viewBox="0 0 21 23" fill="currentColor" aria-hidden="true"><rect x="0.13" y="22.58" width="1.48" height="19.99" rx="0.74" transform="rotate(-90 0.13 22.58)" /><rect x="1.03" y="19.12" width="2" height="5.83" rx="1" transform="rotate(-90 1.03 19.12)" /><rect x="18.03" y="4.59" width="2" height="19.14" rx="1" transform="rotate(45 18.03 4.59)" /><rect x="14.38" y="3.76" width="2" height="5" rx="1" transform="rotate(-45 14.38 3.76)" /><rect width="2" height="5.83" rx="1" transform="matrix(1 0 0 -1 1.04 19.1)" /><rect width="2" height="19.14" rx="1" transform="matrix(-0.707 -0.707 -0.707 0.707 15.57 2.1)" /><rect width="2" height="5" rx="1" transform="matrix(0.707 -0.707 -0.707 -0.707 16.35 5.7)" /><rect x="11.69" y="6.61" width="2" height="5" rx="1" transform="rotate(-45 11.69 6.61)" /><rect width="2" height="5" rx="1" transform="matrix(0.707 -0.707 -0.707 -0.707 13.66 8.55)" /></svg>,
  // one node splitting into two
  <svg viewBox="3.5 5.5 30 26" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M18.5 14.5V18.5M9.5 22.5V18.5H27.5V22.5" /><rect x="13" y="7.5" width="11" height="7" rx="1.6" fill="currentColor" /><rect x="5" y="22.5" width="9" height="7" rx="1.6" fill="currentColor" /><rect x="23" y="22.5" width="9" height="7" rx="1.6" fill="currentColor" /></svg>,
  // checklist
  <svg viewBox="0 0 22 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="1.2" y="2" width="7" height="7" rx="1.6" /><path d="M2.9 5.6l1.8 1.8 3.6-4.2M13.5 5.5H20M13.5 18H20" /><rect x="1.2" y="14.5" width="7" height="7" rx="1.6" /></svg>,
  // padlock
  <svg viewBox="0 0 21 23" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><rect x="2" y="10" width="17" height="11.5" rx="2" /><path d="M5.5 10V7a5 5 0 0 1 10 0v3" /><circle cx="10.5" cy="15.5" r="1.6" fill="currentColor" stroke="none" /></svg>,
];
export const StepIcon = ({ n, className }) => <span className={className} aria-hidden="true">{ico[n]}</span>;

// Intraconnected's own node palette (its landing hero animation): root brown, sky child, note green, indigo to-do, vault purple.
const C = { root: '#A3703E', sky: '#00A9D8', note: '#2B701D', todo: '#2049C5', vault: '#4B1F8F', vaultDeep: '#2A1052', link: '#E8E879' };

// One node: hard 3px shadow, 2.5px border, 7px radius, same as the app.
const Node = ({ x, y, w, h, fill = '#fff', cls = '', children }) => (
  <g className={cls}>
    <rect x={x + 3} y={y + 3} width={w} height={h} rx="7" fill="#111" />
    <rect x={x} y={y} width={w} height={h} rx="7" fill={fill} stroke="#111" strokeWidth="2.5" />
    {children}
  </g>
);
const T = ({ x, y, size = 15, weight = 700, fill = '#111', children, ...r }) => (
  <text x={x} y={y} fontFamily="'DM Sans', sans-serif" fontSize={size} fontWeight={weight} fill={fill} {...r}>{children}</text>
);
const Mono = ({ x, y, size = 12, fill = '#fff', children }) => (
  <text x={x} y={y} fontFamily="'Courier Prime', 'Courier New', monospace" fontSize={size} fill={fill}>{children}</text>
);
// Checklist row: box + label. When d is given the tick draws in and the label dims, like a ticked item in the app.
const Row = ({ x, y, d, children }) => (
  <g>
    <rect x={x} y={y} width="14" height="14" rx="3" fill="none" stroke="#fff" strokeOpacity=".8" strokeWidth="1.8" />
    <path className={`icm-draw icm-d${d}`} pathLength="1" d={`M${x + 3} ${y + 7.5} l3 3 l5-6.5`} fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <T x={x + 22} y={y + 11.5} size={14} weight={500} fill="#fff">{children}</T>
  </g>
);

// Each scene loops (~5s). Timings are baked into per-delay keyframes in zine.scss (icm-pop-N, icm-draw-N ...).
const scenes = [
  // 1. a single rough note, written out
  <>
    <Node x={50} y={18} w={220} h={128} fill={C.note} cls="icm-pop icm-d0">
      <T x={64} y={44} fill="#fff">Song idea</T>
      <line x1="50" y1="56" x2="270" y2="56" stroke="#fff" strokeOpacity=".25" strokeWidth="1.2" />
      <Mono x={64} y={80}>Open with a</Mono>
      <Mono x={64} y={100}>slow riff, then</Mono>
      <Mono x={64} y={120}>drop the beat.</Mono>
      {[66, 86, 106].map((y, i) => <rect key={y} className={`icm-wipe icm-w${i}`} x={58} y={y} width={204} height={20} fill={C.note} />)}
    </Node>
  </>,
  // 2. one idea branching into parts
  <>
    {[31, 87, 143].map((y, i) => (
      <path key={y} className={`icm-draw icm-d${i + 1}`} pathLength="1" d={`M118 87 C 162 87, 162 ${y}, 204 ${y}`} fill="none" stroke="#111" strokeWidth="2.5" strokeLinecap="round" />
    ))}
    <Node x={18} y={65} w={100} h={44} fill={C.root} cls="icm-pop icm-d0"><T x={68} y={92} size={16} fill="#fff" textAnchor="middle">Big idea</T></Node>
    {['Part one', 'Part two', 'Part three'].map((t, i) => (
      <Node key={t} x={204} y={[14, 70, 126][i]} w={98} h={34} fill={C.sky} cls={`icm-pop icm-d${i + 2}`}>
        <T x={253} y={[14, 70, 126][i] + 22} size={14} textAnchor="middle">{t}</T>
      </Node>
    ))}
  </>,
  // 3. a to-do node getting ticked off
  <>
    <g transform="translate(0 28)"><Node x={40} y={12} w={240} h={112} fill={C.todo} cls="icm-pop icm-d0">
      <rect x="58" y="26" width="13" height="13" rx="2.5" fill="none" stroke="#fff" strokeWidth="1.8" />
      <path d="M61 32.5 l3 3 l5-6.5" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <T x={78} y={38} size={15} fill="#fff">Plan the trip</T>
      <line x1="40" y1="52" x2="280" y2="52" stroke="#fff" strokeOpacity=".25" strokeWidth="1.2" />
      <Row x={58} y={64} d={2}>Book flights</Row>
      <Row x={58} y={90} d={3}>Pack a bag</Row>
    </Node></g>
  </>,
  // 4. the secret gets hidden, then the node is marked locked
  <>
    <Node x={40} y={16} w={240} h={142} fill={C.vault} cls="icm-pop icm-d0">
      <T x={56} y={36} size={8.5} weight={800} fill="#fff" fillOpacity=".65" letterSpacing="1">VAULT NOTE</T>
      <T x={56} y={58} size={15} fill="#fff">FL Studio Password</T>
      <line x1="40" y1="70" x2="280" y2="70" stroke="#fff" strokeOpacity=".22" strokeWidth="1.2" />
      <rect x="56" y="80" width="208" height="32" rx="5" fill={C.vaultDeep} stroke="#111" strokeWidth="2" />
      <Mono x={68} y={101} size={14}>hunter2_final</Mono>
      <rect className="icm-bar" x="58" y="82" width="204" height="28" rx="4" fill={C.vaultDeep} />
      <g className="icm-pop icm-d3"><T x={68} y={103} size={16} weight={500} fill="#fff" fillOpacity=".9" letterSpacing="2.5">••••••••••</T></g>
      <g className="icm-pop icm-d4">
        <rect x="57" y="123" width="82" height="24" rx="12" fill={C.link} stroke="#111" strokeWidth="2" />
        <g transform="translate(64 126.5) scale(.62)" fill="none" stroke="#111" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <path className="icm-shackle" d="M8 10.5V8a4 4 0 0 1 8 0v2.5" />
          <rect x="4.5" y="10.5" width="15" height="10" rx="2.5" />
        </g>
        <T x={83} y={139.5} size={12} weight={800}>Locked</T>
      </g>
    </Node>
  </>,
];

export const StepModal = ({ index, onClose, onGo }) => {
  const closeBtn = useRef(null);
  const [mounted, setMounted] = useState(false);
  const open = index != null;
  useEffect(() => setMounted(true), []);
  useEffect(() => {
    if (!open) return undefined;
    const back = document.activeElement;
    if (closeBtn.current) closeBtn.current.focus();
    const key = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', key);
    return () => { document.removeEventListener('keydown', key); if (back && back.focus) back.focus(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);
  useEffect(() => {
    if (!open) return undefined;
    const key = (e) => {
      if (e.key === 'ArrowRight') onGo((index + 1) % steps.length);
      else if (e.key === 'ArrowLeft') onGo((index + steps.length - 1) % steps.length);
    };
    document.addEventListener('keydown', key);
    return () => document.removeEventListener('keydown', key);
  }, [open, index, onGo]);
  if (!mounted || !open) return null;
  const s = steps[index];
  return createPortal(
    <div className="icm" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="icm-win" role="dialog" aria-modal="true" aria-label={`Step ${index + 1}: ${s.title}`}>
        <div className="icm-bar-top">
          <i /><i /><i />
          <span>intraconnected.app / step {index + 1}</span>
          <button type="button" className="icm-x" ref={closeBtn} onClick={onClose} aria-label="Close">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" /></svg>
          </button>
        </div>
        <div className="icm-stage">
          <svg key={index} viewBox="0 0 320 180" role="img" aria-label={`Animation: ${s.title}`}>{scenes[index]}</svg>
        </div>
        <div className="icm-body">
          <div className="icm-head">
            <span className="icm-n" style={{ background: s.color, color: s.light ? '#fff' : '#111' }}>{index + 1}</span>
            <h3>{s.title}</h3>
            <StepIcon n={index} className="icm-ico" />
          </div>
          <p className="icm-short">{s.short}</p>
          <p>{s.long}</p>
        </div>
        <div className="icm-foot">
          <button type="button" className="icm-btn" onClick={() => onGo((index + steps.length - 1) % steps.length)}>&larr; Back</button>
          <span className="icm-dots" aria-hidden="true">{steps.map((_, i) => <i key={i} className={i === index ? 'on' : ''} />)}</span>
          <button type="button" className="icm-btn icm-btn-go" onClick={() => onGo((index + 1) % steps.length)}>Next &rarr;</button>
        </div>
      </div>
    </div>,
    document.body,
  );
};
