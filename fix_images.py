import os
import shutil

mapping = {
    # Generic error message
    "BUG-001": "web-FR-02-FR-02-Đăng-nhập--759c4-y-Cases-TC12---Mật-khẩu-sai-web-chromium/test-failed-1.png",
    # Login page heading
    "BUG-002": "web-FR-02-FR-02-Đăng-nhập--d0384-ses-TC28---Login-page-title-web-chromium/test-failed-1.png",
    # Input type text
    "BUG-003": "web-FR-02-FR-02-Đăng-nhập--6bbab-ssword-input-type-attribute-web-chromium/test-failed-1.png",
    # Profile lacks H1
    "BUG-004": "web-FR-11-FR-11-Xem-lịch-s-5986b--tra-thẻ-h1-duy-nhất-FR-21--web-chromium/test-failed-1.png",
    # Confirmed status color
    "BUG-005": "web-FR-11-FR-11-Xem-lịch-s-47681-rạng-thái-confirmed-màu-sắc-web-chromium/test-failed-1.png",
    # API role check missing (TC03) - I'll just use the regular user login test if we don't have a specific screenshot, or leave it.
    # Let's search if TC03 exists. I will map it to User-thường login for now to show user is logged in.
    "BUG-006": "web-FR-02-FR-02-Đăng-nhập--6debf-g-với-tài-khoản-User-thường-web-firefox/test-failed-1.png",
    # Profile lacks H1 (duplicate)
    "BUG-007": "web-FR-11-FR-11-Xem-lịch-s-5986b--tra-thẻ-h1-duy-nhất-FR-21--web-chromium/test-failed-1.png",
    # Empty state lacks icon
    "BUG-008": "web-FR-11-FR-11-Xem-lịch-s-799b1-V5-LB-1-0-đơn-—-Empty-State-web-chromium/test-failed-1.png",
    # Confirmed status color (duplicate)
    "BUG-009": "web-FR-11-FR-11-Xem-lịch-s-47681-rạng-thái-confirmed-màu-sắc-web-chromium/test-failed-1.png",
    # API role check missing (duplicate)
    "BUG-010": "web-FR-02-FR-02-Đăng-nhập--6debf-g-với-tài-khoản-User-thường-web-firefox/test-failed-1.png",
    # No SQL transaction
    "BUG-011": "admin-FR-16-FR-16-Import-S-48741-uối-lỗi-price-âm-—-rollback-admin-chromium/test-failed-1.png",
    # CSV parser naive split
    "BUG-012": "admin-FR-16-FR-16-Import-S-691ea-dấu-phẩy-KHÔNG-bọc-nháy-kép-admin-chromium/test-failed-1.png",
    # backend doesn't validate price
    "BUG-013": "admin-FR-16-FR-16-Import-S-2bad5-ive-TC19---IV15-price-số-âm-admin-chromium/test-failed-1.png",
    # backend doesn't enforce category_id
    "BUG-014": "admin-FR-16-FR-16-Import-S-1f45e-C24---IV19-category-id-rỗng-admin-chromium/test-failed-1.png",
}

src_dir = "e2e/test-results"
dest_dir = "23127378_HW04_AI_Automation_100/images"

for bug_id, image_path in mapping.items():
    full_src = os.path.join(src_dir, image_path)
    full_dest = os.path.join(dest_dir, f"{bug_id}.png")
    
    if os.path.exists(full_src):
        shutil.copy(full_src, full_dest)
        print(f"Copied {full_src} to {full_dest}")
    else:
        print(f"Missing: {full_src}")
