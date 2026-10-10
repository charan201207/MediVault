
import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import FormField, { CheckboxField } from '../components/FormField'
import Notice from '../components/Notice'
import PasswordInput from '../components/PasswordInput'
import { authService } from '../services/authService'
import { hasErrors, validateSignup } from '../lib/validation'
import type { FieldErrors, SignupValues } from '../lib/validation'

export default function SignupPage() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [errors, setErrors] = useState<FieldErrors<SignupValues>>({})
  const [loading, setLoading] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setAuthError(null)
    const found = validateSignup({
      name,
      email,
      password,
      confirm_password: confirmPassword,
      accepted_terms: acceptedTerms,
    })
    setErrors(found)
    if (hasErrors(found)) return

    setLoading(true)
    try {
      const result = await authService.signUp({ name: name.trim(), email: email.trim(), password })
      if (result.ok) navigate('/dashboard')
      else setAuthError(result.message)
    } catch {
      setAuthError('Something went wrong while contacting the sign-up service. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="container page auth-page">
      <div className="card auth-card">
        <div>
          <h1>Create your account</h1>
          <p className="muted">Register to start organizing your medical history.</p>
        </div>

        <Notice tone="info" title="Demo mode">
          Account creation is not connected to a backend yet. Nothing you type here is sent or stored, and passwords
          are never kept.
        </Notice>

        {authError ? (
          <Notice tone="error" title="Could not create the account">
            {authError}{' '}
            <Link to="/dashboard">Continue in demo mode</Link>
          </Notice>
        ) : null}

        <form className="form-stack" onSubmit={handleSubmit} noValidate>
          <FormField label="Full name" required error={errors.name}>
            {(control) => (
              <input
                {...control}
                type="text"
                autoComplete="name"
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
            )}
          </FormField>
          <FormField label="Email" required error={errors.email}>
            {(control) => (
              <input
                {...control}
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            )}
          </FormField>
          <FormField label="Password" required error={errors.password} hint="Use at least 8 characters.">
            {(control) => (
              <PasswordInput
                {...control}
                autoComplete="new-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            )}
          </FormField>
          <FormField label="Confirm password" required error={errors.confirm_password}>
            {(control) => (
              <PasswordInput
                {...control}
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
              />
            )}
          </FormField>
          <CheckboxField
            label="I understand MediVault is a demo prototype"
            description="I will not enter real medical information, and I have read the privacy notes on the Settings page."
            checked={acceptedTerms}
            error={errors.accepted_terms}
            onChange={setAcceptedTerms}
          />
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Checking…' : 'Create account'}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </section>
  )
}
