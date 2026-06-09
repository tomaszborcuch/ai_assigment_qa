import { test, expect } from '../../fixtures/board.fixture';
import { createBoardState, createCard, createCards } from '../../utils/board-state';
import { measureDuration, measureP95 } from '../../utils/performance';

const CARD_OPERATION_LIMIT_MS = 150;
const SEARCH_RESPONSE_LIMIT_MS = 150;
const INITIAL_LOAD_LIMIT_MS = 2000;
const SEARCH_COMPLETION_TIMEOUT_MS = 20_000;
const P95_SAMPLE_COUNT = 20;

const createSearchDataset = () =>
  Array.from({ length: 100 }, (_, index) => {
    const cardNumber = index + 1;
    const title = cardNumber === 1 ? 'Unique performance search target' : `Filler performance card ${cardNumber}`;

    return createCard(cardNumber, { title });
  });

test.describe('Performance defects', () => {
  for (const cardCount of [999, 1000, 1001]) {
    test(`initial board load stays under 2s with ${cardCount} cards`, async ({ boardPage }) => {
      test.setTimeout(30_000);

      const loadDuration = await measureDuration(async () => {
        await boardPage.openWithState(
          createBoardState({
            cards: createCards(cardCount),
            nextCardNumber: cardCount + 1,
          }),
        );
      });

      expect(loadDuration).toBeLessThan(INITIAL_LOAD_LIMIT_MS);
    });
  }

  test('BUG-009: add-card P95 latency stays under 150ms around 1000 cards', async ({ boardPage }) => {
    test.setTimeout(90_000);

    await boardPage.openWithState(
      createBoardState({
        cards: createCards(1000),
        nextCardNumber: 1001,
      }),
    );

    const p95 = await measureP95(P95_SAMPLE_COUNT, async (sampleIndex) => {
      const title = `Performance add card ${sampleIndex}`;

      await boardPage.addCard('To Do', title);
    });

    expect(p95).toBeLessThan(CARD_OPERATION_LIMIT_MS);
  });

  test('BUG-013: search filters to one matching card within 150ms', async ({ boardPage }) => {
    test.setTimeout(30_000);

    await boardPage.openWithState(
      createBoardState({
        cards: createSearchDataset(),
        nextCardNumber: 101,
      }),
    );

    const searchDuration = await measureDuration(async () => {
      await boardPage.search('Unique performance search target');
      await boardPage.expectVisibleCardCount(1, { timeout: SEARCH_COMPLETION_TIMEOUT_MS });
    });

    expect(searchDuration).toBeLessThan(SEARCH_RESPONSE_LIMIT_MS);
  });
});
