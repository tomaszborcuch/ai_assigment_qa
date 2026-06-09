import { test } from '../../fixtures/board.fixture';
import { createBoardState, createCard } from '../../utils/board-state';

test.describe('Search and filters positive paths', () => {
  test('searches cards by title', async ({ boardPage }) => {
    await boardPage.openWithState(
      createBoardState({
        cards: [createCard(1, { title: 'Search target title' }), createCard(2, { title: 'Other title' })],
      }),
    );

    await boardPage.search('Search target');

    await boardPage.expectCardVisible('Search target title');
    await boardPage.expectCardHidden('Other title');
  });

  test('searches cards by description', async ({ boardPage }) => {
    await boardPage.openWithState(
      createBoardState({
        cards: [
          createCard(1, { title: 'Description match', description: 'needle-description-token' }),
          createCard(2, { title: 'Description miss', description: 'other description' }),
        ],
      }),
    );

    await boardPage.search('needle-description-token');

    await boardPage.expectCardVisible('Description match');
    await boardPage.expectCardHidden('Description miss');
  });

  test('filters cards by priority', async ({ boardPage }) => {
    await boardPage.openWithState(
      createBoardState({
        cards: [
          createCard(1, { title: 'High priority card', priority: 'high' }),
          createCard(2, { title: 'Low priority card', priority: 'low' }),
        ],
      }),
    );

    await boardPage.selectPriorityFilter('High');

    await boardPage.expectCardVisible('High priority card');
    await boardPage.expectCardHidden('Low priority card');
  });

  test('filters blocked cards', async ({ boardPage }) => {
    await boardPage.openWithState(
      createBoardState({
        cards: [
          createCard(1, {
            title: 'Blocked filter card',
            blocked: true,
            blockedReason: 'Waiting for dependency',
          }),
          createCard(2, { title: 'Unblocked filter card' }),
        ],
      }),
    );

    await boardPage.selectBlockedFilter();

    await boardPage.expectCardVisible('Blocked filter card');
    await boardPage.expectCardHidden('Unblocked filter card');
  });

  test('filters not blocked cards', async ({ boardPage }) => {
    await boardPage.openWithState(
      createBoardState({
        cards: [
          createCard(1, {
            title: 'Blocked card hidden by not blocked filter',
            blocked: true,
            blockedReason: 'Waiting for dependency',
          }),
          createCard(2, { title: 'Visible not blocked card' }),
        ],
      }),
    );

    await boardPage.selectNotBlockedFilter();

    await boardPage.expectCardVisible('Visible not blocked card');
    await boardPage.expectCardHidden('Blocked card hidden by not blocked filter');
  });

  test('clears active non-search filters', async ({ boardPage }) => {
    await boardPage.openWithState(
      createBoardState({
        cards: [
          createCard(1, { title: 'High priority clear filter card', priority: 'high' }),
          createCard(2, { title: 'Low priority restored card', priority: 'low' }),
        ],
      }),
    );

    await boardPage.selectPriorityFilter('High');
    await boardPage.expectCardHidden('Low priority restored card');
    await boardPage.clearAllFilters();

    await boardPage.expectCardVisible('High priority clear filter card');
    await boardPage.expectCardVisible('Low priority restored card');
  });

  test('filters cards by due date range', async ({ boardPage }) => {
    await boardPage.openWithState(
      createBoardState({
        cards: [
          createCard(1, { title: 'June due card', dueDate: '2026-06-15' }),
          createCard(2, { title: 'July due card', dueDate: '2026-07-15' }),
        ],
      }),
    );

    await boardPage.setDueDateRange('2026-06-01', '2026-06-30');

    await boardPage.expectCardVisible('June due card');
    await boardPage.expectCardHidden('July due card');
  });
});
