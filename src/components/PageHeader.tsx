import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

type PageHeaderProps = {
  title: string
  description: string
  icon: LucideIcon
  backTo?: { to: string; label: string }
  actions?: ReactNode
}

export default function PageHeader({ title, description, icon: HeaderIcon, backTo, actions }: PageHeaderProps) {
  return (
    <header className="page-heading">
      {backTo ? (
        <Link to={backTo.to} className="back-link">
          <ArrowLeft size={16} aria-hidden="true" />
          {backTo.label}
        </Link>
      ) : null}
      <div className="page-header">
        <span className="page-icon">
          <HeaderIcon size={26} aria-hidden="true" />
        </span>
        <div className="page-header-text">
          <h1>{title}</h1>
          <p className="muted">{description}</p>
        </div>
        {actions ? <div className="page-header-actions">{actions}</div> : null}
      </div>
    </header>
  )
}