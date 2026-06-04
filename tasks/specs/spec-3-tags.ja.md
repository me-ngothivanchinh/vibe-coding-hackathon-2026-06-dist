# 仕様例: #3 議事録をプロジェクト/顧客ごとに整理したい（タグ機能）

> 言語: [English](spec-3-tags.md) | **日本語** | [Tiếng Việt](spec-3-tags.vi.md)

> これは「一例」です。合理的な別解釈で実装しても問題ありません。

## 受け入れ基準

1. 議事録に対して、複数のタグを付けられる（例: `Acme`, `Q2 planning`, `kickoff`）
2. 一覧画面で、タグによる絞り込みができる
3. 1 つのタグで絞り込んだ状態の URL が共有可能（リロードしても絞り込み状態が維持される、もしくは共有可能なリンクになる）
4. 新規作成・編集画面で、議事録にタグを追加・削除できる
5. 同じタグ名は重複登録されない（"Acme" と "Acme " のような空白違いは許容してよい、厳格な正規化は任意）

## 想定される実装の方向性

### データモデル（Prisma schema）の例

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

別解として、`Tag` テーブルを切らずに `String[]` (PostgreSQL Array) で持つ方法もあり。スケール感（100〜500 件）ならどちらでも問題なし。

### API 変更の例

- `GET /api/meetings?tag=Acme` でタグ絞り込み
- `POST /api/meetings` リクエストボディに `tags: string[]` を許容
- `PUT /api/meetings/:id` でタグ更新
- `GET /api/tags` で既存タグ一覧（オートコンプリート用）

例:

```http
GET /api/meetings?tag=Acme
→ 200 OK [{ id, title, ..., tags: [{ id, name: "Acme" }, ...] }, ...]

POST /api/meetings
{ "title": "...", "body": "...", "meetingDate": "...", "tags": ["Acme", "kickoff"] }
→ 201 Created (タグが存在しなければ自動作成)
```

### UI 変更の例

- 一覧画面: 各議事録の行にタグチップを表示、上部に「タグでフィルタ」のセレクト or 検索ボックス
- 新規/編集画面: タグ入力欄（カンマ区切り、もしくはチップ UI）

UI 詳細は完璧でなくて OK。「絞り込めること」「議事録にタグが紐づいて見えること」が分かれば合格。

## 確認方法（参加者向け）

1. 新規議事録を 3 件作成、それぞれ異なるタグセットを付与（例: `[Acme, kickoff]`, `[BizCo]`, `[Acme, retrospective]`）
2. 一覧画面で `Acme` で絞り込むと 2 件が表示される
3. 詳細画面でタグが表示される
4. 編集画面でタグを変更し、保存後に変更が反映されている

## 補足

- タグの色分けや並び順は本仕様では問わない（やってもよい）
- タグ削除（タグそのものを消す）UI までは要らない（要らないユーザー operation のはず）
- マイグレーションは Prisma の `prisma db push --accept-data-loss` で OK（ハッカソン環境なので）
