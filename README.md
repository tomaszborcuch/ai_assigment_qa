# Kanban Board E2E Tests

Automated Playwright tests for the Kanban Board demo application.

## Tested Application

Default URL:

```text
https://main-bvxea6i-yqgjk4adqrx5w.ch-1.platformsh.site/
```

The URL can be overridden with `BASE_URL`.

## Setup

```bash
npm install
npx playwright install
```

## Run Tests

```bash
npm test
```

Run against a different environment:

```bash
BASE_URL=https://example.com npm test
```

PowerShell:

```powershell
$env:BASE_URL = "https://example.com"
npm test
```

## Project Structure

The test suite will use a Page Object Model designed for a single-page Kanban application:

- `pages/base-page.ts` for shared page behavior.
- `pages/board-page.ts` for the main Kanban board.
- `pages/components/` for reusable UI components such as columns, card modal, filters, and bulk actions.
- `tests/` for business-level test scenarios.
- `fixtures/` for Playwright fixtures.
- `utils/` for shared test data helpers.
