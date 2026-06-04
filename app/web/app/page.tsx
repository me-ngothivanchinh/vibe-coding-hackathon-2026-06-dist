'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { fetchMeetings, searchMeetings, formatDate } from '@/lib/api'
import type { Meeting } from '@/lib/types'

export default function HomePage() {
  const [meetings, setMeetings] = useState<Meeting[] | null>(null)
  const [searchResults, setSearchResults] = useState<Meeting[] | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSearching, setIsSearching] = useState(false)

  // Load initial meetings
  useEffect(() => {
    fetchMeetings()
      .then(setMeetings)
      .catch((e) => setError(e.message))
  }, [])

  // Debounce search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults(null)
      return
    }

    const timer = setTimeout(() => {
      setIsSearching(true)
      searchMeetings(searchQuery)
        .then(setSearchResults)
        .catch((e) => setError(e.message))
        .finally(() => setIsSearching(false))
    }, 300)

    return () => clearTimeout(timer)
  }, [searchQuery])

  if (error) return <div className="text-red-600">Error: {error}</div>
  if (!meetings) return <div>Loading...</div>

  const displayMeetings = searchResults !== null ? searchResults : meetings
  const hasSearchQuery = searchQuery.trim().length > 0

  return (
    <div>
      <div className="mb-4 flex gap-2">
        <input
          type="text"
          placeholder="Search meetings by title or content..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {hasSearchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded-md text-sm font-medium"
          >
            Clear
          </button>
        )}
      </div>

      {hasSearchQuery && (
        <div className="mb-2 text-sm text-gray-600">
          {isSearching ? (
            <span>Searching...</span>
          ) : (
            <span>Found {displayMeetings.length} result{displayMeetings.length !== 1 ? 's' : ''}</span>
          )}
        </div>
      )}

      {displayMeetings.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          {hasSearchQuery ? 'No meetings found.' : 'No meetings yet. Create one to get started.'}
        </div>
      ) : (
        <div className="bg-white rounded shadow divide-y">
          {displayMeetings.map((m) => (
            <Link
              key={m.id}
              href={`/meetings/${m.id}`}
              className="flex items-center justify-between px-4 py-3 hover:bg-gray-50"
            >
              <span className="font-medium">{m.title}</span>
              <span className="text-sm text-gray-500 ml-4">
                {formatDate(m.meetingDate)}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
