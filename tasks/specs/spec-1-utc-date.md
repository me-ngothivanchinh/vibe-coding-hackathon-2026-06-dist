# Spec example: #1 Meeting dates display on the wrong day

> Languages: **English** | [日本語](spec-1-utc-date.ja.md) | [Tiếng Việt](spec-1-utc-date.vi.md)

> This is **one** valid interpretation. A different reasonable take is fine.
> What matters is meeting the acceptance criteria and being able to explain why you implemented it that way.

## Acceptance criteria

1. The **JST (Asia/Tokyo, UTC+9) date** of a meeting is shown both in the list view and the detail view.
2. Meetings created between 0:00 and 9:00 JST are not displayed with the wrong date.
3. The displayed date does not depend on the browser's local timezone — JST is always assumed (this app is JST-centric).
4. Existing meeting data (the `meetingDate` already in the DB) keeps working without a migration.

## Suggested implementation directions

The root issue: the current display code slices the date out of a UTC ISO string, so any meeting whose UTC date differs from its JST date renders the UTC date.

How you might fix it (any of these is fine; alternative interpretations also OK):

- **A. Format with an explicit Asia/Tokyo timezone.**
  - Use `Intl.DateTimeFormat('ja-JP', { timeZone: 'Asia/Tokyo', ... })`,
  - or a library (`date-fns-tz`, `dayjs` with the timezone plugin) and convert explicitly.
- **B. Use the local-time methods on `Date`.**
  - This depends on the browser's timezone, so not recommended.
- **C. Compute the display string on the API side.**
  - Overkill, A is enough.

Recommended: **A**. The minimal fix lives inside the display utility (`formatDate`).

## How to verify (for participants)

After the fix:

1. From the create page, set the meeting date to "2026-06-01" and save.
2. Confirm the list view displays "2026-06-01".
3. In your browser's devtools, override the system clock to "2026-06-01 07:00 JST" — the displayed date should not change.
4. Existing seed data (any morning-time meetings) should also display the correct JST date.

## What we look at when grading

- Do you understand what the bug actually is (UTC vs. JST handling)?
- Is the change scoped tightly (no DB changes, no API changes)?
- If you delegated this to an AI tool, did you still verify the result yourself?

## Notes

- No data migration is required. The stored data is correct; only the display code is wrong.
- Whether you also display the time of day on the detail / edit pages is a separate decision. This spec only requires the **date** to be correct.
