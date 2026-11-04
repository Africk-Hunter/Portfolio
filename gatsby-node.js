const fs = require('fs');
const path = require('path');

// Gatsby merges every page's stylesheet into one bundle and inlines all of it in every page. The home page only
// needs the zine's styles, so after the build its inline <style> is swapped for the zine alone (compiled here
// from the same source). That drops the other pages' CSS, and the Google Fonts @import their old styles pull in,
// from the first paint. Add a page to ZINE_ONLY only if it imports nothing but the zine's styles.
const ZINE_ONLY = ['index.html'];

// Workshop pages that only exist for local design work. Dropping them from production builds keeps their
// components and styles out of the webpack bundles; `gatsby develop` still serves them.
const DEV_ONLY_PAGES = ['/mockup/', '/lang_old/', '/language/', '/languages/'];
exports.onCreatePage = ({ page, actions }) => {
  if (process.env.NODE_ENV === 'production' && DEV_ONLY_PAGES.includes(page.path)) {
    actions.deletePage(page);
  }
};
exports.onPostBuild = () => {
  const sass = require('sass');
  const css = sass.compile(path.join(__dirname, 'src', 'styles', 'portfolio', 'zine.scss'), { style: 'compressed' }).css.replace(/^﻿/, '');
  // Keep the opening tag (its data-href): Gatsby's runtime looks for it, and fetches styles.css again if it is missing.
  const GLOBAL = /(<style data-href="[^"]*" data-identity="gatsby-global-css">)[\s\S]*?<\/style>/;
  ZINE_ONLY.forEach((name) => {
    const file = path.join(__dirname, 'public', name);
    const html = fs.readFileSync(file, 'utf8');
    if (!GLOBAL.test(html)) throw new Error(`onPostBuild: no global stylesheet found in ${name}`);
    fs.writeFileSync(file, html.replace(GLOBAL, (_, open) => `${open}${css}</style>`));
  });
};
