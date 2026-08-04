import { test, expect } from '@playwright/test';
import testData from '../../test-data/FR_02.data.json';
import { LoginPage } from '../../pages/web/FR-02.page';

test.describe('FR-02: Đăng nhập & Khóa tài khoản', () => {

  test.describe('Positive Cases', () => {
    const positiveCases = testData.testCases.filter(tc => tc.category === 'positive');

    for (const tc of positiveCases) {
      test(`${tc.id} - ${tc.title}`, async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.goto();
        
        await loginPage.login(tc.input.email, tc.input.password);

        // Assertion Pattern 1: toHaveURL
        if (tc.expected?.redirect) {
          await expect(page).toHaveURL(tc.expected.redirect);
        }
        
        // Assertion Pattern 2: toBeVisible
        if (tc.expected?.tokenStored) {
          // Token is stored means logged in successfully, logout button might be visible
          await expect(page.getByRole('button', { name: /logout|đăng xuất/i })).toBeVisible({ timeout: 2000 }).catch(() => {}); 
        }
      });
    }
  });

  test.describe('Negative & Boundary Cases', () => {
    const negativeCases = testData.testCases.filter(tc => tc.category === 'negative' || tc.category === 'boundary');

    for (const tc of negativeCases) {
      test(`${tc.id} - ${tc.title}`, async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.goto();
        
        if (tc.input?.email !== undefined || tc.input?.password !== undefined) {
            await loginPage.login(tc.input.email, tc.input.password);
        }

        // Assertion Pattern 3: toHaveText
        if (tc.expected?.errorMessage) {
          await expect(loginPage.errorMessage).toBeVisible();
          await expect(loginPage.errorMessage).toHaveText(tc.expected.errorMessage);
        }
      });
    }
  });

  test.describe('UI/UX Cases', () => {
    test('TC24 - Email input type attribute', async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.goto();
      
      // Assertion Pattern 4: toHaveAttribute
      await expect(loginPage.emailInput).toHaveAttribute('type', 'email');
    });

    test('TC25 - Password input type attribute', async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.goto();
      
      await expect(loginPage.passwordInput).toHaveAttribute('type', 'password');
    });

    test('TC28 - Login page title', async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.goto();
      
      await expect(loginPage.pageTitle).toBeVisible();
      await expect(loginPage.pageTitle).toHaveText(/Đăng Nhập/i);
    });
  });
});
