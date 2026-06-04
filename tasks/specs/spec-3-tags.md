# Spec example: #3 Organize meeting notes by project / customer (tags)

> Languages: **English** | [日本語](spec-3-tags.ja.md) | [Tiếng Việt](spec-3-tags.vi.md)

> This is **one** valid interpretation. A different reasonable take is fine.

## Acceptance criteria

1. A meeting can be assigned multiple tags (e.g. `Acme`, `Q2 planning`, `kickoff`).
2. The list view supports filtering by tag.
3. A filtered URL is shareable — reloading preserves the filter, or there is a shareable link form.
4. The create / edit pages allow adding and removing tags.
5. The same tag is not registered twice (`"Acme"` and `"Acme "` with trailing space — strict normalization is optional).

## Suggested implementation directions

### Data model (Prisma schema example)

```prisma
model Meeting {
  id          String   @id @default(cuid())
  title       String
  body        String
  meetingDate DateTime
  tags        Tag[]    @relation("MeetingTags")
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Tag {
  id       String    @id @default(cuid())
  name     String    @unique
  meetings Meeting[] @relation("MeetingTags")
}
```

Alternative: skip the `Tag` table and use `String[]` (PostgreSQL array). For 100–500 rows, either approach is fine.

### API changes (example)

- `GET /api/meetings?tag=Acme` filters by tag
- `POST /api/meetings` accepts `tags: string[]` in the body
- `PUT /api/meetings/:id` updates tags
- `GET /api/tags` returns the list of existing tags (for autocomplete)

Examples:

```http
GET /api/meetings?tag=Acme
→ 200 OK [{ id, title, ..., tags: [{ id, name: "Acme" }, ...] }, ...]

POST /api/meetings
{ "title": "...", "body": "...", "meetingDate": "...", "tags": ["Acme", "kickoff"] }
→ 201 Created  (a tag is auto-created if it does not exist)
```

### UI (example)

- List view: each row shows tag chips; a "filter by tag" dropdown or search box at the top.
- Create / edit page: a tag input (comma-separated, or a chip-style UI).

UI polish doesn't have to be perfect. As long as filtering works and tags are visibly attached to meetings, you're good.

## How to verify

1. Create three new meetings with different tag sets, e.g. `[Acme, kickoff]`, `[BizCo]`, `[Acme, retrospective]`.
2. Filter by `Acme` on the list view → 2 meetings appear.
3. Tags are visible on the detail view.
4. Edit a meeting's tags, save, and confirm the change persists.

## Notes

- Tag colors / sort order are not required (extra credit only).
- A "delete tag entirely" UI is not required (not a real user need at this scale).
- For schema migration, `prisma db push --accept-data-loss` is fine in this environment.
