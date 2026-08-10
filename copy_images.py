import os
import shutil

mapping = {
    "BUG-001": "web-FR-02-FR-02-Đăng-nhập--97a5c-i-khoản-đã-bị-khóa-từ-lần-3-web-chromium/test-failed-1.png",
    "BUG-002": "web-FR-02-FR-02-Đăng-nhập--5bf85-khóa-locked-until---1-giây--web-chromium/test-failed-1.png",
    "BUG-003": "web-FR-02-FR-02-Đăng-nhập--4161d--TC06---Email-không-tồn-tại-web-chromium/test-failed-1.png",
    "BUG-004": "web-FR-02-FR-02-Đăng-nhập--d0384-ses-TC28---Login-page-title-web-chromium/test-failed-1.png",
    "BUG-005": "web-FR-02-FR-02-Đăng-nhập--6bbab-ssword-input-type-attribute-web-chromium/test-failed-1.png",
    "BUG-006": "web-FR-02-FR-02-Đăng-nhập--759c4-y-Cases-TC12---Mật-khẩu-sai-web-chromium/test-failed-1.png",
    "BUG-007": "web-FR-11-FR-11-Xem-lịch-s-5986b--tra-thẻ-h1-duy-nhất-FR-21--web-chromium/test-failed-1.png",
    "BUG-008": "web-FR-11-FR-11-Xem-lịch-s-799b1-V5-LB-1-0-đơn-—-Empty-State-web-chromium/test-failed-1.png",
    "BUG-009": "web-FR-11-FR-11-Xem-lịch-s-47681-rạng-thái-confirmed-màu-sắc-web-chromium/test-failed-1.png",
    "BUG-010": "web-FR-02-FR-02-Đăng-nhập--6debf-g-với-tài-khoản-User-thường-web-webkit/test-failed-1.png",
    "BUG-011": "admin-FR-16-FR-16-Import-S-48741-uối-lỗi-price-âm-—-rollback-admin-chromium/test-failed-1.png",
    "BUG-012": "admin-FR-16-FR-16-Import-S-691ea-dấu-phẩy-KHÔNG-bọc-nháy-kép-admin-chromium/test-failed-1.png",
    "BUG-013": "admin-FR-16-FR-16-Import-S-2bad5-ive-TC19---IV15-price-số-âm-admin-chromium/test-failed-1.png",
    "BUG-014": "admin-FR-16-FR-16-Import-S-1f45e-C24---IV19-category-id-rỗng-admin-chromium/test-failed-1.png",
}

src_dir = "e2e/test-results"
dest_dir = "23127378_HW04_AI_Automation_100/images"
bugs_dir = "23127378_HW04_AI_Automation_100/bugs"

os.makedirs(dest_dir, exist_ok=True)

for bug_id, image_path in mapping.items():
    full_src = os.path.join(src_dir, image_path)
    full_dest = os.path.join(dest_dir, f"{bug_id}.png")
    
    if os.path.exists(full_src):
        shutil.copy(full_src, full_dest)
        
        bug_file = os.path.join(bugs_dir, f"{bug_id}.md")
        if os.path.exists(bug_file):
            with open(bug_file, "r") as f:
                content = f.read()
            if "### Evidence" not in content:
                with open(bug_file, "a") as f:
                    f.write(f"\n\n### Evidence\n![{bug_id}](../images/{bug_id}.png)\n")
        print(f"Successfully processed {bug_id}")
    else:
        print(f"Missing: {full_src}")
