
import { Link } from 'react-router-dom'
import { ArrowRight, FileText, Share2, ShieldCheck } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

const steps: { icon: LucideIcon; title: string; text: string }[] = [
  {
    icon: FileText,
    title: 'Keep records together',
    text: 'Records are often scattered across hospitals, clinics, and labs. MediVault lets you organize them in one place.',
  },
  {
    icon: Share2,
    title: 'Choose what to share',
    text: 'Pick specific records, name a recipient, and set how long access should last.',
  },
  {
    icon: ShieldCheck,
    title: 'Stay in control',
    text: 'Revoke access when it is no longer needed. In this prototype, sharing is simulated.',
  },
]

export default function HomePage() {
  return (
    <section className="container page">
      <div className="hero-stub">
        <span className="eyebrow">HealthTech hackathon prototype</span>

        <h1>Your Health History, All in One Place.</h1>

        <p className="lead">
          MediVault helps patients organize their medical records and
          choose which records to share with a healthcare provider.
          Explore the demo with fictional data.
        </p>

        <div className="button-row">
          <Link to="/dashboard" className="btn btn-primary">
            Open demo dashboard
            <ArrowRight size={18} aria-hidden="true" />
          </Link>

          <Link to="/records" className="btn btn-secondary">
            Browse records
          </Link>

          <Link to="/share" className="btn btn-secondary">
            Try the sharing demo
          </Link>
        </div>
      </div>

      <ul className="home-steps">
        {steps.map(({ icon: StepIcon, title, text }) => (
          <li key={title} className="card home-step">
            <span className="page-icon">
              <StepIcon size={24} aria-hidden="true" />
            </span>

            <h2>{title}</h2>
            <p className="muted">{text}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}
