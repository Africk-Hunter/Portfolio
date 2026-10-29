import * as React from "react"
import { Link } from "gatsby"
import { SEO } from "../components/seo"
import "../styles/index.scss"
import "../styles/NotFound.scss"

const NotFoundPage = () => {
  return (
    <main>
      <header className="notFoundHeader">
        <h1 className="nameText">Hunter Africk</h1>
      </header>
      <section className="notFound">
        <h2 className="notFoundCode">404</h2>
        <h3 className="notFoundTitle">Page not found</h3>
        <p className="notFoundText">Sorry, we couldn’t find what you were looking for.</p>
        <Link to="/" className="notFoundButton">Go home</Link>
      </section>
    </main>
  )
}

export default NotFoundPage

export const Head = () => <SEO title="Not found" />
