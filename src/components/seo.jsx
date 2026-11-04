import React from "react"
import { useSiteMetadata } from "../hooks/use-site-metadata"

// `title` is a page-specific prefix ("Not found"); the home page just uses the site name.
// `noindex` keeps error pages out of search results.
export const SEO = ({ title, description, pathname = "", noindex = false, children }) => {
  const { title: siteTitle, description: defaultDescription, siteUrl } = useSiteMetadata()

  const fullTitle = title ? `${title} | ${siteTitle}` : siteTitle
  const desc = description || defaultDescription
  const url = `${siteUrl}${pathname}`
  const image = `${siteUrl}/og-image.png`

  return (
    <>
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      <link rel="canonical" href={url} />
      <link rel="icon" type="image/svg+xml" sizes="any" href="/favicon.svg" />
      {noindex && <meta name="robots" content="noindex" />}

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
      {children}
    </>
  )
}
