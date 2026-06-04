'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { fetchMeeting, updateMeeting } from '@/lib/api'

export default function EditMeetingPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [meetingDate, setMeetingDate] = useState('')
  const [tagsInput, setTagsInput] = useState('')
  const [loaded, setLoaded] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchMeeting(id).then((m) => {
      setTitle(m.title)
      setBody(m.body)
      setMeetingDate(m.meetingDate.slice(0, 10))
      setTagsInput(m.tags.join(', '))
      setLoaded(true)
    })
  }, [id])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    try {
      await updateMeeting(id, {
        title,
        body,
        meetingDate: `${meetingDate}T00:00:00Z`,
        tags: tagsInput
          .split(',')
          .map((tag) => tag.trim())
          .filter(Boolean),
      })
      router.push(`/meetings/${id}`)
    } catch (err) {
      alert('Error updating meeting')
      setSubmitting(false)
    }
  }

  if (!loaded) return <div>Loading...</div>

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded shadow p-6 space-y-4"
    >
      <h1 className="text-2xl font-semibold">Edit Meeting</h1>
      <div>
        <label className="block text-sm font-medium mb-1">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border rounded px-3 py-2"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Date</label>
        <input
          type="date"
          value={meetingDate}
          onChange={(e) => setMeetingDate(e.target.value)}
          className="border rounded px-3 py-2"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Tags</label>
        <input
          type="text"
          placeholder="e.g. acme, onboarding"
          value={tagsInput}
          onChange={(e) => setTagsInput(e.target.value)}
          className="w-full border rounded px-3 py-2"
        />
        <p className="mt-1 text-xs text-gray-500">
          Separate tags with commas.
        </p>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Notes</label>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={10}
          className="w-full border rounded px-3 py-2"
        />
      </div>
      <button
        type="submit"
        disabled={submitting}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {submitting ? 'Updating...' : 'Update'}
      </button>
    </form>
  )
}
