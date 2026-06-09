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

  test('does not create a card without a title', async ({ boardPage }) => {
    await boardPage.openWithState(createBoardState());

    await boardPage.attemptAddCardWithoutTitle('To Do');

    await boardPage.expectCardComposerVisible('To Do');
    await boardPage.expectVisibleCardCount(0);
  });

  test('shows blocked card state and reason on the board', async ({ boardPage }) => {
    await boardPage.openWithState(
      createBoardState({
        cards: [
          createCard(1, {
            title: 'Blocked visible card',
            blocked: true,
            blockedReason: 'Waiting for approval',
          }),
        ],
      }),
    );

    await boardPage.expectCardVisible('Blocked visible card');
    await boardPage.expectCardTextVisible('Blocked visible card', 'Blocked: Waiting for approval');
  });

  test('shows priority and due date on the card', async ({ boardPage }) => {
    await boardPage.openWithState(
      createBoardState({
        cards: [
          createCard(1, {
            title: 'Card visual fields',
            priority: 'high',
            dueDate: '2026-06-30',
          }),
        ],
      }),
    );

    await boardPage.expectCardTextVisible('Card visual fields', 'High');
    await boardPage.expectCardTextMatches('Card visual fields', /2026-06-30/);
  });

  test('deletes a card after confirmation', async ({ boardPage }) => {
    await boardPage.openWithState(
      createBoardState({
        cards: [createCard(1, { title: 'Delete positive card' })],
      }),
    );

    await boardPage.openCard('Delete positive card');
    await boardPage.cardModal.deleteAndConfirm();

    await boardPage.expectCardHidden('Delete positive card');

    const cards = (await boardPage.getStoredState()).state.boards[0].cards;
    expect(cards).toHaveLength(0);
  });
});
