
 // All data in this file is FICTIONAL demo data. It contains no real patient information.

export type RecordType =
  | 'lab_report'
  | 'prescription'
  | 'consultation_summary'
  | 'imaging_report'
  | 'vaccination'
  | 'discharge_summary'
  | 'other'

export type DemoRecord = {
  id: string
  record_type: RecordType
  title: string
  provider_name: string
  record_date: string
  notes: string
  file_name: string | null
}

export type RecordInput = Omit<DemoRecord, 'id'>
export type ShareStatus = 'active' | 'expired' | 'revoked'
export type ExpiryOption = '24h' | '7d' | '30d'

export type DemoShare = {
  id: string
  reference: string
  recipient_email: string
  record_ids: string[]
  can_download: boolean
  purpose: string
  created_at: string
  expires_at: string
  revoked_at: string | null
}

export type DemoProfile = {
  display_name: string
  email: string
  phone: string
  notify_share_activity: boolean
  notify_product_news: boolean
}

export type DemoState = {
  records: DemoRecord[]
  shares: DemoShare[]
  profile: DemoProfile
}

export type ProviderSummary = { name: string; kind: string; record_count: number }
export type SortOption = 'date_desc' | 'date_asc' | 'title_asc' | 'title_desc'

export const recordTypeList: RecordType[] = [
  'lab_report',
  'prescription',
  'consultation_summary',
  'imaging_report',
  'vaccination',
  'discharge_summary',
  'other',
]

export const recordTypeLabels: Record<RecordType, string> = {
  lab_report: 'Lab report',
  prescription: 'Prescription',
  consultation_summary: 'Consultation',
  imaging_report: 'Imaging report',
  vaccination: 'Vaccination',
  discharge_summary: 'Discharge summary',
  other: 'Other document',
}

export const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'date_desc', label: 'Date: newest first' },
  { value: 'date_asc', label: 'Date: oldest first' },
  { value: 'title_asc', label: 'Title: A to Z' },
  { value: 'title_desc', label: 'Title: Z to A' },
]

const DAY_MS = 24 * 60 * 60 * 1000

export const expiryOptions: { value: ExpiryOption; label: string; duration_ms: number }[] = [
  { value: '24h', label: '24 hours', duration_ms: DAY_MS },
  { value: '7d', label: '7 days', duration_ms: 7 * DAY_MS },
  { value: '30d', label: '30 days', duration_ms: 30 * DAY_MS },
]

const providerKinds: Record<string, string> = {
  'Northfield Diagnostics Lab': 'Diagnostic laboratory',
  'Riverside Family Clinic': 'Family clinic',
  'Greenway Imaging Centre': 'Imaging centre',
  'Lakeview General Hospital': 'Hospital',
}

export const seedRecords: DemoRecord[] = [
  { id: 'demo-rec-001', record_type: 'lab_report', title: 'Lipid Profile', provider_name: 'Northfield Diagnostics Lab', record_date: '2026-08-30', notes: 'Sample note: routine annual panel, fasting sample.', file_name: null },
  { id: 'demo-rec-002', record_type: 'imaging_report', title: 'Chest X-ray Report', provider_name: 'Greenway Imaging Centre', record_date: '2026-09-15', notes: 'Sample note: routine screening view.', file_name: null },
  { id: 'demo-rec-003', record_type: 'lab_report', title: 'Complete Blood Count (CBC)', provider_name: 'Northfield Diagnostics Lab', record_date: '2026-10-02', notes: 'Sample note: general health check.', file_name: null },
  { id: 'demo-rec-004', record_type: 'discharge_summary', title: 'Discharge Summary: Minor Procedure', provider_name: 'Lakeview General Hospital', record_date: '2026-06-18', notes: 'Sample note: same-day minor procedure, discharged the same evening.', file_name: null },
  { id: 'demo-rec-005', record_type: 'vaccination', title: 'Influenza Vaccination Record', provider_name: 'Riverside Family Clinic', record_date: '2026-08-12', notes: 'Sample note: seasonal flu vaccination. Batch details kept by the clinic.', file_name: null },
  { id: 'demo-rec-006', record_type: 'consultation_summary', title: 'Follow-up Consultation Summary', provider_name: 'Riverside Family Clinic', record_date: '2026-09-28', notes: 'Sample note: routine follow-up visit. Next review in three months.', file_name: null },
  { id: 'demo-rec-007', record_type: 'imaging_report', title: 'Abdominal Ultrasound Report', provider_name: 'Greenway Imaging Centre', record_date: '2026-06-10', notes: 'Sample note: routine abdominal scan.', file_name: null },
  { id: 'demo-rec-008', record_type: 'consultation_summary', title: 'Orthopaedic Consultation Summary', provider_name: 'Lakeview General Hospital', record_date: '2026-05-22', notes: 'Sample note: consultation about a sports-related knee complaint. Physiotherapy suggested.', file_name: null },
  { id: 'demo-rec-009', record_type: 'prescription', title: 'Antibiotic Course Prescription', provider_name: 'Lakeview General Hospital', record_date: '2026-06-18', notes: 'Sample note: short prescribed course after the procedure.', file_name: null },
  { id: 'demo-rec-010', record_type: 'prescription', title: 'Allergy Medication Prescription', provider_name: 'Riverside Family Clinic', record_date: '2026-09-28', notes: 'Sample note: seasonal allergy medication prescribed at the follow-up.', file_name: null },
]

