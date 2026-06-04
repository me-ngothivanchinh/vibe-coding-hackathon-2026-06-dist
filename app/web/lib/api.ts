import type { Meeting } from './types'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'

export async function fetchMeetings(
  query?: string,
  tag?: string
): Promise<Meeting[]> {
  const url = new URL(`${API_URL}/api/meetings`)
  if (query?.trim()) {
    url.searchParams.set('q', query.trim())
  }
  if (tag?.trim()) {
    url.searchParams.set('tag', tag.trim())
  }

  const res = await fetch(url.toString(), { cache: 'no-store' })
  if (!res.ok) throw new Error('Failed to fetch meetings')
  return res.json()
}

export async function fetchMeeting(id: string): Promise<Meeting> {
  const res = await fetch(`${API_URL}/api/meetings/${id}`, { cache: 'no-store' })
  if (!res.ok) throw new Error('Failed to fetch meeting')
  return res.json()
}

export async function createMeeting(data: {
  title: string
  body: string
  meetingDate: string
  tags: string[]
}): Promise<Meeting> {
  const res = await fetch(`${API_URL}/api/meetings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Failed to create meeting')
  return res.json()
}

export async function updateMeeting(
  id: string,
  data: { title: string; body: string; meetingDate: string; tags: string[] }
): Promise<Meeting> {
  const res = await fetch(`${API_URL}/api/meetings/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Failed to update meeting')
  return res.json()
}

export async function deleteMeeting(id: string): Promise<void> {
  const res = await fetch(`${API_URL}/api/meetings/${id}`, {
    method: 'DELETE',
  })
  if (!res.ok) throw new Error('Failed to delete meeting')
}

const tokyoFormatter = new Intl.DateTimeFormat('ja-JP', {
  timeZone: 'Asia/Tokyo',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
})

export function formatDate(isoString: string): string {
  const date = new Date(isoString)
  const parts = tokyoFormatter.formatToParts(date)
  const year = parts.find((part) => part.type === 'year')?.value ?? ''
  const month = parts.find((part) => part.type === 'month')?.value ?? ''
  const day = parts.find((part) => part.type === 'day')?.value ?? ''
  return `${year}-${month}-${day}`
}
