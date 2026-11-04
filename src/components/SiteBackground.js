import React, { useEffect, useState } from 'react';
import { Background } from '../../background';
import '../../background/background.css';
import saved from '../data/background.json';

const SiteBackground = () => {
  const config = saved;
  const [lite, setLite] = useState(false);

  // Page color: the stack paints it (--t-page-bg) and <html> shows it behind the page.
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--t-page-bg', config.bg || 'transparent');
    root.style.background = config.bg || '';
  }, [config.bg]);

  // Phones get the lighter, lower frame rate rendering.
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)');
    const update = () => setLite(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  return (
    <>
      <Background layers={config.layers} lite={lite} />
    </>
  );
};

export default SiteBackground;
