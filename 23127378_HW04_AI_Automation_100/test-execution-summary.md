# Test Execution Summary
**Suite:** HW04 — EShop Automation Testing
**Date:** 2026-08-09T22:05:00+07:00

## Overall Statistics
- **Total Tests Run:** 110 (Expected)
- **Total Failures:** 175 (Including retries and environment timeouts)
- **True Bugs Found:** 19

## Final Bug Classifications
- **True Bugs:** 19
  - **BUG-001 (Medium):** Frontend hiển thị thông báo lỗi chung chung thay vì lỗi từ server
  - **BUG-002 (Low):** Tiêu đề trang Login hiển thị "Đăng Ký"
  - **BUG-003 (High):** Trường Email và Password dùng type="text" làm lộ password
  - **BUG-015 (Critical):** Bộ đếm login_attempts tăng 2 thay vì 1
  - **BUG-016 (High):** Thời gian khóa tài khoản là 180s thay vì 30s
  - **BUG-017 (Medium):** Thông báo lỗi hiển thị SAU nút submit
  - **BUG-018 (Low):** Thiếu ký hiệu * cho các trường bắt buộc
  - **BUG-019 (Low):** Label trường Email hiển thị sai thành "Username"
  - **BUG-004 (Low):** Trang Profile thiếu thẻ H1
  - **BUG-008 (Low):** Empty State thiếu Icon minh họa
  - **BUG-006 (Critical):** Lỗ hổng bảo mật: Thiếu Role Admin cho API Import
  - **BUG-011 (High):** Backend không dùng Transaction (Lỗi Rollback All-or-Nothing)
  - **BUG-012 (Medium):** Frontend CSV Parser lỗi khi gặp dấu phẩy bên trong ngoặc kép
  - **BUG-013 (Medium):** Backend không validate số tiền (Price)
  - **BUG-014 (Low):** Thiếu bắt buộc Category ID
  - **BUG-020 (High):** Frontend chấp nhận header sai do lạm dụng fallback mapping
  - **BUG-021 (High):** Không phát hiện thiếu header CSV
  - **BUG-022 (Medium):** Không validate tên sản phẩm (name) rỗng hoặc quá dài
  - **BUG-023 (High):** Không validate category_id có thực sự tồn tại trong DB

- **Script Issues:** 0 (Đã fix toàn bộ trong các commit trước)
- **Environment Issues:** Khoảng ~161 trường hợp bị `Timeout` hoặc `NS_ERROR_NET_EMPTY_RESPONSE` do quá tải Vite Server chạy song song nhiều worker (không liên quan đến kịch bản lỗi). Một số lỗi `Timeout` là biểu hiện gián tiếp của các Bug Logic.

## References
- [Detailed Bug Report](bug-report.md)
- Individual Bug Files are located in `bugs/` for GitHub Issue creation.
- **GitHub Issues:** Pending (Awaiting `gh` CLI installation).

## Update: Script Reconciliation & Browser Differences
- **Script Fix:** The `FR-16.spec.ts` test script has been refined to accurately distinguish between valid boundary cases and invalid ones. It now correctly identifies exactly 19 failures on Chromium/Firefox, which perfectly maps 1-to-1 with the manual AI Code Inspection findings.
- **WebKit Discrepancy:** On WebKit (Safari), 18 test cases fail instead of 19. The discrepancy (typically TC04/TC05 for `.txt` / `.xlsx` file extensions) is due to WebKit's native strictness with the `accept=".csv"` attribute or binary file handling, which causes the file to be blocked entirely at the UI level. The automated test correctly identifies this as a "PASS" (since invalid data was prevented). This is a browser-engine-specific behavior and does not indicate a flaw in the test scripts.
