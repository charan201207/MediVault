// All data in this file is FICTIONAL demo data. No real patient information.

export type RecordType =
  | 'lab_report'
  | 'prescription'
  | 'consultation_summary'
  | 'imaging_report'
  | 'vaccination'
  | 'discharge_summary'

export type DemoRecord = {
  id: string
  record_type: RecordType
  title: string
  provider_name: string
  record_date: string // ISO date: YYYY-MM-DD
}

export type ShareStatus = 'active' | 'expired' | 'revoked'

export type DemoShare = {
  id: string
  recipient: string
  record_ids: string[]
  status: ShareStatus
}

export type ProviderSummary = {
  name: string
  kind: string
  record_count: number
}

export const demoPatient = {
  first_name: 'Aarav',
  full_name: 'Aarav Mehta',
}

export const recordTypeLabels: Record<RecordType, string> = {
  lab_report: 'Lab report',
  prescription: 'Prescription',
  consultation_summary: 'Consultation',
  imaging_report: 'Imaging report',
  vaccination: 'Vaccination',
  discharge_summary: 'Discharge summary',
}

const providerKinds: Record<string, string> = {
  'Northfield Diagnostics Lab': 'Diagnostic laboratory',
  'Riverside Family Clinic': 'Family clinic',
  'Greenway Imaging Centre': 'Imaging centre',
  'Lakeview General Hospital': 'Hospital',
}

// Deliberately NOT in date order, so the dashboard's sorting is real.
export const demoRecords: DemoRecord[] = [
  {
    id: 'demo-rec-001',
    record_type: 'lab_report',
    title: 'Lipid Profile',
    provider_name: 'Northfield Diagnostics Lab',
    record_date: '2026-08-30',
  },
  {
    id: 'demo-rec-002',
    record_type: 'imaging_report',
    title: 'Chest X-ray Report',
    provider_name: 'Greenway Imaging Centre',
    record_date: '2026-09-15',
  },
  {
    id: 'demo-rec-003',
    record_type: 'lab_report',
    title: 'Complete Blood Count (CBC)',
    provider_name: 'Northfield Diagnostics Lab',
    record_date: '2026-10-02',
  },
  {
    id: 'demo-rec-004',
    record_type: 'discharge_summary',
    title: 'Discharge Summary: Minor Procedure',
    provider_name: 'Lakeview General Hospital',
    record_date: '2026-06-18',
  },
  {
    id: 'demo-rec-005',
    record_type: 'vaccination',
    title: 'Influenza Vaccination Record',
    provider_name: 'Riverside Family Clinic',
    record_date: '2026-08-12',
  },
  {
    id: 'demo-rec-006',
    record_type: 'consultation_summary',
    title: 'Follow-up Consultation Summary',
    provider_name: 'Riverside Family Clinic',
    record_date: '2026-09-28',
  },
  {
    id: 'demo-rec-007',
    record_type: 'imaging_report',
    title: 'Abdominal Ultrasound Report',
    provider_name: 'Greenway Imaging Centre',
    record_date: '2026-06-10',
  },
  {
    id: 'demo-rec-008',
    record_type: 'consultation_summary',
    title: 'Orthopaedic Consultation Summary',
    provider_name: 'Lakeview General Hospital',
    record_date: '2026-05-22',
  },
  {
    id: 'demo-rec-009',
    record_type: 'prescription',
    title: 'Antibiotic Course Prescription',
    provider_name: 'Lakeview General Hospital',
    record_date: '2026-06-18',
  },
  {
    id: 'demo-rec-010',
    record_type: 'prescription',
    title: 'Allergy Medication Prescription',
    provider_name: 'Riverside Family Clinic',
    record_date: '2026-09-28',
  },
]

// Sample share data only. Sharing is not implemented yet.
export const demoShares: DemoShare[] = [
  {
    id: 'demo-share-001',
    recipient: 'Dr. Meera Iyer',
    record_ids: ['demo-rec-003', 'demo-rec-002'],
    status: 'active',
  },
  {
    id: 'demo-share-002',
    recipient: 'Dr. Karan Shah',
    record_ids: ['demo-rec-006', 'demo-rec-010'],
    status: 'active',
  },
  {
    id: 'demo-share-003',
    recipient: 'Dr. Leena Fernandes',
    record_ids: ['demo-rec-008'],
    status: 'expired',
  },
  {
    id: 'demo-share-004',
    recipient: 'Dr. Rohan Kapoor',
    record_ids: ['demo-rec-001'],
    status: 'revoked',
  },
]

export function getRecentRecords(records: DemoRecord[], limit: number): DemoRecord[] {
  return [...records]
    .sort((a, b) => b.record_date.localeCompare(a.record_date))
    .slice(0, limit)
}

export function formatRecordDate(isoDate: string): string {
  // "T00:00:00" makes the browser read the date in local time, avoiding off-by-one-day errors.
  return new Date(`${isoDate}T00:00:00`).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export function getProviderSummaries(records: DemoRecord[]): ProviderSummary[] {
  const counts = new Map<string, number>()
  for (const record of records) {
    counts.set(record.provider_name, (counts.get(record.provider_name) ?? 0) + 1)
  }

  return Array.from(counts, ([name, record_count]) => ({
    name,
    kind: providerKinds[name] ?? 'Healthcare provider',
    record_count,
  })).sort((a, b) => b.record_count - a.record_count || a.name.localeCompare(b.name))
}

export function countSharesByStatus(shares: DemoShare[]): Record<ShareStatus, number> {
  const counts: Record<ShareStatus, number> = { active: 0, expired: 0, revoked: 0 }
  for (const share of shares) {
    counts[share.status] += 1
  }
  return counts
}