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

  async expectAddColumnButtonLabel(label: string): Promise<void> {
    await expect(this.page.getByRole('button', { name: label, exact: true })).toBeVisible();
  }

  async expectColumnDescriptionVisible(columnTitle: string, description: string, policy: string): Promise<void> {
    const column = this.columnByTitle(columnTitle);

    await column.getByTitle('Column description').click();
    await expect(this.page.getByText(description, { exact: true })).toBeVisible();
    await expect(this.page.getByText(`Policy: ${policy}`, { exact: true })).toBeVisible();
  }

  async expectColumnInfoButtonVisible(columnTitle: string): Promise<void> {
    await expect(this.columnByTitle(columnTitle).getByTitle('Column description')).toBeVisible();
  }

  async renameColumn(currentTitle: string, newTitle: string): Promise<void> {
    await this.columnHeading(currentTitle).dblclick();
    await this.page.locator(`${COLUMN_SELECTOR} .kanban-column__header input`).fill(newTitle);
    await this.page.keyboard.press('Enter');
    await this.expectColumnVisible(newTitle);
  }

  async archiveColumn(columnTitle: string): Promise<void> {
    const column = this.columnByTitle(columnTitle);

    await column.getByTitle('Column settings').click();
    await column.getByRole('button', { name: 'Archive column' }).click();
    await expect(column).toBeHidden();
  }

  async dragColumnTo(sourceTitle: string, targetTitle: string): Promise<void> {
    await this.columnByTitle(sourceTitle).getByTitle('Drag column').dragTo(this.columnByTitle(targetTitle));
  }

  async expectColumnSettingsActionInViewport(columnTitle: string, actionName: string): Promise<void> {
    const column = this.columnByTitle(columnTitle);

    await column.getByTitle('Column settings').click();
    await expect(column.getByRole('button', { name: actionName })).toBeInViewport();
  }

  async expectColumnDescriptionSaveVisible(columnTitle: string, description: string): Promise<void> {
    const column = this.columnByTitle(columnTitle);

    await column.getByTitle('Column settings').click();
    await column.getByPlaceholder('Column description...').fill(description);
    await expect(column.getByRole('button', { name: /Save description|Save policy/ })).toBeVisible();
  }

  async expectCardVisible(title: string, options?: { timeout?: number }): Promise<void> {
    await expect(this.cardContainerByTitle(title)).toBeVisible(options);
  }

  async expectCardHidden(title: string, options?: { timeout?: number }): Promise<void> {
    await expect(this.cardContainerByTitle(title)).toBeHidden(options);
  }

  async expectCardTextVisible(title: string, text: string): Promise<void> {
    await expect(this.cardContainerByTitle(title).getByText(text, { exact: true })).toBeVisible();
  }

  async expectCardTextMatches(title: string, pattern: RegExp): Promise<void> {
    await expect(this.cardContainerByTitle(title).getByText(pattern)).toBeVisible();
  }

  async expectCardTitleDoesNotSuggestDoubleClick(title: string): Promise<void> {
    await expect(this.cardContainerByTitle(title).getByText(title, { exact: true })).not.toHaveAttribute(
      'title',
      /Double-click/i,
    );
  }

  async expectVisibleCardCount(count: number, options?: { timeout?: number }): Promise<void> {
    await expect(this.cardContainers().filter({ visible: true })).toHaveCount(count, options);
  }

  async addCard(columnTitle: string, cardTitle: string): Promise<void> {
    const column = this.columnByTitle(columnTitle);

    await this.openCardComposer(columnTitle);
    await column.getByPlaceholder('Card title...').fill(cardTitle);
    await column.getByRole('button', { name: 'Add card', exact: true }).click();
    await this.expectCardVisible(cardTitle);
  }

  async expectAddCardDisabled(columnTitle: string): Promise<void> {
    await expect(this.columnByTitle(columnTitle).getByRole('button', { name: '+ Add card' })).toBeDisabled();
  }

  async expectAddCardEnabled(columnTitle: string): Promise<void> {
    await expect(this.columnByTitle(columnTitle).getByRole('button', { name: '+ Add card' })).toBeEnabled();
  }

  async expectWipWarningVisible(columnTitle: string, warning: string): Promise<void> {
    await expect(this.columnByTitle(columnTitle).getByText(warning)).toBeVisible();
  }

  async setColumnWipLimit(columnTitle: string, limit: number, hardBlock = false): Promise<void> {
    const column = this.columnByTitle(columnTitle);

    await column.getByTitle('Column settings').click();
    await column.locator('input[type="number"]').fill(String(limit));
    await column
      .locator('label')
      .filter({ hasText: 'Hard block at limit' })
      .getByRole('checkbox')
      .setChecked(hardBlock);
    await column.getByRole('button', { name: 'Save WIP' }).click();
  }

  async openCardComposer(columnTitle: string): Promise<void> {
    await this.columnByTitle(columnTitle).getByTitle('Add a card').click();
  }

  async attemptAddCardWithoutTitle(columnTitle: string): Promise<void> {
    const column = this.columnByTitle(columnTitle);

    await this.openCardComposer(columnTitle);
    await column.getByRole('button', { name: 'Add card', exact: true }).click();
  }

  async expectCardComposerVisible(columnTitle: string): Promise<void> {
    await expect(this.columnByTitle(columnTitle).getByPlaceholder('Card title...')).toBeVisible();
  }

  async expectCardComposerFieldVisible(columnTitle: string, placeholder: string): Promise<void> {
    await expect(this.columnByTitle(columnTitle).getByPlaceholder(placeholder)).toBeVisible();
  }

  async openCard(title: string): Promise<void> {
    await this.cardContainerByTitle(title).click();
    await this.cardModal.expectVisible();
  }

  async dragCardToColumn(cardTitle: string, columnTitle: string): Promise<void> {
    await this.cardContainerByTitle(cardTitle)
      .getByTitle('Drag card')
      .dragTo(this.columnByTitle(columnTitle).locator('.kanban-column__cards'));
  }

  async dragCardToSwimlane(cardTitle: string, swimlaneTitle: string, columnTitle: string): Promise<void> {
    await this.cardContainerByTitle(cardTitle)
      .getByTitle('Drag card')
      .dragTo(this.swimlaneColumnByTitle(swimlaneTitle, columnTitle).locator('.kanban-column__cards'));
  }

  async dragCardOntoCard(sourceTitle: string, targetTitle: string): Promise<void> {
    await this.cardContainerByTitle(sourceTitle).getByTitle('Drag card').dragTo(this.cardContainerByTitle(targetTitle));
  }

  async search(query: string): Promise<void> {
    await this.page.getByPlaceholder('Search cards...').fill(query);
  }

  async clearAllFilters(): Promise<void> {
    await this.page.getByRole('button', { name: 'Clear all' }).click();
  }

  async openFilters(): Promise<void> {
    if (
      !(await this.page
        .getByRole('button', { name: 'Low', exact: true })
        .isVisible()
        .catch(() => false))
    ) {
      await this.page.getByRole('button', { name: /Filters/ }).click();
    }
  }

  async expectBlockedFilterLabelVisible(label: string): Promise<void> {
    await this.openFilters();
    await expect(this.page.getByRole('button', { name: label, exact: true })).toBeVisible();
  }

  async selectPriorityFilter(priority: string): Promise<void> {
    await this.openFilters();
    await this.page.getByRole('button', { name: priority, exact: true }).click();
  }

  async selectBlockedFilter(): Promise<void> {
    await this.openFilters();
    await this.page.getByRole('button', { name: /^(app\.filters\.blocked_only\.label|Blocked only)$/ }).click();
  }

  async selectNotBlockedFilter(): Promise<void> {
    await this.openFilters();
    await this.page.getByRole('button', { name: 'Not blocked' }).click();
  }

  async setDueDateRange(from: string, to: string): Promise<void> {
    await this.openFilters();
    await this.page.locator('input[type="date"]').nth(0).fill(from);
    await this.page.locator('input[type="date"]').nth(1).fill(to);
  }

  async toggleSwimlanes(): Promise<void> {
    await this.page.getByRole('button', { name: /Swimlanes/ }).click();
  }

  async expectSwimlanesToggleVisible(label: string): Promise<void> {
    await expect(this.page.getByRole('button', { name: label, exact: true })).toBeVisible();
  }

  async addSwimlane(title: string): Promise<void> {
    await this.page.getByRole('button', { name: '+ Swimlane', exact: true }).click();
    await this.page.getByPlaceholder('Swimlane name...').fill(title);
    await this.page.getByRole('button', { name: 'Add', exact: true }).click();
    await expect(this.page.getByText(title, { exact: true })).toBeVisible();
  }

  async pressShortcut(key: string): Promise<void> {
    await this.page.keyboard.press(key);
  }

  async expectSearchFocused(): Promise<void> {
    await expect(this.page.getByPlaceholder('Search cards...')).toBeFocused();
  }

  async expectCommandPaletteVisible(): Promise<void> {
    await expect(this.page.getByText(/command palette|keyboard shortcuts|save view/i).first()).toBeVisible();
  }

  async keyboardMoveCard(
    title: string,
    direction: 'ArrowDown' | 'ArrowLeft' | 'ArrowRight' | 'ArrowUp',
  ): Promise<void> {
    const dragHandle = this.cardContainerByTitle(title).getByTitle('Drag card');

    await dragHandle.focus();
    await this.page.keyboard.press('Space');
    await this.page.keyboard.press(direction);
    await this.page.keyboard.press('Space');
  }

  async expectLiveRegionContains(text: string): Promise<void> {
    await expect(this.page.getByRole('status')).toContainText(text);
  }

  async expectEmptyStateGuidanceVisible(): Promise<void> {
    await expect(this.page.getByText(/tip|sample|template/i).first()).toBeVisible();
  }

  async expectDisplayModeToggleVisible(): Promise<void> {
    await expect(this.page.getByRole('button', { name: /compact|expanded/i }).first()).toBeVisible();
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
    await expect(this.page.locator(`${CARD_SELECTOR} img`)).toHaveCount(0);
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

  private swimlaneColumnByTitle(swimlaneTitle: string, columnTitle: string): Locator {
    return this.page
      .locator('.board__swimlane-row')
      .filter({ hasText: swimlaneTitle })
      .locator(COLUMN_SELECTOR)
      .filter({ has: this.columnHeading(columnTitle) });
  }
}
