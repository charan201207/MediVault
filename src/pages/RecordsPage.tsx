
import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { FileText, Pencil, Plus, Search, Share2, Trash2 } from 'lucide-react'
import Modal, { ConfirmDialog } from '../components/Modal'
import Notice from '../components/Notice'
import PageHeader from '../components/PageHeader'
import RecordForm from '../components/RecordForm'
import RecordTypeIcon from '../components/RecordTypeIcon'
import { EmptyState, ErrorState, LoadingState } from '../components/StateViews'
import StatusBadge from '../components/StatusBadge'
import {
  filterRecords,
  formatRecordDate,
  recordTypeLabels,
  recordTypeList,
  sortOptions,
  sortRecords,
} from '../data/dashboardData'
import type { RecordInput, RecordType, SortOption } from '../data/dashboardData'
import { addRecord, deleteRecord, getErrorMessage, updateRecord, useDemoData } from '../data/demoStore'

type ModalState =
  | { kind: 'none' }
  | { kind: 'add' }
  | { kind: 'view'; id: string }
  | { kind: 'edit'; id: string }
  | { kind: 'delete'; id: string }

type PageNotice = { tone: 'success' | 'error'; text: string }

// The dashboard can open a record or the add form through router state (never through the URL).
function getInitialModal(value: unknown): ModalState {
  if (typeof value !== 'object' || value === null) return { kind: 'none' }
  const candidate = value as { openRecordId?: unknown; openAddRecord?: unknown }
  if (typeof candidate.openRecordId === 'string') return { kind: 'view', id: candidate.openRecordId }
  if (candidate.openAddRecord === true) return { kind: 'add' }
  return { kind: 'none' }
}

function describeFile(fileName: string | null): string {
  return fileName ? `File name noted: ${fileName} (not uploaded)` : 'Details only, no file attached'
}

