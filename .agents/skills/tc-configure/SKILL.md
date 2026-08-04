---
name: tc-configure
description: >-
  Playwright Configuration & Multi-browser Setup — Creates or updates
  playwright.config.ts with multi-browser projects (Chromium, Firefox, WebKit),
  HTML Reporter with custom metadata displaying StudentID, screenshot/trace
  settings, and environment variable configuration. Triggers: /tc-configure,
  "configure playwright", "setup multi-browser", "configure reporter".
---

# tc-configure — Playwright Configuration & Multi-browser Setup

> **Purpose:** Set up `playwright.config.ts` with multi-browser execution (≥3 browsers),
> HTML Reporter displaying "Run by: {StudentID}", and proper screenshot/trace
> configuration for automated bug evidence collection.

## When to Use

Invoke this skill **after** `tc-codegen` has generated the test files.
It configures the execution environment before running the suite.

**Trigger phrases:** `/tc-configure`, `configure playwright`, `setup multi-browser`,
`configure reporter`, `setup browsers`.

---

## Prerequisites

- `tc-codegen` has been executed — test files exist in `e2e/tests/`
- Playwright is installed: `npx playwright install`
- Student knows their StudentID

---

## Input

| Source | Description |
|--------|-------------|
| `e2e/tests/` | Generated test spec files (to determine project structure) |
| `HW04-Requirement.md` | StudentID display requirement |
| User input | StudentID value |

---

## Processing Steps

### Step 0 — Ask for StudentID

Before generating the config, ask the user:

```
Please provide your StudentID (e.g., 22120xxx) for the HTML report metadata.
```

### Step 1 — Generate playwright.config.ts

Create `e2e/playwright.config.ts` with the following configuration:

```typescript
import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '.env') });

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  
  // HTML Reporter with StudentID metadata
  reporter: [
    ['html', {
      open: 'never',
      outputFolder: 'playwright-report',
    }],
    ['list'],
    ['json', {
      outputFile: 'results.json',
    }],
  ],

  // Custom metadata — displayed in HTML report
  metadata: {
    'Run by': process.env.STUDENT_ID || '{STUDENT_ID}',
    'Project': 'EShop Web Automation Testing — HW04',
    'Timestamp': new Date().toISOString(),
    'Environment': process.env.CI ? 'CI' : 'Local',
  },

  use: {
    // Base URLs — no hardcoded URLs in tests
    baseURL: process.env.WEB_BASE_URL || 'http://localhost:5173',
    
    // Screenshot on failure for bug evidence
    screenshot: 'only-on-failure',
    
    // Trace on first retry for debugging
    trace: 'on-first-retry',
    
    // Video on failure for bug evidence
    video: 'on-first-retry',
    
    // Extra HTTP headers
    extraHTTPHeaders: {
      'Accept': 'application/json',
    },
  },

  // Multi-browser projects — 3 browsers × all features = ≥9 runs
  projects: [
    // ── Web Frontend (Customer) ──
    {
      name: 'web-chromium',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: process.env.WEB_BASE_URL || 'http://localhost:5173',
      },
      testMatch: /tests\/(web)\/.*\.spec\.ts/,
    },
    {
      name: 'web-firefox',
      use: {
        ...devices['Desktop Firefox'],
        baseURL: process.env.WEB_BASE_URL || 'http://localhost:5173',
      },
      testMatch: /tests\/(web)\/.*\.spec\.ts/,
    },
    {
      name: 'web-webkit',
      use: {
        ...devices['Desktop Safari'],
        baseURL: process.env.WEB_BASE_URL || 'http://localhost:5173',
      },
      testMatch: /tests\/(web)\/.*\.spec\.ts/,
    },

    // ── Admin Frontend ──
    {
      name: 'admin-chromium',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: process.env.ADMIN_BASE_URL || 'http://localhost:5174',
      },
      testMatch: /tests\/(admin)\/.*\.spec\.ts/,
    },
    {
      name: 'admin-firefox',
      use: {
        ...devices['Desktop Firefox'],
        baseURL: process.env.ADMIN_BASE_URL || 'http://localhost:5174',
      },
      testMatch: /tests\/(admin)\/.*\.spec\.ts/,
    },
    {
      name: 'admin-webkit',
      use: {
        ...devices['Desktop Safari'],
        baseURL: process.env.ADMIN_BASE_URL || 'http://localhost:5174',
      },
      testMatch: /tests\/(admin)\/.*\.spec\.ts/,
    },
  ],
});
```

### Step 2 — Generate .env File

Create `e2e/.env` (and `e2e/.env.example` for version control):

```env
# Student identification — displayed in HTML report
STUDENT_ID={StudentID provided by user}

# SUT URLs
WEB_BASE_URL=http://localhost:5173
ADMIN_BASE_URL=http://localhost:5174
API_BASE_URL=http://localhost:3000

# Test credentials
USER_EMAIL=test@eshop.com
USER_PASSWORD=Test1234!
ADMIN_EMAIL=admin@eshop.com
ADMIN_PASSWORD=Admin123!
```

### Step 3 — Verify Browser Installation

Run the following commands:

```bash
cd e2e
npx playwright install chromium firefox webkit
```

### Step 4 — Verify Configuration

Run verification commands:

```bash
# List all projects
npx playwright test --list

# Verify each browser project is recognized
npx playwright test --list --project=web-chromium
npx playwright test --list --project=web-firefox
npx playwright test --list --project=web-webkit
npx playwright test --list --project=admin-chromium
npx playwright test --list --project=admin-firefox
npx playwright test --list --project=admin-webkit
```

---

## Multi-browser Run Calculation

| Feature | Test Files | Chromium | Firefox | WebKit | Total Runs |
|---------|-----------|----------|---------|--------|------------|
| {Feature} | `tests/[platform]/[feature]/*.spec.ts` | ✅ | ✅ | ✅ | 3 |
| ... | ... | ✅ | ✅ | ✅ | ... |
| **Total** | | | | | **≥ 9** |

---

## Output

| File | Description |
|------|-------------|
| `e2e/playwright.config.ts` | Full configuration with 6 browser projects |
| `e2e/.env` | Environment variables with StudentID |
| `e2e/.env.example` | Template for version control |

---

## HTML Report Verification

After running tests, the HTML report at `e2e/playwright-report/index.html` must show:

- **"Run by: {StudentID}"** in the report metadata section
- **ISO timestamp** of the test run
- Results grouped by project (browser)
- Screenshots attached to failed tests
- Traces available for retried tests

To verify: `npx playwright show-report`

---

## Human Gate

After configuration:

```
✅ tc-configure complete

Config: e2e/playwright.config.ts
Browsers: Chromium, Firefox, WebKit (6 projects total)
Reporter: HTML + JSON + List
Metadata: "Run by: {StudentID}"
Screenshots: only-on-failure
Traces: on-first-retry

Minimum browser runs: 9 (3 features × 3 browsers)

Run `npx playwright test --list` to verify.
Reply APPROVED or provide feedback.
```

---

## Constraints

- **Minimum 3 browsers:** Chromium, Firefox, WebKit — non-negotiable
- **Minimum 9 runs:** Each feature on all 3 browsers
- **StudentID must be visible:** In HTML report metadata
- **No hardcoded URLs in tests:** All URLs from config/env
- **Screenshot on failure:** Mandatory for bug evidence
