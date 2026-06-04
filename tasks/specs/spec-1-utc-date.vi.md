# Ví dụ đặc tả: #1 Ngày họp hiển thị sai

> Ngôn ngữ: [English](spec-1-utc-date.md) | [日本語](spec-1-utc-date.ja.md) | **Tiếng Việt**

> ✅ **Đã được người bản xứ kiểm duyệt.**

> Đây là **một** cách diễn giải hợp lệ. Cách hiểu khác hợp lý cũng được.
> Điều quan trọng là đáp ứng tiêu chí chấp nhận và giải thích được vì sao bạn triển khai theo cách đó.

## Tiêu chí chấp nhận

1. **Ngày JST (Asia/Tokyo, UTC+9)** của cuộc họp được hiển thị ở cả danh sách và chi tiết.
2. Các cuộc họp được tạo trong khoảng 0:00 đến 9:00 JST không bị hiển thị sai ngày.
3. Ngày hiển thị không phụ thuộc múi giờ cục bộ của trình duyệt — luôn giả định JST (ứng dụng này lấy JST làm trung tâm).
4. Dữ liệu cuộc họp hiện có (`meetingDate` đã có trong DB) vẫn hoạt động mà không cần migration.

## Hướng triển khai gợi ý

Vấn đề gốc: mã hiển thị hiện tại cắt phần ngày từ chuỗi ISO theo UTC, nên cuộc họp nào có ngày UTC khác với ngày JST sẽ bị hiển thị theo ngày UTC.

Cách bạn có thể sửa (bất kỳ cách nào dưới đây đều được; cách hiểu khác hợp lý cũng được):

- **A. Định dạng với múi giờ Asia/Tokyo rõ ràng.**
  - Dùng `Intl.DateTimeFormat('ja-JP', { timeZone: 'Asia/Tokyo', ... })`,
  - hoặc thư viện (`date-fns-tz`, `dayjs` với plugin timezone) và chuyển đổi rõ ràng.
- **B. Dùng các phương thức giờ địa phương trên `Date`.**
  - Cách này phụ thuộc vào múi giờ của trình duyệt, nên không khuyến khích.
- **C. Tính chuỗi hiển thị ở phía API.**
  - Thừa, A là đủ.

Khuyến nghị: **A**. Sửa đổi tối thiểu nằm ngay trong hàm tiện ích hiển thị (`formatDate`).

## Cách xác minh (cho người tham gia)

Sau khi sửa:

1. Từ trang tạo mới, đặt ngày cuộc họp là "2026-06-01" và lưu.
2. Xác nhận danh sách hiển thị "2026-06-01".
3. Trong devtools của trình duyệt, giả lập đồng hồ hệ thống thành "2026-06-01 07:00 JST" — ngày hiển thị không được thay đổi.
4. Dữ liệu seed có sẵn (cuộc họp buổi sáng nếu có) cũng nên hiển thị đúng ngày JST.

## Điều chúng tôi nhìn vào khi chấm

- Bạn có hiểu lỗi thực sự là gì không (xử lý UTC so với JST)?
- Phạm vi thay đổi có đủ gọn không (không chạm DB, không chạm API)?
- Nếu bạn ủy thác cho công cụ AI, bạn vẫn tự xác minh kết quả chứ?

## Lưu ý

- Không cần migration dữ liệu. Dữ liệu được lưu là đúng; chỉ mã hiển thị là sai.
- Việc hiển thị thêm phần giờ ở trang chi tiết / chỉnh sửa là quyết định riêng. Spec này chỉ yêu cầu **ngày** đúng.
