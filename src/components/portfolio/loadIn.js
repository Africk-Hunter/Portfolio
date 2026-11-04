import { useEffect, useLayoutEffect } from 'react';

// Load-in for a portfolio mockup: the page starts empty, the masthead letters slam down one by one,
// then everything else comes in, and keeps coming in as the scroller is scrolled.
// Uses the Web Animations API (not CSS classes) so it composes with elements that already run their own CSS animations.

// ---- Tuning knobs ---------------------------------------------------------
const START_DELAY = 180;    // empty page, before the first letter drops
const FALL_MS = 85;         // how long one letter takes to fall (fast, accelerating)
const GAP_MS = 15;          // pause between a landing and the next drop
const LAST_PAUSE_MS = 280;  // beat after the final letter before the page builds
const SHAKE_MS = 300;
const REVEAL_THRESHOLD = 0.4;           // scrolling: fraction of an element that must be in view...
const REVEAL_MARGIN = '0px 0px -7% 0px'; // ...inside the viewport minus this much at the bottom
const TYPE_MS_PER_CHAR = 20; // nav labels: typing speed
const TYPE_GAP_MS = 50;      // pause between one label and the next
const FONT_WAIT_MS = 1500;  // never wait longer than this for the masthead font

const BOING = 'cubic-bezier(0.34, 1.56, 0.64, 1)';
const SMOOTH = 'cubic-bezier(0.16, 1, 0.3, 1)';

const VARIANTS = {
  up: { dur: 800, ease: SMOOTH, frames: [{ opacity: 0, translate: '0 40px' }, { opacity: 1, translate: '0 0' }] },
  down: { dur: 600, ease: SMOOTH, frames: [{ opacity: 0, translate: '0 -24px' }, { opacity: 1, translate: '0 0' }] },
  pop: { dur: 750, ease: BOING, frames: [{ opacity: 0, scale: '0.8', translate: '0 30px' }, { opacity: 1, scale: '1', translate: '0 0' }] },
  stamp: { dur: 480, ease: BOING, frames: [{ opacity: 0, scale: '2.4', rotate: '-24deg' }, { opacity: 1, scale: '1', rotate: '0deg' }] },
  // the nav bar slides itself down from above the top edge; its labels are then typed in (see typeIn)
  bar: { dur: 480, ease: 'cubic-bezier(0.2, 0.9, 0.3, 1.12)', frames: [{ opacity: 1, translate: '0 -110%' }, { opacity: 1, translate: '0 0' }] },
  // contents list / interview questions: slide in from the margin like typeset lines
  left: { dur: 650, ease: SMOOTH, frames: [{ opacity: 0, translate: '-36px 0' }, { opacity: 1, translate: '0 0' }] },
  // interview answers: from the right margin, a beat after their question (lag)
  right: { dur: 650, ease: SMOOTH, lag: 250, frames: [{ opacity: 0, translate: '36px 0' }, { opacity: 1, translate: '0 0' }] },
  // Websites heading: a browser-style wipe, left to right
  wipe: { dur: 700, ease: 'cubic-bezier(0.65, 0, 0.35, 1)', frames: [{ opacity: 1, clipPath: 'inset(0 100% 0 0)' }, { opacity: 1, clipPath: 'inset(0 0% 0 0)' }] },
  // the seedling grows up out of its window
  grow: { dur: 900, ease: BOING, frames: [{ opacity: 0, scale: '1 0.05' }, { opacity: 1, scale: '1 1' }] },
  // seed packets get pinned to the board: dropped from above, tilted, settling
  plant: { dur: 750, ease: BOING, frames: [{ opacity: 0, translate: '0 -70px', rotate: '-7deg', scale: '0.94' }, { opacity: 1, translate: '0 0', rotate: '0deg', scale: '1' }] },
  // the record slides out of its sleeve
  slideout: { dur: 900, ease: SMOOTH, frames: [{ opacity: 1, translate: '-42% 0' }, { opacity: 1, translate: '0 0' }] },
  // Intraconnected is neo-brutal: hard, stepped, snapping onto its hard shadow
  // (Not stepped: steps(4) over 380ms is ~10fps, which reads as lag. A short, fast-out ease still feels hard and sudden.)
  snap: { dur: 300, ease: 'cubic-bezier(0.2, 0.9, 0.2, 1)', frames: [{ opacity: 0, translate: '14px 14px' }, { opacity: 1, translate: '0 0' }] },
  // a taped photo pressed onto the page
  press: { dur: 520, ease: 'cubic-bezier(0.2, 0.9, 0.3, 1.2)', frames: [{ opacity: 0, scale: '1.18', rotate: '-7deg' }, { opacity: 1, scale: '1', rotate: '0deg' }] },
  // jelly buttons and form fields inflate
  bloom: { dur: 600, ease: BOING, frames: [{ opacity: 0, scale: '0.6', translate: '0 14px' }, { opacity: 1, scale: '1', translate: '0 0' }] },
  // headings drop hard and settle, echoing the masthead
  drop: {
    dur: 600,
    ease: 'linear',
    frames: [
      { opacity: 0, translate: '0 -60px', easing: 'cubic-bezier(0.7, 0, 1, 0.55)' },
      { opacity: 1, translate: '0 0', offset: 0.55, easing: 'ease-out' },
      { translate: '0 6px', offset: 0.75, easing: 'ease-in-out' },
      { opacity: 1, translate: '0 0' },
    ],
  },
};

