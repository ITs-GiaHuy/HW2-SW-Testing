# Test Cases cho FR-02 - Đăng nhập & Khóa tài khoản (Phiên bản Mobile - React Native)
**Phương pháp:** Domain Testing (Equivalence Partitioning & Boundary Value Analysis)
**Phạm vi:** Ứng dụng Mobile (React Native + Expo) — file `frontend-mobile/App.js`

## 1. Xác định Biến Đầu vào & Đầu ra (Step 1)

### Đầu vào (Inputs)

| # | Biến | Loại | Mô tả |
|---|------|------|--------|
| I1 | **Email** | Explicit | Trường nhập email trên form đăng nhập mobile (`TextInput`). Theo FR-02, phải có validate email (tương đương `type="email"` trên web). Trên mobile, cần xem xét `keyboardType="email-address"` hoặc validate thủ công. |
| I2 | **Mật khẩu (Password)** | Explicit | Trường nhập mật khẩu trên form mobile (`TextInput`). Cần `secureTextEntry={true}` để ẩn ký tự (tương đương `type="password"` trên web). |
| I3 | **Trạng thái tài khoản (Account Lock State)** | Implicit/State | Tài khoản đang bị khóa hay không (`locked_until` trong DB). |
| I4 | **Bộ đếm đăng nhập sai (login_attempts)** | Implicit/State | Số lần đăng nhập sai liên tiếp hiện tại (DB: `login_attempts`, mặc định = 0). |
| I5 | **Sự tồn tại của tài khoản** | Implicit/State | Email có tồn tại trong hệ thống hay không. |

### Đầu ra (Outputs)

| # | Đầu ra | Loại | Mô tả |
|---|--------|------|--------|
| O1 | **JWT Token** | Hidden | Trả về khi đăng nhập thành công, lưu vào state `token` (React state, không phải `localStorage` như web). |
| O2 | **Thông báo lỗi** | Visible | Hiển thị trên UI (phải ở **trên** nút submit theo FR-22). Trên mobile sử dụng `Text` component với style `errorBoxText`. |
| O3 | **Chuyển hướng (Navigation)** | Visible | Chuyển về màn hình Home (`setView("home")`) khi đăng nhập thành công. |
| O4 | **Cập nhật bộ đếm login_attempts** | Hidden | Tăng **đúng 1 đơn vị** khi sai; reset về 0 khi đúng. |
| O5 | **Khóa tài khoản (locked_until)** | Hidden | Set `locked_until` khi `login_attempts >= 3`, thời gian khóa **30 giây** (30000ms). |
| O6 | **Header Authorization** | Hidden | Token được gửi qua `Authorization: Bearer <token>` cho các request xác thực. |
| O7 | **secureTextEntry** | Visible | Trường mật khẩu dùng `secureTextEntry={true}` để ẩn ký tự nhập (tương đương `type="password"`). |
| O8 | **Ký hiệu bắt buộc (*)** | Visible | Tất cả trường bắt buộc phải có ký hiệu `*` bên cạnh label (FR-22). |
| O9 | **Label và Tiêu đề** | Visible | Tiêu đề form phải là "Đăng Nhập", label trường email phải là "Email" (không phải "Username"). |
| O10 | **Nút đăng nhập** | Visible | Nút submit phải nhãn tiếng Việt (FR-21: nhất quán ngôn ngữ). |

---

## 2. Phân hoạch Tương đương (Step 2)

### I1 - Email

| ID | Lớp Hợp lệ (Valid) | Lớp Không hợp lệ (Invalid) |
|---|---|---|
| EC1.1 | Email đúng format và tồn tại trong hệ thống (vd: `admin@eshop.com`, `test@eshop.com`) | — |
| EC1.2 | — | Email đúng format nhưng không tồn tại trong hệ thống (vd: `notexist@eshop.com`) |
| EC1.3 | — | Email sai format: thiếu `@` (vd: `admineshop.com`) |
| EC1.4 | — | Email sai format: thiếu domain (vd: `admin@`) |
| EC1.5 | — | Email sai format: thiếu local part (vd: `@eshop.com`) |
| EC1.6 | — | Email rỗng (empty string `""`) |
| EC1.7 | — | Email là khoảng trắng (vd: `"   "`) |

