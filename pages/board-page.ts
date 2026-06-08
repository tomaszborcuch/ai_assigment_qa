import { expect, type Locator, type Page } from '@playwright/test';
import { BasePage } from './base-page';
import { CardModalComponent } from './components/card-modal.component';

export class BoardPage extends BasePage {
  readonly cardModal: CardModalComponent;

  constructor(page: Page) {
    super(page);
    this.cardModal = new CardModalComponent(page);
  }

  async expectColumnVisible(title: string): Promise<void> {
    await expect(this.columnHeading(title)).toBeVisible();
  }

  async expectCardVisible(title: string, options?: { timeout?: number }): Promise<void> {
    await expect(this.cardContainerByTitle(title)).toBeVisible(options);
  }

  async expectCardHidden(title: string, options?: { timeout?: number }): Promise<void> {
    await expect(this.cardContainerByTitle(title)).toBeHidden(options);
  }

  async expectVisibleCardCount(count: number, options?: { timeout?: number }): Promise<void> {
    await expect(this.page.locator('.kanban-card:visible')).toHaveCount(count, options);
  }

  async addCard(columnTitle: string, cardTitle: string): Promise<void> {
    const column = this.columnByTitle(columnTitle);

    await column.getByTitle('Add a card').click();
    await column.getByPlaceholder('Card title...').fill(cardTitle);
    await column.getByRole('button', { name: 'Add card', exact: true }).click();
    await this.expectCardVisible(cardTitle);
  }

  async openCard(title: string): Promise<void> {
    await this.cardContainerByTitle(title).click();
    await this.cardModal.expectVisible();
  }

  async search(query: string): Promise<void> {
    await this.page.getByPlaceholder('Search cards...').fill(query);
  }

  async clearAllFilters(): Promise<void> {
    await this.page.getByRole('button', { name: 'Clear all' }).click();
  }

  async openFilters(): Promise<void> {
    await this.page.getByRole('button', { name: /Filters/ }).click();
  }

  async selectPriorityFilter(priority: string): Promise<void> {
    await this.openFilters();
    await this.page.getByRole('button', { name: priority, exact: true }).click();
  }

  async setDueDateRange(from: string, to: string): Promise<void> {
    await this.openFilters();
    await this.page.locator('input[type="date"]').nth(0).fill(from);
    await this.page.locator('input[type="date"]').nth(1).fill(to);
  }

  async toggleSwimlanes(): Promise<void> {
    await this.page.getByRole('button', { name: /Swimlanes/ }).click();
  }

  async selectCard(title: string): Promise<void> {
    await this.cardContainerByTitle(title).locator('.kanban-card__checkbox').check();
  }

  async bulkArchiveSelectedCards(): Promise<void> {
    await this.page.getByRole('button', { name: 'Archive' }).click();
  }

  async bulkMoveSelectedCardsTo(columnTitle: string): Promise<void> {
    await this.page.getByRole('combobox').selectOption({ label: columnTitle });
  }

  async addColumnViaButton(columnTitle: string): Promise<void> {
    await this.page.getByRole('button', { name: /Add colunn|Add column/ }).click();
    await this.page.locator('input:not([placeholder="Search cards..."])').last().fill(columnTitle);
    await this.page.getByRole('button', { name: 'Add column', exact: true }).click();
  }

  async searchInputValue(): Promise<string> {
    return this.page.getByPlaceholder('Search cards...').inputValue();
  }

  async expectNoInjectedImages(): Promise<void> {
    await expect(this.page.locator('img')).toHaveCount(0);
  }

  private columnByTitle(title: string): Locator {
    return this.page.locator('.kanban-column').filter({ has: this.columnHeading(title) });
  }

  private columnHeading(title: string): Locator {
    return this.page.getByRole('heading', { name: title, exact: true });
  }

  private cardContainerByTitle(title: string): Locator {
    return this.page.locator('.kanban-card').filter({ hasText: title }).first();
  }
}
