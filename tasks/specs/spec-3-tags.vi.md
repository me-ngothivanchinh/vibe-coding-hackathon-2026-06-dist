# Ví dụ đặc tả: #3 Tổ chức ghi chú cuộc họp theo dự án / khách hàng (tag)

> Ngôn ngữ: [English](spec-3-tags.md) | [日本語](spec-3-tags.ja.md) | **Tiếng Việt**

> ✅ **Đã được người bản xứ kiểm duyệt.**

> Đây là **một** cách diễn giải hợp lệ. Cách hiểu khác hợp lý cũng được.

## Tiêu chí chấp nhận

1. Một cuộc họp có thể gắn nhiều tag (ví dụ `Acme`, `Q2 planning`, `kickoff`).
2. Màn hình danh sách hỗ trợ lọc theo tag.
3. URL sau khi lọc có thể chia sẻ — tải lại trang vẫn giữ bộ lọc, hoặc có một dạng liên kết có thể chia sẻ.
4. Trang tạo mới / chỉnh sửa cho phép thêm và xóa tag.
5. Cùng một tag không được đăng ký hai lần (`"Acme"` và `"Acme "` có dấu cách ở cuối — chuẩn hóa nghiêm ngặt là tùy chọn).

## Hướng triển khai gợi ý

### Mô hình dữ liệu (ví dụ Prisma schema)

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

Cách khác: bỏ bảng `Tag` và dùng `String[]` (mảng PostgreSQL). Với 100–500 dòng dữ liệu, cả hai cách đều ổn.

### Thay đổi API (ví dụ)

- `GET /api/meetings?tag=Acme` lọc theo tag
- `POST /api/meetings` chấp nhận `tags: string[]` trong body
- `PUT /api/meetings/:id` cập nhật các tag
- `GET /api/tags` trả về danh sách tag hiện có (để dùng cho autocomplete)

Ví dụ:

```http
GET /api/meetings?tag=Acme
→ 200 OK [{ id, title, ..., tags: [{ id, name: "Acme" }, ...] }, ...]

POST /api/meetings
{ "title": "...", "body": "...", "meetingDate": "...", "tags": ["Acme", "kickoff"] }
→ 201 Created  (tag được tự tạo nếu chưa có)
```

### UI (ví dụ)

- Danh sách: mỗi hàng hiển thị các tag dạng chip; phía trên có dropdown hoặc ô tìm kiếm để "lọc theo tag".
- Trang tạo / chỉnh sửa: ô nhập tag (phân tách bằng dấu phẩy, hoặc UI dạng chip).

UI không cần hoàn hảo. Miễn là bộ lọc hoạt động và tag được hiển thị rõ là gắn với cuộc họp, như vậy là đạt.

## Cách xác minh

1. Tạo 3 cuộc họp mới với tập tag khác nhau, ví dụ `[Acme, kickoff]`, `[BizCo]`, `[Acme, retrospective]`.
2. Lọc theo `Acme` trên màn hình danh sách → 2 cuộc họp xuất hiện.
3. Tag hiển thị trong trang chi tiết.
4. Sửa tag của một cuộc họp, lưu, và xác nhận thay đổi được giữ.

## Lưu ý

- Màu tag / thứ tự sắp xếp không bắt buộc (chỉ tính là điểm cộng).
- UI "xóa tag hoàn toàn" không bắt buộc (không phải nhu cầu thực ở quy mô này).
- Migration schema dùng `prisma db push --accept-data-loss` được trong môi trường này.
