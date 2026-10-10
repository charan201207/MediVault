import { TriangleAlert } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

type EmptyStateProps = { icon: LucideIcon; title: string; children?: ReactNode; action?: ReactNode }

export function EmptyState({ icon: StateIcon, title, children, action }: EmptyStateProps) {
  return (
    <div className="state-view">
      <StateIcon size={28} aria-hidden="true" />
      <p className="state-title">{title}</p>
      {children ? <div className="state-text">{children}</div> : null}
      {action}
    </div>
  )
}

export function LoadingState({ label = 'Loading…' }: { label?: string }) {
  return (
    <div className="state-view" role="status">
      <span className="spinner" aria-hidden="true" />
      <p className="state-text">{label}</p>
    </div>
  )
}

export function ErrorState({ title = 'Something went wrong', children }: { title?: string; children?: ReactNode }) {
  return (
    <div className="state-view state-error" role="alert">
      <TriangleAlert size={28} aria-hidden="true" />
      <p className="state-title">{title}</p>
      {children ? <div className="state-text">{children}</div> : null}
    </div>
  )
}