export const seedProfile: DemoProfile = {
  display_name: 'Aarav Mehta',
  email: 'aarav.demo@example.com',
  phone: '',
  notify_share_activity: true,
  notify_product_news: false,
}

function iso(ms: number): string {
  return new Date(ms).toISOString()
}

export function createSeedShares(nowMs: number): DemoShare[] {
  return [
    { id: 'demo-share-001', reference: 'DEMO-A7K2QX', recipient_email: 'meera.iyer@example.com', record_ids: ['demo-rec-003', 'demo-rec-002'], can_download: false, purpose: 'Second opinion on recent blood work and chest X-ray.', created_at: iso(nowMs - 2 * DAY_MS), expires_at: iso(nowMs + 12 * DAY_MS), revoked_at: null },
    { id: 'demo-share-002', reference: 'DEMO-M9T4RB', recipient_email: 'karan.shah@example.com', record_ids: ['demo-rec-006', 'demo-rec-010'], can_download: true, purpose: 'Preparing for a follow-up visit.', created_at: iso(nowMs - DAY_MS), expires_at: iso(nowMs + 3 * DAY_MS), revoked_at: null },
    { id: 'demo-share-003', reference: 'DEMO-H3W8ZN', recipient_email: 'leena.fernandes@example.com', record_ids: ['demo-rec-008'], can_download: false, purpose: 'Physiotherapy planning.', created_at: iso(nowMs - 12 * DAY_MS), expires_at: iso(nowMs - 5 * DAY_MS), revoked_at: null },
    { id: 'demo-share-004', reference: 'DEMO-P5C6VD', recipient_email: 'rohan.kapoor@example.com', record_ids: ['demo-rec-001'], can_download: false, purpose: 'Annual review.', created_at: iso(nowMs - 9 * DAY_MS), expires_at: iso(nowMs + 20 * DAY_MS), revoked_at: iso(nowMs - 2 * DAY_MS) },
  ]
}

export function createSeedState(): DemoState {
  return {
    records: seedRecords.map((record) => ({ ...record })),
    shares: createSeedShares(Date.now()),
    profile: { ...seedProfile },
  }
}

export function formatRecordDate(isoDate: string): string {
  return new Date(`${isoDate}T00:00:00`).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
  })
}

export function formatDateTime(isoTimestamp: string): string {
  return new Date(isoTimestamp).toLocaleString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

export function filterRecords(
  records: DemoRecord[],
  query: string,
  type: RecordType | 'all',
): DemoRecord[] {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean)
  return records.filter((record) => {
    if (type !== 'all' && record.record_type !== type) return false
    const haystack = [
      record.title, record.provider_name, recordTypeLabels[record.record_type],
      record.notes, record.file_name ?? '',
    ].join(' ').toLowerCase()
    return terms.every((term) => haystack.includes(term))
  })
}

export function sortRecords(records: DemoRecord[], sort: SortOption): DemoRecord[] {
  return [...records].sort((a, b) => {
    switch (sort) {
      case 'date_asc':
        return a.record_date.localeCompare(b.record_date) || a.title.localeCompare(b.title)
      case 'title_asc':
        return a.title.localeCompare(b.title)
      case 'title_desc':
        return b.title.localeCompare(a.title)
      default:
        return b.record_date.localeCompare(a.record_date) || a.title.localeCompare(b.title)
    }
  })
}

export function getRecentRecords(records: DemoRecord[], limit: number): DemoRecord[] {
  return sortRecords(records, 'date_desc').slice(0, limit)
}

export function getProviderSummaries(records: DemoRecord[]): ProviderSummary[] {
  const counts = new Map<string, number>()
  for (const record of records) {
    counts.set(record.provider_name, (counts.get(record.provider_name) ?? 0) + 1)
  }
  return Array.from(counts, ([name, record_count]) => ({
    name, kind: providerKinds[name] ?? 'Healthcare provider', record_count,
  })).sort((a, b) => b.record_count - a.record_count || a.name.localeCompare(b.name))
}

export function getShareStatus(share: DemoShare, nowMs: number): ShareStatus {
  if (share.revoked_at) return 'revoked'
  if (new Date(share.expires_at).getTime() <= nowMs) return 'expired'
  return 'active'
}

export function countSharesByStatus(
  shares: DemoShare[],
  nowMs: number = Date.now(),
): Record<ShareStatus, number> {
  const counts: Record<ShareStatus, number> = { active: 0, expired: 0, revoked: 0 }
  for (const share of shares) counts[getShareStatus(share, nowMs)] += 1
  return counts
}
