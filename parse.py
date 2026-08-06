import json
import re
import os

with open("/home/giahuy/HCMUS/US-3rd/SoftwareTesting/Homeworks/HW04/testcase/FR_16.md", "r", encoding="utf-8") as f:
    text = f.read()

data = {
    "feature": "FR-16",
    "title": "Import Sản phẩm từ CSV",
    "method": "Domain Testing (Equivalence Partitioning & Boundary Value Analysis)",
    "targetUrl": "http://localhost:5174",
    "platform": "admin",
    "totalTestCases": 43,
    "inputVariables": [],
    "equivalencePartitions": [],
    "testCases": []
}

# 1. Parse Input Variables
input_vars_section = re.search(r'### Đầu vào \(Inputs\)(.*?)(?:### Đầu ra|---)', text, re.DOTALL).group(1)
for line in input_vars_section.strip().split('\n'):
    if line.startswith('| I'):
        parts = [p.strip() for p in line.split('|')]
        data["inputVariables"].append({
            "id": parts[1],
            "name": re.sub(r'\*\*(.*?)\*\*', r'\1', parts[2]),
            "type": parts[3],
            "description": parts[4]
        })

# 2. Parse Equivalence Partitions
ec_section = re.search(r'## 2\. Phân hoạch Tương đương \(Step 2\)(.*?)(?:## 3|---)', text, re.DOTALL).group(1)
current_var = ""
for line in ec_section.strip().split('\n'):
    if line.startswith('| EC'):
        parts = [p.strip() for p in line.split('|')]
        id_ = parts[1]
        var = parts[2] if parts[2] else current_var
        current_var = var
        valid = parts[3] if parts[3] else None
        invalid = parts[4] if parts[4] else None
        data["equivalencePartitions"].append({
            "id": id_,
            "variable": var,
            "validClass": valid,
            "invalidClass": invalid
        })

# 3. Parse Test Cases
# Find the start of step 3
step3_idx = text.find('## 3. Danh sách Test Case')
if step3_idx != -1:
    step3_text = text[step3_idx:]
    
    current_cat = "functional"
    for line in step3_text.split('\n'):
        if line.startswith('### Nhóm'):
            if "Xác thực" in line or "Phân quyền" in line or "Authorization" in line:
                current_cat = "security"
            elif "Rollback" in line or "Transaction" in line:
                current_cat = "transaction"
            elif "Định dạng file" in line or "Header CSV" in line or "Báo cáo" in line:
                current_cat = "functional"
            else:
                current_cat = "boundary" # Just a guess for remaining validation ones, will refine per TC
                
        if line.startswith('| TC'):
            parts = [p.strip() for p in line.split('|')]
            if len(parts) >= 5:
                tcid = parts[1]
                purpose = parts[2]
                inputs_text = parts[3]
                expected_text = parts[4]
                
                cat = current_cat
                if "Biên" in purpose:
                    cat = "boundary"
                elif "V" in purpose and "IV" not in purpose and cat == "boundary":
                    cat = "positive"
                elif "IV" in purpose and cat == "boundary":
                    cat = "negative"
                
                pri = "Medium"
                if cat in ["positive", "negative", "security"]:
                    pri = "High"
                    
                ecs = re.findall(r'(V\d+|IV\d+)', purpose)
                
                input_obj = {"raw": inputs_text}
                expected_obj = {"raw": expected_text}
                
                status_match = re.search(r'HTTP (\d+)', expected_text)
                if status_match:
                    expected_obj["httpStatus"] = int(status_match.group(1))
                    
                data["testCases"].append({
                    "id": tcid,
                    "title": purpose,
                    "category": cat,
                    "priority": pri,
                    "equivalenceClasses": ecs,
                    "input": input_obj,
                    "expected": expected_obj,
                    "steps": [
                        "Prepare file/request based on input",
                        "Send POST /api/admin/import-products",
                        "Verify response and database state"
                    ]
                })

os.makedirs("/home/giahuy/HCMUS/US-3rd/SoftwareTesting/Homeworks/HW04/e2e/test-data", exist_ok=True)
with open("/home/giahuy/HCMUS/US-3rd/SoftwareTesting/Homeworks/HW04/e2e/test-data/FR_16.data.json", "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print(f"Total test cases parsed: {len(data['testCases'])}")

categories_breakdown = {}
for tc in data['testCases']:
    c = tc['category']
    categories_breakdown[c] = categories_breakdown.get(c, 0) + 1
print(f"Categories: {categories_breakdown}")
