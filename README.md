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

Run all tests:

```bash
npm test
```

Run only positive paths:

```bash
npm run test:positive
```

Run known defect checks:

```bash
npm run test:negative
```

Run performance checks:

```bash
npm run test:performance
```

Negative and performance tests document known defects from `docs/BUG_REPORT.md`. They are expected to fail while the
demo application does not match the requirements. Use `npm run test:positive` for a green smoke run.

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
