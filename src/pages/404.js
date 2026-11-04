import * as React from "react"
import { Link } from "gatsby"
import { SEO } from "../components/seo"
import ZineShell from "../components/portfolio/ZineShell"

const NotFoundPage = () => (
  <ZineShell>
    <section className="tz-page tz-back tz-404">
      <p className="tz-kicker">Error &middot; Missing page</p>
      <p className="tz-404-num" aria-hidden="true">404</p>
      <h1>Page not found</h1>
      <p className="tz-stand">This page fell out of the issue. Sorry, we couldn&rsquo;t find what you were looking for.</p>
      <div className="tz-row"><Link to="/" className="tz-jelly">Back to the cover</Link></div>
    </section>
  </ZineShell>
)

export default NotFoundPage

export const Head = () => <SEO title="Not found" />
