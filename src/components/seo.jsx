import React from "react"
import { Head } from "vite-react-ssg"
import { site } from "../data/site"

// `title` is a page-specific prefix ("Projects"), shown as "Projects | Hunter Africk". `fullTitle` replaces the whole
// title (the home page). `pathname` is the page's path with its trailing slash, used for the canonical and og:url.
// `noindex` keeps error pages out of search results (and leaves out the canonical, which would contradict it).
// `schema` is an object (or array) emitted as JSON-LD. The favicon, theme-color and manifest links live in index.html.
export const SEO = ({ title, fullTitle: fullTitleProp, description, pathname = "/", noindex = false, schema, children }) => {
  const { title: siteTitle, description: defaultDescription, siteUrl } = site

  const fullTitle = fullTitleProp || (title ? `${title} | ${siteTitle}` : siteTitle)
  const desc = description || defaultDescription
  const url = `${siteUrl}${pathname}`
  const image = `${siteUrl}/og-image.png`

  return (
    <Head>
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      {noindex ? <meta name="robots" content="noindex" /> : <link rel="canonical" href={url} />}

      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={siteTitle} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={desc} />
      <meta name="twitter:image" content={image} />
      {schema && <script type="application/ld+json">{JSON.stringify(schema)}</script>}
      {children}
    </Head>
  )
}
