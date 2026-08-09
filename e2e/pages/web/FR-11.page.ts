import { type Page, type Locator } from '@playwright/test';

export class OrderHistoryPage {
  readonly page: Page;
  readonly pageTitle: Locator;
  readonly orderTable: Locator;
  readonly orderRows: Locator;
  readonly emptyStateMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pageTitle = page.getByRole('heading', { level: 1 });
    this.orderTable = page.getByRole('table');
    this.orderRows = page.getByRole('row');
    this.emptyStateMessage = page.getByText(/chưa có đơn hàng/i);
  }

  async goto() {
    await this.page.goto('/profile');
  }
}
