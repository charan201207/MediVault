
import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ArrowLeft, Ban, Copy, ExternalLink, FileText, Share2 } from 'lucide-react'
import FormField, { CheckboxField } from '../components/FormField'
import { ConfirmDialog } from '../components/Modal'
import Notice from '../components/Notice'
import PageHeader from '../components/PageHeader'
import RecordTypeIcon from '../components/RecordTypeIcon'
import { EmptyState, ErrorState, LoadingState } from '../components/StateViews'
import StatusBadge, { ShareStatusBadge } from '../components/StatusBadge'
import {
  expiryOptions,
  formatDateTime,
  formatRecordDate,
  getShareStatus,
  recordTypeLabels,
} from '../data/dashboardData'
import type { DemoRecord, DemoShare, ExpiryOption } from '../data/dashboardData'
import { createShare, getErrorMessage, revokeShare, useDemoData } from '../data/demoStore'
import { hasErrors, validateShare } from '../lib/validation'
import type { FieldErrors, ShareFormValues } from '../lib/validation'

type Step = 'compose' | 'review' | 'done'
type PageNotice = { tone: 'success' | 'error'; text: string }

// The Records page can pre-select a record through router state (never through the URL).
function readPreselected(value: unknown): string[] {
  if (typeof value !== 'object' || value === null) return []
  const ids = (value as { preselectRecordIds?: unknown }).preselectRecordIds
  return Array.isArray(ids) ? ids.filter((id): id is string => typeof id === 'string') : []
}

