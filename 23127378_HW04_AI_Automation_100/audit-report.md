**Khoa Công nghệ Thông tin (FIT) – Trường Đại học Khoa học Tự nhiên (HCMUS)**

**CS423 / CSC13003 – Kiểm chứng Phần mềm (AI-augmented · 2026\)**

**CHÍNH SÁCH AI · BIỂU MẪU — 2026 v1.0**

# **AI Audit Report — Mẫu 5 mục cho mỗi Artifact**


## **1\. Thông tin Sinh viên**

| Mục | Giá trị |
| :---- | :---- |
| **Họ tên sinh viên (in hoa):** | NGUYỄN GIA HUY |
| **MSSV:** | 23127378 |
| **Lớp / Khoá:** | 23KTPM2 |
| **Mã bài tập (ví dụ HW\#00, HW\#02):** | HW\#04 |
| **Ngày làm bài:** | 10/08/2026 |
| **Công cụ AI đã dùng:** | Gemini 3.1 Pro, Claude Opus 4.6 |
| **Kiểm chứng AI:** | \[x\] Có  \[ \] Không |

## **2\. Hướng dẫn (đọc trước khi điền)**

* Thêm 1 hàng cho mỗi artifact AI sinh (test case, script, checklist, OpenAPI spec, JMeter plan…).  
* Dán nguyên văn prompt — KHÔNG paraphrase.  
* Dán nguyên văn output AI (hoặc kèm screenshot có chú thích trong báo cáo).  
* Gắn nhãn: VALID / INVALID / INCOMPLETE.  
* Lý do phải dẫn chiếu slide, mục ISTQB, hoặc RFC kỹ thuật.  
* Hiển thị bản sửa với phần thay đổi được tô sáng.  
* Hàng mẫu in nghiêng — thay trước khi nộp.

## **3\. Bảng Audit — 1 hàng / artifact**

| (1) Prompt + Công cụ | (2) Output AI | (3) Verdict | (4) Lý do (ISTQB) | (5) Bản SV sửa |
| :---- | :---- | :---- | :---- | :---- |
| **Tool: Gemini 3.1 Pro**<br>Thời gian: ~06:17 04/08/2026<br>**Prompt**: Yêu cầu thiết kế workflow AI Agent đọc test case và sinh kịch bản Playwright. *"Skill không cần test mobile. Bỏ qua mobile"*, *"Trước khi tạo github issue phải hỏi tôi trước"* | Lên kế hoạch (`implementation_plan.md`) xây dựng 5 skills (tc-parse, tc-codegen, tc-configure, tc-execute, tc-report). Khởi tạo các file cấu trúc cơ bản. | INCOMPLETE | Lúc đầu AI định tự động hóa tất cả test case (bao gồm cả Mobile) và tự động mở GitHub Issue. Điều này vi phạm nguyên tắc kiểm soát của con người (Human-in-the-loop) và vượt quá phạm vi bài tập Web Testing. | User đã chủ động giới hạn scope (bỏ qua mobile) và đặt ra "Human Gate" (cổng xác nhận của người dùng) trước bước Report. Kế hoạch được AI cập nhật tuân thủ tuyệt đối. |
| **Tool: Gemini 3.1 Pro**<br>Thời gian: 06:36 04/08/2026<br>**Prompt**: *"không có playwright skill à, tại sao"* | Trả lời rằng `playwright-skill` đang nằm ở thư mục reference gốc `_agents/`, sau đó AI tự động copy sang `.agents/skills/` để đồng bộ. | VALID | AI phụ thuộc vào khả năng tự động khám phá (auto-discover) thư mục của hệ thống, nhưng về mặt tổ chức dự án, việc để sót skill nền tảng ra ngoài thư mục active `.agents/skills/` làm giảm tính nhất quán của workflow. | Lệnh `cp -r` được thực thi để đưa `playwright-skill` (chứa 78 file guide/Golden Rules) vào đúng thư mục cấu trúc, đảm bảo Workflow 6-skills hoàn chỉnh. |
| **Tool: Gemini 3.1 Pro**<br>Thời gian: 06:52 04/08/2026<br>**Prompt**: *"Tại sao trong skill parse trong template của test case lại có "knownBugs"..."* | Giải thích mục đích là để AI lưu lại các bug tĩnh có sẵn trong Markdown, truyền ngữ cảnh cho bước `tc-report` nhằm tự động map lỗi fail trong script với bug thực tế. | VALID | AI đã suy nghĩ hơi "over-engineer" (thiết kế vượt yêu cầu) bằng cách gộp logic ánh xạ bug ngay từ khâu Parse dữ liệu test (vi phạm nguyên tắc Single Responsibility). | (Dẫn đến quyết định loại bỏ ở bước sau để tách biệt trách nhiệm của các skills). |
| **Tool: Gemini 3.1 Pro**<br>Thời gian: 06:55 04/08/2026<br>**Prompt**: *"bỏ qua knownBugs, và kiểm tra xem các skill khác có bị ảnh hưởng gì ko"* | Chạy lệnh `multi_replace_file_content` xóa block `"knownBugs"` khỏi template JSON của `tc-parse` và hướng dẫn lại luồng đọc chéo (Cross-Reference) cho `tc-report`. | INCOMPLETE | Việc giữ `knownBugs` trong JSON khiến cấu trúc dữ liệu bị phình to không cần thiết. Việc loại bỏ giúp `tc-parse` thuần túy làm nhiệm vụ trích xuất Test Data, nhường việc đối chiếu bug lại cho `tc-report` đọc trực tiếp từ Markdown gốc. | Đã xóa 11 dòng JSON template và chỉ dẫn trong `tc-parse/SKILL.md`. Xác nhận `tc-report` hoạt động độc lập không bị ảnh hưởng. |
| **Tool: Gemini 3.1 Pro**<br>Thời gian: 06:56 04/08/2026<br>**Prompt**: *"Phần Input đang bị gán cứng &#124; Source &#124; Description &#124; ... testcase/FR_02.md ..."* | Đồng loạt sửa 5 file SKILL.md. Đổi các tên tính năng cố định (FR_02, FR_11, FR_16) thành các wildcard tổng quát như `{Feature}`, `FR_*.md`, `*.data.json`. | INCOMPLETE | AI ban đầu vi phạm nguyên tắc thiết kế công cụ (Reusability). Workflow skills sinh ra bị "Hardcoded" (gán cứng) cho bài tập HW04 thay vì có thể tái sử dụng cho mọi bộ test case tương tự trong tương lai. | Dùng tính năng Replace để tổng quát hóa (Generic) lại toàn bộ bảng Input, Output, và Report ở cả 5 skills, biến chúng thành các Template độc lập. |
| **Tool: Gemini 3.1 Pro**<br>Thời gian: 15:55 04/08/2026<br>**Prompt**: "Kiểm tra test result xem có lỗi do script ko..." (Test Web FR-02 fail) | N/A | VALID | **Lỗi do Web sai Đặc tả (SRS).** Script tìm ô "Email" và nút "Đăng nhập" (theo SRS), nhưng lập trình viên làm ra ô "Username" và nút "Sign In". | Giữ nguyên script (vì script bám sát SRS). Khuyên dùng lệnh `/tc-report` để xuất báo cáo Bug bắt dev sửa giao diện. |
| **Tool: Gemini 3.1 Pro**<br>Thời gian: 16:10 04/08/2026<br>**Prompt**: "Sửa lại cho hoàn chỉnh" (Test Web FR-11 fail) | Thêm `test.beforeEach()` gọi API ngầm để lấy token và `localStorage.setItem('token', token)` | INCOMPLETE | **Lỗi do Script.** Tương tự FR-16, script quên đăng nhập trước khi xem lịch sử đơn hàng, và test API bảo mật chọc nhầm cổng 5173. | Sửa cổng API và chèn hook `beforeEach` bơm thẳng Token vào trình duyệt để test giao diện. |
| **Tool: Gemini 3.1 Pro**<br>Thời gian: 16:12 04/08/2026<br>**Prompt**: Cung cấp Log báo cáo 8 test fail của FR-11. | Cập nhật `test.beforeEach` cho block Security Cases. | VALID | 2 lỗi do Script thiếu login ở nhóm Security. 3 lỗi do Web code sai SRS (thẻ `<h2>` thay vì `<h1>`). 3 lỗi do tài khoản test chưa có dữ liệu mua hàng. | Sửa 2 lỗi của script. Hướng dẫn tạo thêm đơn hàng mẫu để test pass, và báo cáo Bug Web. |
| **Tool: Antigravity (Gemini)**<br>Thời gian: 09/08/2026<br>**Prompt**: "Kiểm tra lại test xem có đúng là phát hiện ra đúng tất cả các bug không... Bổ sung các BUG còn thiếu vào báo cáo... Phân tích chênh lệch so với HW02" | Báo cáo ban đầu nhận diện chưa đủ True Bugs do bị nhầm lẫn giữa lỗi kịch bản và lỗi hệ thống (rất nhiều test case bị Timeout). | INCOMPLETE | AI chưa phân tích kỹ sự chênh lệch so với kết quả test thủ công (HW02). Lỗi Timeout chưa được phân loại rõ ràng. | AI đọc lại HW02, rà soát log, tổng hợp chính xác 14 True Bugs, loại trừ lỗi kịch bản và cập nhật chi tiết vào `docs/bug-report.md`. |
| **Tool: Antigravity (Gemini)**<br>Thời gian: 09/08/2026<br>**Prompt**: "Cần chú ý yêu cầu - The HTML reports, which must contain **'Run by: {StudentID}'** together with an ISO timestamp... visibly displays" | Cấu hình file `playwright.config.ts` để chèn thông tin sinh viên vào phần `metadata` ngầm của báo cáo Playwright. | INCOMPLETE | Dữ liệu có lưu nhưng giao diện HTML Report chưa hiển thị tên và MSSV đủ nổi bật (visibly displays) để Giảng viên/TA dễ thấy ngay lập tức. | AI sửa lại cấu hình, chèn chuỗi `"Run by: 23127378 - Nguyễn Gia Huy"` trực tiếp vào thuộc tính `title` của HTML Reporter để hiện rõ ngay trên giao diện. |
| **Tool: Antigravity (Gemini)**<br>Thời gian: 10/08/2026<br>**Prompt**: "Kiểm tra lại tại sao `npm test -- FR-02.spec.ts --project=web-firefox` Tất cả đều fail" | Phát hiện lỗi `NS_ERROR_NET_EMPTY_RESPONSE`. AI tự động đổi `127.0.0.1` thành `localhost` trong file config để tương thích IPv6 với Vite. | INCOMPLETE | Dù đã đổi IP thành localhost, Firefox vẫn văng lỗi kết nối và fail 100% các test case. Chromium thì bình thường. | AI phân tích sâu hơn, phát hiện nguyên nhân gốc do set cứng header `Accept: application/json`. Đã xóa cấu hình này ở global, giúp Firefox chạy qua thành công. |
| **Tool: Antigravity (Gemini)**<br>Thời gian: 10/08/2026<br>**Prompt**: "Tại sao chromium chỉ fail 10 mà fire fox fail 11 kiểm tra... và so sánh tìm ra kết luận" | Phân tích log tìm ra `TC02` pass ở Chromium nhưng fail ở Firefox/WebKit do chạy song song (`fullyParallel: true`) gây ra Race Condition (Dùng chung data). | INCOMPLETE | AI xác định đúng bệnh nhưng lại đưa ra hướng giải quyết sai vai trò (Đề xuất sửa mã nguồn Backend của ứng dụng để fix bug này). | Người dùng chấn chỉnh (Đây là bài tập Testing, không sửa mã nguồn Web). AI nhận lỗi và đề xuất 3 giải pháp Automation. Cuối cùng, thực hiện Giải pháp 1: Viết script `global-setup.ts` để Reset Database tự động. |
| **Tool: Antigravity (Gemini)**<br>Thời gian: 10/08/2026<br>**Prompt**: "Tôi chạy lệnh npm test -- FR-02.spec.ts --project=web-webkit --workers=1 mà. sao vẫn lỗi" | AI giải thích nguyên nhân do Test State Pollution (Backend vẫn lưu trạng thái khóa tài khoản 3 phút từ lần chạy Chromium trước đó). | VALID | Lời giải thích logic, làm rõ được lý do vì sao chạy tuần tự (workers=1) trên trình duyệt mới vẫn tạch Test Case 02. | Xác nhận việc tạo cơ chế Database Teardown (Global Setup) là phương pháp tối ưu và chính xác nhất cho Automation Framework thay vì chờ 3 phút. |
| **Tool: Gemini 3.1 Pro (High)**<br>Thời gian: 11:52 10/08/2026<br>**Prompt**: Cung cấp log lỗi Playwright của TC06 và TC18 (lỗi không tìm thấy thẻ `<h1>`).<br><br>Thời gian: 11:53 10/08/2026<br>**Prompt**: "Không sửa web" | Sửa Page Object `FR-11.page.ts`: Đổi locator từ tìm thẻ `<h1>` sang tìm thẻ heading theo text: `this.pageTitle = page.getByRole('heading', { name: /Lịch sử đơn hàng/i });` | INVALID | AI cố gắng sửa test script để "lách" qua lỗi và ép cho test pass (do không được sửa code web). Hành động này vi phạm nguyên tắc kiểm thử cơ bản: Test phải fail để bắt lỗi nếu ứng dụng thực tế vi phạm Requirements (ở đây là FR-21). | Chú đã phải đính chính và giải thích lại mục đích thực sự của các test case này. |
| **Tool: Gemini 3.1 Pro (High)**<br>Thời gian: 11:57 10/08/2026<br>**Prompt**: "Đáng lẽ TC18 phải fail chú... vi phạm FR-21. và TC11... phải fail chú (thiếu icon/illustration... vi phạm FR-24)" | 1. Trả lại locator cũ: `this.pageTitle = page.getByRole('heading', { level: 1 });` (để TC18 fail).<br>2. Thêm locator và assertion vào TC11: `await expect(orderPage.emptyStateIcon).toBeVisible();` (để TC11 fail do thiếu icon). | VALID | Đã hiểu đúng Tư duy Kiểm thử (Testing Mindset): Mục đích của E2E Test là phơi bày lỗi của ứng dụng (bảo vệ Requirements) chứ không phải bao che lỗi để test luôn pass (xanh). | Kịch bản test đã được cập nhật thành công, các test case fail đúng như kỳ vọng. Sẵn sàng để xuất Bug Report cho đội Front-end. |

## **4\. Tổng kết Độ chính xác AI**

Tổng hợp verdict từ Mục 3 và điền vào bảng dưới.

| Chỉ số | Số lượng | Tỉ lệ |
| :---- | :---- | :---- |
| **Tổng artifact AI sinh đã audit** | 15 | 100% |
| **VALID (đúng, dùng nguyên)** | 6 | 40.0% |
| **INVALID (sai; loại bỏ)** | 1 | 6.7% |
| **INCOMPLETE (chấp nhận sau khi sửa)** | 8 | 53.3% |

## **5\. Kết luận — Khi nào nên / không nên dùng AI?**

Qua quá trình thực hiện bài tập, có thể thấy AI cực kỳ **mạnh** trong các công việc tự động hóa và lặp đi lặp lại như: tạo script từ kịch bản có sẵn, parse test data từ markdown sang JSON, và phân tích log để tìm nguyên nhân lỗi.
Tuy nhiên, AI thường mắc nhiều **sai sót về ngữ cảnh**. Điển hình như việc tự ý chọn locator theo giao diện web thực tế thay vì bám sát tài liệu đặc tả, dẫn đến test fail trước cả khi chạy data-driven. Bên cạnh đó, AI hay gặp trục trặc ở các cấu hình  nhỏ gọn như mạng lưới IPv6/localhost
**Khuyến nghị:** Cần kết hợp chặt chẽ sự kiểm soát của con người. Người dùng nên coi AI là công cụ sinh code thô, phải liên tục rà soát các config nhỏ và chiến lược chọn locator để đảm bảo script kiểm thử phơi bày được lỗi thực sự của ứng dụng thay vì tự động lách lỗi để chạy cho "xanh".

## **6\. Mandatory Disclosure (dán nguyên văn)**

*"Toàn bộ test scripts, cấu hình Playwright, báo cáo lỗi và test data được sinh phiên bản đầu bởi các công cụ AI. Tuy nhiên, tôi đã trực tiếp review, phát hiện nhiều điểm bất thường khi chạy script (như test bị fail do cấu hình sai, state database bị ô nhiễm, hoặc AI cố ý sửa locator để lách lỗi của Web). Tôi đã chủ động đưa ra các prompt để hướng dẫn AI sửa lại cho đúng với Tư duy Kiểm thử (Testing Mindset). Phần viết kết luận do tôi tự viết dựa trên quan sát thực tế. AI Audit Report chi tiết đính kèm ở Phụ lục A. Tôi cam đoan không dùng AI để sinh bất kỳ artifact nào thuộc danh mục bị cấm."*

## **Chữ ký**

| Họ tên sinh viên (in hoa): | GIA HUY |
| :---- | :---- |
| **MSSV:** | 23127378 |
| **Lớp / Khoá:** | 23KTPM2 |
| **Môn học:** | CS423 / CSC13003 – Kiểm chứng Phần mềm |
| **Giảng viên:** |  |
| **Ngày:** | 10/08/2026 |
| **Chữ ký:** | *GiaHuy* |

## **Tham khảo**

* Kharbach, M. (2026). AI Use Policy Templates for Higher Education. CC BY-NC-SA 4.0.  
* ISTQB Foundation Level Syllabus (latest version).  
* Hardman, P. (2025). A Post-AI Learning Taxonomy.  
* Fuster Rabella, M. (2025). OECD Education Working Paper No. 338\.  
* Perkins, M., Roe, J., & Furze, L. (2025). AI Assessment Scale.  
* Anthropic (2025). Building reliable AI test agents — engineering blog.  
* DeepEval & Promptfoo documentation — testing frameworks for LLM systems.