# Spec example: #6 Long meeting titles break the list view layout

> Languages: **English** | [日本語](spec-6-title-overflow.ja.md) | [Tiếng Việt](spec-6-title-overflow.vi.md)

> This is **one** valid interpretation. A different reasonable take is fine.

## Acceptance criteria

1. In the list view, a title of any length stays on a single line (it does not push other rows wider or wrap).
2. When truncated, the user has a way to see the full title (hover tooltip, the detail page, or both).
3. Existing short titles are unaffected.
4. The date column on the right stays in a consistent position even when titles are long.

## Suggested implementation directions

### CSS truncation (recommended)

The minimal fix is CSS-only:

```tsx
<span className="font-medium truncate flex-1 mr-4">{m.title}</span>
<span className="text-sm text-gray-500 whitespace-nowrap">{formatDate(m.meetingDate)}</span>
```

Key points:
- The title gets `truncate` (`overflow: hidden; text-overflow: ellipsis; white-space: nowrap`).
- `flex-1` lets the title stretch; `whitespace-nowrap` keeps the date column tight.
- The row wrapper should already have `flex items-center`.

### Alternatives

- The title is clickable (it leads to the detail page), so the truncated title can use `<title>` or a tooltip to show the full string on hover.
- Show up to two lines and truncate from line 3 (`-webkit-line-clamp: 2`).
- Be responsive: truncate only on narrow viewports, show full titles on wide ones.

## How to verify

1. The seed has a long title (`Detailed Quarterly Business Review with Multiple Stakeholders ...`, 130+ chars). Its row should now display on one line with an ellipsis.
2. The date on that row aligns with the dates on the other rows.
3. Hovering / clicking still gets you the full title.
4. Other shorter titles look the same as before.

## What we look at when grading

- Is the change **scoped to CSS / layout**? (No DB or business logic changes.)
- Did you preserve a way for the user to read the full string?
- Did you keep the change small? (A common AI failure mode is "redesign everything.")

## Notes

- Tailwind's `truncate` utility alone gets you most of the way.
- The title on the detail page can wrap freely — this is a list-view-only problem.
- Responsive breakpoints aren't required (desktop-only testing is enough).
