export const STORAGE_KEY = 'kanban-store';

export const COLUMN_IDS = {
  todo: 'col-todo',
  doing: 'col-doing',
  done: 'col-done',
} as const;

export const DEFAULT_SWIMLANE_ID = 'lane-default';

export type Priority = 'low' | 'medium' | 'high' | 'critical';

export interface KanbanColumn {
  id: string;
  title: string;
  description: string;
  policy: string;
  wipLimit: number | null;
  wipHardBlock: boolean;
  order: number;
  archived: boolean;
}

export interface KanbanCard {
  id: string;
  number: number;
  title: string;
  description: string;
  priority: Priority;
  dueDate: string | null;
  blocked: boolean;
  blockedReason: string;
  blockedDependency: string | null;
  dependencyLink: string;
  columnId: string;
  swimlaneId: string | null;
  order: number;
  archived: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface KanbanSwimlane {
  id: string;
  title: string;
  order: number;
}

export interface KanbanBoard {
  id: string;
  name: string;
  columns: KanbanColumn[];
  cards: KanbanCard[];
  swimlanes: KanbanSwimlane[];
  swimlanesEnabled: boolean;
  nextCardNumber: number;
}

export interface KanbanStore {
  state: {
    boards: KanbanBoard[];
    activeBoardId: string | null;
    searchQuery: string;
    filters: {
      priorities: Priority[];
      blocked: boolean | null;
      dueDateFrom: string | null;
      dueDateTo: string | null;
    };
    selectedCardIds: string[];
  };
  version: number;
}

export const createCard = (number: number, overrides: Partial<KanbanCard> = {}): KanbanCard => ({
  id: `card-${number}`,
  number,
  title: `Card ${number}`,
  description: '',
  priority: 'medium',
  dueDate: null,
  blocked: false,
  blockedReason: '',
  blockedDependency: null,
  dependencyLink: '',
  columnId: COLUMN_IDS.todo,
  swimlaneId: null,
  order: number - 1,
  archived: false,
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
  ...overrides,
});

export const createBoardState = (
  overrides: Partial<KanbanBoard> = {},
  storeOverrides: Partial<KanbanStore['state']> = {},
): KanbanStore => {
  const cards = overrides.cards ?? [];

  return {
    state: {
      boards: [
        {
          id: 'board-1',
          name: 'My Board',
          columns: [
            {
              id: COLUMN_IDS.todo,
              title: 'To Do',
              description: '',
              policy: '',
              wipLimit: null,
              wipHardBlock: false,
              order: 0,
              archived: false,
            },
            {
              id: COLUMN_IDS.doing,
              title: 'Doing',
              description: '',
              policy: '',
              wipLimit: null,
              wipHardBlock: false,
              order: 1,
              archived: false,
            },
            {
              id: COLUMN_IDS.done,
              title: 'Done',
              description: '',
              policy: '',
              wipLimit: null,
              wipHardBlock: false,
              order: 2,
              archived: false,
            },
          ],
          cards,
          swimlanes: [{ id: DEFAULT_SWIMLANE_ID, title: 'Default', order: 0 }],
          swimlanesEnabled: false,
          nextCardNumber: cards.length + 1,
          ...overrides,
        },
      ],
      activeBoardId: null,
      searchQuery: '',
      filters: {
        priorities: [],
        blocked: null,
        dueDateFrom: null,
        dueDateTo: null,
      },
      selectedCardIds: [],
      ...storeOverrides,
    },
    version: 1,
  };
};

export const createCards = (count: number): KanbanCard[] =>
  Array.from({ length: count }, (_, index) => createCard(index + 1));
