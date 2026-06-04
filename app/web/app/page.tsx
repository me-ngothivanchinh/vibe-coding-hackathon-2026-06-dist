'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { fetchMeetings, searchMeetings, formatDate } from '@/lib/api'
import type { Meeting } from '@/lib/types'

export default function HomePage() {
  const [meetings, setMeetings] = useState<Meeting[] | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [tagFilter, setTagFilter] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSearching, setIsSearching] = useState(false)

  useEffect(() => {
    setIsSearching(true)
    const trimmedQuery = searchQuery.trim()
    const trimmedTag = tagFilter.trim()
    const timer = setTimeout(() => {
      const fetcher = trimmedQuery
        ? searchMeetings(trimmedQuery, trimmedTag || undefined)
        : fetchMeetings(trimmedTag || undefined)

      fetcher
        .then(setMeetings)
        .catch((e) => setError(e.message))
        .finally(() => setIsSearching(false))
    }, 300)

    return () => clearTimeout(timer)
  }, [searchQuery, tagFilter])

  if (error) return <div className="text-red-600">Error: {error}</div>
  if (!meetings) return <div>Loading...</div>

  const hasSearchQuery = searchQuery.trim().length > 0
  const hasTagFilter = tagFilter.trim().length > 0

  return (
    <div>
      <div className="mb-4 grid gap-2 md:grid-cols-[1fr_auto]">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search meetings by title or content..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {hasSearchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded-md text-sm font-medium"
            >
              Clear
            </button>
          )}
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Filter by tag (project/customer)"
            value={tagFilter}
            onChange={(e) => setTagFilter(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {hasTagFilter && (
            <button
              type="button"
              onClick={() => setTagFilter('')}
              className="px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded-md text-sm font-medium"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {(hasSearchQuery || hasTagFilter) && (
        <div className="mb-2 text-sm text-gray-600">
          {isSearching ? (
            <span>Loading results…</span>
          ) : (
            <span>
              Showing {meetings.length} meeting{meetings.length !== 1 ? 's' : ''}
              {hasSearchQuery ? ' matching your search' : ''}
              {hasTagFilter ? ` filtered by #${tagFilter.trim()}` : ''}
            </span>
          )}
        </div>
      )}

      {meetings.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          {hasSearchQuery || hasTagFilter
            ? 'No meetings found.'
            : 'No meetings yet. Create one to get started.'}
        </div>
      ) : (
        <div className="bg-white rounded shadow divide-y">
          {meetings.map((m) => (
            <Link
              key={m.id}
              href={`/meetings/${m.id}`}
              className="flex flex-col gap-2 px-4 py-3 hover:bg-gray-50 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <div className="font-medium text-gray-900 break-words">{m.title}</div>
                {(m.tags?.length ?? 0) > 0 && (
                  <div className="mt-1 flex flex-wrap gap-2 text-xs text-gray-600">
                    {(m.tags ?? []).map((tag) => (
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
              <span className="flex-shrink-0 text-sm text-gray-500">
                {formatDate(m.meetingDate)}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
