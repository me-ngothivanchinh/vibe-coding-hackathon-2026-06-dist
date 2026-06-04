'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { fetchMeeting, deleteMeeting, formatDate } from '@/lib/api'
import type { Meeting } from '@/lib/types'

export default function MeetingDetailPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  const [meeting, setMeeting] = useState<Meeting | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchMeeting(id)
      .then(setMeeting)
      .catch((e) => setError(e.message))
  }, [id])

  async function handleDelete() {
    const confirmed = window.confirm(
      'Are you sure you want to delete this meeting note? This action cannot be undone.'
    )
    if (!confirmed) {
      return
    }

    await deleteMeeting(id)
    router.push('/')
  }

  if (error) return <div className="text-red-600">Error: {error}</div>
  if (!meeting) return <div>Loading...</div>

  return (
    <div className="bg-white rounded shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">{meeting.title}</h1>
        <div className="flex gap-2">
          <Link
            href={`/meetings/${id}/edit`}
            className="px-3 py-1.5 border rounded hover:bg-gray-50"
          >
            Edit
          </Link>
          <button
            onClick={handleDelete}
            className="px-3 py-1.5 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
      <div className="text-sm text-gray-500 mb-6">
        {formatDate(meeting.meetingDate)}
      </div>
      <div className="whitespace-pre-wrap">{meeting.body}</div>
    </div>
  )
}
