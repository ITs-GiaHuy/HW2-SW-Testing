import os
import re

bugs_dir = "23127378_HW04_AI_Automation_100/bugs"

for filename in sorted(os.listdir(bugs_dir)):
    if filename.endswith(".md"):
        filepath = os.path.join(bugs_dir, filename)
        with open(filepath, "r") as f:
            content = f.read()
            # Extract bug description
            m1 = re.search(r"## Bug Description\n(.*?)(?=\n##|$)", content, re.DOTALL)
            desc = m1.group(1).strip() if m1 else "None"
            
            # Extract test case
            m2 = re.search(r"- Test Case:\s*(.+)", content)
            tc = m2.group(1) if m2 else "None"
            
            print(f"{filename}: [{tc}] {desc[:80]}...")
