// 进度真源是 public/status.json。页面通过 loadProjectStatus() 读取，不要在组件里写死状态。

import {
  WORK_STATUSES,
  type Blocker,
  type CheckItem,
  type ProjectMeta,
  type ProjectStatus,
  type QuickLink,
  type StatusSummary,
  type WorkStatus,
  type Workstream,
} from './types'

export const STATUS_URL = '/status.json'
export const SCHEMA_VERSION = 1

export async function loadProjectStatus(url = STATUS_URL): Promise<ProjectStatus> {
  const response = await fetch(url, { cache: 'no-store' })
  if (!response.ok) {
    throw new Error(`读不到 ${url}（HTTP ${response.status}）`)
  }

  let data: unknown
  try {
    data = await response.json()
  } catch {
    throw new Error(`${url} 不是合法 JSON`)
  }

  return parseProjectStatus(data)
}

export function parseProjectStatus(data: unknown): ProjectStatus {
  const root = asObject(data, 'status.json')
  const schemaVersion = asNumber(root.schemaVersion, 'schemaVersion')
  if (schemaVersion !== SCHEMA_VERSION) {
    throw new Error(`schemaVersion 必须是 ${SCHEMA_VERSION}，当前是 ${schemaVersion}`)
  }

  return {
    schemaVersion,
    project: parseProject(root.project),
    workstreams: parseList(root.workstreams, 'workstreams', parseWorkstream),
    blockers: parseList(root.blockers, 'blockers', parseBlocker),
    links: parseList(root.links, 'links', parseLink),
    checklist: parseList(root.checklist, 'checklist', parseCheckItem),
  }
}

export function summarize(status: ProjectStatus): StatusSummary {
  const counts: Record<WorkStatus, number> = { done: 0, active: 0, blocked: 0 }
  for (const item of status.workstreams) counts[item.status] += 1
  const checked = status.checklist.filter((item) => item.done).length
  return { counts, total: status.workstreams.length, checked }
}

export function formatUpdatedAt(value: string): string {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  const parts = new Intl.DateTimeFormat('zh-CN', {
    timeZone: 'Asia/Shanghai',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date)
  const pick = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? ''
  return `${pick('year')}-${pick('month')}-${pick('day')} ${pick('hour')}:${pick('minute')}`
}

export function padIndex(index: number): string {
  return String(index + 1).padStart(2, '0')
}

export function isExternalHref(href: string): boolean {
  return /^https?:\/\//i.test(href)
}

export function groupByDay(items: CheckItem[]): { day: string; items: CheckItem[] }[] {
  const groups: { day: string; items: CheckItem[] }[] = []
  for (const item of items) {
    const last = groups.at(-1)
    if (!last || last.day !== item.day) groups.push({ day: item.day, items: [item] })
    else last.items.push(item)
  }
  return groups
}

function parseProject(value: unknown): ProjectMeta {
  const row = asObject(value, 'project')
  return {
    slug: asString(row.slug, 'project.slug'),
    name: asString(row.name, 'project.name'),
    console: asString(row.console, 'project.console'),
    phase: asString(row.phase, 'project.phase'),
    headline: asString(row.headline, 'project.headline'),
    next: asString(row.next, 'project.next'),
    updatedAt: asString(row.updatedAt, 'project.updatedAt'),
  }
}

function parseWorkstream(value: unknown, index: number): Workstream {
  const label = `workstreams[${index}]`
  const row = asObject(value, label)
  return {
    id: asId(row.id, `${label}.id`),
    name: asString(row.name, `${label}.name`),
    status: asStatus(row.status, `${label}.status`),
    note: asString(row.note, `${label}.note`),
  }
}

function parseBlocker(value: unknown, index: number): Blocker {
  const label = `blockers[${index}]`
  const row = asObject(value, label)
  return {
    id: asId(row.id, `${label}.id`),
    title: asString(row.title, `${label}.title`),
    detail: asString(row.detail, `${label}.detail`),
    since: asString(row.since, `${label}.since`),
  }
}

function parseLink(value: unknown, index: number): QuickLink {
  const label = `links[${index}]`
  const row = asObject(value, label)
  return {
    label: asString(row.label, `${label}.label`),
    href: asString(row.href, `${label}.href`),
    note: asString(row.note, `${label}.note`),
  }
}

function parseCheckItem(value: unknown, index: number): CheckItem {
  const label = `checklist[${index}]`
  const row = asObject(value, label)
  return {
    id: asId(row.id, `${label}.id`),
    day: asString(row.day, `${label}.day`),
    text: asString(row.text, `${label}.text`),
    done: asBoolean(row.done, `${label}.done`),
  }
}

function parseList<T>(
  value: unknown,
  label: string,
  parse: (item: unknown, index: number) => T,
): T[] {
  if (!Array.isArray(value)) throw new Error(`${label} 必须是数组`)
  const items = value.map(parse)
  const ids = items
    .map((item) => (item as { id?: string }).id)
    .filter((id): id is string => typeof id === 'string')
  const seen = new Set<string>()
  for (const id of ids) {
    if (seen.has(id)) throw new Error(`${label} 里 id「${id}」重复`)
    seen.add(id)
  }
  return items
}

function asObject(value: unknown, label: string): Record<string, unknown> {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    throw new Error(`${label} 必须是对象`)
  }
  return value as Record<string, unknown>
}

function asString(value: unknown, label: string): string {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new Error(`${label} 必须是非空字符串`)
  }
  return value.trim()
}

function asId(value: unknown, label: string): string {
  const id = asString(value, label)
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id)) {
    throw new Error(`${label} 只能用小写字母、数字和连字符`)
  }
  return id
}

function asNumber(value: unknown, label: string): number {
  if (typeof value !== 'number' || !Number.isInteger(value)) {
    throw new Error(`${label} 必须是整数`)
  }
  return value
}

function asBoolean(value: unknown, label: string): boolean {
  if (typeof value !== 'boolean') throw new Error(`${label} 必须是 true 或 false`)
  return value
}

function asStatus(value: unknown, label: string): WorkStatus {
  if (typeof value === 'string' && WORK_STATUSES.includes(value as WorkStatus)) {
    return value as WorkStatus
  }
  throw new Error(`${label} 只能是 done、active、blocked`)
}
