import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/web/FR-02.page';

type TestFixtures = {
  loginPage: LoginPage;
  authenticatedPage: import('@playwright/test').Page;
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