### I2 - Mật khẩu

| ID | Lớp Hợp lệ (Valid) | Lớp Không hợp lệ (Invalid) |
|---|---|---|
| EC2.1 | Mật khẩu đúng, khớp với tài khoản (vd: `Admin123!` cho `admin@eshop.com`) | — |
| EC2.2 | — | Mật khẩu sai (vd: `WrongPassword1!`) |
| EC2.3 | — | Mật khẩu rỗng (empty string `""`) |
| EC2.4 | — | Mật khẩu chỉ là khoảng trắng (vd: `"        "`) |

### I3 - Trạng thái khóa tài khoản

| ID | Lớp Hợp lệ (Valid) | Lớp Không hợp lệ (Invalid) |
|---|---|---|
| EC3.1 | Tài khoản không bị khóa (`locked_until = NULL` hoặc đã hết hạn khóa) | — |
| EC3.2 | — | Tài khoản đang bị khóa (`locked_until` > thời gian hiện tại) |

### I4 - Bộ đếm login_attempts (Giá trị biên quan trọng)

| ID | Lớp Hợp lệ (Valid) | Lớp Không hợp lệ (Invalid) |
|---|---|---|
| EC4.1 | `login_attempts = 0` (chưa sai lần nào) | — |
| EC4.2 | `login_attempts = 1` (sai 1 lần, chưa bị khóa) | — |
| EC4.3 | `login_attempts = 2` (sai 2 lần, lần sai tiếp theo sẽ khóa — **biên UB**) | — |
| EC4.4 | — | `login_attempts >= 3` (tài khoản bị khóa) |

### I5 - Sự tồn tại tài khoản

| ID | Lớp Hợp lệ (Valid) | Lớp Không hợp lệ (Invalid) |
|---|---|---|
| EC5.1 | Tài khoản tồn tại trong DB | — |
| EC5.2 | — | Tài khoản không tồn tại trong DB |

### UI/UX Constraints (FR-21, FR-22 — Đặc thù Mobile)

| ID | Điều kiện kiểm tra | Đúng (Valid) | Sai (Invalid) |
|---|---|---|---|
| EC6.1 | Trường Email có `keyboardType="email-address"` hoặc validate email trên client | Có | Không |
| EC6.2 | Trường Mật khẩu dùng `secureTextEntry={true}` | Có | Không |
| EC6.3 | Thông báo lỗi hiển thị **trên** nút submit | Đúng vị trí | Sai vị trí |
| EC6.4 | Tất cả trường bắt buộc có ký hiệu `*` | Có | Không |
| EC6.5 | Tiêu đề form là "Đăng Nhập" (tiếng Việt, nhất quán — FR-21) | Đúng | Sai |
| EC6.6 | Label trường email là "Email" (không phải "Username") | Đúng | Sai |
| EC6.7 | Nút submit nhãn tiếng Việt "Đăng Nhập" (FR-21: nhất quán ngôn ngữ) | Đúng | Sai |

---

## 3. Danh sách Test Case (Step 3 & 4)

*Lưu ý: Đã áp dụng phân tích giá trị biên (LB-1, LB, LB+1, UB-1, UB, UB+1) cho bộ đếm `login_attempts` với ngưỡng khóa = 3.*

### 3.1. Test Cases - Đăng nhập thành công (Valid Classes)

