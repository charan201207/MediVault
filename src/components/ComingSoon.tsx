import { Construction } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

type ComingSoonProps = {
  title: string
  description: string
  milestone: string
  icon: LucideIcon
}

export default function ComingSoon({
  title,
  description,
  milestone,
  icon: PageIcon,
}: ComingSoonProps) {
  return (
    <section className="container page">
      <div className="page-header">
        <span className="page-icon">
          <PageIcon size={26} aria-hidden="true" />
        </span>
        <div>
          <h1>{title}</h1>
          <p className="muted">{description}</p>
        </div>
      </div>

      <div className="card coming-soon">
        <Construction size={20} aria-hidden="true" />
        <div>
          <p className="coming-soon-title">Not built yet</p>
          <p className="muted">
            This route exists so navigation works, but the real page is built in{' '}
            <strong>{milestone}</strong>.
          </p>
        </div>
      </div>
    </section>
  )
}