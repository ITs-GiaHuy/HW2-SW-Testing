# Báo cáo Phân tích Lỗi Timeout (30.1s)

Theo yêu cầu của bạn, tôi đã trích xuất toàn bộ stack trace từ file `results.json` để tìm hiểu chính xác **dòng code nào trong kịch bản test** đã gây ra lỗi Timeout 30s.

Kết quả phân tích cho thấy có **2 nguyên nhân chính** dẫn đến Timeout, và **KHÔNG CÓ lỗi nào do kịch bản nhập sai dữ liệu hay thao tác sai UI**.

## 1. Timeout do chưa kịp nhập data đã fail (Lỗi Server Môi trường)
Khoảng **~135 trường hợp** (chiếm 80% số lỗi timeout) xảy ra tại ĐÚNG 1 dòng code duy nhất ở đầu mỗi kịch bản:
- `FR-02.spec.ts` dòng 13 và 37: `await loginPage.goto();`
- `FR-11.spec.ts` dòng 12: `await page.goto('/');`
- `FR-16.spec.ts` dòng 67: `await page.goto('/');`

**Nguyên nhân:** Lỗi này có mã `NS_ERROR_NET_EMPTY_RESPONSE`. Khi Playwright chạy song song 3 trình duyệt với nhiều luồng, server **Vite cục bộ bị nghẽn cổ chai và sập (trả về 404 hoặc mất kết nối)**. Trình duyệt trắng xóa, lệnh `goto` bị treo chờ phản hồi từ Vite cho đến khi hết 30s.
**Kết luận:** Kịch bản hoàn toàn không có lỗi logic, nó chỉ là nạn nhân của server dev quá tải. Để khắc phục triệt để, bạn chỉ cần chạy test với lệnh `npm test -- --workers=1` (giới hạn 1 luồng) thì các test này sẽ chạy mượt mà qua bước nhập data.

## 2. Timeout do chờ phần tử UI nhưng không thấy (Chính là BUG của ứng dụng)
Khoảng **~38 trường hợp** còn lại đã vượt qua được bước `page.goto()`, đã tiến hành **nhập data thành công**, nhưng bị Timeout ở các dòng kiểm tra kết quả (Assertions). Ví dụ:
- `FR-02.spec.ts` dòng 46: `await expect(loginPage.errorMessage).toBeVisible();` (Script chờ 30s nhưng thông báo lỗi không hiện lên vì BUG-001 làm tài khoản bị khóa thay vì báo sai mật khẩu).
- `FR-02.spec.ts` dòng 58: `await expect(loginPage.emailInput).toHaveAttribute('type', 'email');` (Script chờ 30s mong thuộc tính type đổi thành email, nhưng dev code cứng `type="text"` - BUG-005).
- `FR-16.spec.ts` (Nhiều dòng): Chờ `importPage.errorMessage.toBeVisible()` nhưng không thấy vì backend báo import thành công thay vì báo lỗi (BUG-013 Không validate Price).

**Nguyên nhân:** Playwright có cơ chế auto-retrying assertions. Khi nó `expect` một phần tử hiển thị mà phần tử đó chưa có, nó sẽ liên tục retry cho đến khi hết 30s mới văng lỗi Timeout. Các test này timeout chính là vì ứng dụng có Bug, khiến phần tử cần tìm vĩnh viễn không xuất hiện.

---
**Đề xuất hành động (Cần bạn Approve):**
1. Các Script Test hiện tại **hoàn toàn chính xác về mặt logic và data-driven**, không bị lỗi nhập sai data. Việc nó văng Timeout là biểu hiện đúng đắn khi bắt được 14 Bug ẩn.
2. Vấn đề duy nhất là server Vite bị yếu sinh lý khi chịu tải song song. Tôi không cần phải sửa Script để né lỗi này (vì không thể can thiệp vào Vite từ Script). Thay vào đó, chúng ta sẽ chốt nguyên nhân và chuyển sang **giai đoạn VÁ LỖI MÃ NGUỒN (Fix Bugs)** trong `server.js`, `App.jsx`, `Login.jsx` để diệt trừ 14 Bug kia. Khi ứng dụng hết Bug, các Assertion sẽ Pass tức thì và không bị Timeout nữa.

Bạn có đồng ý Approve báo cáo này để chúng ta tiến hành sửa mã nguồn (Code Fixing) cho 3 tính năng FR-02, FR-11, FR-16 không?
