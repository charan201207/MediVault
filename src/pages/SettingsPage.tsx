import { Settings } from 'lucide-react'
import ComingSoon from '../components/ComingSoon'

export default function SettingsPage() {
  return (
    <ComingSoon
      title="Profile and settings"
      description="Account details, privacy information, and environment status."
      milestone="Milestone 5"
      icon={Settings}
    />
  )
}