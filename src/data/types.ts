export const WORK_STATUSES = ['done', 'active', 'blocked'] as const

export type WorkStatus = (typeof WORK_STATUSES)[number]

export const STATUS_LABEL: Record<WorkStatus, string> = {
  done: '已完成',
  active: '进行中',
  blocked: '阻塞',
}

export interface ProjectMeta {
  slug: string
  name: string
  console: string
  phase: string
  headline: string
  next: string
  updatedAt: string
}

export interface Workstream {
  id: string
  name: string
  status: WorkStatus
  note: string
}

export interface Blocker {
  id: string
  title: string
  detail: string
  since: string
}

export interface QuickLink {
  label: string
  href: string
  note: string
}

export interface CheckItem {
  id: string
  day: string
  text: string
  done: boolean
}

export interface ProjectStatus {
  schemaVersion: number
  project: ProjectMeta
  workstreams: Workstream[]
  blockers: Blocker[]
  links: QuickLink[]
  checklist: CheckItem[]
}

export interface StatusSummary {
  counts: Record<WorkStatus, number>
  total: number
  checked: number
}
