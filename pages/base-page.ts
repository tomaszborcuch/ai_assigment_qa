import { expect, type Page } from '@playwright/test';
import { STORAGE_KEY, type KanbanStore } from '../utils/board-state';

export abstract class BasePage {
  protected constructor(protected readonly page: Page) {}

  async openWithState(state?: KanbanStore): Promise<void> {
    await this.page.addInitScript(
      ({ key, value }) => {
        if (sessionStorage.getItem('kanban-test-state-seeded')) {
          return;
        }

        localStorage.clear();

        if (value) {
          localStorage.setItem(key, value);
        }

        sessionStorage.setItem('kanban-test-state-seeded', 'true');
      },
      { key: STORAGE_KEY, value: state ? JSON.stringify(state) : null },
    );

    await this.page.goto('/');
    await this.waitForPageReady();
  }

  async waitForPageReady(): Promise<void> {
    await expect(this.page.getByText('Kanban Board').first()).toBeVisible();
  }

  async reload(): Promise<void> {
    await this.page.reload();
    await this.waitForPageReady();
  }

  async getStoredState(): Promise<KanbanStore> {
    return this.page.evaluate((key) => {
      const rawState = localStorage.getItem(key);

      if (!rawState) {
        throw new Error(`Missing localStorage state for key: ${key}`);
      }

      return JSON.parse(rawState) as KanbanStore;
    }, STORAGE_KEY);
  }
}
