---
name: tc-parse
description: >-
  Test Case Parser & Data Extractor — Reads Markdown test case files from testcase/
  directory, parses Domain Testing format (Equivalence Partitioning & BVA tables),
  and extracts structured test data into separate .json files for data-driven
  Playwright testing. Triggers: /tc-parse, "parse test cases", "extract test data",
  "convert test cases to json".
---

# tc-parse — Test Case Parser & Data Extractor

> **Purpose:** Read test case Markdown files, parse the Domain Testing table format,
> and produce one `.json` test data file per feature — enabling fully data-driven
> Playwright scripts with zero hardcoded test data.

## When to Use

Invoke this skill **first** in the workflow, before `tc-codegen`. It is the entry
point that transforms human-written test case documents into machine-readable
test data.

**Trigger phrases:** `/tc-parse`, `parse test cases`, `extract test data`,
`convert test cases to json`, `read test cases`.

---

## Prerequisites

- Test case files exist in `testcase/` directory
- Files follow Domain Testing format with Markdown tables
- Directory `e2e/test-data/` will be created if it does not exist

---

## Input

| Source | Description |
|--------|-------------|
| `testcase/FR_*.md` | Any markdown files containing test cases following the Domain Testing format |

> **IMPORTANT:** Skip `testcase/FR_02_mobile.md` and any file matching `*_mobile.md`.
> These are mobile-platform test cases outside the scope of Playwright web testing.

---

## Processing Steps

### Step 1 — Discover Test Case Files

1. Scan `testcase/` directory for all `*.md` files
2. Filter out any file whose name contains `_mobile` (e.g., `FR_02_mobile.md`)
3. Sort remaining files alphabetically
4. Log the list of files to be processed

### Step 2 — Parse Each Test Case File

Each test case file follows the **Domain Testing** methodology with this structure:

```
# Test Cases cho FR-XX — [Feature Name]
**Phương pháp:** Domain Testing (Equivalence Partitioning & Boundary Value Analysis)

## 1. Xác định Biến Đầu vào & Đầu ra (Step 1)
### Đầu vào (Inputs)   → table of input variables
### Đầu ra (Outputs)    → table of expected outputs

## 2. Phân hoạch Tương đương (Step 2)
→ tables of equivalence partitions per input variable

## 3. Danh sách Test Case (Step 3 & 4)
### 3.x. [Category Name]
→ tables with columns: TC ID | Mục đích test | Đầu vào (Inputs) | Kết quả mong đợi
```

For each file, extract:

1. **Feature metadata:**
   - Feature ID (e.g., `FR-02`)
   - Feature title (from `# Test Cases cho FR-XX — [Title]`)
   - Target URL (from content: `/login` for FR-02, order history page for FR-11, admin for FR-16)
   - Target platform: `web`, `admin`, or `api`

2. **Input variables** from Step 1 tables:
   - Variable name, type (Explicit/Implicit/State), description

3. **Equivalence partitions** from Step 2 tables:
   - Partition ID, variable, valid class description, invalid class description

4. **Test cases** from Step 3 tables:
   - TC ID (e.g., `TC01`)
   - Purpose/title (from "Mục đích test" column)
   - Category: Determine from the section heading:
     - "thành công" / "Valid" / "Happy path" → `"positive"`
     - "thất bại" / "Invalid" / "Không hợp lệ" → `"negative"`
     - "Giá trị Biên" / "Boundary" / "Biên" → `"boundary"`
     - "UI/UX" / "FR-22" / "FR-21" → `"ui_ux"`
     - "JWT" / "Token" / "Authorization" / "Xác thực" → `"security"`
     - "Rollback" / "Transaction" → `"transaction"`
     - "Empty State" → `"boundary"`
     - "phân quyền" / "Isolation" → `"security"`
     - Other → `"functional"`
   - Priority: Derive from category:
     - `"positive"` → `"High"`
     - `"negative"` → `"High"`
     - `"boundary"` → `"Medium"`
     - `"security"` → `"High"`
     - `"ui_ux"` → `"Medium"`
     - `"functional"` → `"Medium"`
   - Input data: Parse from "Đầu vào" column. Extract key-value pairs:
     - `Email: value` → `{"email": "value"}`
     - `Password: value` → `{"password": "value"}`
     - `login_attempts=N` → `{"login_attempts": N}`
     - `locked_until=...` → `{"locked_until": "description"}`
     - For FR-16: CSV file content, token type, role
     - For FR-11: Token type, order data, user credentials
   - Expected results: Parse from "Kết quả mong đợi" column. Extract:
     - HTTP status codes → `{"httpStatus": NNN}`
     - Redirect URLs → `{"redirect": "/path"}`
     - Error messages → `{"errorMessage": "text"}`
     - UI assertions → `{"uiAssertions": [...]}`
     - State changes → `{"stateChanges": {...}}`
   - Test steps: Derive logical steps from the input/expected columns
   - Equivalence classes referenced (from "Lớp/Biên được test")


