import type { Meeting } from './types'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'

export async function fetchMeetings(): Promise<Meeting[]> {
  const res = await fetch(`${API_URL}/api/meetings`, { cache: 'no-store' })
  if (!res.ok) throw new Error('Failed to fetch meetings')
  return res.json()
}

export async function fetchMeeting(id: string): Promise<Meeting> {
  const res = await fetch(`${API_URL}/api/meetings/${id}`, { cache: 'no-store' })
  if (!res.ok) throw new Error('Failed to fetch meeting')
  return res.json()
}

export async function searchMeetings(query: string): Promise<Meeting[]> {
  const res = await fetch(
    `${API_URL}/api/meetings/search?q=${encodeURIComponent(query)}`,
    { cache: 'no-store' }
  )
  if (!res.ok) throw new Error('Failed to search meetings')
  return res.json()
}

export async function createMeeting(data: {
  title: string
  body: string
  meetingDate: string
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
  data: { title: string; body: string; meetingDate: string }
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

export function formatDate(isoString: string): string {
  const date = new Date(isoString)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}
