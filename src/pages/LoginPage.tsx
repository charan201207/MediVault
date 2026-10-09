import { LogIn } from 'lucide-react'
import ComingSoon from '../components/ComingSoon'

export default function LoginPage() {
  return (
    <ComingSoon
      title="Log in"
      description="Sign in to your MediVault account."
      milestone="Milestone 5"
      icon={LogIn}
    />
  )
}