| TC ID | Mục đích test (Lớp/Biên được test) | Đầu vào (Inputs) | Kết quả mong đợi (Expected Output) |
|---|---|---|---|
| TC01 | **Happy path**: Đăng nhập thành công với tài khoản Admin (EC1.1, EC2.1, EC3.1, EC4.1, EC5.1) | Email: `admin@eshop.com`, Password: `Admin123!`, login_attempts=0, locked_until=NULL | - API trả về HTTP 200 với JWT Token<br>- Token lưu vào state `token`<br>- Chuyển về màn hình Home (`view = "home"`)<br>- Header `Authorization: Bearer <token>` được set cho các request tiếp theo |
| TC02 | Đăng nhập thành công với tài khoản User thường (EC1.1, EC2.1, EC3.1, EC4.1, EC5.1) | Email: `test@eshop.com`, Password: `Test1234!`, login_attempts=0, locked_until=NULL | - API trả về HTTP 200 với JWT Token<br>- Token lưu vào state `token`<br>- Chuyển về màn hình Home |
| TC03 | Đăng nhập thành công sau khi đã sai 1 lần (EC4.2) — reset bộ đếm | Email: `test@eshop.com`, Password: `Test1234!`, login_attempts=1, locked_until=NULL | - HTTP 200, JWT Token trả về<br>- `login_attempts` reset về **0**<br>- `locked_until` = NULL |
| TC04 | Đăng nhập thành công sau khi đã sai 2 lần (EC4.3, **biên UB-1**) — reset bộ đếm | Email: `test@eshop.com`, Password: `Test1234!`, login_attempts=2, locked_until=NULL | - HTTP 200, JWT Token trả về<br>- `login_attempts` reset về **0**<br>- `locked_until` = NULL |
| TC05 | Đăng nhập thành công sau khi hết thời gian khóa (EC3.1 — locked_until đã qua) | Email: `test@eshop.com`, Password: `Test1234!`, login_attempts=3, locked_until= (thời điểm trong quá khứ) | - HTTP 200, JWT Token trả về<br>- `login_attempts` reset về **0**<br>- `locked_until` = NULL |

### 3.2. Test Cases - Đăng nhập thất bại (Invalid Classes — Single Invalid Rule)

| TC ID | Mục đích test (Lớp/Biên được test) | Đầu vào (Inputs) | Kết quả mong đợi (Expected Output) |
|---|---|---|---|
| TC06 | **Email không tồn tại** (EC1.2, EC5.2) — tất cả input khác hợp lệ | Email: `notexist@eshop.com`, Password: `Admin123!` | - HTTP 401<br>- Thông báo lỗi chung (không tiết lộ email không tồn tại)<br>- `login_attempts` KHÔNG thay đổi (không có user để cập nhật) |
| TC07 | **Email sai format — thiếu @** (EC1.3) | Email: `admineshop.com`, Password: `Admin123!` | - Client-side validation chặn submit (validate email format)<br>- HOẶC server trả HTTP 401 nếu mobile không validate client-side |
| TC08 | **Email sai format — thiếu domain** (EC1.4) | Email: `admin@`, Password: `Admin123!` | - Client-side validation chặn submit<br>- HOẶC server trả HTTP 401 nếu mobile không validate client-side |
| TC09 | **Email sai format — thiếu local part** (EC1.5) | Email: `@eshop.com`, Password: `Admin123!` | - Client-side validation chặn submit<br>- HOẶC server trả HTTP 401 nếu mobile không validate client-side |
| TC10 | **Email rỗng** (EC1.6) | Email: `""`, Password: `Admin123!` | - Client-side validation chặn submit<br>- Thông báo trường bắt buộc |
| TC11 | **Email chỉ có khoảng trắng** (EC1.7) | Email: `"   "`, Password: `Admin123!` | - Client-side validation chặn submit (không phải email hợp lệ)<br>- Không gửi request đến server |
| TC12 | **Mật khẩu sai** (EC2.2) — lần sai đầu tiên, login_attempts=0 | Email: `test@eshop.com`, Password: `WrongPassword1!`, login_attempts=0 | - HTTP 401<br>- Thông báo lỗi hiển thị trên UI<br>- `login_attempts` tăng lên **đúng 1** (từ 0 → 1)<br>- `locked_until` = NULL |
| TC13 | **Mật khẩu rỗng** (EC2.3) | Email: `test@eshop.com`, Password: `""` | - Client-side validation chặn submit<br>- Thông báo trường bắt buộc |
| TC14 | **Mật khẩu chỉ là khoảng trắng** (EC2.4) | Email: `test@eshop.com`, Password: `"        "` | - HTTP 401 (server-side: password không khớp)<br>- Thông báo lỗi hiển thị<br>- `login_attempts` tăng lên **đúng 1** |
| TC15 | **Tài khoản đang bị khóa** (EC3.2) — đăng nhập đúng mật khẩu nhưng bị khóa | Email: `test@eshop.com`, Password: `Test1234!`, locked_until= (thời điểm trong tương lai) | - HTTP 403<br>- Thông báo: "Tài khoản đã bị khóa. Vui lòng thử lại sau."<br>- Không trả về JWT Token |
| TC16 | **Tài khoản đang bị khóa** (EC3.2) — đăng nhập sai mật khẩu khi bị khóa | Email: `test@eshop.com`, Password: `WrongPass1!`, locked_until= (thời điểm trong tương lai) | - HTTP 403<br>- Thông báo: "Tài khoản đã bị khóa. Vui lòng thử lại sau."<br>- `login_attempts` KHÔNG tăng thêm |

