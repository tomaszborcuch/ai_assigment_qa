import { test, expect } from '../../fixtures/board.fixture';
import { COLUMN_IDS, createBoardState, createCard } from '../../utils/board-state';

test.describe('Card positive paths', () => {
  test('edits card details and persists changes', async ({ boardPage }) => {
    await boardPage.openWithState(
      createBoardState({
        cards: [createCard(1, { title: 'Editable card' })],
      }),
    );

    await boardPage.openCard('Editable card');
    await boardPage.cardModal.updateTitle('Edited card');
    await boardPage.cardModal.updateDescription('Edited description');
    await boardPage.cardModal.markBlocked('Waiting for API', '#42');
    await boardPage.cardModal.selectPriority('critical');
    await boardPage.cardModal.selectColumn(COLUMN_IDS.done);
    await boardPage.cardModal.setDueDate('2026-06-30');
    await boardPage.cardModal.save();

    await expect
      .poll(async () => (await boardPage.getStoredState()).state.boards[0].cards[0].title)
      .toBe('Edited card');

    await boardPage.reload();
    await boardPage.expectCardVisible('Edited card');

    const card = (await boardPage.getStoredState()).state.boards[0].cards[0];
    expect(card).toEqual(
      expect.objectContaining({
        title: 'Edited card',
        description: 'Edited description',
        blocked: true,
        blockedReason: 'Waiting for API',
        blockedDependency: '#42',
        priority: 'critical',
        columnId: COLUMN_IDS.done,
        dueDate: '2026-06-30',
      }),
    );
  });

  test('closes the card modal with Escape without saving changes', async ({ boardPage }) => {
    await boardPage.openWithState(
      createBoardState({
        cards: [createCard(1, { title: 'Cancel edit card' })],
      }),
    );

    await boardPage.openCard('Cancel edit card');
    await boardPage.cardModal.updateTitle('Unsaved title');
    await boardPage.cardModal.closeWithEscape();

    await boardPage.expectCardVisible('Cancel edit card');
    await boardPage.expectCardHidden('Unsaved title');
  });
});