export default function SharePage() {
  const { status, error, records, shares } = useDemoData()
  const location = useLocation()
  const [now] = useState(() => new Date().getTime())
  const [step, setStep] = useState<Step>('compose')
  const [selectedIds, setSelectedIds] = useState<string[]>(() => readPreselected(location.state))
  const [email, setEmail] = useState('')
  const [canDownload, setCanDownload] = useState(false)
  const [purpose, setPurpose] = useState('')
  const [expiry, setExpiry] = useState<ExpiryOption>('7d')
  const [errors, setErrors] = useState<FieldErrors<ShareFormValues>>({})
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [created, setCreated] = useState<DemoShare | null>(null)
  const [copyStatus, setCopyStatus] = useState<string | null>(null)
  const [revokeId, setRevokeId] = useState<string | null>(null)
  const [notice, setNotice] = useState<PageNotice | null>(null)

  if (status === 'loading') {
    return (
      <div className="container page">
        <LoadingState label="Loading sharing center…" />
      </div>
    )
  }
  if (status === 'error') {
    return (
      <div className="container page">
        <ErrorState title="The sharing center could not load">{error}</ErrorState>
      </div>
    )
  }

  const selectedRecords = records.filter((record) => selectedIds.includes(record.id))
  const selectedRecordIds = selectedRecords.map((record) => record.id)
  const expiryLabel = expiryOptions.find((option) => option.value === expiry)?.label ?? ''
  const sortedShares = [...shares].sort((a, b) => b.created_at.localeCompare(a.created_at))
  const revokeTarget = shares.find((share) => share.id === revokeId)

  function toggleRecord(id: string) {
    setSelectedIds((current) => (current.includes(id) ? current.filter((existing) => existing !== id) : [...current, id]))
  }

  function handleReview(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const found = validateShare({ record_ids: selectedRecordIds, recipient_email: email, purpose })
    setErrors(found)
    if (hasErrors(found)) return
    setSubmitError(null)
    setNotice(null)
    setStep('review')
  }

  function handleConfirm() {
    setSubmitError(null)
    try {
      const share = createShare({
        recipient_email: email,
        record_ids: selectedRecordIds,
        can_download: canDownload,
        purpose,
        expires_in: expiry,
      })
      setCreated(share)
      setCopyStatus(null)
      setStep('done')
    } catch (caught) {
      setSubmitError(getErrorMessage(caught))
    }
  }

  function startOver() {
    setStep('compose')
    setSelectedIds([])
    setEmail('')
    setCanDownload(false)
    setPurpose('')
    setExpiry('7d')
    setErrors({})
    setSubmitError(null)
    setCreated(null)
    setCopyStatus(null)
  }

  async function copyLink(link: string) {
    try {
      await navigator.clipboard.writeText(link)
      setCopyStatus('Link copied.')
    } catch {
      setCopyStatus('Could not copy automatically. Select the link above and copy it yourself.')
    }
  }

  function handleRevoke() {
    if (!revokeId) return
    try {
      revokeShare(revokeId)
      setNotice({ tone: 'success', text: 'Access revoked in this demo session.' })
    } catch (caught) {
      setNotice({ tone: 'error', text: getErrorMessage(caught) })
    }
    setRevokeId(null)
  }

  const stepLabels: { id: Step; label: string }[] = [
    { id: 'compose', label: 'Choose' },
    { id: 'review', label: 'Review' },
    { id: 'done', label: 'Done' },
  ]
  const demoLink = created ? `${window.location.origin}/shared/${created.reference}` : ''

  return (
    <div className="container page stack">
      <PageHeader
        title="Sharing center"
        description="Choose records, a recipient, and an expiry. This is a simulation: nothing is sent."
        icon={Share2}
        backTo={{ to: '/dashboard', label: 'Back to dashboard' }}
      />

      <Notice tone="warning" title="Simulated sharing">
        No email is sent and no server enforces permissions, expiry, or revocation. Shares exist only in this browser
        tab and disappear on refresh. Real, secure sharing needs the backend described in the project plan.
      </Notice>

      {notice ? <Notice tone={notice.tone}>{notice.text}</Notice> : null}

      <ol className="steps" aria-label="Sharing steps">
        {stepLabels.map((item) => (
          <li key={item.id} aria-current={item.id === step ? 'step' : undefined}>
            {item.label}
          </li>
        ))}
      </ol>

      {step === 'compose' ? (
        records.length === 0 ? (
          <section className="card">
            <EmptyState
              icon={FileText}
              title="No records to share"
              action={
                <Link to="/records" className="btn btn-primary btn-sm">
                  Go to records
                </Link>
              }
            >
              Add a record first, then come back to share it.
            </EmptyState>
          </section>
        ) : (
          <form className="card" onSubmit={handleReview} noValidate>
            <h2 className="section-title">1. Choose records</h2>
            <fieldset className="select-fieldset" aria-describedby={errors.record_ids ? 'share-records-error' : undefined}>
              <legend className="visually-hidden">Records to share</legend>
              <div className="select-toolbar">
                <span aria-live="polite">
                  {selectedRecords.length} of {records.length} selected
                </span>
                <span>
                  <button type="button" className="link-button" onClick={() => setSelectedIds(records.map((record) => record.id))}>
                    Select all
                  </button>
                  {' · '}
                  <button type="button" className="link-button" onClick={() => setSelectedIds([])}>
                    Clear
                  </button>
                </span>
              </div>
              <ul className="select-list">
                {records.map((record) => (
                  <li key={record.id}>
                    <label className="select-row">
                      <input type="checkbox" checked={selectedIds.includes(record.id)} onChange={() => toggleRecord(record.id)} />
                      <RecordTypeIcon type={record.record_type} />
                      <span className="select-row-text">
                        <span className="record-title">{record.title}</span>
                        <span className="record-meta">
                          {record.provider_name} · {formatRecordDate(record.record_date)}
                        </span>
                      </span>
                      <StatusBadge>{recordTypeLabels[record.record_type]}</StatusBadge>
                    </label>
                  </li>
                ))}
              </ul>
            </fieldset>
            {errors.record_ids ? (
              <p id="share-records-error" className="field-error">
                {errors.record_ids}
              </p>
            ) : null}

            <h2 className="section-title" style={{ marginTop: '1.5rem' }}>
              2. Recipient and access
            </h2>
            <div className="form-stack">
              <FormField label="Recipient email" required error={errors.recipient_email}>
                {(control) => (
                  <input
                    {...control}
                    type="email"
                    autoComplete="off"
                    placeholder="doctor@example.com"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                  />
                )}
              </FormField>
              <div className="form-grid">
                <FormField label="Access expires after" required>
                  {(control) => (
                    <select {...control} value={expiry} onChange={(event) => setExpiry(event.target.value as ExpiryOption)}>
                      {expiryOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  )}
                </FormField>
                <CheckboxField
                  label="Allow download"
                  description="View-only is the default. Downloads are shown for design purposes: no files are stored in this demo."
                  checked={canDownload}
                  onChange={setCanDownload}
                />
              </div>
              <FormField label="Purpose or message" error={errors.purpose} hint="Do not enter real medical information.">
                {(control) => (
                  <textarea
                    {...control}
                    rows={3}
                    maxLength={300}
                    value={purpose}
                    onChange={(event) => setPurpose(event.target.value)}
                  />
                )}
              </FormField>
            </div>

            <div className="form-footer">
              <span className="muted small">Next: review exactly what will be shared.</span>
              <button type="submit" className="btn btn-primary">
                Review share
              </button>
            </div>
          </form>
        )
      ) : null}

      {step === 'review' ? (
        <section className="card" aria-labelledby="share-review-heading">
          <h2 id="share-review-heading" className="section-title">
            Review before creating
          </h2>
          {submitError ? <Notice tone="error">{submitError}</Notice> : null}
          <dl className="detail-list" style={{ marginTop: '1rem' }}>
            <div>
              <dt>Recipient</dt>
              <dd>{email.trim()}</dd>
            </div>
            <div>
              <dt>Expires</dt>
              <dd>{expiryLabel} after you confirm</dd>
            </div>
            <div>
              <dt>Permissions</dt>
              <dd>View-only{canDownload ? ' + download' : ''}</dd>
            </div>
            <div>
              <dt>Message</dt>
              <dd>{purpose.trim() || 'None'}</dd>
            </div>
            <div className="detail-wide">
              <dt>Records ({selectedRecords.length})</dt>
              <dd>
                <ul className="chip-list">
                  {selectedRecords.map((record) => (
                    <li key={record.id} className="chip">
                      {record.title}
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
          </dl>
          <div className="form-footer">
            <button type="button" className="btn btn-secondary" onClick={() => setStep('compose')}>
              <ArrowLeft size={18} aria-hidden="true" />
              Back to edit
            </button>
            <button type="button" className="btn btn-primary" onClick={handleConfirm}>
              Create demo share
            </button>
          </div>
        </section>
      ) : null}

      {step === 'done' && created ? (
        <section className="card form-stack" aria-labelledby="share-done-heading">
          <h2 id="share-done-heading" className="section-title">
            Demo share created
          </h2>
          <Notice tone="success">
            Reference <strong>{created.reference}</strong> now exists in this browser tab. No email was sent.
          </Notice>
          <div className="link-box">{demoLink}</div>
          <div className="modal-actions" style={{ justifyContent: 'flex-start' }}>
            <button type="button" className="btn btn-secondary" onClick={() => copyLink(demoLink)}>
              <Copy size={18} aria-hidden="true" />
              Copy demo link
            </button>
            <Link to={`/shared/${created.reference}`} className="btn btn-secondary">
              <ExternalLink size={18} aria-hidden="true" />
              Open demo viewer
            </Link>
            <button type="button" className="btn btn-primary" onClick={startOver}>
              Create another share
            </button>
          </div>
          {copyStatus ? (
            <p role="status" className="muted small">
              {copyStatus}
            </p>
          ) : null}
          <p className="muted small">
            The link only works in this tab while the demo is open. It is not secure: a real link would be validated by
            a server.
          </p>
        </section>
      ) : null}

      <section aria-labelledby="share-list-heading">
        <h2 id="share-list-heading" className="section-title">
          Shares in this demo session
        </h2>
        {sortedShares.length === 0 ? (
          <div className="card">
            <EmptyState icon={Share2} title="No shares yet">
              Shares you create will be listed here.
            </EmptyState>
          </div>
        ) : (
          <ul className="share-list">
            {sortedShares.map((share) => {
              const shareStatus = getShareStatus(share, now)
              const shareRecords = share.record_ids
                .map((id) => records.find((record) => record.id === id))
                .filter((record): record is DemoRecord => record !== undefined)
              return (
                <li key={share.id} className="card share-card">
                  <div className="share-card-head">
                    <span className="share-ref">{share.reference}</span>
                    <ShareStatusBadge status={shareStatus} />
                  </div>
                  <dl className="detail-list">
                    <div>
                      <dt>Recipient</dt>
                      <dd>{share.recipient_email}</dd>
                    </div>
                    <div>
                      <dt>Permissions</dt>
                      <dd>View-only{share.can_download ? ' + download' : ''}</dd>
                    </div>
                    <div>
                      <dt>Created</dt>
                      <dd>{formatDateTime(share.created_at)}</dd>
                    </div>
                    <div>
                      <dt>{shareStatus === 'expired' ? 'Expired' : 'Expires'}</dt>
                      <dd>{formatDateTime(share.expires_at)}</dd>
                    </div>
                    {share.revoked_at ? (
                      <div>
                        <dt>Revoked</dt>
                        <dd>{formatDateTime(share.revoked_at)}</dd>
                      </div>
                    ) : null}
                    {share.purpose ? (
                      <div className="detail-wide">
                        <dt>Message</dt>
                        <dd>{share.purpose}</dd>
                      </div>
                    ) : null}
                    <div className="detail-wide">
                      <dt>Records ({shareRecords.length})</dt>
                      <dd>
                        {shareRecords.length === 0 ? (
                          'No records remain in this share.'
                        ) : (
                          <ul className="chip-list">
                            {shareRecords.map((record) => (
                              <li key={record.id} className="chip">
                                {record.title}
                              </li>
                            ))}
                          </ul>
                        )}
                      </dd>
                    </div>
                  </dl>
                  <div className="modal-actions" style={{ justifyContent: 'flex-start' }}>
                    <Link to={`/shared/${share.reference}`} className="btn btn-secondary btn-sm">
                      <ExternalLink size={16} aria-hidden="true" />
                      Open demo viewer
                    </Link>
                    {shareStatus === 'active' ? (
                      <button type="button" className="btn btn-danger-outline btn-sm" onClick={() => setRevokeId(share.id)}>
                        <Ban size={16} aria-hidden="true" />
                        Revoke access
                      </button>
                    ) : null}
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </section>

      {revokeTarget ? (
        <ConfirmDialog
          title="Revoke this share?"
          confirmLabel="Revoke access"
          danger
          onConfirm={handleRevoke}
          onCancel={() => setRevokeId(null)}
        >
          <p>
            Access for <strong>{revokeTarget.recipient_email}</strong> ({revokeTarget.reference}) will end immediately in
            this demo. In the full product, the server would enforce revocation.
          </p>
        </ConfirmDialog>
      ) : null}
    </div>
  )
}
