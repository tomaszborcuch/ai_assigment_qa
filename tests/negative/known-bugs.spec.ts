import { test, expect } from '../../fixtures/board.fixture';
import {
  COLUMN_IDS,
  DEFAULT_SWIMLANE_ID,
  createBoardState,
  createCard,
  createColumn,
  createSwimlane,
} from '../../utils/board-state';

test.describe('Known bugs', () => {
  test('BUG-001: uses In progress as the default middle column', async ({ boardPage }) => {
    await boardPage.openWithState(createBoardState());

    await boardPage.expectColumnVisible('In progress');
  });

  test('BUG-002: spells the add-column button correctly', async ({ boardPage }) => {
    await boardPage.openWithState(createBoardState());

    await boardPage.expectAddColumnButtonLabel('+ Add column');
  });

  test('BUG-003: creates a column using the add-column button', async ({ boardPage }) => {
    await boardPage.openWithState(createBoardState());

    await boardPage.addColumnViaButton('Review');

    await boardPage.expectColumnVisible('Review');
  });

  test('FR1: drag-and-drop reorders columns', async ({ boardPage }) => {
    await boardPage.openWithState(createBoardState());

    await boardPage.dragColumnTo('Done', 'To Do');

    const columns = (await boardPage.getStoredState()).state.boards[0].columns;
    expect(columns.find((column) => column.id === COLUMN_IDS.done)).toEqual(expect.objectContaining({ order: 0 }));
  });

  test('BUG-004: displays a user-facing blocked filter label', async ({ boardPage }) => {
    await boardPage.openWithState(createBoardState());

    await boardPage.expectBlockedFilterLabelVisible('Blocked only');
  });

  test('BUG-005: N shortcut starts the new-card flow', async ({ boardPage }) => {
    await boardPage.openWithState(createBoardState());

    await boardPage.pressShortcut('N');

    await boardPage.expectCardComposerVisible('To Do');
  });

  test('FR shortcuts: F focuses global search', async ({ boardPage }) => {
    await boardPage.openWithState(createBoardState());

    await boardPage.pressShortcut('F');

    await boardPage.expectSearchFocused();
  });

  test('FR shortcuts: E opens quick edit for the focused card', async ({ boardPage }) => {
    await boardPage.openWithState(
      createBoardState({
        cards: [createCard(1, { title: 'Shortcut edit card' })],
      }),
    );

    await boardPage.pressShortcut('Tab');
    await boardPage.pressShortcut('E');

    await boardPage.cardModal.expectVisible();
  });

  test('FR shortcuts: S opens save-view flow', async ({ boardPage }) => {
    await boardPage.openWithState(createBoardState());

    await boardPage.pressShortcut('S');

    await boardPage.expectCommandPaletteVisible();
  });

  test('FR shortcuts: question mark opens help or command palette', async ({ boardPage }) => {
    await boardPage.openWithState(createBoardState());

    await boardPage.pressShortcut('?');

    await boardPage.expectCommandPaletteVisible();
  });

  test('BUG-006: empty columns show guided tips or sample cards', async ({ boardPage }) => {
    await boardPage.openWithState(createBoardState());

    await boardPage.expectEmptyStateGuidanceVisible();
  });

  test('BUG-007: column policy is visible when description is empty', async ({ boardPage }) => {
    await boardPage.openWithState(
      createBoardState({
        columns: [
          createColumn(COLUMN_IDS.todo, 'To Do', 0, {
            policy: 'Only ready work can enter this column.',
          }),
          createColumn(COLUMN_IDS.doing, 'Doing', 1),
          createColumn(COLUMN_IDS.done, 'Done', 2),
        ],
      }),
    );

    await boardPage.expectColumnInfoButtonVisible('To Do');
  });

  test('BUG-008: keeps existing cards visible when swimlanes are enabled', async ({ boardPage }) => {
    await boardPage.openWithState(
      createBoardState({
        cards: [createCard(1, { title: 'Card created without swimlane', swimlaneId: null })],
      }),
    );

    await boardPage.toggleSwimlanes();

    await boardPage.expectCardVisible('Card created without swimlane');
  });

  test('FR5: drag-and-drop moves a card across columns', async ({ boardPage }) => {
    await boardPage.openWithState(
      createBoardState({
        cards: [createCard(1, { title: 'Mouse drag across columns card' })],
      }),
    );

    await boardPage.dragCardToColumn('Mouse drag across columns card', 'Doing');

    const movedCard = (await boardPage.getStoredState()).state.boards[0].cards.find(
      (card) => card.title === 'Mouse drag across columns card',
    );
    expect(movedCard).toEqual(expect.objectContaining({ columnId: COLUMN_IDS.doing }));
  });

  test('FR5: drag-and-drop moves a card between swimlanes', async ({ boardPage }) => {
    await boardPage.openWithState(
      createBoardState({
        swimlanes: [createSwimlane(DEFAULT_SWIMLANE_ID, 'Default', 0), createSwimlane('lane-expedite', 'Expedite', 1)],
        swimlanesEnabled: true,
        cards: [
          createCard(1, {
            title: 'Mouse drag between swimlanes card',
            swimlaneId: DEFAULT_SWIMLANE_ID,
          }),
        ],
      }),
    );

    await boardPage.dragCardToSwimlane('Mouse drag between swimlanes card', 'Expedite', 'To Do');

    const movedCard = (await boardPage.getStoredState()).state.boards[0].cards.find(
      (card) => card.title === 'Mouse drag between swimlanes card',
    );
    expect(movedCard).toEqual(expect.objectContaining({ swimlaneId: 'lane-expedite' }));
  });

  test('BUG-010: bulk move keeps selected card visible when swimlanes are enabled', async ({ boardPage }) => {
    await boardPage.openWithState(
      createBoardState({
        swimlanesEnabled: true,
        cards: [createCard(1, { title: 'Bulk move swimlane card', swimlaneId: DEFAULT_SWIMLANE_ID })],
      }),
    );

    await boardPage.selectCard('Bulk move swimlane card');
    await boardPage.bulkMoveSelectedCardsTo('Doing');

    await boardPage.expectCardVisible('Bulk move swimlane card');
  });

  test('FR8: drag-and-drop reorders cards within a column', async ({ boardPage }) => {
    await boardPage.openWithState(
      createBoardState({
        cards: [
          createCard(1, { title: 'Mouse reorder first card', order: 0 }),
          createCard(2, { title: 'Mouse reorder second card', order: 1 }),
        ],
        nextCardNumber: 3,
      }),
    );

    await boardPage.dragCardOntoCard('Mouse reorder first card', 'Mouse reorder second card');

    const cards = (await boardPage.getStoredState()).state.boards[0].cards;
    expect(cards.find((card) => card.title === 'Mouse reorder first card')).toEqual(
      expect.objectContaining({ order: 1 }),
    );
  });

  test('BUG-011: column settings actions stay visible on short columns', async ({ boardPage, page }) => {
    await page.setViewportSize({ width: 1280, height: 360 });
    await boardPage.openWithState(createBoardState());

    await boardPage.expectColumnSettingsActionInViewport('To Do', 'Delete column');
  });

  test('BUG-012: dense card layout still allows opening visible cards', async ({ boardPage, page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await boardPage.openWithState(
      createBoardState({
        cards: Array.from({ length: 16 }, (_, index) =>
          createCard(index + 1, {
            title: `Dense card ${index + 1}`,
            order: index,
          }),
        ),
        nextCardNumber: 17,
      }),
    );

    await boardPage.openCard('Dense card 16');
  });

  test('BUG-014: rejects unrealistic far-future due dates', async ({ boardPage }) => {
    await boardPage.openWithState(
      createBoardState({
        cards: [createCard(1, { title: 'Far future due date card' })],
      }),
    );

    await boardPage.openCard('Far future due date card');
    await boardPage.cardModal.setDueDate('275760-01-01');
    await boardPage.cardModal.save();

    const card = (await boardPage.getStoredState()).state.boards[0].cards[0];
    expect(card.dueDate).not.toBe('275760-01-01');
  });

  test('FR13: rejects invalid due date filter ranges', async ({ boardPage }) => {
    await boardPage.openWithState(
      createBoardState({
        cards: [createCard(1, { title: 'Date range validation card', dueDate: '2026-06-15' })],
      }),
    );

    await boardPage.setDueDateRange('2012-02-28', '1996-02-28');

    const filters = (await boardPage.getStoredState()).state.filters;
    expect(filters).not.toEqual(
      expect.objectContaining({
        dueDateFrom: '2012-02-28',
        dueDateTo: '1996-02-28',
      }),
    );
  });

  test('BUG-016: keyboard reorder announces the target column', async ({ boardPage }) => {
    await boardPage.openWithState(
      createBoardState({
        cards: [
          createCard(1, { title: 'Keyboard first card' }),
          createCard(2, { title: 'Doing keyboard card', columnId: COLUMN_IDS.doing, order: 0 }),
        ],
        nextCardNumber: 3,
      }),
    );

    await boardPage.keyboardMoveCard('Keyboard first card', 'ArrowRight');

    await boardPage.expectLiveRegionContains('Doing');
  });

  test('BUG-017: column description and policy have an explicit save action', async ({ boardPage }) => {
    await boardPage.openWithState(createBoardState());

    await boardPage.expectColumnDescriptionSaveVisible('To Do', 'Column description update');
  });

  test('BUG-018: card title tooltip does not advertise unavailable double-click edit', async ({ boardPage }) => {
    await boardPage.openWithState(
      createBoardState({
        cards: [createCard(1, { title: 'Tooltip card title' })],
      }),
    );

    await boardPage.expectCardTitleDoesNotSuggestDoubleClick('Tooltip card title');
  });

  test('FR6: new-card flow exposes all card fields before save', async ({ boardPage }) => {
    await boardPage.openWithState(createBoardState());

    await boardPage.openCardComposer('To Do');

    await boardPage.expectCardComposerFieldVisible('To Do', 'Description');
    await boardPage.expectCardComposerFieldVisible('To Do', 'Due date');
  });

  test('BUG-019: clear all clears the search input value', async ({ boardPage }) => {
    await boardPage.openWithState(
      createBoardState({
        cards: [createCard(1, { title: 'Alpha search card' }), createCard(2, { title: 'Beta search card' })],
      }),
    );

    await boardPage.search('Alpha');
    await boardPage.expectCardHidden('Beta search card');
    await boardPage.clearAllFilters();

    await expect.poll(() => boardPage.searchInputValue()).toBe('');
  });

  test('BUG-020: renders card description as safe text', async ({ boardPage, page }) => {
    const payload = '<img src="x" onerror="window.__xss=1" />';
    await boardPage.openWithState(
      createBoardState({
        cards: [createCard(1, { title: 'Description security card' })],
      }),
    );

    await boardPage.openCard('Description security card');
    await boardPage.cardModal.updateDescription(payload);
    await boardPage.cardModal.save();

    await boardPage.expectNoInjectedImages();
    await expect.poll(() => page.evaluate(() => (window as Window & { __xss?: number }).__xss)).toBeUndefined();
  });

  test('BUG-021: provides a compact or expanded display mode toggle', async ({ boardPage }) => {
    await boardPage.openWithState(
      createBoardState({
        cards: [createCard(1, { title: 'Display mode card' })],
      }),
    );

    await boardPage.expectDisplayModeToggleVisible();
  });
});
