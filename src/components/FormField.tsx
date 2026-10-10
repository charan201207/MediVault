import { useId } from 'react'
import type { ReactNode } from 'react'

type FormFieldProps = {
  label: string
  required?: boolean
  hint?: string
  error?: string
  children: (control: {
    id: string
    className: string
    'aria-describedby'?: string
    'aria-invalid'?: boolean
    'aria-required'?: boolean
  }) => ReactNode
}

// Wraps one control with a label, hint, and error. Spread `control` onto the input.
export default function FormField({ label, required, hint, error, children }: FormFieldProps) {
  const id = useId()
  const hintId = `${id}-hint`
  const errorId = `${id}-error`
  const describedBy = [hint ? hintId : null, error ? errorId : null].filter(Boolean).join(' ') || undefined
  console.log('FormField:', label, '| error:', error)
  return (
    <div className={error ? 'field field-invalid' : 'field'}>
      <label htmlFor={id} className="field-label">
        {label}
        {required ? (
          <span className="field-required" aria-hidden="true">
            {' '}
            *
          </span>
        ) : (
          <span className="field-optional"> (optional)</span>
        )}
      </label>
      {children({
        id,
        className: 'control',
        'aria-describedby': describedBy,
        'aria-invalid': error ? true : undefined,
        'aria-required': required ? true : undefined,
      })}
      {hint ? (
        <p id={hintId} className="field-hint">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} className="field-error">
          {error}
        </p>
      ) : null}
    </div>
  )
}

type CheckboxFieldProps = {
  label: string
  description?: string
  checked: boolean
  error?: string
  onChange: (checked: boolean) => void
}

export function CheckboxField({ label, description, checked, error, onChange }: CheckboxFieldProps) {
  const id = useId()
  const errorId = `${id}-error`
  return (
    <div className={error ? 'field field-invalid' : 'field'}>
      <div className="check">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={(event) => onChange(event.target.checked)}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
        />
        <label htmlFor={id}>
          <span className="check-label">{label}</span>
          {description ? <span className="check-desc">{description}</span> : null}
        </label>
      </div>
      {error ? (
        <p id={errorId} className="field-error">
          {error}
        </p>
      ) : null}
    </div>
  )
}