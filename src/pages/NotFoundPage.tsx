import { Link } from 'react-router-dom'
import { SearchX } from 'lucide-react'

export default function NotFoundPage() {
  return (
    <section className="container page">
      <div className="card not-found">
        <span className="page-icon">
          <SearchX size={26} aria-hidden="true" />
        </span>
        <h1>Page not found</h1>
        <p className="muted">
          The page you are looking for does not exist or has moved.
        </p>
        <Link to="/" className="btn btn-primary">
          Back to home
        </Link>
      </div>
    </section>
  )
}