// [selector, variant]. An element is only claimed by the first row that matches it, so a parent and its
// children are never both animated. Each section gets entrances that match how it is built.
export const ZINE_REVEALS = [
  // cover: jelly and print furniture
  ['.tz-nav', 'bar'],
  ['.tz-strip', 'down'],
  ['.tz-burst', 'stamp'],
  ['.tz-cover-photo', 'pop'],
  ['.tz-lines li', 'left'],
  ['.tz-down', 'up'],

  // websites: a browser wipe for the heading, the seedling grows, seed packets get pinned up
  ['.tz-field-head h2', 'wipe'],
  ['.tz-field-head > *', 'up'],
  ['.tz-sprout', 'grow'],
  ['.tz-seed', 'plant'],

  // the debut: lettering pops, the record slides out of its sleeve, the pull quote slides in
  ['.tz-debut-title, .tz-album', 'pop'],
  ['.tz-vinyl', 'slideout'],
  ['.tz-feature h2', 'drop'],
  ['.tz-pull', 'left'],
  ['.tz-spread .tz-row .tz-jelly', 'bloom'],
  ['.tz-feature > :not(.tz-row)', 'up'],

  // intraconnected: the app's own neo-brutal look, so everything snaps in on steps
  ['.tz-intra-head > *, .tz-intra-shot, .tz-ic-box, .tz-packet, .tz-nb, .tz-intra-nodes li', 'snap'],

  // interview: the photo is pressed on, questions slide in from the margin, answers rise
  ['.tz-qa-photo', 'press'],
  ['.tz-qa article h2', 'drop'],
  ['.tz-qa article > .tz-kicker', 'up'],
  ['.tz-dialogue dt', 'left'],
  ['.tz-dialogue dd', 'right'],

  // back cover: fields and buttons inflate
  ['.tz-back h2', 'drop'],
  ['.tz-form > *, .tz-back .tz-row .tz-jelly', 'bloom'],
  ['.tz-back > :not(.tz-form):not(.tz-row):not(h2)', 'up'],

  // footer: each column rises as it scrolls into view
  ['.tz-foot-brand, .tz-foot-col, .tz-foot-base', 'up'],
];

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * @param rootRef  the scrolling container (position: fixed; overflow: auto)
 * @param opts.mast     selector of the element whose children are the letters to slam
 * @param opts.shake    selector of the element to jolt on impact
 * @param opts.reveals  [selector, variant] rows
 */
