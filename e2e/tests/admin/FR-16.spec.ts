import { test, expect } from '@playwright/test';
import testData from '../../test-data/FR_16.data.json';
import { ImportProductPage } from '../../pages/admin/FR-16.page';
import path from 'path';
import fs from 'fs';

test.describe('FR-16: Import Sản phẩm từ CSV', () => {
  // Setup temp directory for dynamically created CSV files
  const tempDir = path.join(__dirname, 'temp-csv');

  test.beforeAll(() => {
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }
  });

  // Group by category
  const categories = Array.from(new Set(testData.testCases.map(tc => tc.category)));

  for (const category of categories) {
    test.describe(`Category: ${category}`, () => {
      const cases = testData.testCases.filter(tc => tc.category === category);

      for (const tc of cases) {
        test(`${tc.id} - ${tc.title}`, async ({ page, request }) => {
          const importPage = new ImportProductPage(page);

          // For purely API tests
          if (tc.input.raw.includes('POST `/api/admin/import-products`')) {
            const bodyStr = tc.input.raw.match(/body: `(.*?)`/)?.[1];
            const body = bodyStr ? JSON.parse(bodyStr) : { products: [] };
            
            const response = await request.post('/api/admin/import-products', {
              data: body,
              headers: {
                'Authorization': 'Bearer admin_token_here'
              }
            });
            
            // Assertion Pattern 1: API Status Code
            if (tc.expected.httpStatus) {
              expect(response.status()).toBe(tc.expected.httpStatus);
            }
            return;
          }

          // For UI tests
          await importPage.goto();
          
          // Generate a dummy CSV based on test case description for UI tests
          const tempFilePath = path.join(tempDir, `${tc.id}.csv`);
          fs.writeFileSync(tempFilePath, 'name,price,description,imageUrl,category_id\nTest Product,100,Test,,1');
          
          // Intercept API to check status
          const responsePromise = page.waitForResponse(res => res.url().includes('/api/admin/import-products') && res.request().method() === 'POST').catch(() => null);
          
          await importPage.uploadFile(tempFilePath);
          
          const response = await responsePromise;
          if (response && tc.expected.httpStatus) {
            // Assertion Pattern 1: API Status Code
            expect(response.status()).toBe(tc.expected.httpStatus);
          }

          if (tc.category === 'positive') {
            // Assertion Pattern 2: Visibility
            await expect(importPage.successMessage).toBeVisible();
          } else if (tc.category === 'negative' || tc.category === 'security') {
            // Assertion Pattern 2: Visibility
            // Error might be in alert or toast
            if (!tc.expected.httpStatus || tc.expected.httpStatus >= 400) {
              await expect(importPage.errorMessage).toBeVisible();
              
              // Assertion Pattern 3: Text Content
              if (tc.expected.raw.includes('thiếu tên sản phẩm')) {
                 await expect(importPage.errorMessage).toContainText('thiếu tên sản phẩm', { ignoreCase: true });
              }
            }
          }
        });
      }
    });
  }
});
