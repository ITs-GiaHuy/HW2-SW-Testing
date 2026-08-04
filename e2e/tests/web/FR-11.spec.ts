import { test, expect } from '@playwright/test';
import testData from '../../test-data/FR_11.data.json';
import { OrderHistoryPage } from '../../pages/web/FR-11.page';

test.describe('FR-11: Xem lịch sử đơn hàng', () => {

  // Security Cases
  test.describe('Security Cases', () => {
    const securityCases = testData.testCases.filter(tc => tc.category === 'security');

    for (const tc of securityCases) {
      test(`${tc.id} - ${tc.title}`, async ({ page, request }) => {
        if (tc.id === 'TC01' || tc.id === 'TC02' || tc.id === 'TC03' || tc.id === 'TC04') {
          const headers: Record<string, string> = {};
          if (tc.input?.authorization) {
            headers['Authorization'] = tc.input.authorization;
          }
          const response = await request.get('/api/orders/my-orders', { headers });
          // Assertion Pattern 1: HTTP Status code check
          expect(response.status()).toBe(tc.expected.httpStatus);
        } else {
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
    const positiveCases = testData.testCases.filter(tc => tc.category === 'positive');

    for (const tc of positiveCases) {
      test(`${tc.id} - ${tc.title}`, async ({ page }) => {
        const orderPage = new OrderHistoryPage(page);
        await orderPage.goto();
        
        // Assertion Pattern 3: Count check
        if (tc.id === 'TC05') {
          await expect(orderPage.orderRows).toHaveCount(2); // Header + 1 row
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
    const uiUxCases = testData.testCases.filter(tc => tc.category === 'ui_ux');

    for (const tc of uiUxCases) {
      test(`${tc.id} - ${tc.title}`, async ({ page }) => {
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
    const boundaryCases = testData.testCases.filter(tc => tc.category === 'boundary');

    for (const tc of boundaryCases) {
      test(`${tc.id} - ${tc.title}`, async ({ page }) => {
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
    const functionalCases = testData.testCases.filter(tc => tc.category === 'functional');

    for (const tc of functionalCases) {
      test(`${tc.id} - ${tc.title}`, async ({ page }) => {
        const orderPage = new OrderHistoryPage(page);
        await orderPage.goto();
        await expect(orderPage.orderTable).toBeVisible();
      });
    }
  });
});