### 3.3. Test Cases - Phân tích Giá trị Biên cho Bộ đếm login_attempts (Ngưỡng khóa = 3)

| TC ID | Mục đích test (Lớp/Biên được test) | Đầu vào (Inputs) | Kết quả mong đợi (Expected Output) |
|---|---|---|---|
| TC17 | **Biên LB**: Sai lần 1 (login_attempts: 0→1) | Email: `test@eshop.com`, Password: `WrongPass1!`, login_attempts=0 | - HTTP 401, thông báo lỗi chung<br>- `login_attempts` = **1** (tăng đúng 1 đơn vị)<br>- `locked_until` = NULL (chưa khóa) |
| TC18 | **Biên LB+1**: Sai lần 2 (login_attempts: 1→2) | Email: `test@eshop.com`, Password: `WrongPass1!`, login_attempts=1 | - HTTP 401, thông báo lỗi chung<br>- `login_attempts` = **2** (tăng đúng 1 đơn vị)<br>- `locked_until` = NULL (chưa khóa) |
| TC19 | **Biên UB (ngưỡng khóa)**: Sai lần 3 (login_attempts: 2→3) — tài khoản bị KHÓA | Email: `test@eshop.com`, Password: `WrongPass1!`, login_attempts=2 | - HTTP 401, thông báo lỗi chung<br>- `login_attempts` = **3** (tăng đúng 1 đơn vị)<br>- `locked_until` được set = **now + 30 giây** (30000ms) |
| TC20 | **Biên UB+1**: Sai lần 4 (login_attempts: 3→?) — tài khoản đã bị khóa từ lần 3 | Email: `test@eshop.com`, Password: `WrongPass1!`, login_attempts=3, locked_until= (tương lai) | - HTTP 403<br>- Thông báo: "Tài khoản đã bị khóa. Vui lòng thử lại sau."<br>- `login_attempts` không tăng (bị chặn trước khi check password) |

### 3.4. Test Cases - Thời gian khóa tài khoản (Biên thời gian)

| TC ID | Mục đích test (Lớp/Biên được test) | Đầu vào (Inputs) | Kết quả mong đợi (Expected Output) |
|---|---|---|---|
| TC21 | **Biên thời gian**: Đăng nhập ngay trước khi hết khóa (locked_until - 1 giây) | Email: `test@eshop.com`, Password: `Test1234!`, locked_until = now + 1 giây | - HTTP 403<br>- Thông báo tài khoản bị khóa<br>- Không cho phép đăng nhập |
| TC22 | **Biên thời gian**: Đăng nhập ngay khi vừa hết khóa (locked_until = now) | Email: `test@eshop.com`, Password: `Test1234!`, locked_until = now (chính xác) | - HTTP 200, JWT Token trả về<br>- `login_attempts` reset về 0 |
| TC23 | **Biên thời gian**: Đăng nhập sau khi hết khóa 1 giây (locked_until + 1 giây) | Email: `test@eshop.com`, Password: `Test1234!`, locked_until = now - 1 giây | - HTTP 200, JWT Token trả về<br>- `login_attempts` reset về 0 |

### 3.5. Test Cases - Kiểm tra UI/UX Mobile (FR-21, FR-22)

