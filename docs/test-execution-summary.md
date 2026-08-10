# Test Execution Summary
**Suite:** HW04 — EShop Automation Testing
**Date:** 2026-08-09T22:05:00+07:00

## Overall Statistics
- **Total Tests Run:** 110 (Expected)
- **Total Failures:** 175 (Including retries and environment timeouts)
- **True Bugs Found:** 14

## Final Bug Classifications
- **True Bugs:** 14
  - **BUG-001 (High):** Bộ đếm sai (login_attempts tăng 2 thay vì 1)
  - **BUG-002 (High):** Thời gian khóa tài khoản là 180 giây thay vì 30 giây
  - **BUG-003 (Low):** Lỗi giao diện hiển thị sai vị trí và thiếu ký hiệu (*)
  - **BUG-004 (Low):** Tiêu đề trang hiển thị "Đăng Ký" thay vì "Đăng Nhập"
  - **BUG-005 (High):** Input fields dùng sai type (type="text") làm lộ password
  - **BUG-006 (Medium):** Frontend hiển thị lỗi chung chung thay vì lỗi từ server
  - **BUG-007 (Low):** Trang Profile thiếu thẻ H1
  - **BUG-008 (Low):** Empty State thiếu Icon minh họa
  - **BUG-009 (Low):** Màu sắc trạng thái "Confirmed" bị sai
  - **BUG-010 (Critical):** Lỗ hổng bảo mật: Thiếu Role Admin cho API Import
  - **BUG-011 (High):** Backend không dùng Transaction (Lỗi Rollback All-or-Nothing)
  - **BUG-012 (Medium):** Frontend CSV Parser lỗi khi gặp dấu phẩy bên trong ngoặc kép
  - **BUG-013 (Medium):** Backend không validate số tiền (Price)
  - **BUG-014 (Low):** Thiếu bắt buộc Category ID
- **Script Issues:** 0 (Đã fix toàn bộ trong các commit trước)
- **Environment Issues:** Khoảng ~161 trường hợp bị `Timeout` hoặc `NS_ERROR_NET_EMPTY_RESPONSE` do quá tải Vite Server chạy song song nhiều worker (không liên quan đến kịch bản lỗi). Một số lỗi `Timeout` là biểu hiện gián tiếp của các Bug Logic.

## References
- [Detailed Bug Report](bug-report.md)
- Individual Bug Files are located in `docs/bugs/` for GitHub Issue creation.
- **GitHub Issues:** Pending (Awaiting `gh` CLI installation).
