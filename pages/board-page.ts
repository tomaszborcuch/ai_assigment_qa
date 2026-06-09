import { expect, type Locator, type Page } from '@playwright/test';
import { BasePage } from './base-page';
import { CardModalComponent } from './components/card-modal.component';

const COLUMN_SELECTOR = '.kanban-column';
const CARD_SELECTOR = '.kanban-card';

export class BoardPage extends BasePage {
  readonly cardModal: CardModalComponent;

  constructor(page: Page) {
    super(page);
    this.cardModal = new CardModalComponent(page);
  }

  async expectColumnVisible(title: string): Promise<void> {
    await expect(this.columnHeading(title)).toBeVisible();
  }

  async expectColumnDescriptionVisible(columnTitle: string, description: string, policy: string): Promise<void> {
    const column = this.columnByTitle(columnTitle);

    await column.getByTitle('Column description').click();
    await expect(this.page.getByText(description, { exact: true })).toBeVisible();
    await expect(this.page.getByText(`Policy: ${policy}`, { exact: true })).toBeVisible();
  }

  async expectCardVisible(title: string, options?: { timeout?: number }): Promise<void> {
    await expect(this.cardContainerByTitle(title)).toBeVisible(options);
  }

  async expectCardHidden(title: string, options?: { timeout?: number }): Promise<void> {
    await expect(this.cardContainerByTitle(title)).toBeHidden(options);
  }

  async expectVisibleCardCount(count: number, options?: { timeout?: number }): Promise<void> {
    await expect(this.cardContainers().filter({ visible: true })).toHaveCount(count, options);
  }

  async addCard(columnTitle: string, cardTitle: string): Promise<void> {
    const column = this.columnByTitle(columnTitle);

    await column.getByTitle('Add a card').click();
    await column.getByPlaceholder('Card title...').fill(cardTitle);
    await column.getByRole('button', { name: 'Add card', exact: true }).click();
    await this.expectCardVisible(cardTitle);
  }

  async expectAddCardDisabled(columnTitle: string): Promise<void> {
    await expect(this.columnByTitle(columnTitle).getByRole('button', { name: '+ Add card' })).toBeDisabled();
  }

  async expectWipWarningVisible(columnTitle: string, warning: string): Promise<void> {
    await expect(this.columnByTitle(columnTitle).getByText(warning)).toBeVisible();
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

  async selectBlockedFilter(): Promise<void> {
    await this.openFilters();
    await this.page.getByRole('button', { name: /^(app\.filters\.blocked_only\.label|Blocked only)$/ }).click();
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
    await this.cardContainerByTitle(title).getByRole('checkbox').check();
  }

  async bulkArchiveSelectedCards(): Promise<void> {
    await this.page.getByRole('button', { name: 'Archive' }).click();
  }

  async bulkMoveSelectedCardsTo(columnTitle: string): Promise<void> {
    await this.page.getByRole('combobox').selectOption({ label: columnTitle });
  }

  async addColumnViaButton(columnTitle: string): Promise<void> {
    await this.page.getByRole('button', { name: /Add colunn|Add column/ }).click();
    await this.page.getByPlaceholder('Column name...').fill(columnTitle);
    await this.page.getByRole('button', { name: 'Add column', exact: true }).click();
  }

  async searchInputValue(): Promise<string> {
    return this.page.getByPlaceholder('Search cards...').inputValue();
  }

  async expectNoInjectedImages(): Promise<void> {
    await expect(this.page.getByRole('img')).toHaveCount(0);
  }

  private columnByTitle(title: string): Locator {
    return this.page.locator(COLUMN_SELECTOR).filter({ has: this.columnHeading(title) });
  }

  private columnHeading(title: string): Locator {
    return this.page.getByRole('heading', { name: title, exact: true });
  }

  private cardContainerByTitle(title: string): Locator {
    return this.cardContainers().filter({ hasText: title }).first();
  }

  private cardContainers(): Locator {
    return this.page.locator(CARD_SELECTOR);
  }
}
