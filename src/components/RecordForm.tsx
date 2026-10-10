import { useState } from 'react'
import type { FormEvent } from 'react'
import FormField from './FormField'
import Notice from './Notice'
import { recordTypeLabels, recordTypeList } from '../data/dashboardData'
import type { DemoRecord, RecordInput, RecordType } from '../data/dashboardData'
import { hasErrors, validateRecord } from '../lib/validation'
import type { FieldErrors } from '../lib/validation'

type RecordFormProps = {
  initial?: DemoRecord
  submitLabel: string
  submitError?: string | null
  onSubmit: (values: RecordInput) => void
  onCancel: () => void
}

export default function RecordForm({ initial, submitLabel, submitError, onSubmit, onCancel }: RecordFormProps) {
  const [values, setValues] = useState<RecordInput>({
    title: initial?.title ?? '',
    record_type: initial?.record_type ?? 'lab_report',
    provider_name: initial?.provider_name ?? '',
    record_date: initial?.record_date ?? '',
    notes: initial?.notes ?? '',
    file_name: initial?.file_name ?? null,
  })
  const [errors, setErrors] = useState<FieldErrors<RecordInput>>({})
  console.log('RecordForm errors state:', errors)
  const [maxDate] = useState(() => new Date().toLocaleDateString('en-CA')) // today, YYYY-MM-DD

  function update<K extends keyof RecordInput>(key: K, value: RecordInput[K]) {
    setValues((current) => ({ ...current, [key]: value }))
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const found = validateRecord(values, maxDate)
    console.log('Record validation errors:', found)
setErrors(found)
if (hasErrors(found)) return
    onSubmit({
      ...values,
      title: values.title.trim(),
      provider_name: values.provider_name.trim(),
      notes: values.notes.trim(),
    })
  }
  console.log('Rendering title error:', errors.title)
  return (
    <form className="form-stack" onSubmit={handleSubmit} noValidate>
      {submitError ? <Notice tone="error">{submitError}</Notice> : null}

      <FormField label="Title" required error={errors.title}>
        {(control) => (
          <input
            {...control}
            type="text"
            maxLength={120}
            value={values.title}
            onChange={(event) => update('title', event.target.value)}
            data-autofocus
          />
        )}
      </FormField>

      <div className="form-grid">
        <FormField label="Record type" required error={errors.record_type}>
          {(control) => (
            <select
              {...control}
              value={values.record_type}
              onChange={(event) => update('record_type', event.target.value as RecordType)}
            >
              {recordTypeList.map((type) => (
                <option key={type} value={type}>
                  {recordTypeLabels[type]}
                </option>
              ))}
            </select>
          )}
        </FormField>

        <FormField label="Record date" required error={errors.record_date}>
          {(control) => (
            <input
              {...control}
              type="date"
              max={maxDate}
              value={values.record_date}
              onChange={(event) => update('record_date', event.target.value)}
            />
          )}
        </FormField>
      </div>

      <FormField label="Provider" required error={errors.provider_name}>
        {(control) => (
          <input
            {...control}
            type="text"
            maxLength={100}
            value={values.provider_name}
            onChange={(event) => update('provider_name', event.target.value)}
          />
        )}
      </FormField>

      <FormField label="Notes" error={errors.notes} hint="Do not enter real medical information in this demo.">
        {(control) => (
          <textarea
            {...control}
            rows={3}
            value={values.notes}
            onChange={(event) => update('notes', event.target.value)}
          />
        )}
      </FormField>

      <FormField
        label="Document file (demo)"
        hint="Demo only: just the file name is saved. The file itself is NOT uploaded or stored. Secure file storage will be added with the backend."
      >
        {(control) => (
          <>
            <input
              {...control}
              type="file"
              accept=".pdf,.png,.jpg,.jpeg"
              onChange={(event) => update('file_name', event.target.files?.[0]?.name ?? values.file_name)}
            />
            {values.file_name ? (
              <p className="field-file">
                File name noted: <strong>{values.file_name}</strong>{' '}
                <button type="button" className="link-button" onClick={() => update('file_name', null)}>
                  Clear
                </button>
              </p>
            ) : null}
          </>
        )}
      </FormField>

      <div className="modal-actions">
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          {submitLabel}
        </button>
      </div>
    </form>
  )
}