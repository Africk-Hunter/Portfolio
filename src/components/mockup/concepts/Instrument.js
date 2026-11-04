import React, { useCallback, useEffect, useRef, useState } from 'react';
import Reader from './Reader';

// Concept 2: the page is a little instrument. Hover the keys to play them,
// click a labelled key to open it. Sound is off until you turn it on. Leave it
// alone for a few seconds and it plays itself like a screensaver.

const FREQS = [261.63, 293.66, 329.63, 392, 440, 523.25, 587.33, 659.25];
const PADS = [
  { n: 0 },
  { n: 1, id: 'about', label: 'About' },
  { n: 2, id: 'websites', label: 'Websites' },
  { n: 3 },
  { n: 4, id: 'music', label: 'Music' },
  { n: 5 },
  { n: 6, id: 'contact', label: 'Contact' },
  { n: 7 },
];
const MELODY = [0, 2, 4, 2, 5, 4, 2, 1, 3, 5, 7, 5, 4, 2];

const Instrument = () => {
  const [open, setOpen] = useState(null);
  const [lit, setLit] = useState(-1);
  const [sound, setSound] = useState(false);
  const [saver, setSaver] = useState(false);
  const audio = useRef(null);
  const soundOn = useRef(false);
  const litTimer = useRef(null);
  const close = useCallback(() => setOpen(null), []);

  const ping = useCallback((n) => {
    setLit(n);
    clearTimeout(litTimer.current);
    litTimer.current = setTimeout(() => setLit(-1), 380);

    const ctx = audio.current;
    if (!ctx || !soundOn.current) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const t = ctx.currentTime;
    osc.type = 'triangle';
    osc.frequency.value = FREQS[n];
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(0.14, t + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 1.1);
    osc.connect(gain).connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 1.2);
  }, []);

  const toggleSound = () => {
    if (!audio.current) {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (Ctx) audio.current = new Ctx();
    }
    if (audio.current && audio.current.resume) audio.current.resume();
    soundOn.current = !sound;
    setSound(!sound);
    if (!sound) ping(4);
  };

  // Any movement wakes it; ten quiet seconds start the screensaver.
  useEffect(() => {
    let idle;
    const wake = () => {
      clearTimeout(idle);
      setSaver(false);
      idle = setTimeout(() => setSaver(true), 10000);
    };
    const events = ['pointermove', 'pointerdown', 'keydown'];
    events.forEach((ev) => window.addEventListener(ev, wake));
    wake();
    return () => {
      events.forEach((ev) => window.removeEventListener(ev, wake));
      clearTimeout(idle);
    };
  }, []);

  useEffect(() => {
    if (!saver) return undefined;
    let step = 0;
    const id = setInterval(() => {
      ping(MELODY[step % MELODY.length]);
      step += 1;
    }, 520);
    return () => clearInterval(id);
  }, [saver, ping]);

  return (
    <div className={`in ${saver ? 'isSaver' : ''}`}>
      <header className="in__head">
        <h1>Hunter Africk</h1>
        <p>websites, music, stories. play the keys.</p>
      </header>

      <div className="in__pads" role="group" aria-label="Keys">
        {PADS.map((pad) => (
          <button
            key={pad.n}
            className={`in__pad ${pad.id ? 'in__pad--key' : ''} ${lit === pad.n ? 'isLit' : ''}`}
            onPointerEnter={() => ping(pad.n)}
            onClick={() => { ping(pad.n); if (pad.id) setOpen(pad.id); }}
            aria-label={pad.id ? `Open ${pad.label}` : 'Play a note'}
            style={{ '--hue': pad.n * 9 }}
          >
            {pad.label && <span>{pad.label}</span>}
          </button>
        ))}
      </div>

      <footer className="in__foot">
        <button className="in__sound" onClick={toggleSound} aria-pressed={sound}>
          sound {sound ? 'on' : 'off'}
        </button>
        <span>{saver ? 'move to wake it up' : 'leave it alone and it plays itself'}</span>
      </footer>

      {open && <Reader id={open} onClose={close} />}
    </div>
  );
};

export default Instrument;