| TC ID | Mục đích test (Lớp/Biên được test) | Đầu vào (Inputs) | Kết quả mong đợi (Expected Output) |
|---|---|---|---|
| TC24 | **Kiểm tra keyboardType của trường Email** (EC6.1) | Kiểm tra props `TextInput` cho trường Email | - Trường Email phải có `keyboardType="email-address"` để hiển thị bàn phím phù hợp<br>- Hoặc có client-side validation email format |
| TC25 | **Kiểm tra secureTextEntry của trường Mật khẩu** (EC6.2) | Kiểm tra props `TextInput` cho trường Mật khẩu | - Trường Mật khẩu phải có `secureTextEntry={true}`<br>- Ký tự nhập vào phải được ẩn (hiển thị dạng `●●●●`) |
| TC26 | **Vị trí thông báo lỗi** (EC6.3) | Đăng nhập sai, quan sát vị trí thông báo lỗi trên form | - Thông báo lỗi phải hiển thị **trên** nút submit (render trước nút trong JSX) |
| TC27 | **Ký hiệu bắt buộc** (EC6.4) | Quan sát label các trường trên form đăng nhập | - Tất cả trường bắt buộc (Email, Mật khẩu) phải có ký hiệu `*` bên cạnh label |
| TC28 | **Tiêu đề form đăng nhập** (EC6.5) | Quan sát tiêu đề đầu form | - Tiêu đề phải là "Đăng Nhập" (tiếng Việt, nhất quán) |
| TC29 | **Label trường Email** (EC6.6) | Quan sát label của trường email | - Label phải là "Email" (không phải "Username") |
| TC30 | **Nhãn nút submit** (EC6.7) | Quan sát text trên nút đăng nhập | - Nhãn nút phải là "Đăng Nhập" (tiếng Việt, nhất quán ngôn ngữ FR-21), không phải "Sign In" |

### 3.6. Test Cases - JWT Token & Authorization Header (Đặc thù Mobile)

| TC ID | Mục đích test (Lớp/Biên được test) | Đầu vào (Inputs) | Kết quả mong đợi (Expected Output) |
|---|---|---|---|
| TC31 | **Token lưu state** sau khi đăng nhập thành công | Đăng nhập thành công với `test@eshop.com` / `Test1234!` | - State `token` chứa JWT Token hợp lệ<br>- Token không rỗng, không null |
| TC32 | **Authorization header** được gửi kèm request xác thực | Sau khi đăng nhập thành công, gọi API `/api/users/me` | - Request có header `Authorization: Bearer <token>`<br>- Server trả về thông tin user (HTTP 200) |
| TC33 | **Request xác thực** khi không có token | Gọi API `/api/users/me` mà không đăng nhập (token rỗng) | - HTTP 401<br>- `{"error": "Unauthorized"}` |

---

## 4. Kiểm chứng (Verification)

- [x] Đã bao phủ toàn bộ điều kiện của FR-02.
- [x] Các lớp không hợp lệ (Invalid) được test độc lập (không gộp chung) — mỗi TC chỉ chứa **một** invalid class.
- [x] Đã test đầy đủ các giá trị biên cho `login_attempts` (0→1, 1→2, 2→3, 3→locked).
- [x] Đã test giá trị biên thời gian cho `locked_until` (trước, tại, sau thời điểm hết khóa).
- [x] Đã kiểm tra các ràng buộc UI/UX đặc thù Mobile từ FR-21, FR-22 (secureTextEntry, keyboardType, vị trí lỗi, ký hiệu *, nhất quán ngôn ngữ tiếng Việt).
- [x] Đã kiểm tra JWT Token flow đặc thù mobile (React state thay vì localStorage).
- [x] Đã bổ sung test case kiểm tra nhãn nút "Đăng Nhập" thay vì "Sign In" (FR-21: nhất quán ngôn ngữ tiếng Việt).

### Ghi chú quan trọng — Đặc thù Mobile so với Web:
- **Không có HTML5 validation**: React Native không hỗ trợ `type="email"`. Cần kiểm tra `keyboardType` và client-side validation thủ công.
- **secureTextEntry thay cho type="password"**: React Native dùng prop `secureTextEntry` trên `TextInput`.
- **State thay vì localStorage**: Token được lưu trong React state, không có `localStorage` trên React Native.
- **Alert thay vì Toast/Redirect**: Mobile app dùng `Alert.alert()` cho thông báo, và `setView()` cho điều hướng.
- **Nhất quán ngôn ngữ**: Cần kiểm tra tất cả UI text đều bằng tiếng Việt (FR-21).
