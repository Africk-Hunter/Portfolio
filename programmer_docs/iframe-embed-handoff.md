# Handoff: make this site embeddable as an iframe in the portfolio

> Self-contained. Paste into the repo this site lives in (Luna Lash & Beauty Co, and Stock Z). The implementer needs no prior conversation.
> Do NOT commit or push. Do NOT change how the site looks or behaves when visited directly.

## 1. Goal

The portfolio at **https://hunterafrick.com** shows live previews of this site in an `<iframe>`. Right now the browser refuses to render it in a frame, so the portfolio falls back to a static screenshot. Change this site so that **only the portfolio origins** can frame it, and make sure it renders correctly when framed.

Do not open framing to everyone. No `*`, and do not remove the header entirely.

## 2. Current state (measured from the portfolio, re-check with `curl -sI`)

| Site | Header today | Effect |
|---|---|---|
| Luna Lash & Beauty Co (`lunalashandbeautyco.com`) | `X-Frame-Options: DENY` | Blocked for every origin |
| Stock Z (`Stock-Z.com`) | `Content-Security-Policy: frame-ancestors 'none'` | Blocked for every origin |

For reference, the portfolio's other embeddable site, intraconnected.app, sends `frame-ancestors 'self' https://hunterafrick.com`. Copy that pattern.

## 3. Required change: the framing header

Send this on **HTML document responses** (at minimum `/`, ideally all routes):

```
Content-Security-Policy: frame-ancestors 'self' https://hunterafrick.com https://www.hunterafrick.com
```

Rules:
- **Remove `X-Frame-Options` entirely** (including `DENY` and `SAMEORIGIN`). It cannot name a specific allowed origin (the `ALLOW-FROM` form is dead), and when both headers are present some browsers apply the stricter one. `frame-ancestors` replaces it.
- If the site already sends a `Content-Security-Policy`, **edit its `frame-ancestors` directive** rather than adding a second header. Two CSP headers are both enforced, so the stricter one wins.
- For local testing add `http://localhost:8000` (Gatsby dev) to the list. Remove it before the production deploy, or keep it on a dev or preview environment only.
- Add other origins only if the owner asks.

Where to put it depends on the host. Check which one this repo uses and edit the matching file:
- **Netlify:** `_headers` (`/*` block) or `[[headers]]` in `netlify.toml`.
- **Vercel:** `headers` in `vercel.json`.
- **Cloudflare Pages:** `_headers` in the publish directory.
- **Firebase Hosting:** `headers` in `firebase.json`.
- **Express / Node server, or middleware such as helmet:** set `frame-ancestors` in the CSP config and **disable helmet's default `frameguard`**, which sets `X-Frame-Options: SAMEORIGIN`.
- **nginx / Apache:** `add_header Content-Security-Policy ...` / `Header set ...`, and remove any `X-Frame-Options` line. Check every `server` and `location` block, because `add_header` in a child block drops the parent's headers.
- **GitHub Pages:** cannot set response headers at all. If the site is on Pages, stop and tell the owner. The fix is moving hosting (Netlify, Cloudflare Pages, or Vercel), not code.

Also search the repo and any CDN or edge config for the strings `X-Frame-Options`, `frame-ancestors`, `frameguard`, and `frame-options`, and for a Cloudflare/Vercel dashboard rule if one exists. Report anything that lives outside the repo that you cannot change.

## 4. Required check: frame-busting code

Search the source for scripts that break out of frames:
`top.location`, `window.top`, `top !== self`, `window.self !== window.top`, `parent.location`.

If found, remove it or make it a no-op. Frame-busting code will redirect the portfolio itself to this site.

## 5. How the portfolio embeds it (design for this)

```html
<iframe src="https://<this site>/"
        loading="lazy" referrerpolicy="no-referrer"
        sandbox="allow-scripts allow-same-origin allow-forms"
        tabindex="-1" aria-hidden="true">
```

