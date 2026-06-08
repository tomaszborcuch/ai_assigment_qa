import { test, expect } from '../../fixtures/board.fixture';
import { createBoardState, createCard } from '../../utils/board-state';

test.describe('Board positive paths', () => {
  test('loads the board and visible columns', async ({ boardPage }) => {
    await boardPage.openWithState(createBoardState());

    await boardPage.expectColumnVisible('To Do');
    await boardPage.expectColumnVisible('Doing');
    await boardPage.expectColumnVisible('Done');
  });

  test('adds a card to a column', async ({ boardPage }) => {
    await boardPage.openWithState(createBoardState());

    await boardPage.addCard('To Do', 'New positive card');

    const state = await boardPage.getStoredState();
    expect(state.state.boards[0].cards).toEqual(
      expect.arrayContaining([expect.objectContaining({ title: 'New positive card' })]),
    );
  });

  test('bulk archives selected cards', async ({ boardPage }) => {
    await boardPage.openWithState(
      createBoardState({
        cards: [createCard(1, { title: 'Archive A' }), createCard(2, { title: 'Archive B' })],
      }),
    );

    await boardPage.selectCard('Archive A');
    await boardPage.selectCard('Archive B');
    await boardPage.bulkArchiveSelectedCards();

    await boardPage.expectCardHidden('Archive A');
    await boardPage.expectCardHidden('Archive B');

    const state = await boardPage.getStoredState();
    expect(state.state.boards[0].cards.every((card) => card.archived)).toBe(true);
  });
});
