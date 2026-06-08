import { expect, type Locator, type Page } from '@playwright/test';
import type { Priority } from '../../utils/board-state';

export class CardModalComponent {
  private readonly modal: Locator;

  constructor(private readonly page: Page) {
    this.modal = this.page.locator('.modal');
  }

  async expectVisible(): Promise<void> {
    await expect(this.modal).toBeVisible();
  }

  async updateTitle(title: string): Promise<void> {
    await this.modal.locator('input[placeholder="Card title"]').fill(title);
  }

  async updateDescription(description: string): Promise<void> {
    await this.modal.locator('textarea[placeholder="Add a detailed description..."]').fill(description);
  }

  async markBlocked(reason: string, dependency: string): Promise<void> {
    await this.modal.locator('label:has-text("Blocked") input[type="checkbox"]').check();
    await this.modal.locator('textarea[placeholder="Reason for being blocked..."]').fill(reason);
    await this.modal.locator('input[placeholder="Dependency link (URL or card #)"]').fill(dependency);
  }

  async selectPriority(priority: Priority): Promise<void> {
    await this.modal.locator('select').nth(0).selectOption(priority);
  }

  async selectColumn(columnId: string): Promise<void> {
    await this.modal.locator('select').nth(1).selectOption(columnId);
  }

  async setDueDate(dueDate: string): Promise<void> {
    await this.modal.locator('input[type="date"]').fill(dueDate);
  }

  async save(): Promise<void> {
    await this.modal.getByRole('button', { name: 'Save changes' }).click();
    await expect(this.modal).toBeHidden();
  }

  async closeWithEscape(): Promise<void> {
    await this.page.keyboard.press('Escape');
    await expect(this.modal).toBeHidden();
  }
}
