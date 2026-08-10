import os
import re

bugs_dir = "23127378_HW04_AI_Automation_100/bugs"

for filename in os.listdir(bugs_dir):
    if filename.endswith(".md"):
        filepath = os.path.join(bugs_dir, filename)
        with open(filepath, "r") as f:
            content = f.read()
        
        # Remove everything from "## Screenshot" up to the next heading or end of file
        # Since we know "### Evidence" follows it, we can lookahead for it.
        new_content = re.sub(r"## Screenshot.*?(?=### Evidence)", "", content, flags=re.DOTALL)
        
        # If there's extra whitespace before Evidence, clean it up
        new_content = re.sub(r"\n{3,}### Evidence", "\n\n### Evidence", new_content)
        
        with open(filepath, "w") as f:
            f.write(new_content)
        print(f"Processed {filename}")
