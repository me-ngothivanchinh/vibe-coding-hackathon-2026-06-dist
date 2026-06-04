# 仕様例: #6 一覧画面でタイトルが長いと表示が崩れる

> 言語: [English](spec-6-title-overflow.md) | **日本語** | [Tiếng Việt](spec-6-title-overflow.vi.md)

> これは「一例」です。合理的な別解釈で実装しても問題ありません。

## 受け入れ基準

1. 一覧画面で、どんなに長いタイトルでも 1 行で収まる（複数行にまたがって他の行を押し広げない）
2. 切り捨てた場合は、ユーザーがフルテキストを確認できる手段がある（ホバーで全文が見える、クリックで詳細遷移時にフルが見える、など）
3. 既存の短いタイトル表示には影響しない
4. 日付（右側のカラム）の位置が長タイトルでも一定

## 想定される実装の方向性

### CSS による truncate（推奨）

最小修正は CSS のみ:

```tsx
<span className="font-medium truncate flex-1 mr-4">{m.title}</span>
<span className="text-sm text-gray-500 whitespace-nowrap">{formatDate(m.meetingDate)}</span>
```

ポイント:
- タイトル側に `truncate` (`overflow: hidden; text-overflow: ellipsis; white-space: nowrap`) を当てる
- `flex-1` でタイトル側が伸びる、日付側は `whitespace-nowrap` で固定
- 親要素（行 wrapper）に `flex items-center` が当たっていれば OK

### 別解

- タイトルクリックで詳細画面に遷移する設計なので、ホバー時に `<title>` 属性で全文をツールチップ表示
- 2 行までは表示し、3 行目以降を省略（`-webkit-line-clamp: 2`）
- レスポンシブ: 幅が狭い場合のみ省略、広い場合は全文表示

## 確認方法（参加者向け）

1. seed データに含まれる長タイトル（「Detailed Quarterly Business Review with Multiple Stakeholders ...」130 文字超）の行が、1 行で省略表示されている
2. その行の右側にある日付の表示位置が、他の行と揃っている
3. ホバー or クリックで、フルタイトルを確認できる
4. 短いタイトル（既存の seed の他の行）は省略されていない

## 評価ポイント

- 修正が **CSS / レイアウトに閉じている** か（DB やロジックを触っていないか）
- 切り捨てた後、ユーザーがフル文字列にアクセスする手段を残しているか
- 修正範囲の最小化判断（よくある AI ツール事故: 「全部 redesign」してしまうケース）

## 補足

- Tailwind の `truncate` ユーティリティ 1 つで完結する想定
- 詳細画面のタイトルは長くても折り返してよい（一覧画面のみの問題）
- レスポンシブ対応は必須ではない（PC ブラウザでの動作確認のみで OK）
