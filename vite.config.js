import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const root = path.dirname(fileURLToPath(import.meta.url));
const saved = JSON.parse(fs.readFileSync(path.join(root, 'src/data/background.json'), 'utf8'));
const SITE = 'https://hunterafrick.com';

// Public pages, in sitemap order. 404 is left out (noindex).
const SITEMAP_PATHS = ['/', '/web-design/', '/music/'];

// Paint the saved page colour in the static HTML so it does not flash the stylesheet's colour first.
const pageBackground = () => ({
  name: 'saved-page-background',
  transformIndexHtml: (html) => (saved.bg
    ? html.replace('<html lang="en">', `<html lang="en" style="background:${saved.bg};--t-page-bg:${saved.bg}">`)
    : html),
});

export default defineConfig({
  publicDir: 'static',
  plugins: [
    pageBackground(),
    // Components are written as .js files with JSX in them.
    react({ include: /\.(js|jsx)$/ }),
  ],
  esbuild: { loader: 'jsx', include: /src\/.*\.jsx?$/, exclude: [] },
  optimizeDeps: { esbuildOptions: { loader: { '.js': 'jsx' } } },
  resolve: {
    // The two unported design workshop pages (dev only) still import from 'gatsby'; this keeps them untouched.
    alias: { gatsby: path.join(root, 'src/dev/gatsby-shim.js') },
  },
  css: { preprocessorOptions: { scss: { silenceDeprecations: ['import', 'global-builtin', 'color-functions', 'mixed-decls'] } } },
  ssgOptions: {
    entry: 'src/main.jsx',
    dirStyle: 'nested',
    // Head tags are inserted first; put the charset declaration back at the very top so it is inside the first 1024 bytes.
    onPageRendered(_route, html) {
      const charset = '<meta charset="utf-8">';
      let out = html.includes(charset) ? html.replace(charset, '').replace('<head>', `<head>${charset}`) : html;
      // Inline each page's stylesheet: a separate CSS file blocks the first paint for a whole round trip.
      out = out.replace(/<link rel="stylesheet" href="(\/assets\/[^"]+\.css)"[^>]*>/g, (tag, href) => {
        const file = path.join(root, 'dist', href);
        return fs.existsSync(file) ? `<style>${fs.readFileSync(file, 'utf8')}</style>` : tag;
      });
      return out;
    },
    // "*" routes are never prerendered by vite-react-ssg, so 404 is an explicit route (see src/main.jsx).
    onFinished(dir) {
      // Build bookkeeping that nothing at runtime reads.
      fs.rmSync(path.join(dir, 'static-loader-data'), { recursive: true, force: true });
      fs.readdirSync(dir).filter((f) => f.startsWith('static-loader-data-manifest')).forEach((f) => fs.rmSync(path.join(dir, f)));
      // Netlify serves /404.html for unknown URLs.
      const nested = path.join(dir, '404', 'index.html');
      if (fs.existsSync(nested)) {
        fs.renameSync(nested, path.join(dir, '404.html'));
        fs.rmSync(path.join(dir, '404'), { recursive: true, force: true });
      }
      // Same file names the Gatsby build produced, so robots.txt and Search Console keep working.
      const urls = SITEMAP_PATHS.map((p) => `  <url><loc>${SITE}${p}</loc></url>`).join('\n');
      const urlset = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
      fs.writeFileSync(path.join(dir, 'sitemap-0.xml'), urlset);
      fs.writeFileSync(path.join(dir, 'sitemap.xml'), urlset);
      fs.writeFileSync(path.join(dir, 'sitemap-index.xml'),
        `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <sitemap><loc>${SITE}/sitemap-0.xml</loc></sitemap>\n</sitemapindex>\n`);
    },
  },
});
