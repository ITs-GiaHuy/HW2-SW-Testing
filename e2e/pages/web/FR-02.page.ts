import { type Page, type Locator } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;
  readonly pageTitle: Locator;
  readonly requiredFields: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.locator('input').nth(0);
    this.passwordInput = page.locator('input').nth(1);
    this.loginButton = page.getByRole('button', { name: /sign in/i });
    this.errorMessage = page.locator('.text-red-700');
    this.pageTitle = page.getByRole('heading', { level: 2 });
    this.requiredFields = page.locator('.required, [required]');
  }

  async goto() {
    await this.page.goto('/login');
  }

  async login(email?: string, password?: string) {
    if (email !== undefined) await this.emailInput.fill(email);
    if (password !== undefined) await this.passwordInput.fill(password);
    await this.loginButton.click();
  }
}
