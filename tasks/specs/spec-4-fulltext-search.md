# Spec example: #4 Full-text search across meeting bodies

> Languages: **English** | [日本語](spec-4-fulltext-search.ja.md) | [Tiếng Việt](spec-4-fulltext-search.vi.md)

> This is **one** valid interpretation. A different reasonable take is fine.

## Acceptance criteria

1. The list view has a search box where the user types a keyword.
2. **The body (`body`) is searched, not just the title.**
3. Search is case-insensitive (`acme`, `Acme`, and `ACME` all match).
4. Substring matching ("meet" matches "meeting").
5. An empty query returns all meetings.
6. With ~100 rows, the user does not perceive the search as slow (target: well under a second).

## Suggested implementation directions

### Backend

Simple version (recommended — fits comfortably in 1.5 hours):

```ts
// GET /api/meetings?q=keyword
const where = q
  ? {
      OR: [
        { title: { contains: q, mode: 'insensitive' } },
        { body:  { contains: q, mode: 'insensitive' } },
      ],
    }
  : {}
const meetings = await prisma.meeting.findMany({ where, orderBy: { meetingDate: 'desc' } })
```

This compiles down to PostgreSQL `ILIKE`, which is fast enough for 100–500 rows even without an index.

Advanced version (only if you have time left over):

- PostgreSQL `tsvector` / `tsquery` for proper full-text search
- Sort by relevance score
- Highlight matches in the result rendering

The advanced version is unrealistic in 1.5 hours — go with the simple version.

### Frontend

- Add `<input type="search">` to the top of the list view.
- Re-issue the API call on each keystroke (debounce is recommended; not strictly required).
- Mirror the query into the URL querystring so reloading preserves the search state.
- When the result set is empty, show "No meetings match this search."

UI sketch:

```
┌────────────────────────────────────────┐
│ 🔍 [ acme                       ]  [×] │  ← search input
├────────────────────────────────────────┤
│ Acme Q2 Kickoff                  4/15  │
│ Acme Renewal Discussion          4/10  │
│ ...                                    │
└────────────────────────────────────────┘
```

## How to verify

1. With seed data loaded, type "search" — meetings whose body contains "search" (e.g. "Customer Feedback Discussion") should match.
2. "ACME" and "acme" return the same number of results.
3. With the search box empty, all 12 seed meetings appear.
4. With nonsense input, you see the empty-result message.

## What we look at when grading

- Did you change both the backend (query parameter) and the UI (search box)?
- Did you pick the right scope — simple version inside 1.5 hours, rather than getting trapped in `tsvector`?
- Did you handle the empty-result case?

## Notes

- Sort order can stay the same (`meetingDate desc`).
- Pagination is not required for this spec, even at ~500 rows.
- Highlighting matched keywords in results is bonus only (not required).
