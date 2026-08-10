import pytesseract
from PIL import Image
import os

images_dir = "23127378_HW04_AI_Automation_100/images"

for img in sorted(os.listdir(images_dir)):
    if img.endswith(".png"):
        path = os.path.join(images_dir, img)
        text = pytesseract.image_to_string(Image.open(path), lang='vie+eng')
        
        # Check for keywords
        if "Vui lòng" in text or "Đăng Nhập" in text:
            print(f"{img}: Looks like Login page")
        elif "Lịch sử" in text or "Hồ sơ" in text:
            print(f"{img}: Looks like Profile page")
        else:
            print(f"{img}: Unknown page (Text length: {len(text)})")
