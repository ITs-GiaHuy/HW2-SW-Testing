import { test, expect } from '@playwright/test';
import testData from '../../test-data/FR_11.data.json';
import { OrderHistoryPage } from '../../pages/web/FR-11.page';

test.describe('FR-11: Xem lịch sử đơn hàng', () => {

  const setupLogin = async (page: any, request: any, email = 'test@eshop.com', password = 'Test1234!') => {
    const apiUrl = process.env.API_BASE_URL || 'http://127.0.0.1:3000';
    const res = await request.post(`${apiUrl}/api/login`, { data: { email, password } });
    if (res.ok()) {
      const body = await res.json();
      await page.goto('/');
      await page.evaluate((token: string) => localStorage.setItem('token', token), body.token);
    }
  };

  // Security Cases
  test.describe('Security Cases', () => {
    const securityCases = testData.testCases.filter((tc: any) => tc.category === 'security');

    for (const tc of securityCases) {
      test(`${tc.id} - ${tc.title}`, async ({ page, request }) => {
        if (tc.id === 'TC01' || tc.id === 'TC02' || tc.id === 'TC03' || tc.id === 'TC04') {
          const headers: Record<string, string> = {};
          if (tc.input?.authorization) {
            headers['Authorization'] = tc.input.authorization;
          }
          const apiUrl = process.env.API_BASE_URL || 'http://127.0.0.1:3000';
          const response = await request.get(`${apiUrl}/api/orders/my-orders`, { headers });
          // Assertion Pattern 1: HTTP Status code check
          expect(response.status()).toBe(tc.expected.httpStatus);
        } else if (tc.id === 'TC12' || tc.id === 'TC13') {
          // Security checks for cross-user order visibility
          await setupLogin(page, request, 'admin@eshop.com', 'Admin123!');
          const orderPage = new OrderHistoryPage(page);
          await orderPage.goto();
          await expect(orderPage.pageTitle).toBeVisible();
          // Admin shouldn't see test@eshop.com's orders
          await expect(orderPage.emptyStateMessage).toBeVisible();
        } else {
          await setupLogin(page, request);
          const orderPage = new OrderHistoryPage(page);
          await orderPage.goto();
          // Assertion Pattern 2: Visibility check
          await expect(orderPage.pageTitle).toBeVisible();
        }
      });
    }
  });

  // Positive Cases
  test.describe('Positive Cases', () => {
    const positiveCases = testData.testCases.filter((tc: any) => tc.category === 'positive');

    for (const tc of positiveCases) {
      test(`${tc.id} - ${tc.title}`, async ({ page, request }) => {
        if (tc.id === 'TC14') {
          await setupLogin(page, request, 'admin@eshop.com', 'Admin123!');
        } else {
          await setupLogin(page, request);
        }

        const orderPage = new OrderHistoryPage(page);
        await orderPage.goto();
        
        // Assertion Pattern 3: Count check
        if (tc.id === 'TC05') {
          // Seeded DB has 5 orders for test@eshop.com
          await expect(orderPage.orderRows).toHaveCount(6); // Header + 5 rows
        }
        
        // Assertion Pattern 4: Text Content check
        if (tc.id === 'TC06') {
           await expect(orderPage.pageTitle).toHaveText(/Lịch sử đơn hàng/i);
        }
      });
    }
  });

  // UI/UX Cases
  test.describe('UI/UX Cases', () => {
    const uiUxCases = testData.testCases.filter((tc: any) => tc.category === 'ui_ux');

    for (const tc of uiUxCases) {
      test(`${tc.id} - ${tc.title}`, async ({ page, request }) => {
        await setupLogin(page, request);
        const orderPage = new OrderHistoryPage(page);
        await orderPage.goto();

        // Assertion Pattern 5: CSS Property check
        if (tc.id === 'TC07') {
          const badge = page.getByText(/Đã xác nhận/i).first();
          await expect(badge).toHaveCSS('background-color', /rgb|rgba/);
        }

        if (tc.id === 'TC18') {
          await expect(orderPage.pageTitle).toHaveCount(1);
        }
      });
    }
  });

  // Boundary Cases
  test.describe('Boundary Cases', () => {
    const boundaryCases = testData.testCases.filter((tc: any) => tc.category === 'boundary');

    for (const tc of boundaryCases) {
      test(`${tc.id} - ${tc.title}`, async ({ page, request }) => {
        if (tc.id === 'TC11') {
          // Log in as a user with 0 orders (admin) to check empty state
          await setupLogin(page, request, 'admin@eshop.com', 'Admin123!');
        } else {
          await setupLogin(page, request);
        }

        const orderPage = new OrderHistoryPage(page);
        await orderPage.goto();

        if (tc.id === 'TC11') {
          await expect(orderPage.emptyStateMessage).toBeVisible();
        }
      });
    }
  });

  // Functional Cases
  test.describe('Functional Cases', () => {
    const functionalCases = testData.testCases.filter((tc: any) => tc.category === 'functional');

    for (const tc of functionalCases) {
      test(`${tc.id} - ${tc.title}`, async ({ page, request }) => {
        await setupLogin(page, request);
        const orderPage = new OrderHistoryPage(page);
        await orderPage.goto();
        await expect(orderPage.orderTable).toBeVisible();
      });
    }
  });
});
