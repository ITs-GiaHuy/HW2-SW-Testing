---
name: tc-codegen
description: >-
  Playwright Script Generator — Reads JSON test data files produced by tc-parse
  and generates data-driven Playwright TypeScript test scripts with Page Object
  Model classes, shared fixtures, and at least 3 assertion patterns. Follows
  Playwright Golden Rules. Triggers: /tc-codegen, "generate test scripts",
  "create playwright tests", "codegen", "build test code".
---

# tc-codegen — Playwright Script Generator

> **Purpose:** Transform structured JSON test data into production-quality,
> data-driven Playwright TypeScript test scripts using the Page Object Model
> pattern, with mandatory integration of ≥3 distinct assertion patterns.

## When to Use

Invoke this skill **after** `tc-parse` has produced the JSON test data files.
It is the second step in the workflow.

**Trigger phrases:** `/tc-codegen`, `generate test scripts`, `create playwright tests`,
`codegen`, `build test code`, `generate playwright code`.

---

## Prerequisites

- `tc-parse` has been executed — JSON files exist in `e2e/test-data/`
- Node.js and Playwright are installed in the `e2e/` directory
- `playwright-skill` is available as a reference (consult Golden Rules)

---

## Input

| Source | Description |
|--------|-------------|
| `e2e/test-data/*.data.json` | Parsed JSON test data files for each feature |
| `e2e/test-data/_index.json` | Feature metadata index |
| `.agents/skills/playwright-skill/SKILL.md` | Golden Rules reference |

---

## Processing Steps

### Step 1 — Read & Analyze Test Data

1. Read `_index.json` to get the list of features
2. For each feature, read its `.data.json` file
3. Analyze test cases to determine:
   - Which pages/components need POM classes
   - Which fixtures are needed (authentication, test data setup)
   - How test cases group into spec files
   - Which assertion patterns apply to each test case

### Step 2 — Consult Playwright Golden Rules

Before writing any code, read and internalize these rules from `playwright-skill`:

1. **`getByRole()` over CSS/XPath** — use semantic locators
2. **Never `page.waitForTimeout()`** — use auto-waiting assertions
3. **Web-first assertions** — `expect(locator)` auto-retries
4. **Isolate every test** — no shared mutable state
5. **`baseURL` in config** — zero hardcoded URLs
6. **Fixtures over globals** — `test.extend()` for shared state
7. **One behavior per test** — focused assertions

### Step 3 — Generate Page Object Model (POM) Classes

Create one POM class per page/component. Rules:

- Locators are `readonly` class properties
- Use semantic selectors: `getByRole()`, `getByLabel()`, `getByText()`, `getByPlaceholder()`
- **Zero assertions in POM** — POM only contains locators and actions
- Actions are `async` methods that perform user interactions
- Constructor takes `Page` as parameter

**Example POM structure:**

```typescript
// e2e/pages/web/login.page.ts
import { type Page, type Locator } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;
  readonly pageTitle: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.getByLabel('Email');
    this.passwordInput = page.getByLabel(/password|mật khẩu/i);
    this.loginButton = page.getByRole('button', { name: /login|đăng nhập/i });
    this.errorMessage = page.locator('.error-message, [role="alert"]');
    this.pageTitle = page.getByRole('heading', { level: 1 });
  }

  async goto() {
    await this.page.goto('/login');
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }
}
```

**POM files to generate:**

| File | Description |
|------|-------------|
| `e2e/pages/[platform]/[feature].page.ts` | Generated POM class for each feature |

### Step 4 — Generate Shared Fixtures

Create `e2e/fixtures/index.ts` with reusable fixtures:

```typescript
import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/web/login.page';

type TestFixtures = {
  loginPage: LoginPage;
  authenticatedPage: Page;
};

export const test = base.extend<TestFixtures>({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },
  authenticatedPage: async ({ page }, use) => {
    // Login and provide authenticated page
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(
      process.env.USER_EMAIL || 'test@eshop.com',
      process.env.USER_PASSWORD || 'Test1234!'
    );
    await page.waitForURL('/');
    await use(page);
  },
});

export { expect } from '@playwright/test';
```

### Step 5 — Generate Data-Driven Test Spec Files

For each feature, generate test spec files that:

1. **Import test data from JSON** — `import testData from '../../../test-data/FR_02.data.json'`
2. **Use `for...of` loops** to create `test()` blocks from data
3. **Never hardcode test data** — all values come from JSON
4. **Group tests by category** using `test.describe()`
5. **Capture screenshots on failure** — configured via `playwright.config.ts`

**Mandatory Assertion Patterns (≥3 required):**

Every spec file MUST use at least 3 of these patterns:

