# Ví dụ đặc tả: #6 Tiêu đề cuộc họp quá dài làm vỡ bố cục danh sách

> Ngôn ngữ: [English](spec-6-title-overflow.md) | [日本語](spec-6-title-overflow.ja.md) | **Tiếng Việt**

> ✅ **Đã được người bản xứ kiểm duyệt.**

> Đây là **một** cách diễn giải hợp lệ. Cách hiểu khác hợp lý cũng được.

## Tiêu chí chấp nhận

1. Trong màn hình danh sách, tiêu đề dù dài đến đâu cũng nằm trên một dòng (không làm các hàng khác rộng ra hoặc bị xuống dòng).
2. Khi bị cắt ngắn, người dùng có cách xem tiêu đề đầy đủ (tooltip khi hover, trang chi tiết, hoặc cả hai).
3. Các tiêu đề ngắn hiện có không bị ảnh hưởng.
4. Cột ngày bên phải giữ vị trí nhất quán ngay cả khi tiêu đề dài.

## Hướng triển khai gợi ý

### Cắt ngắn bằng CSS (khuyến nghị)

Sửa tối thiểu chỉ trong CSS:

```tsx
<span className="font-medium truncate flex-1 mr-4">{m.title}</span>
<span className="text-sm text-gray-500 whitespace-nowrap">{formatDate(m.meetingDate)}</span>
```

Điểm quan trọng:
- Tiêu đề dùng `truncate` (`overflow: hidden; text-overflow: ellipsis; white-space: nowrap`).
- `flex-1` cho phép tiêu đề giãn ra; `whitespace-nowrap` giữ cột ngày gọn.
- Wrapper của hàng vốn đã có `flex items-center`.

### Cách khác

- Tiêu đề có thể bấm được (dẫn đến trang chi tiết), nên tiêu đề bị cắt có thể dùng `<title>` hoặc tooltip để hiển thị chuỗi đầy đủ khi hover.
- Hiển thị tối đa 2 dòng và cắt từ dòng 3 (`-webkit-line-clamp: 2`).
- Responsive: chỉ cắt ngắn ở viewport hẹp, hiển thị tiêu đề đầy đủ ở viewport rộng.

## Cách xác minh

1. Seed có một tiêu đề dài (`Detailed Quarterly Business Review with Multiple Stakeholders ...`, hơn 130 ký tự). Hàng đó giờ phải hiển thị trên một dòng và có dấu ba chấm.
2. Ngày trên hàng đó phải thẳng hàng với ngày của các hàng khác.
3. Hover / click vẫn giúp xem được tiêu đề đầy đủ.
4. Các tiêu đề ngắn khác trông giống như trước.

## Điều chúng tôi nhìn vào khi chấm

- Thay đổi có **giới hạn trong CSS / bố cục** không? (Không chạm DB hay business logic.)
- Bạn có giữ cách cho người dùng đọc chuỗi đầy đủ không?
- Bạn giữ thay đổi nhỏ gọn? (Lỗi AI thường gặp: "redesign tất cả".)

## Lưu ý

- Chỉ riêng utility `truncate` của Tailwind đã xử lý được phần lớn vấn đề.
- Tiêu đề trong trang chi tiết có thể tự do xuống dòng — đây chỉ là vấn đề của màn hình danh sách.
- Breakpoint responsive không bắt buộc (xác minh trên desktop là đủ).
