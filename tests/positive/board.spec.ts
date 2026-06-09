import { test, expect } from '../../fixtures/board.fixture';
import { COLUMN_IDS, DEFAULT_SWIMLANE_ID, createBoardState, createCard, createColumn } from '../../utils/board-state';

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

  test('shows column description and policy', async ({ boardPage }) => {
    await boardPage.openWithState(
      createBoardState({
        columns: [
          createColumn(COLUMN_IDS.todo, 'To Do', 0, {
            description: 'Ready work only',
            policy: 'Pull work when capacity is available',
          }),
          createColumn(COLUMN_IDS.doing, 'Doing', 1),
          createColumn(COLUMN_IDS.done, 'Done', 2),
        ],
      }),
    );

    await boardPage.expectColumnDescriptionVisible('To Do', 'Ready work only', 'Pull work when capacity is available');
  });

  test('blocks adding cards when a hard WIP limit is reached', async ({ boardPage }) => {
    await boardPage.openWithState(
      createBoardState({
        columns: [
          createColumn(COLUMN_IDS.todo, 'To Do', 0, { wipLimit: 1, wipHardBlock: true }),
          createColumn(COLUMN_IDS.doing, 'Doing', 1),
          createColumn(COLUMN_IDS.done, 'Done', 2),
        ],
        cards: [createCard(1, { title: 'Existing WIP card' })],
      }),
    );

    await boardPage.expectWipWarningVisible('To Do', 'WIP limit of 1 reached (hard block)');
    await boardPage.expectAddCardDisabled('To Do');
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

  test('bulk moves selected cards to another column', async ({ boardPage }) => {
    await boardPage.openWithState(
      createBoardState({
        cards: [createCard(1, { title: 'Move selected card' }), createCard(2, { title: 'Stay in todo card' })],
      }),
    );

    await boardPage.selectCard('Move selected card');
    await boardPage.bulkMoveSelectedCardsTo('Doing');

    await boardPage.expectCardVisible('Move selected card');

    const movedCard = (await boardPage.getStoredState()).state.boards[0].cards.find(
      (card) => card.title === 'Move selected card',
    );
    expect(movedCard).toEqual(expect.objectContaining({ columnId: COLUMN_IDS.doing }));
  });

  test('keeps card number stable after moving a card', async ({ boardPage }) => {
    await boardPage.openWithState(
      createBoardState({
        cards: [createCard(7, { title: 'Stable number card' })],
        nextCardNumber: 8,
      }),
    );

    await boardPage.selectCard('Stable number card');
    await boardPage.bulkMoveSelectedCardsTo('Done');

    const movedCard = (await boardPage.getStoredState()).state.boards[0].cards[0];
    expect(movedCard).toEqual(expect.objectContaining({ number: 7, columnId: COLUMN_IDS.done }));
  });

  test('shows cards assigned to the default swimlane', async ({ boardPage }) => {
    await boardPage.openWithState(
      createBoardState({
        swimlanesEnabled: true,
        cards: [createCard(1, { title: 'Default swimlane card', swimlaneId: DEFAULT_SWIMLANE_ID })],
      }),
    );

    await boardPage.expectCardVisible('Default swimlane card');
  });
});