export function useSlamIntro(rootRef, { mast, shake, reveals, typed }) {
  // The prerendered HTML already carries .tz-intro (everything but the masthead hidden, see the stylesheet), so
  // there is no flash of content before hydration. Reduced-motion visitors skip the intro, so drop it for them.
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (root) root.classList[reducedMotion() ? 'remove' : 'add']('tz-intro');
    return () => { if (root) root.classList.remove('tz-intro'); };
  }, [rootRef]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || reducedMotion()) return undefined;

    const letters = Array.from(root.querySelectorAll(`${mast} > span`));
    const jolt = root.querySelector(shake);
    let skipped = false;
    let disposed = false;
    let io = null;
    let flushAtEnd = null;
    const waiters = [];
    const anims = [];

    const wait = (ms) => new Promise((resolve) => {
      const t = setTimeout(resolve, ms);
      waiters.push(() => { clearTimeout(t); resolve(); });
    });
    const skip = () => { skipped = true; waiters.splice(0).forEach((w) => w()); };
    const onKey = (e) => { if (e.key === 'Escape') skip(); };

    // "Typed" labels, left to right, one after another, starting once the bar has landed. The text is not
    // touched (React owns it): a clip wipe in one step per character reads as typing.
    function typeIn(bar, startAt) {
      let t = startAt;
      bar.querySelectorAll(typed).forEach((label) => {
        const chars = Math.max(1, (label.textContent || '').trim().length);
        const dur = chars * TYPE_MS_PER_CHAR;
        label.classList.remove('tz-pre');
        label.animate(
          [{ opacity: 1, clipPath: 'inset(0 100% 0 0)' }, { opacity: 1, clipPath: 'inset(0 0% 0 0)' }],
          { duration: dur, delay: t, easing: `steps(${chars}, end)`, fill: 'backwards' },
        );
        t += dur + TYPE_GAP_MS;
      });
    }

    function play(el, variant, delay) {
      const v = VARIANTS[variant];
      el.classList.remove('tz-pre');
      el.animate(v.frames, { duration: v.dur, delay: delay + (v.lag || 0), easing: v.ease, fill: 'backwards' });
      if (variant === 'bar' && typed) typeIn(el, delay + v.dur);
    }

    function finish() {
      if (disposed) return;
      window.removeEventListener('pointerdown', skip);
      window.removeEventListener('keydown', onKey);

      const claimed = new Set();
      const variantOf = new Map();
      reveals.forEach(([selector, variant]) => {
        root.querySelectorAll(selector).forEach((el) => {
          if (claimed.has(el)) return;
          claimed.add(el);
          variantOf.set(el, variant);
          el.classList.add('tz-pre');
        });
      });

      if (typed) root.querySelectorAll(typed).forEach((el) => el.classList.add('tz-pre'));

      anims.forEach((a) => a.cancel());
      root.classList.remove('tz-intro');

      const byPosition = (a, b) => a.top - b.top || a.left - b.left;
      const pending = new Set();

      // Whatever is already on screen when the intro ends comes in right away (staggered).
      const rootRect = root.getBoundingClientRect();
      const onScreen = [];
      claimed.forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.top < rootRect.bottom && r.bottom > rootRect.top) onScreen.push({ el, top: r.top, left: r.left });
        else pending.add(el);
      });
      onScreen.sort(byPosition).forEach(({ el }, i) => {
        play(el, variantOf.get(el), Math.min(i, 10) * 70);
        const row = el.parentElement;
        if (row && row.scrollWidth > row.clientWidth + 1) {
          Array.from(row.children).forEach((sib) => {
            if (!pending.has(sib)) return;
            play(sib, variantOf.get(sib), Math.min(i + 1, 10) * 70);
            pending.delete(sib);
          });
        }
      });

      // Everything else waits until most of it is inside the viewport, clear of the bottom edge, so you see
      // the whole element arrive rather than catching it already half in.
      io = new IntersectionObserver((entries) => {
        entries
          .filter((e) => e.isIntersecting)
          .map((e) => ({ el: e.target, top: e.boundingClientRect.top, left: e.boundingClientRect.left }))
          .sort(byPosition)
          .forEach(({ el }, i) => {
            play(el, variantOf.get(el), Math.min(i, 8) * 70);
            pending.delete(el);
            io.unobserve(el);
            // A horizontal swipe row: its off-screen items would only reveal after swiping to them, so the
            // whole row comes in together with the first one seen.
            const row = el.parentElement;
            if (row && row.scrollWidth > row.clientWidth + 1) {
              let n = i + 1;
              Array.from(row.children).forEach((sib) => {
                if (!pending.has(sib)) return;
                play(sib, variantOf.get(sib), Math.min(n++, 8) * 70);
                pending.delete(sib);
                io.unobserve(sib);
              });
            }
          });
      }, { root, threshold: REVEAL_THRESHOLD, rootMargin: REVEAL_MARGIN });
      pending.forEach((el) => io.observe(el));

      // At the very bottom the last elements can never clear the margin: bring in whatever is left.
      flushAtEnd = () => {
        if (root.scrollTop + root.clientHeight < root.scrollHeight - 4) return;
        Array.from(pending).map((el) => ({ el, ...el.getBoundingClientRect() })).sort(byPosition).forEach(({ el }, i) => {
          play(el, variantOf.get(el), Math.min(i, 8) * 70);
          pending.delete(el);
          io.unobserve(el);
        });
      };
      root.addEventListener('scroll', flushAtEnd, { passive: true });
    }

    function jolting(k) {
      if (!jolt) return;
      anims.push(jolt.animate([
        { translate: '0 0' },
        { translate: `${-2 * k}px ${9 * k}px`, offset: 0.15 },
        { translate: `${3 * k}px ${-5 * k}px`, offset: 0.4 },
        { translate: `${-2 * k}px ${3 * k}px`, offset: 0.65 },
        { translate: `${k}px ${-k}px`, offset: 0.85 },
        { translate: '0 0' },
      ], { duration: SHAKE_MS, easing: 'ease-out' }));
    }

    async function run() {
      window.addEventListener('pointerdown', skip);
      window.addEventListener('keydown', onKey);

      // The masthead font has to be in, or the letters would drop in a fallback face and swap.
      await Promise.race([
        document.fonts ? document.fonts.load('900 120px Fraunces').catch(() => {}) : Promise.resolve(),
        wait(FONT_WAIT_MS),
      ]);
      await wait(START_DELAY);

      for (let i = 0; i < letters.length && !skipped && !disposed; i++) {
        const el = letters[i];
        const isLast = i === letters.length - 1;
        const dist = el.getBoundingClientRect().bottom + 60;
        const tilt = (Math.random() * 14 - 7).toFixed(1);

        const fall = el.animate([
          { transform: `translateY(${-dist}px) rotate(${tilt}deg) scaleY(1.2)`, opacity: 1 },
          { transform: 'translateY(0) rotate(0deg) scaleY(1.12)', opacity: 1 },
        ], { duration: FALL_MS, easing: 'cubic-bezier(0.8, 0, 1, 0.6)', fill: 'forwards' });
        anims.push(fall);

        await Promise.race([fall.finished.catch(() => {}), wait(FALL_MS + 60)]);
        if (skipped || disposed) break;

        // IMPACT: squash the letter, jolt the whole cover.
        anims.push(el.animate([
          { transform: 'scale(1.16, 0.7)' },
          { transform: 'scale(0.98, 1.05)', offset: 0.5 },
          { transform: 'scale(1, 1)' },
        ], { duration: 240, easing: 'ease-out', fill: 'forwards' }));
        jolting(isLast ? 1.9 : 1);

        await wait(isLast ? LAST_PAUSE_MS : GAP_MS);
      }

      finish();
    }

    run();

    return () => {
      disposed = true;
      skip();
      anims.forEach((a) => a.cancel());
      if (io) io.disconnect();
      if (flushAtEnd) root.removeEventListener('scroll', flushAtEnd);
      window.removeEventListener('pointerdown', skip);
      window.removeEventListener('keydown', onKey);
      root.classList.remove('tz-intro');
    };
  }, [rootRef, mast, shake, reveals]);
}