### Step 3 — Generate JSON Files

For each feature, create `e2e/test-data/FR_{XX}.data.json` with this structure:

```json
{
  "feature": "FR-02",
  "title": "Login & Account Lockout",
  "method": "Domain Testing (Equivalence Partitioning & BVA)",
  "targetUrl": "http://localhost:5173/login",
  "platform": "web",
  "totalTestCases": 33,
  "inputVariables": [
    {
      "id": "I1",
      "name": "Email",
      "type": "Explicit",
      "description": "Email input field"
    }
  ],
  "equivalencePartitions": [
    {
      "id": "EC1.1",
      "variable": "Email",
      "validClass": "Email đúng format và tồn tại",
      "invalidClass": null
    }
  ],
  "testCases": [
    {
      "id": "TC01",
      "title": "Happy path: Admin login with valid credentials",
      "category": "positive",
      "priority": "High",
      "equivalenceClasses": ["EC1.1", "EC2.1", "EC3.1", "EC4.1", "EC5.1"],
      "input": {
        "email": "admin@eshop.com",
        "password": "Admin123!",
        "login_attempts": 0,
        "locked_until": null
      },
      "steps": [
        "Navigate to /login",
        "Enter email: admin@eshop.com",
        "Enter password: Admin123!",
        "Click Login button"
      ],
      "expected": {
        "httpStatus": 200,
        "redirect": "/",
        "tokenStored": true,
        "errorMessage": null,
        "stateChanges": {
          "login_attempts": 0,
          "locked_until": null
        }
    }
  ]
}
```

### Step 4 — Generate Index File

Create `e2e/test-data/_index.json`:

```json
{
  "generatedAt": "ISO-8601 timestamp",
  "generatedBy": "tc-parse skill",
  "features": [
    {
      "id": "FR-02",
      "title": "Login & Account Lockout",
      "file": "FR_02.data.json",
      "platform": "web",
      "totalTestCases": 33,
      "categories": {
        "positive": 5,
        "negative": 11,
        "boundary": 7,
        "ui_ux": 7,
        "security": 3
      }
    }
  ],
  "summary": {
    "totalFeatures": 3,
    "totalTestCases": 102,
    "skippedFiles": ["FR_02_mobile.md"]
  }
}
```

### Step 5 — Validation

1. Verify each JSON file is valid JSON (parseable)
2. Verify TC count in JSON matches the source Markdown
3. Verify every TC has non-empty `id`, `title`, `input`, and `expected`
4. Log any parsing warnings (e.g., ambiguous input fields)

---

## Output

| File | Description |
|------|-------------|
| `e2e/test-data/FR_*.data.json` | One JSON file per parsed feature |
| `e2e/test-data/_index.json` | Metadata index summarizing all parsed features |

---

## Human Gate

After generating all JSON files, present a summary table to the user:

```
✅ tc-parse complete

| Feature | File | TCs Parsed | Categories |
|---------|------|------------|------------|
| {Feature} | {File} | {N} | {Details} |
| ...     | ...  | ... | ...        |

Skipped: FR_02_mobile.md (mobile platform — out of scope)

Review the generated JSON files and reply APPROVED or provide feedback.
```

Wait for user confirmation before proceeding to `tc-codegen`.

---

## Error Handling

- If a test case row cannot be parsed, log a warning and include the raw text in a `"rawText"` field
- If the Markdown table format is unexpected, attempt best-effort extraction and flag the TC
- Never silently drop test cases — every TC in the source must appear in the output

---

## Constraints

- **No mobile:** Skip `*_mobile.md` files entirely
- **No fabrication:** Only extract data that exists in the source files — never invent test cases
- **Preserve Vietnamese:** Keep Vietnamese text in titles and descriptions as-is
