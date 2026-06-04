'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { fetchMeeting, deleteMeeting, formatDate } from '@/lib/api'
import type { Meeting } from '@/lib/types'

function buildMeetingMarkdown(meeting: Meeting) {
  const safeTags = meeting.tags?.length ? meeting.tags.map((tag) => `#${tag}`).join(' ') : ''
  const lines = [
    `# ${meeting.title}`,
    '',
    `**Date:** ${formatDate(meeting.meetingDate)}`,
  ]

  if (safeTags) {
    lines.push(`**Tags:** ${safeTags}`, '')
  }

  lines.push(meeting.body)
  return lines.join('\n')
}

function downloadMarkdown(filename: string, content: string) {
  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

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
        <div>
          <h1 className="text-2xl font-semibold">{meeting.title}</h1>
          {(meeting.tags?.length ?? 0) > 0 && (
            <div className="mt-2 flex flex-wrap gap-2 text-sm text-gray-600">
              {(meeting.tags ?? []).map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-gray-200 bg-gray-50 px-2 py-1"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="flex gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => {
              if (!meeting) return
              const markdown = buildMeetingMarkdown(meeting)
              const safeTitle = meeting.title
                .replace(/[^a-zA-Z0-9_-]+/g, '_')
                .replace(/^_+|_+$/g, '')
                .slice(0, 50)
              const filename = `${safeTitle || 'meeting-note'}.md`
              downloadMarkdown(filename, markdown)
            }}
            className="px-3 py-1.5 border rounded hover:bg-gray-50"
          >
            Export
          </button>
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
