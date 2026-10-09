import { Link } from 'react-router-dom'
import { ArrowRight, ShieldCheck } from 'lucide-react'

export default function HomePage() {
  return (
    <section className="container page">
      <div className="hero-stub">
        <span className="eyebrow">HealthTech hackathon project</span>
        <h1>Your Health History, All in One Place.</h1>
        <p className="lead">
          MediVault helps patients organize their medical records and choose
          which records to share with a healthcare provider.
        </p>

        <div className="button-row">
          <Link to="/dashboard" className="btn btn-primary">
            Open demo dashboard
            <ArrowRight size={18} aria-hidden="true" />
          </Link>
          <Link to="/records" className="btn btn-secondary">
            Browse records
          </Link>
        </div>

        <p className="muted small note-line">
          <ShieldCheck size={16} aria-hidden="true" />
          Milestone 1 shell. The full landing page is built in Milestone 2.
        </p>
      </div>
    </section>
  )
}