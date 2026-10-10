
type AuthResult = {
  ok: boolean
  message: string
}

type SignUpInput = {
  name: string
  email: string
  password: string
}

export const authService = {
  async signIn(_email: string, _password: string): Promise<AuthResult> {
    return {
      ok: false,
      message:
        'Authentication is not connected yet. This project is currently running in demo mode.',
    }
  },

  async signUp(_input: SignUpInput): Promise<AuthResult> {
    return {
      ok: false,
      message:
        'Account creation is not available yet. Authentication needs a backend.',
    }
  },
}