| # | Pattern | Type | Use Case | Example |
|---|---------|------|----------|--------|
| 1 | `expect(page).toHaveURL()` | Auto-retrying | Navigation/redirect | After login, verify redirect to `/` |
| 2 | `expect(locator).toBeVisible()` | Auto-retrying | UI element presence | Error message appears |
| 3 | `expect(locator).toHaveText()` | Auto-retrying | Content verification | Error message text matches |
| 4 | `expect(locator).toHaveAttribute()` | Auto-retrying | DOM attribute check | `type="email"` on input |
| 5 | `expect(response.status()).toBe()` | Non-retrying | API status code | HTTP 200/401/403 |
| 6 | `expect(locator).toHaveCount()` | Auto-retrying | Element count | Number of order rows |
| 7 | `expect(locator).toHaveCSS()` | Auto-retrying | Style verification | Badge color check |
| 8 | `expect(locator).toContainText()` | Auto-retrying | Partial text match | Contains Vietnamese label |

**Example test spec structure:**

```typescript
// e2e/tests/web/login/login.spec.ts
import { test, expect } from '../../../fixtures';
import testData from '../../../test-data/FR_02.data.json';
import { LoginPage } from '../../../pages/web/login.page';

test.describe('FR-02: Login & Account Lockout', () => {

  // Positive test cases — data-driven
  test.describe('Positive Cases', () => {
    const positiveCases = testData.testCases.filter(tc => tc.category === 'positive');

    for (const tc of positiveCases) {
      test(`${tc.id} - ${tc.title}`, async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.goto();
        await loginPage.login(tc.input.email, tc.input.password);

        // Assertion Pattern 1: Navigation
        if (tc.expected.redirect) {
          await expect(page).toHaveURL(tc.expected.redirect);
        }

        // Assertion Pattern 2: UI visibility
        if (tc.expected.tokenStored) {
          // Verify user is logged in by checking UI state
          await expect(page.getByRole('button', { name: /logout|đăng xuất/i }))
            .toBeVisible();
        }
      });
    }
  });

  // Negative test cases — data-driven
  test.describe('Negative Cases', () => {
    const negativeCases = testData.testCases.filter(tc => tc.category === 'negative');

    for (const tc of negativeCases) {
      test(`${tc.id} - ${tc.title}`, async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.goto();
        await loginPage.login(tc.input.email, tc.input.password);

        // Assertion Pattern 3: Text content
        if (tc.expected.errorMessage) {
          await expect(loginPage.errorMessage)
            .toHaveText(tc.expected.errorMessage);
        }
      });
    }
  });

  // UI/UX validation — individual tests
  test.describe('UI/UX Constraints (FR-22)', () => {
    test('TC24 - Email input type attribute', async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.goto();

      // Assertion Pattern 4: Attribute check
      await expect(loginPage.emailInput).toHaveAttribute('type', 'email');
    });
  });
});
```

**Test spec files to generate:**

| File | Feature | Approach |
|------|---------|----------|
| `e2e/tests/[platform]/[feature].spec.ts` | Feature name | Data-driven from JSON |

### Step 6 — Validate Generated Code

1. Check all imports resolve correctly
2. Verify every test case from JSON has a corresponding `test()` block
3. Verify ≥3 distinct assertion patterns are used per spec file
4. Verify zero hardcoded test data in spec files
5. Verify POM classes have zero assertions
6. Run `npx playwright test --list` to verify test discovery

---

## Output

| File | Description |
|------|-------------|
| `e2e/pages/[platform]/[feature].page.ts` | POM classes |
| `e2e/fixtures/index.ts` | Shared test fixtures |
| `e2e/tests/[platform]/[feature].spec.ts` | Test specs (data-driven) |

---

## Human Gate

After generating all files, present:

```
✅ tc-codegen complete

| Feature | Spec File | TCs Generated | Assertion Patterns Used |
|---------|-----------|---------------|------------------------|
| {Feature} | {spec.ts} | {N} | {Patterns Used} |
| ...     | ...       | ... | ... |

POM Classes: 3 | Fixtures: 1 | Total Tests: 102

Run `npx playwright test --list` to verify test discovery.
Reply APPROVED or provide feedback.
```

---

## Code Quality Rules

1. **async/await everywhere** — all Playwright interactions are async
2. **No `page.waitForTimeout()`** — use web-first assertions instead
3. **Semantic locators** — `getByRole()`, `getByLabel()`, `getByText()` preferred
4. **No hardcoded URLs** — use `baseURL` from config, paths only in `goto()`
5. **No hardcoded credentials** — use `process.env` or JSON test data
6. **TypeScript strict** — proper typing, no `any`
7. **Test isolation** — each test is independent, no shared mutable state
8. **Screenshot on failure** — configured in `playwright.config.ts`, not in test code
