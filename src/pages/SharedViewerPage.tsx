
import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Ban, Clock, Link2, SearchX } from 'lucide-react'
import Notice from '../components/Notice'
import PageHeader from '../components/PageHeader'
import RecordTypeIcon from '../components/RecordTypeIcon'
import { EmptyState, ErrorState, LoadingState } from '../components/StateViews'
import StatusBadge, { ShareStatusBadge } from '../components/StatusBadge'
import { formatDateTime, formatRecordDate, getShareStatus, recordTypeLabels } from '../data/dashboardData'
import type { DemoRecord } from '../data/dashboardData'
import { useDemoData } from '../data/demoStore'

export default function SharedViewerPage() {
  const { token } = useParams()
  const { status, error, records, shares, profile } = useDemoData()
  const [now] = useState(() => new Date().getTime())

  const backToSharing = (
    <Link to="/share" className="btn btn-secondary btn-sm">
      Go to sharing center
    </Link>
  )

  let content
  if (status === 'loading') {
    content = <LoadingState label="Checking this link…" />
  } else if (status === 'error') {
    content = <ErrorState title="This link could not be checked">{error}</ErrorState>
  } else {
    const share = shares.find((candidate) => candidate.reference === token)
    if (!share) {
      content = (
        <EmptyState icon={SearchX} title="This demo link isn’t available" action={backToSharing}>
          The reference may be mistyped, or the demo data was reset. Demo shares exist only in the tab that created
          them and are lost on refresh.
        </EmptyState>
      )
    } else {
      const shareStatus = getShareStatus(share, now)
      if (shareStatus === 'revoked') {
        content = (
          <EmptyState icon={Ban} title="Access was revoked" action={backToSharing}>
            The person who shared these records ended access to this link.
          </EmptyState>
        )
      } else if (shareStatus === 'expired') {
        content = (
          <EmptyState icon={Clock} title="This share has expired" action={backToSharing}>
            Access ended on {formatDateTime(share.expires_at)}.
          </EmptyState>
        )
      } else {
        const sharedRecords = share.record_ids
          .map((id) => records.find((record) => record.id === id))
          .filter((record): record is DemoRecord => record !== undefined)
        content = (
          <div className="stack">
            <section className="card">
              <div className="share-card-head">
                <h2 className="section-title">Shared by {profile.display_name}</h2>
                <ShareStatusBadge status={shareStatus} />
              </div>
              <dl className="detail-list">
                <div>
                  <dt>Shared with</dt>
                  <dd>{share.recipient_email}</dd>
                </div>
                <div>
                  <dt>Access ends</dt>
                  <dd>{formatDateTime(share.expires_at)}</dd>
                </div>
                <div>
                  <dt>Permissions</dt>
                  <dd>View-only{share.can_download ? ' + download (not available in the demo)' : ''}</dd>
                </div>
                {share.purpose ? (
                  <div className="detail-wide">
                    <dt>Message</dt>
                    <dd>{share.purpose}</dd>
                  </div>
                ) : null}
              </dl>
            </section>

            <section className="card" aria-labelledby="viewer-records-heading">
              <h2 id="viewer-records-heading" className="section-title">
                Records in this share ({sharedRecords.length})
              </h2>
              {sharedRecords.length === 0 ? (
                <p className="muted">No records remain in this share.</p>
              ) : (
                <ul className="record-list">
                  {sharedRecords.map((record) => (
                    <li key={record.id} className="record-item">
                      <RecordTypeIcon type={record.record_type} />
                      <div className="record-main">
                        <p className="record-title">{record.title}</p>
                        <p className="record-meta">
                          {record.provider_name} ·{' '}
                          <time dateTime={record.record_date}>{formatRecordDate(record.record_date)}</time>
                        </p>
                        {record.notes ? <p className="record-meta">{record.notes}</p> : null}
                      </div>
                      <StatusBadge>{recordTypeLabels[record.record_type]}</StatusBadge>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>
        )
      }
    }
  }

  return (
    <div className="container page stack">
      <PageHeader
        title="Shared records"
        description="What a recipient would see for one specific share."
        icon={Link2}
        backTo={{ to: '/share', label: 'Back to sharing center' }}
      />
      <Notice tone="warning" title="Demo viewer: not secure">
        This page reads in-memory demo data from this browser tab. It does not check a real token, identity, expiry, or
        revocation on a server, so it must not be treated as protecting real records. Secure sharing requires
        server-side checks that are not built yet.
      </Notice>
      {content}
    </div>
  )
}
