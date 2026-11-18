import React from 'react';
import { ViteReactSSG } from 'vite-react-ssg';

// A page module exports its component as `default` and, optionally, its <head> tags as `Head` (the same shape the
// pages had under Gatsby). Routes load lazily, so each page only ships its own stylesheet.
const page = (load) => ({
  lazy: async () => {
    const mod = await load();
    const Page = mod.default;
    const PageHead = mod.Head;
    return { Component: () => <>{PageHead && <PageHead />}<Page /></> };
  },
});

const routes = [
  { path: '/', ...page(() => import('./pages/index')) },
  { path: '/web-design', ...page(() => import('./pages/web-design')) },
  { path: '/music', ...page(() => import('./pages/music')) },
  // Prerendered to /404.html (see vite.config.js); the "*" route covers unknown URLs once the app is running.
  { path: '/404', ...page(() => import('./pages/404')) },
  { path: '*', ...page(() => import('./pages/404')) },
];

// Design workshop pages: dev server only, never in the production build.
if (import.meta.env.DEV) {
  routes.push(
    { path: '/lang_old', ...page(() => import('./pages/lang_old')) },
    { path: '/mockup', ...page(() => import('./pages/mockup')) },
  );
}

export const createRoot = ViteReactSSG({ routes });
