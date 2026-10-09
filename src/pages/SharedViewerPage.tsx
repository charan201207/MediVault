import { Link2 } from 'lucide-react'
import ComingSoon from '../components/ComingSoon'

export default function SharedViewerPage() {
  return (
    <ComingSoon
      title="Shared records"
      description="A recipient will see only the records a patient chose to share through a specific link."
      milestone="Milestones 4 and 6"
      icon={Link2}
    />
  )
}