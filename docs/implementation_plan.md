# Kế hoạch Sửa Lỗi (Fix Bugs) cho EShop

Dựa trên danh sách 14 Bug đã phân tích, dưới đây là kế hoạch chi tiết để sửa mã nguồn hệ thống.

## User Review Required
> [!IMPORTANT]
> Vui lòng xem qua kế hoạch sửa lỗi dưới đây. Nếu bạn đồng ý, tôi sẽ tiến hành chỉnh sửa trực tiếp vào mã nguồn của hệ thống và chạy lại test để kiểm chứng.

## Đề xuất sửa đổi mã nguồn (Proposed Changes)

---

### Backend (Node.js/Express)

#### [MODIFY] `backend/controllers/authController.js` (Sửa FR-02)
- **BUG-001**: Sửa lỗi `login_attempts += 2` thành `login_attempts += 1`.
- **BUG-002**: Sửa thời gian khóa tài khoản từ `180000` (3 phút) thành `30000` (30 giây) theo đúng requirements.

#### [MODIFY] `backend/routes/adminRouter.js` & `backend/middlewares/authMiddleware.js` (Sửa FR-16)
- **BUG-010 (Bảo mật)**: Thêm middleware kiểm tra `req.user.role === 'admin'` vào endpoint `/api/admin/import-products` để chặn User thường.

#### [MODIFY] `backend/controllers/productController.js` (hoặc `importController.js`) (Sửa FR-16)
- **BUG-011 (Lỗi Rollback)**: Áp dụng cơ chế Transaction (All-or-Nothing). Dùng biến mảng tạm để lưu dữ liệu CSV. Nếu bất kỳ dòng nào lỗi, quăng exception và không lưu bất cứ gì vào DB. Nếu tất cả đúng, mới tiến hành insert hàng loạt (Bulk Insert).
- **BUG-013 (Validate Giá)**: Bổ sung điều kiện kiểm tra `price > 0`. Nếu <= 0 hoặc không phải là số, báo lỗi dòng tương ứng.
- **BUG-014 (Category ID)**: Bổ sung logic bắt buộc `category_id` phải tồn tại. Nếu rỗng, quăng lỗi thay vì fallback về 1.

---

### Frontend Web (React/Vite)

#### [MODIFY] `frontend-web/src/pages/Login.jsx` (Sửa FR-02)
- **BUG-003**: Dời thẻ hiển thị `errorMessage` lên phía trên thẻ `<form>` (hoặc trên nút Submit). Thêm dấu `*` đỏ vào Label của Email và Password.
- **BUG-004**: Thay đổi `<title>` trong `useEffect` thành "Đăng Nhập". Sửa nhãn "Username" thành "Email".
- **BUG-005**: Sửa `<input type="text">` của Password thành `<input type="password">`. Sửa của Email thành `<input type="email">`.
- **BUG-006**: Bắt chính xác `err.response.data.message` từ Backend để hiển thị lỗi chi tiết (Sai mật khẩu, Bị khóa) thay vì hiển thị text cứng "Đăng nhập thất bại...".

#### [MODIFY] `frontend-web/src/pages/Profile.jsx` (hoặc `Orders.jsx`) (Sửa FR-11)
- **BUG-007**: Sửa thẻ `<h2>` (Lịch sử đơn hàng) thành `<h1>`.
- **BUG-008**: Bổ sung một Icon (ví dụ `<BoxIcon />` hoặc `<img>` minh họa) vào phần Empty State khi người dùng chưa có đơn hàng.
- **BUG-009**: Chỉnh sửa class CSS của trạng thái `confirmed` từ `bg-indigo-100` sang bảng màu chuẩn (ví dụ `bg-blue-100 text-blue-800`).

---

### Frontend Admin (React/Vite)

#### [MODIFY] `frontend-admin/src/pages/ImportProducts.jsx` (Sửa FR-16)
- **BUG-012 (Lỗi CSV Parser)**: Thay thế hàm `.split(',')` thô sơ bằng một Regex chuẩn RFC 4180 (hoặc thư viện `papaparse`) để không bị cắt nhầm các dấu phẩy nằm bên trong dấu ngoặc kép (ví dụ: `"Màn hình, Chuột"`).

---

## Verification Plan (Kế hoạch Kiểm chứng)
Sau khi chỉnh sửa xong các file trên, tôi sẽ yêu cầu bạn chạy lại lệnh test:
```bash
npm test -- FR-02.spec.ts FR-11.spec.ts FR-16.spec.ts --workers=1
```
Tất cả 14 lỗi sẽ chuyển sang màu xanh (Passed)!
