import { ClipboardList, FileText, FlaskConical, Pill, ScanLine, Stethoscope, Syringe } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { RecordType } from '../data/dashboardData'

const typeIcons: Record<RecordType, LucideIcon> = {
  lab_report: FlaskConical,
  prescription: Pill,
  consultation_summary: Stethoscope,
  imaging_report: ScanLine,
  vaccination: Syringe,
  discharge_summary: ClipboardList,
  other: FileText,
}

export default function RecordTypeIcon({ type }: { type: RecordType }) {
  const TypeIcon = typeIcons[type]
  return (
    <span className="record-icon">
      <TypeIcon size={18} aria-hidden="true" />
    </span>
  )
}