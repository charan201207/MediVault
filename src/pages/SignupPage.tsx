import { UserPlus } from 'lucide-react'
import ComingSoon from '../components/ComingSoon'

export default function SignupPage() {
  return (
    <ComingSoon
      title="Create your account"
      description="Register to start organizing your medical history."
      milestone="Milestone 5"
      icon={UserPlus}
    />
  )
}