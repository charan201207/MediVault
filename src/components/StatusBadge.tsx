import { Ban, Check, Clock } from 'lucide-react'
import type { ReactNode } from 'react'
import type { ShareStatus } from '../data/dashboardData'

type BadgeTone = 'teal' | 'amber' | 'red' | 'gray' | 'navy'

export default function StatusBadge({ tone = 'teal', children }: { tone?: BadgeTone; children: ReactNode }) {
  return <span className={`badge badge-${tone}`}>{children}</span>
}

const shareStatusViews = {
  active: { tone: 'teal', label: 'Active', Icon: Check },
  expired: { tone: 'amber', label: 'Expired', Icon: Clock },
  revoked: { tone: 'red', label: 'Revoked', Icon: Ban },
} as const

// Icon + text, so the status never depends on color alone.
export function ShareStatusBadge({ status }: { status: ShareStatus }) {
  const { tone, label, Icon } = shareStatusViews[status]
  return (
    <StatusBadge tone={tone}>
      <Icon size={12} aria-hidden="true" />
      {label}
    </StatusBadge>
  )
}