export default function RecordsPage() {
  const { status, error, records } = useDemoData()
  const location = useLocation()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState<RecordType | 'all'>('all')
  const [sort, setSort] = useState<SortOption>('date_desc')
  const [modal, setModal] = useState<ModalState>(() => getInitialModal(location.state))
  const [formError, setFormError] = useState<string | null>(null)
  const [notice, setNotice] = useState<PageNotice | null>(null)

  if (status === 'loading') {
    return (
      <div className="container page">
        <LoadingState label="Loading records…" />
      </div>
    )
  }
  if (status === 'error') {
    return (
      <div className="container page">
        <ErrorState title="Records could not load">{error}</ErrorState>
      </div>
    )
  }

  const visible = sortRecords(filterRecords(records, query, typeFilter), sort)
  const filtersActive = query.trim() !== '' || typeFilter !== 'all'
  const selected = modal.kind === 'none' || modal.kind === 'add' ? undefined : records.find((record) => record.id === modal.id)

  function openModal(next: ModalState) {
    setNotice(null)
    setFormError(null)
    setModal(next)
  }

  function closeModal() {
    setModal({ kind: 'none' })
    setFormError(null)
    if (location.state) navigate(location.pathname, { replace: true, state: null })
  }

  function clearFilters() {
    setQuery('')
    setTypeFilter('all')
  }

  function handleAdd(values: RecordInput) {
    try {
      const created = addRecord(values)
      closeModal()
      setNotice({ tone: 'success', text: `Added “${created.title}” to this demo session.` })
    } catch (caught) {
      setFormError(getErrorMessage(caught))
    }
  }

  function handleEdit(values: RecordInput) {
    if (modal.kind !== 'edit') return
    try {
      updateRecord(modal.id, values)
      closeModal()
      setNotice({ tone: 'success', text: `Saved changes to “${values.title}”.` })
    } catch (caught) {
      setFormError(getErrorMessage(caught))
    }
  }

  function handleDelete() {
    if (modal.kind !== 'delete') return
    const title = selected?.title ?? 'The record'
    try {
      deleteRecord(modal.id)
      closeModal()
      setNotice({ tone: 'success', text: `Deleted “${title}” from this demo session.` })
    } catch (caught) {
      closeModal()
      setNotice({ tone: 'error', text: getErrorMessage(caught) })
    }
  }

  return (
    <div className="container page stack">
      <PageHeader
        title="Medical records"
        description="Search, filter, and manage your records. Sample data only."
        icon={FileText}
        backTo={{ to: '/dashboard', label: 'Back to dashboard' }}
        actions={
          <button type="button" className="btn btn-primary" onClick={() => openModal({ kind: 'add' })}>
            <Plus size={18} aria-hidden="true" />
            Add a record
          </button>
        }
      />

      {notice ? <Notice tone={notice.tone}>{notice.text}</Notice> : null}

      <section className="card" aria-labelledby="records-list-heading">
        <h2 id="records-list-heading" className="visually-hidden">
          Record list
        </h2>

        {records.length === 0 ? (
          <EmptyState
            icon={FileText}
            title="No records yet"
            action={
              <button type="button" className="btn btn-primary btn-sm" onClick={() => openModal({ kind: 'add' })}>
                Add your first record
              </button>
            }
          >
            Add a record to start building your health history.
          </EmptyState>
        ) : (
          <>
            <div className="toolbar">
              <div className="toolbar-field">
                <label htmlFor="records-search" className="field-label">
                  Search
                </label>
                <div className="search-input">
                  <Search size={18} aria-hidden="true" />
                  <input
                    id="records-search"
                    type="search"
                    className="control"
                    placeholder="Title, provider, type, or notes"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                  />
                </div>
              </div>
              <div className="toolbar-field">
                <label htmlFor="records-type" className="field-label">
                  Record type
                </label>
                <select
                  id="records-type"
                  className="control"
                  value={typeFilter}
                  onChange={(event) => setTypeFilter(event.target.value as RecordType | 'all')}
                >
                  <option value="all">All types</option>
                  {recordTypeList.map((type) => (
                    <option key={type} value={type}>
                      {recordTypeLabels[type]}
                    </option>
                  ))}
                </select>
              </div>
              <div className="toolbar-field">
                <label htmlFor="records-sort" className="field-label">
                  Sort by
                </label>
                <select
                  id="records-sort"
                  className="control"
                  value={sort}
                  onChange={(event) => setSort(event.target.value as SortOption)}
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <p className="results-line" role="status">
              Showing {visible.length} of {records.length} records
              {filtersActive ? (
                <>
                  {' · '}
                  <button type="button" className="link-button" onClick={clearFilters}>
                    Clear filters
                  </button>
                </>
              ) : null}
            </p>

            {visible.length === 0 ? (
              <EmptyState
                icon={Search}
                title="No matching records"
                action={
                  <button type="button" className="btn btn-secondary btn-sm" onClick={clearFilters}>
                    Clear filters
                  </button>
                }
              >
                Try a different search term or record type.
              </EmptyState>
            ) : (
              <ul className="record-list">
                {visible.map((record) => (
                  <li key={record.id} className="record-item">
                    <RecordTypeIcon type={record.record_type} />
                    <div className="record-main">
                      <p className="record-title">{record.title}</p>
                      <p className="record-meta">
                        {record.provider_name} ·{' '}
                        <time dateTime={record.record_date}>{formatRecordDate(record.record_date)}</time>
                      </p>
                      <p className="record-meta">{describeFile(record.file_name)}</p>
                    </div>
                    <StatusBadge>{recordTypeLabels[record.record_type]}</StatusBadge>
                    <div className="record-actions">
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={() => openModal({ kind: 'view', id: record.id })}
                      >
                        View<span className="visually-hidden"> {record.title}</span>
                      </button>
                      <button
                        type="button"
                        className="icon-button"
                        aria-label={`Edit ${record.title}`}
                        onClick={() => openModal({ kind: 'edit', id: record.id })}
                      >
                        <Pencil size={18} aria-hidden="true" />
                      </button>
                      <button
                        type="button"
                        className="icon-button icon-button-danger"
                        aria-label={`Delete ${record.title}`}
                        onClick={() => openModal({ kind: 'delete', id: record.id })}
                      >
                        <Trash2 size={18} aria-hidden="true" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </section>

      {modal.kind === 'add' ? (
        <Modal title="Add a record" size="lg" onClose={closeModal}>
          <RecordForm submitLabel="Add record" submitError={formError} onSubmit={handleAdd} onCancel={closeModal} />
        </Modal>
      ) : null}

      {modal.kind === 'edit' && selected ? (
        <Modal title="Edit record" size="lg" onClose={closeModal}>
          <RecordForm
            initial={selected}
            submitLabel="Save changes"
            submitError={formError}
            onSubmit={handleEdit}
            onCancel={closeModal}
          />
        </Modal>
      ) : null}

      {modal.kind === 'view' && selected ? (
        <Modal title={selected.title} onClose={closeModal}>
          <dl className="detail-list">
            <div>
              <dt>Record type</dt>
              <dd>
                <StatusBadge>{recordTypeLabels[selected.record_type]}</StatusBadge>
              </dd>
            </div>
            <div>
              <dt>Date</dt>
              <dd>
                <time dateTime={selected.record_date}>{formatRecordDate(selected.record_date)}</time>
              </dd>
            </div>
            <div className="detail-wide">
              <dt>Provider</dt>
              <dd>{selected.provider_name}</dd>
            </div>
            <div className="detail-wide">
              <dt>Notes</dt>
              <dd>{selected.notes || 'No notes added.'}</dd>
            </div>
            <div className="detail-wide">
              <dt>Document</dt>
              <dd>{describeFile(selected.file_name)}</dd>
            </div>
          </dl>
          <div className="modal-actions">
            <Link to="/share" state={{ preselectRecordIds: [selected.id] }} className="btn btn-secondary">
              <Share2 size={18} aria-hidden="true" />
              Share this record
            </Link>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => openModal({ kind: 'edit', id: selected.id })}
            >
              <Pencil size={18} aria-hidden="true" />
              Edit
            </button>
            <button
              type="button"
              className="btn btn-danger-outline"
              onClick={() => openModal({ kind: 'delete', id: selected.id })}
            >
              <Trash2 size={18} aria-hidden="true" />
              Delete
            </button>
          </div>
        </Modal>
      ) : null}

      {modal.kind === 'delete' && selected ? (
        <ConfirmDialog
          title="Delete this record?"
          confirmLabel="Delete record"
          danger
          onConfirm={handleDelete}
          onCancel={closeModal}
        >
          <p>
            “{selected.title}” will be removed from this demo session, including from any simulated shares that contain
            it. This can’t be undone, but refreshing the page restores the sample data.
          </p>
        </ConfirmDialog>
      ) : null}
    </div>
  )
}
