import os
import re

bugs_dir = "23127378_HW04_AI_Automation_100/bugs"

for filename in sorted(os.listdir(bugs_dir)):
    if filename.endswith(".md"):
        filepath = os.path.join(bugs_dir, filename)
        with open(filepath, "r") as f:
            content = f.read()
            m = re.search(r"- Test Case:\s*(.+)", content)
            tc = m.group(1) if m else "None"
            print(f"{filename}: {tc}")
