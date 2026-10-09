import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  Building2,
  CalendarDays,
  ClipboardList,
  FileText,
  FlaskConical,
  FolderOpen,
  Info,
  Pill,
  Plus,
  ScanLine,
  Share2,
  ShieldCheck,
  Stethoscope,
  Syringe,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import {
  countSharesByStatus,
  demoPatient,
  demoRecords,
  demoShares,
  formatRecordDate,
  getProviderSummaries,
  getRecentRecords,
  recordTypeLabels,
} from '../data/dashboardData'
import type { RecordType } from '../data/dashboardData'

const RECENT_RECORD_LIMIT = 5

const recordTypeIcons: Record<RecordType, LucideIcon> = {
  lab_report: FlaskConical,
  prescription: Pill,
  consultation_summary: Stethoscope,
  imaging_report: ScanLine,
  vaccination: Syringe,
  discharge_summary: ClipboardList,
}

type QuickAction = {
  to: string
  title: string
  description: string
  icon: LucideIcon
  status: string
}

// Destinations are still placeholder pages, so each action says so.
const quickActions: QuickAction[] = [
  {
    to: '/records',
    title: 'Browse records',
    description: 'Open your records list.',
    icon: FolderOpen,
    status: 'Page coming soon',
  },
  {
    to: '/records',
    title: 'Add a record',
    description: 'Opens Records, where the add-record form will live.',
    icon: Plus,
    status: 'Page coming soon',
  },
  {
    to: '/share',
    title: 'Share records',
    description: 'Open the sharing center to choose records and a recipient.',
    icon: Share2,
    status: 'Page coming soon',
  },
]

