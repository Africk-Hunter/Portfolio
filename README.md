# Hunter Africk Portfolio

This is my portfolio where I showcase my projects. It is built in React, Sass, and Vite, and prerendered to static HTML with [vite-react-ssg](https://github.com/Daydreamer-riri/vite-react-ssg).

## Running Locally

To run this project locally:

1. **Clone the repository:**
    ```sh
    git clone https://github.com/Africk-Hunter/Portfolio.git
    cd Portfolio
    ```

2. **Install dependencies:**
    ```sh
    npm install
    ```

3. **Start the development server:**
    ```sh
    npm run dev
    ```

4. Navigate to `http://localhost:8000` to view the website.

## Building for Production

```sh
npm run build     # prerenders every page into dist/
npm run preview   # serves dist/ on http://localhost:8000
```

The site is hosted on Netlify; build settings, cache headers and security headers are in `netlify.toml`.

## Adding a page

1. Create `src/pages/<name>.js` with a default component and, optionally, an exported `Head` that renders `<SEO />`.
2. Register the route in `src/main.jsx`.
3. Add its path to `SITEMAP_PATHS` in `vite.config.js`.
