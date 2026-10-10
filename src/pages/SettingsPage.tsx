
import { useState } from 'react'
import type { FormEvent } from 'react'
import { RotateCcw, Settings } from 'lucide-react'
import FormField, { CheckboxField } from '../components/FormField'
import { ConfirmDialog } from '../components/Modal'
import Notice from '../components/Notice'
import PageHeader from '../components/PageHeader'
import { ErrorState, LoadingState } from '../components/StateViews'
import StatusBadge from '../components/StatusBadge'
import type { DemoProfile } from '../data/dashboardData'
import { getDemoState, resetDemoData, updateProfile, useDemoData } from '../data/demoStore'
import { hasErrors, validateProfile } from '../lib/validation'
import type { FieldErrors, ProfileValues } from '../lib/validation'

type PageNotice = { tone: 'success' | 'error'; text: string }

export default function SettingsPage() {
  const { status, error, profile } = useDemoData()
  const [draft, setDraft] = useState<DemoProfile>(profile)
  const [errors, setErrors] = useState<FieldErrors<ProfileValues>>({})
  const [notice, setNotice] = useState<PageNotice | null>(null)
  const [confirmReset, setConfirmReset] = useState(false)

  if (status === 'loading') {
    return (
      <div className="container page">
        <LoadingState label="Loading settings…" />
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="container page">
        <ErrorState title="Settings could not load">{error}</ErrorState>
      </div>
    )
  }

  const dirty =
    draft.display_name !== profile.display_name ||
    draft.email !== profile.email ||
    draft.phone !== profile.phone ||
    draft.notify_share_activity !== profile.notify_share_activity ||
    draft.notify_product_news !== profile.notify_product_news

  function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const found = validateProfile(draft)
    setErrors(found)

    if (hasErrors(found)) {
      setNotice(null)
      return
    }

    const cleaned: DemoProfile = {
      ...draft,
      display_name: draft.display_name.trim(),
      email: draft.email.trim(),
      phone: draft.phone.trim(),
    }

    updateProfile(cleaned)
    setDraft(cleaned)
    setNotice({
      tone: 'success',
      text: 'Saved to this demo session. These settings reset when you refresh.',
    })
  }

  function handleCancel() {
    setDraft(profile)
    setErrors({})
    setNotice(null)
  }

  function handleReset() {
    resetDemoData()
    setDraft(getDemoState().profile)
    setErrors({})
    setConfirmReset(false)
    setNotice({
      tone: 'success',
      text: 'Demo data restored to the original sample records, shares, and profile.',
    })
  }

  return (
    <div className="container page stack">
      <PageHeader
        title="Profile and settings"
        description="Demo profile, preferences, and privacy information."
        icon={Settings}
        backTo={{ to: '/dashboard', label: 'Back to dashboard' }}
      />

      {notice ? <Notice tone={notice.tone}>{notice.text}</Notice> : null}

      <div className="settings-grid">
        <form className="card form-stack" onSubmit={handleSave} noValidate>
          <h2 className="section-title">Profile</h2>

          <FormField label="Display name" required error={errors.display_name}>
            {(control) => (
              <input
                {...control}
                type="text"
                autoComplete="name"
                value={draft.display_name}
                onChange={(event) => setDraft({ ...draft, display_name: event.target.value })}
              />
            )}
          </FormField>

          <FormField
            label="Email"
            required
            error={errors.email}
            hint="Use a fictional address in this demo."
          >
            {(control) => (
              <input
                {...control}
                type="email"
                autoComplete="email"
                value={draft.email}
                onChange={(event) => setDraft({ ...draft, email: event.target.value })}
              />
            )}
          </FormField>

          <FormField label="Phone" error={errors.phone}>
            {(control) => (
              <input
                {...control}
                type="tel"
                autoComplete="tel"
                value={draft.phone}
                onChange={(event) => setDraft({ ...draft, phone: event.target.value })}
              />
            )}
          </FormField>

          <h2 className="section-title">Notification preferences</h2>

          <CheckboxField
            label="Share activity"
            description="Would notify you when a share is created or revoked. No notifications are sent in this demo."
            checked={draft.notify_share_activity}
            onChange={(checked) => setDraft({ ...draft, notify_share_activity: checked })}
          />

          <CheckboxField
            label="Product news"
            description="Occasional updates about MediVault."
            checked={draft.notify_product_news}
            onChange={(checked) => setDraft({ ...draft, notify_product_news: checked })}
          />

          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={handleCancel} disabled={!dirty}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={!dirty}>
              Save changes
            </button>
          </div>
        </form>

        <div className="stack">
          <section className="card form-stack" aria-labelledby="settings-env-heading">
            <h2 id="settings-env-heading" className="section-title">Environment</h2>
            <p><StatusBadge tone="amber">Demo mode</StatusBadge></p>
            <p className="muted">
              This is a frontend-only prototype. There is no backend, no real account, and no secure storage.
            </p>
          </section>

          <section className="card form-stack" aria-labelledby="settings-security-heading">
            <h2 id="settings-security-heading" className="section-title">Account and security</h2>
            <p className="muted">
              Sign-in, sign-up, and password management will be provided by Supabase Auth. This demo has no accounts,
              so there is no password to change.
            </p>
          </section>

          <section className="card form-stack" aria-labelledby="settings-privacy-heading">
            <h2 id="settings-privacy-heading" className="section-title">Privacy in this demo</h2>
            <ul className="plain-list">
              <li>All data is fictional and held in memory in this browser tab only.</li>
              <li>Nothing is saved to the browser, a server, or the URL, and everything resets on refresh.</li>
              <li>Passwords are never stored or sent.</li>
              <li>Documents are never uploaded. Only a selected file’s name can be noted.</li>
              <li>Please do not enter real medical or personal information.</li>
            </ul>
          </section>

          <section className="card form-stack" aria-labelledby="settings-reset-heading">
            <h2 id="settings-reset-heading" className="section-title">Demo data</h2>
            <p className="muted">
              Restore the original sample records, shares, and profile, for example before a demo.
            </p>
            <button type="button" className="btn btn-secondary" onClick={() => setConfirmReset(true)}>
              <RotateCcw size={18} aria-hidden="true" />
              Reset demo data
            </button>
          </section>
        </div>
      </div>

      {confirmReset ? (
        <ConfirmDialog
          title="Reset demo data?"
          confirmLabel="Reset demo data"
          danger
          onConfirm={handleReset}
          onCancel={() => setConfirmReset(false)}
        >
          <p>Records you added, edits, simulated shares, and profile changes in this session will be discarded.</p>
        </ConfirmDialog>
      ) : null}
    </div>
  )
}
