import { type Page, type Locator } from '@playwright/test';

export class ImportProductPage {
  readonly page: Page;
  readonly fileInput: Locator;
  readonly importButton: Locator;
  readonly successMessage: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.fileInput = page.locator('input[type="file"]');
    this.importButton = page.getByRole('button', { name: /import|nhập/i });
    this.successMessage = page.locator('.success-message, [role="status"], .Toastify__toast--success');
    this.errorMessage = page.locator('.error-message, [role="alert"], .Toastify__toast--error');
  }

  async goto() {
    await this.page.goto('/admin/products/import');
  }

  async uploadFile(filePath: string) {
    await this.fileInput.setInputFiles(filePath);
    await this.importButton.click();
  }
}
