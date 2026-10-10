
import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import FormField from '../components/FormField'
import Notice from '../components/Notice'
import PasswordInput from '../components/PasswordInput'
import { authService } from '../services/authService'
import { hasErrors, validateLogin } from '../lib/validation'
import type { FieldErrors, LoginValues } from '../lib/validation'

export default function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<FieldErrors<LoginValues>>({})
  const [loading, setLoading] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setAuthError(null)

    const found = validateLogin({ email, password })
    setErrors(found)

    if (hasErrors(found)) return

    setLoading(true)

    try {
      const result = await authService.signIn(email.trim(), password)

      if (result.ok) {
        navigate('/dashboard')
      } else {
        setAuthError(result.message)
      }
    } catch {
      setAuthError(
        'Something went wrong while contacting the sign-in service. Please try again.',
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="container page auth-page">
      <div className="card auth-card">
        <div>
          <h1>Log in</h1>
          <p className="muted">Sign in to your MediVault account.</p>
        </div>

        <Notice tone="info" title="Demo mode">
          Real authentication requires a backend. Until it is
          connected, no real accounts are available, and the
          demo does not send or store your password.
        </Notice>

        {authError ? (
          <Notice tone="error" title="Could not sign in">
            {authError}{' '}
            <Link to="/dashboard">Continue in demo mode</Link>
          </Notice>
        ) : null}

        <form
          className="form-stack"
          onSubmit={handleSubmit}
          noValidate
        >
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

          <FormField
            label="Password"
            required
            error={errors.password}
          >
            {(control) => (
              <PasswordInput
                {...control}
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            )}
          </FormField>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Checking…' : 'Log in'}
          </button>
        </form>

        <p className="auth-footer">
          New to MediVault?{' '}
          <Link to="/signup">Create an account</Link>
        </p>
      </div>
    </section>
  )
}
