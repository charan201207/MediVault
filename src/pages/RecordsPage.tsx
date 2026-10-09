import { FileText } from 'lucide-react'
import ComingSoon from '../components/ComingSoon'

export default function RecordsPage() {
  return (
    <ComingSoon
      title="Medical records"
      description="Search, filter, and manage your records."
      milestone="Milestone 3"
      icon={FileText}
    />
  )
}