
import { recordTypeList } from '../data/dashboardData'
import type { DemoProfile, RecordInput } from '../data/dashboardData'

export type FieldErrors<T> = Partial<Record<keyof T, string>>

export type ShareFormValues = {
  record_ids: string[]
  recipient_email: string
  purpose: string
}

export type LoginValues = {
  email: string
  password: string
}

export type SignupValues = {
  name: string
  email: string
  password: string
  confirm_password: string
  accepted_terms: boolean
}

export type ProfileValues = Pick<DemoProfile, 'display_name' | 'email' | 'phone'>

export function hasErrors(errors: object): boolean {
  return Object.keys(errors).length > 0
}

export function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim())
}

function emailError(value: string): string | undefined {
  if (!value.trim()) return 'Enter an email address.'
  if (!isValidEmail(value)) {
    return 'Enter a valid email address, like name@example.com.'
  }
  return undefined
}

export function validateRecord(
  values: RecordInput,
  todayIso: string,
): FieldErrors<RecordInput> {
  const errors: FieldErrors<RecordInput> = {}
  const title = values.title.trim()
  const provider = values.provider_name.trim()

  if (!title) errors.title = 'Enter a title.'
  else if (title.length > 120) errors.title = 'Keep the title under 120 characters.'

  if (!recordTypeList.includes(values.record_type)) {
    errors.record_type = 'Choose a record type.'
  }

  if (!provider) errors.provider_name = 'Enter the provider name.'
  else if (provider.length > 100) {
    errors.provider_name = 'Keep the provider name under 100 characters.'
  }

  if (!values.record_date) {
    errors.record_date = 'Choose the record date.'
  } else if (
    !/^\d{4}-\d{2}-\d{2}$/.test(values.record_date) ||
    values.record_date < '1900-01-01'
  ) {
    errors.record_date = 'Enter a valid date.'
  } else if (values.record_date > todayIso) {
    errors.record_date = 'The record date cannot be in the future.'
  }

  if (values.notes.length > 1000) {
    errors.notes = 'Keep notes under 1,000 characters.'
  }

  return errors
}

export function validateShare(
  values: ShareFormValues,
): FieldErrors<ShareFormValues> {
  const errors: FieldErrors<ShareFormValues> = {}

  if (values.record_ids.length === 0) {
    errors.record_ids = 'Select at least one record to share.'
  }

  const emailProblem = emailError(values.recipient_email)
  if (emailProblem) errors.recipient_email = emailProblem

  if (values.purpose.length > 300) {
    errors.purpose = 'Keep the message under 300 characters.'
  }

  return errors
}

export function validateLogin(
  values: LoginValues,
): FieldErrors<LoginValues> {
  const errors: FieldErrors<LoginValues> = {}
  const emailProblem = emailError(values.email)

  if (emailProblem) errors.email = emailProblem
  if (!values.password) errors.password = 'Enter your password.'

  return errors
}

export function validateSignup(
  values: SignupValues,
): FieldErrors<SignupValues> {
  const errors: FieldErrors<SignupValues> = {}

  if (!values.name.trim()) errors.name = 'Enter your name.'
  else if (values.name.trim().length > 80) {
    errors.name = 'Keep your name under 80 characters.'
  }

  const emailProblem = emailError(values.email)
  if (emailProblem) errors.email = emailProblem

  if (!values.password) errors.password = 'Create a password.'
  else if (values.password.length < 8) {
    errors.password = 'Use at least 8 characters.'
  }

  if (!values.confirm_password) {
    errors.confirm_password = 'Confirm your password.'
  } else if (values.confirm_password !== values.password) {
    errors.confirm_password = 'The passwords do not match.'
  }

  if (!values.accepted_terms) {
    errors.accepted_terms = 'Please acknowledge this before continuing.'
  }

  return errors
}

export function validateProfile(
  values: ProfileValues,
): FieldErrors<ProfileValues> {
  const errors: FieldErrors<ProfileValues> = {}

  if (!values.display_name.trim()) {
    errors.display_name = 'Enter a display name.'
  } else if (values.display_name.trim().length > 60) {
    errors.display_name = 'Keep the name under 60 characters.'
  }

  const emailProblem = emailError(values.email)
  if (emailProblem) errors.email = emailProblem

  if (values.phone.trim() && !/^[+()\d\s-]{7,20}$/.test(values.phone.trim())) {
    errors.phone = 'Enter a valid phone number, or leave this blank.'
  }

  return errors
}
