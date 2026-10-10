import { Check, Info, TriangleAlert } from 'lucide-react'
import type { ReactNode } from 'react'

type NoticeTone = 'success' | 'error' | 'info' | 'warning'

const noticeIcons = { success: Check, error: TriangleAlert, info: Info, warning: TriangleAlert }

type NoticeProps = { tone: NoticeTone; title?: string; children: ReactNode }

export default function Notice({ tone, title, children }: NoticeProps) {
  const NoticeIcon = noticeIcons[tone]
  return (
    <div className={`notice notice-${tone}`} role={tone === 'error' ? 'alert' : 'status'}>
      <NoticeIcon size={18} aria-hidden="true" />
      <div className="notice-content">
        {title ? <p className="notice-title">{title}</p> : null}
        <div>{children}</div>
      </div>
    </div>
  )
}