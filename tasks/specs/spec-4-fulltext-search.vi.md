# Ví dụ đặc tả: #4 Tìm kiếm toàn văn trong nội dung cuộc họp

> Ngôn ngữ: [English](spec-4-fulltext-search.md) | [日本語](spec-4-fulltext-search.ja.md) | **Tiếng Việt**

> ✅ **Đã được người bản xứ kiểm duyệt.**

> Đây là **một** cách diễn giải hợp lệ. Cách hiểu khác hợp lý cũng được.

## Tiêu chí chấp nhận

1. Màn hình danh sách có ô tìm kiếm để người dùng nhập từ khóa.
2. **Nội dung (`body`) được tìm kiếm, không chỉ tiêu đề.**
3. Tìm kiếm không phân biệt hoa thường (`acme`, `Acme`, `ACME` đều khớp).
4. Khớp một phần ("meet" khớp với "meeting").
5. Truy vấn rỗng trả về tất cả cuộc họp.
6. Với khoảng 100 dòng dữ liệu, người dùng không cảm thấy tìm kiếm bị chậm (mục tiêu: nhanh hơn một giây rõ rệt).

## Hướng triển khai gợi ý

### Backend

Bản đơn giản (khuyến nghị — vừa đủ trong 1,5 giờ):

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

Cách này được biên dịch xuống PostgreSQL `ILIKE`, đủ nhanh cho 100–500 dòng dữ liệu ngay cả khi không có index.

Bản nâng cao (chỉ làm nếu còn thời gian):

- `tsvector` / `tsquery` của PostgreSQL để tìm kiếm toàn văn đúng nghĩa
- Sắp xếp theo điểm liên quan
- Tô sáng phần khớp khi render

Bản nâng cao không thực tế trong 1,5 giờ — chọn bản đơn giản.

### Frontend

- Thêm `<input type="search">` lên đầu danh sách.
- Gọi API mỗi lần gõ phím (khuyến nghị debounce; không bắt buộc).
- Đồng bộ truy vấn vào querystring của URL để tải lại trang vẫn giữ trạng thái tìm kiếm.
- Khi kết quả rỗng, hiển thị "Không có cuộc họp nào khớp tìm kiếm này."

UI mẫu:

```
┌────────────────────────────────────────┐
│ 🔍 [ acme                       ]  [×] │  ← ô tìm kiếm
├────────────────────────────────────────┤
│ Acme Q2 Kickoff                  4/15  │
│ Acme Renewal Discussion          4/10  │
│ ...                                    │
└────────────────────────────────────────┘
```

## Cách xác minh

1. Với dữ liệu seed, gõ "search" — các cuộc họp có "search" trong body (ví dụ "Customer Feedback Discussion") nên khớp.
2. "ACME" và "acme" trả về cùng số kết quả.
3. Khi ô tìm kiếm rỗng, cả 12 cuộc họp seed xuất hiện.
4. Với dữ liệu nhập vô nghĩa, bạn thấy thông báo không có kết quả.

## Điều chúng tôi nhìn vào khi chấm

- Bạn có thay đổi cả backend (query parameter) và UI (ô tìm kiếm) không?
- Bạn chọn đúng phạm vi — bản đơn giản trong 1,5 giờ, không bị mắc kẹt với `tsvector`?
- Bạn xử lý trường hợp kết quả rỗng?

## Lưu ý

- Thứ tự sắp xếp giữ nguyên (`meetingDate desc`).
- Spec này không yêu cầu phân trang, ngay cả ở khoảng 500 dòng dữ liệu.
- Highlight từ khóa khớp trong kết quả là điểm cộng (không bắt buộc).