- Rendered at a **virtual 1440×810 desktop viewport**, then CSS-scaled down to about 500 to 600px wide. The page sees a 1440px-wide window, so the **desktop layout must work at exactly 1440×810**, with nothing important only below the fold.
- Sandboxed **without** `allow-popups`, `allow-top-navigation`, and `allow-modals`. Links that open new tabs, `window.open`, `alert`, and `confirm` will not work inside the preview. That is fine, but they must not throw errors that break the page render.
- `referrerpolicy="no-referrer"`: the site will receive no `Referer` from the portfolio. Do not gate content on it.
- The preview is mostly non-interactive (a click-through overlay sits on top), but visitors may scroll or interact in some views. Both must be safe.
- Many previews can load on one page, so the first paint should be cheap.

## 6. Make it behave well when framed

Fix these only if they are a problem. Do not refactor.

1. **Storage and cookies.** Inside a cross-site iframe, many browsers block or partition `localStorage`, `sessionStorage`, `indexedDB`, and cookies, and some throw on access. Wrap reads and writes in `try/catch`, and make sure the page renders fully with storage unavailable. A cookie banner or consent modal must not cover the whole preview. If one appears, it is acceptable, but prefer not showing it when `window.self !== window.top`.
2. **Auth and gates.** No login wall, age gate, or "open in app" redirect on the landing page for a first-time visitor.
3. **Autoplay and heavy media.** Autoplaying video with sound, or a very large hero asset, makes the preview slow. Muted autoplay is fine.
4. **Service workers and caching.** If the site registers a service worker, confirm it does not strip or rewrite the new header. Cached responses keep the old headers until the cache expires, so tell the owner if a cache purge is needed.
5. **Third-party widgets.** Embedded maps, chat widgets, and booking widgets (common on Luna Lash) may have their own framing rules or fail inside a nested iframe. Note any that render blank in the preview.
6. **`prefers-reduced-motion` and animations.** Intro animations that gate content (a splash screen that lasts several seconds) leave the preview looking empty. Keep any splash short, or skip it when framed.

## 7. Verify

1. After deploying (or on a preview build), run:
   ```
   curl -sI https://<this site>/
   ```
   Confirm: there is **no** `x-frame-options` header, and `content-security-policy` contains `frame-ancestors 'self' https://hunterafrick.com`. Check `/` and one deep route.
2. Test the framing for real. Create a throwaway local file (outside the repo, or delete it afterward) served from `http://localhost:8000`, or use the portfolio's dev server, containing:
   ```html
   <iframe src="https://<this site>/" width="1440" height="810" sandbox="allow-scripts allow-same-origin allow-forms" referrerpolicy="no-referrer"></iframe>
   ```
   It should render the real page, with no "refused to connect" error and no blank frame. The browser console should show no `Refused to display ... in a frame` or `frame-ancestors` message.
3. Confirm an **unlisted origin is still blocked**. Open the same iframe from a different origin (for example `http://localhost:9999`) and confirm the browser refuses it.
4. Confirm the site still loads normally in a top-level tab, with no visual change.
5. At 1440×810 in the frame, check that the above-the-fold area shows the brand and the main hero, with no consent modal or empty splash covering it.
6. If you cannot deploy or run a browser, say so plainly and list what is unverified.

## 8. Final report should include

- The host/platform and the exact file changed to set the header.
- The header value before and after.
- Whether any frame-busting code was found or removed.
- Any storage, widget, splash, or consent issues found in the frame, and what you did about them.
- Anything outside the repo (CDN rules, dashboard headers, cache) that the owner must change or purge.
- The final list of allowed origins, and confirmation that they match section 3.
- Unverified items, if any.

## 9. After this lands (for the portfolio side, not this repo)

The portfolio keeps a `FRAME_ANCESTORS` map in `src/components/SiteShowcase.js`. When this site is live with the new header, change its entry from `[]` to `['https://hunterafrick.com']` (or delete the entry) so the live preview turns on. The portfolio owner does this, not you.