function getGreeting(hour: number): string {
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

function pluralize(count: number, singular: string): string {
  return `${count} ${count === 1 ? singular : `${singular}s`}`
}

type StatCardProps = {
  icon: LucideIcon
  label: string
  value: number
  hint: string
  badge?: string
}

function StatCard({ icon: StatIcon, label, value, hint, badge }: StatCardProps) {
  return (
    <li className="card dashboard-stat">
      <span className="dashboard-stat-icon">
        <StatIcon size={20} aria-hidden="true" />
      </span>
      <p className="dashboard-stat-label">{label}</p>
      <p className="dashboard-stat-value">{value}</p>
      <p className="dashboard-stat-hint">{hint}</p>
      {badge ? <span className="dashboard-badge dashboard-badge-pending">{badge}</span> : null}
    </li>
  )
}

export default function DashboardPage() {
  // Created once when the page first renders, so the date is live but stable.
  const [today] = useState(() => new Date())

  const records = demoRecords
  const recentRecords = getRecentRecords(records, RECENT_RECORD_LIMIT)
  const providers = getProviderSummaries(records)
  const shareCounts = countSharesByStatus(demoShares)

  const longDate = today.toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
  const isoDate = today.toLocaleDateString('en-CA') // YYYY-MM-DD in local time

  return (
    <div className="container page dashboard-page">
      <section className="dashboard-welcome" aria-labelledby="dashboard-welcome-heading">
        <div className="dashboard-welcome-text">
          <p className="dashboard-date">
            <CalendarDays size={16} aria-hidden="true" />
            <time dateTime={isoDate}>{longDate}</time>
          </p>
          <h1 id="dashboard-welcome-heading">
            {getGreeting(today.getHours())}, {demoPatient.first_name}
          </h1>
          <p className="dashboard-welcome-lead">
            Your dashboard shows the records you have organized, the providers behind them, and your
            sharing options, all in one place.
          </p>
          <p className="dashboard-demo-note">
            <FlaskConical size={16} aria-hidden="true" />
            <span>
              Demo patient: {demoPatient.full_name} is a fictional person. Every record on this page
              is sample data.
            </span>
          </p>
        </div>

        <div className="dashboard-welcome-actions">
          <Link to="/records" className="btn btn-primary">
            <FolderOpen size={18} aria-hidden="true" />
            Manage records
          </Link>
          <Link to="/share" className="btn btn-secondary">
            <Share2 size={18} aria-hidden="true" />
            Share records
          </Link>
        </div>
      </section>

      <section aria-labelledby="dashboard-summary-heading">
        <h2 id="dashboard-summary-heading" className="visually-hidden">
          Summary
        </h2>
        <ul className="dashboard-stats">
          <StatCard
            icon={FileText}
            label="Total medical records"
            value={records.length}
            hint="Fictional sample records"
          />
          <StatCard
            icon={Building2}
            label="Healthcare providers"
            value={providers.length}
            hint="Represented in these records"
          />
          <StatCard
            icon={Share2}
            label="Active shares"
            value={shareCounts.active}
            hint={`${shareCounts.expired} expired · ${shareCounts.revoked} revoked`}
            badge="Sample data: sharing is not active yet"
          />
        </ul>
      </section>

      <div className="dashboard-grid">
        <div className="dashboard-main">
          <section className="card" aria-labelledby="dashboard-records-heading">
            <div className="dashboard-section-header">
              <h2 id="dashboard-records-heading">Recent records</h2>
              <Link to="/records" className="dashboard-link">
                View all records
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </div>

            {recentRecords.length === 0 ? (
              <div className="dashboard-empty">
                <FileText size={28} aria-hidden="true" />
                <p className="dashboard-empty-title">No records yet</p>
                <p className="muted">
                  When you add medical records, the newest ones will appear here.
                </p>
                <Link to="/records" className="btn btn-secondary btn-sm">
                  Go to records
                </Link>
              </div>
            ) : (
              <>
                <ul className="dashboard-record-list">
                  {recentRecords.map((record) => {
                    const TypeIcon = recordTypeIcons[record.record_type]
                    return (
                      <li key={record.id} className="dashboard-record">
                        <span className="dashboard-record-icon">
                          <TypeIcon size={18} aria-hidden="true" />
                        </span>
                        <div className="dashboard-record-body">
                          <p className="dashboard-record-title">{record.title}</p>
                          <p className="dashboard-record-meta">
                            {record.provider_name} ·{' '}
                            <time dateTime={record.record_date}>
                              {formatRecordDate(record.record_date)}
                            </time>
                          </p>
                        </div>
                        <span className="dashboard-badge">
                          {recordTypeLabels[record.record_type]}
                        </span>
                      </li>
                    )
                  })}
                </ul>
                <p className="dashboard-record-footnote">
                  Showing the {recentRecords.length} most recent of {records.length} sample records.
                </p>
              </>
            )}
          </section>
        </div>

        <div className="dashboard-side">
          <section className="card" aria-labelledby="dashboard-actions-heading">
            <h2 id="dashboard-actions-heading">Quick actions</h2>
            <ul className="dashboard-action-list">
              {quickActions.map(({ to, title, description, icon: ActionIcon, status }) => (
                <li key={title}>
                  <Link to={to} className="dashboard-action">
                    <span className="dashboard-action-icon">
                      <ActionIcon size={18} aria-hidden="true" />
                    </span>
                    <span className="dashboard-action-text">
                      <span className="dashboard-action-title">{title}</span>
                      <span className="dashboard-action-desc">{description}</span>
                      <span className="dashboard-badge dashboard-badge-pending">{status}</span>
                    </span>
                    <ArrowRight size={16} aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section className="card" aria-labelledby="dashboard-providers-heading">
            <h2 id="dashboard-providers-heading">Healthcare providers</h2>
            <p className="dashboard-section-note">Sample providers behind these records.</p>
            {providers.length === 0 ? (
              <p className="muted">Providers will appear here once you add records.</p>
            ) : (
              <ul className="dashboard-provider-list">
                {providers.map((provider) => (
                  <li key={provider.name} className="dashboard-record">
                    <span className="dashboard-record-icon">
                      <Building2 size={18} aria-hidden="true" />
                    </span>
                    <div className="dashboard-record-body">
                      <p className="dashboard-record-title">{provider.name}</p>
                      <p className="dashboard-record-meta">
                        {provider.kind} · {pluralize(provider.record_count, 'record')}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="card dashboard-privacy" aria-labelledby="dashboard-privacy-heading">
            <div className="dashboard-privacy-title">
              <ShieldCheck size={22} aria-hidden="true" />
              <h2 id="dashboard-privacy-heading">Your records, your choice.</h2>
            </div>
            <p>
              MediVault is designed to let you pick exactly which records to share, with whom, and
              for how long.
            </p>
            <div className="dashboard-privacy-status">
              <Info size={18} aria-hidden="true" />
              <p>
                <strong>Not active yet.</strong> Sharing and server-enforced permissions are planned
                for a later release. Nothing on this page is stored or shared.
              </p>
            </div>
            <Link to="/share" className="dashboard-link">
              Preview the sharing center
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </section>
        </div>
      </div>
    </div>
  )
}