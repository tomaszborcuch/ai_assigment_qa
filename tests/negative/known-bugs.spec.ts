import { test, expect } from '../../fixtures/board.fixture';
import { DEFAULT_SWIMLANE_ID, createBoardState, createCard } from '../../utils/board-state';

test.describe('Known bugs', () => {
  test('BUG-003: creates a column using the add-column button', async ({ boardPage }) => {
    await boardPage.openWithState(createBoardState());

    await boardPage.addColumnViaButton('Review');

    await boardPage.expectColumnVisible('Review');
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
});
