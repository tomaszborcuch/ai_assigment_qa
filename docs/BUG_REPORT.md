# Bug Report

Environment: https://main-bvxea6i-yqgjk4adqrx5w.ch-1.platformsh.site/

## Summary

| ID      | Title                                                          | Requirement                           | Severity | Priority |
| ------- | -------------------------------------------------------------- | ------------------------------------- | -------- | -------- |
| BUG-001 | Default column name does not match requirements                | FR3                                   | Medium   | Medium   |
| BUG-002 | Add column button has a typo                                   | UX Requirements - Visual Text         | Low      | Low      |
| BUG-003 | Add column button does not create a column                     | FR1                                   | High     | High     |
| BUG-004 | Blocked filter displays a translation key                      | FR13                                  | Medium   | Medium   |
| BUG-005 | Required shortcuts and command palette are not available       | UX Requirements - Shortcuts           | Medium   | Medium   |
| BUG-006 | Empty columns do not show guided tips or sample cards          | UX Requirements - Empty States        | Medium   | Low      |
| BUG-007 | Column policy is not discoverable when description is empty    | FR2                                   | Medium   | Medium   |
| BUG-008 | Cards are split between swimlanes OFF and ON views             | FR4                                   | High     | High     |
| BUG-009 | Add-card latency exceeds P95 performance target                | NFR Performance                       | Medium   | Medium   |
| BUG-010 | Bulk move hides cards when swimlanes are enabled               | FR9                                   | High     | High     |
| BUG-011 | Column settings menu is clipped on short columns               | FR1                                   | High     | Medium   |
| BUG-012 | Dense card layout prevents opening cards                       | UX Requirements - Information Density | High     | High     |
| BUG-013 | Search response is delayed by board size                       | FR12                                  | High     | High     |
| BUG-014 | Due date accepts unrealistic far-future years                  | FR6                                   | Medium   | Low      |
| BUG-015 | Card modal can be saved with invalid due date input            | FR6                                   | Medium   | Medium   |
| BUG-016 | Keyboard cross-column reorder behaves unpredictably            | UX Requirements - Drag-and-Drop       | Medium   | Medium   |
| BUG-017 | Column description and policy auto-save without clear feedback | FR2                                   | Low      | Medium   |
| BUG-018 | Card title tooltip advertises unavailable double-click edit    | UX Requirements - Visual Text         | Low      | Medium   |
| BUG-019 | Clear all leaves stale text in the search input                | FR12, FR13                            | Medium   | Medium   |
| BUG-020 | Card description allows HTML/JavaScript injection              | Security                              | Critical | High     |
| BUG-021 | Expanded card display mode is not available                    | UX Requirements - Information Density | Medium   | Low      |

## BUG-001: Default column name does not match requirements

Requirement: FR3  
Severity: Medium  
Priority: Medium  
Reproducibility: 100%

### Preconditions

Open the application in a clean browser context.

### Steps To Reproduce

1. Open the Kanban board.
2. Observe the default column names.

### Expected Result

The default columns are `To Do`, `In progress`, and `Done`.

### Actual Result

The default columns are `To Do`, `Doing`, and `Done`.

## BUG-002: Add column button has a typo

Requirement: UX Requirements - Visual Text  
Severity: Low  
Priority: Low  
Reproducibility: 100%

### Preconditions

Open the application in a clean browser context.

### Steps To Reproduce

1. Open the Kanban board.
2. Look at the add-column button below the board.

### Expected Result

The button label is spelled correctly, for example `+ Add column`.

### Actual Result

The button label is displayed as `+ Add colunn`.

## BUG-003: Add column button does not create a column

Requirement: FR1  
Severity: High  
Priority: High  
Reproducibility: 100%

### Preconditions

Open the application in a clean browser context.

### Steps To Reproduce

1. Open the Kanban board.
2. Click `+ Add colunn`.
3. Enter `Review` in the column name field.
4. Click `Add column`.

### Expected Result

A new `Review` column is added to the board.

### Actual Result

No column is added after clicking the button. The add-column form remains visible and the browser console logs:

```text
Unable to add new column. Unknown error occurred.
```

## BUG-004: Blocked filter displays a translation key

Requirement: FR13  
Severity: Medium  
Priority: Medium  
Reproducibility: 100%

### Preconditions

Open the application in a clean browser context.

### Steps To Reproduce

1. Open the Kanban board.
2. Click `Filters`.
3. Observe the options in the `Blocked` filter section.

### Expected Result

The blocked-only filter option is displayed with a user-facing label, for example `Blocked only`.

### Actual Result

The blocked-only filter option is displayed as `app.filters.blocked_only.label`.

## BUG-005: Required shortcuts and command palette are not available

Requirement: UX Requirements - Shortcuts  
Severity: Medium  
Priority: Medium  
Reproducibility: 100%

### Preconditions

Open the application in a clean browser context.

### Steps To Reproduce

1. Open the Kanban board.
2. Press `N`.
3. Press `E`.
4. Press `F`.
5. Press `S`.
6. Press `?`.
7. Try to open a command palette, for example with `Ctrl+K`.

### Expected Result

The required shortcuts are available:

- `N` opens new card flow.
- `E` opens quick edit.
- `F` opens filter.
- `S` saves the current view.
- `?` opens help or shortcut discovery.
- Shortcuts are discoverable through a command palette.

### Actual Result

No visible action happens after pressing the listed shortcuts. No command palette or shortcut discovery UI is available.

## BUG-006: Empty columns do not show guided tips or sample cards

Requirement: UX Requirements - Empty States  
Severity: Medium  
Priority: Low  
Reproducibility: 100%

### Preconditions

Open the application in a clean browser context.

### Steps To Reproduce

1. Open the Kanban board.
2. Observe the empty `To Do`, `Doing`, and `Done` columns.

### Expected Result

Empty states provide guided tips and sample template cards.

### Actual Result

Each empty column only displays `Drop cards here`. No guided tips or sample template cards are shown.

## BUG-007: Column policy is not discoverable when description is empty

Requirement: FR2  
Severity: Medium  
Priority: Medium  
Reproducibility: 100%

### Preconditions

Open the application in a clean browser context.

### Steps To Reproduce

1. Open the Kanban board.
2. Open settings for the `To Do` column.
3. Enter `Only ready work can enter this column.` in the `Column policy...` field.
4. Close the settings menu.
5. Observe the `To Do` column header.

### Expected Result

The column policy can be opened or viewed by the user, even when the column description is empty.

### Actual Result

No information icon or other control is displayed for the column. The policy is saved, but the user cannot open or view
it from the column header.

If both description and policy are added first, the information icon is displayed and both values can be viewed. However,
after removing the description, the information icon disappears even though the policy still exists.

## BUG-008: Cards are split between swimlanes OFF and ON views

Requirement: FR4  
Severity: High  
Priority: High  
Reproducibility: 100%

### Preconditions

Open the application in a clean browser context.

### Steps To Reproduce

1. Add a card to the `To Do` column while swimlanes are off.
2. Click `Swimlanes OFF` to enable swimlanes.
3. Observe the `Default` swimlane.
4. Add another card while swimlanes are on.
5. Click `Swimlanes ON` to disable swimlanes.
6. Toggle swimlanes on again.

### Expected Result

All non-archived cards remain visible when toggling swimlanes on or off. Cards created before enabling swimlanes should
appear in the `Default` swimlane, and cards created while swimlanes are enabled should still be visible when swimlanes are
disabled.

### Actual Result

Cards created while swimlanes are off disappear from the visible board when swimlanes are enabled. Cards created while
swimlanes are on disappear from the visible board when swimlanes are disabled. The cards are not deleted, but each mode
shows a different set of cards.

## BUG-009: Add-card latency exceeds P95 performance target

Requirement: NFR Performance  
Severity: Medium  
Priority: Medium  
Reproducibility: 100%

### Preconditions

Prepare a board with generated test data in browser storage.

Measured datasets:

- 999 cards
- 1000 cards
- 1001 cards

Each measurement set was executed 100 times.

### Steps To Reproduce

1. Prepare the board with generated test data.
2. Open the Kanban board.
3. Add a new card through the UI.
4. Measure the time from clicking `Add card` to the new card becoming visible.
5. Repeat the operation 100 times and calculate P95.

### Expected Result

P95 interactive latency for card operations is under 150ms.

### Actual Result

Add-card operation P95 exceeds 150ms for boards around the supported 1000-card size:

| Card count | Samples | Min   | Avg   | P50   | P95   | Max   |
| ---------- | ------- | ----- | ----- | ----- | ----- | ----- |
| 999        | 100     | 137ms | 165ms | 162ms | 183ms | 200ms |
| 1000       | 100     | 136ms | 166ms | 164ms | 186ms | 191ms |
| 1001       | 100     | 151ms | 193ms | 191ms | 221ms | 230ms |

Initial board load stayed under the 2s requirement for 999 and 1000 cards:

| Card count | Samples | Min   | Avg   | P50   | P95   | Max    |
| ---------- | ------- | ----- | ----- | ----- | ----- | ------ |
| 999        | 100     | 275ms | 367ms | 329ms | 595ms | 1421ms |
| 1000       | 100     | 271ms | 299ms | 297ms | 325ms | 375ms  |
| 1001       | 100     | 420ms | 470ms | 457ms | 504ms | 860ms  |

## BUG-010: Bulk move hides cards when swimlanes are enabled

Requirement: FR9  
Severity: High  
Priority: High  
Reproducibility: 100%

### Preconditions

Open the application in a clean browser context.

### Steps To Reproduce

1. Enable swimlanes.
2. Add a new swimlane, for example `Team A`.
3. Add a card to the `Default` swimlane.
4. Select the card checkbox.
5. Use the bulk actions dropdown to move the selected card to `Doing`.
6. Observe all visible swimlanes and columns.

### Expected Result

The selected card is moved to the `Doing` column and remains visible in its swimlane.

### Actual Result

The card disappears from all visible swimlanes after the bulk move.

## BUG-011: Column settings menu is clipped on short columns

Requirement: FR1  
Severity: High  
Priority: Medium  
Reproducibility: 100%

### Preconditions

Open the application in a clean browser context with an empty or short column.

### Steps To Reproduce

1. Open the Kanban board.
2. Open the `Column settings` menu for an empty `To Do` or `Doing` column.
3. Try to access the lower controls in the settings menu, such as:
   - `Column description...`
   - `Column policy...`
   - `Archive column`
   - `Delete column`

### Expected Result

The full settings menu is visible and all controls are clickable, regardless of the current column height.

### Actual Result

Only the upper part of the settings menu is interactable. Lower controls are clipped by the column container because the
menu is rendered inside a column with hidden overflow. The controls become easier to access only after the column becomes
taller, for example after adding several cards.

## BUG-012: Dense card layout prevents opening cards

Requirement: UX Requirements - Information Density  
Severity: High  
Priority: High  
Reproducibility: 100%

### Preconditions

Use a Full HD viewport, for example 1920x1080.

### Steps To Reproduce

1. Open the Kanban board.
2. Add 16 cards to the same column.
3. Try to open any card by clicking the card body or visible card title.
4. Try to scroll inside the column.

### Expected Result

Cards remain readable and clickable while showing 12-16 cards per column at 1080p. Clicking a card title opens the card
edit modal.

### Actual Result

Cards are compressed so aggressively that the card title area is pushed outside its own card bounds and overlaps with the
next card header or the `+ Add card` area. Clicking the card body or visible title does not open the card modal. Scrolling
does not help because the column does not expose additional scrollable content in this state.

## BUG-013: Search response is delayed by board size

Requirement: FR12  
Severity: High  
Priority: High  
Reproducibility: 100%

### Preconditions

Prepare a board with generated test data in browser storage.

Measured datasets:

- 10 cards
- 100 cards
- 1000 cards

### Steps To Reproduce

1. Open a board with generated cards.
2. Type a unique card title into the global search field.
3. Measure the time until the board filters down to the matching card.

### Expected Result

Search results update quickly and remain usable on boards up to the supported 1000-card size.

### Actual Result

Search response time grows with the number of cards:

| Card count | Samples | Min     | Avg     | P50     | P95     | Max     |
| ---------- | ------- | ------- | ------- | ------- | ------- | ------- |
| 10         | 20      | 1016ms  | 1032ms  | 1032ms  | 1042ms  | 1046ms  |
| 100        | 20      | 10015ms | 10049ms | 10050ms | 10065ms | 10067ms |

For 1000 cards, the search did not complete within a 60s timeout during measurement.

## BUG-014: Due date accepts unrealistic far-future years

Requirement: FR6  
Severity: Medium  
Priority: Low  
Reproducibility: 100%

### Preconditions

Open the application in a clean browser context and create a card.

### Steps To Reproduce

1. Open the card edit modal.
2. Enter `275760-01-01` in the `Due Date` field.
3. Save the card.
4. Reopen the card edit modal.

### Expected Result

The due date field validates realistic due dates or defines an explicit maximum allowed date.

### Actual Result

The application accepts and stores a due date with year `275760`. This suggests that the application relies only on the
browser date field and does not define a realistic maximum date.

## BUG-015: Card modal can be saved with invalid due date input

Requirement: FR6  
Severity: Medium  
Priority: Medium  
Reproducibility: 100%

### Preconditions

Open the application in a clean browser context and create a card.

### Steps To Reproduce

1. Open the card edit modal.
2. Type an invalid date, for example `31.02.2012`, into the `Due Date` field.
3. Observe that the native date input is in an invalid state.
4. Click `Save changes`.
5. Reopen the card edit modal.

### Expected Result

The modal prevents saving while the due date field contains an invalid date, or it shows a clear validation message.

### Actual Result

The `Save changes` button remains enabled. Clicking it closes the modal without showing an application-level validation
message. After reopening the card, the invalid date is not visible.

## BUG-016: Keyboard cross-column reorder behaves unpredictably

Requirement: UX Requirements - Drag-and-Drop  
Severity: Medium  
Priority: Medium  
Reproducibility: 100%

### Preconditions

Open the application in a clean browser context and create multiple cards in `To Do` and `Doing`.

### Steps To Reproduce

1. Add 10 cards to `To Do`.
2. Add 10 cards to `Doing`.
3. Focus the drag handle of the last `To Do` card.
4. Press `Space`.
5. Press `ArrowLeft` twice.
6. Press `ArrowRight` several times.
7. Press `Space`.
8. Observe the visual movement and final card position.

### Expected Result

Keyboard drag-and-drop behaves predictably. Pressing `ArrowLeft` from the leftmost column should either do nothing or
move within the same column in a clear way. Cross-column movement should preserve a predictable target position.

### Actual Result

Pressing `ArrowLeft` from the leftmost column visually moves the selected card to the top of the same column. Subsequent
`ArrowRight` presses move the card through columns in unexpected positions, and the final drop can place it in a different
column than the user intended.

## BUG-017: Column description and policy auto-save without clear feedback

Requirement: FR2  
Severity: Low  
Priority: Medium  
Reproducibility: 100%

### Preconditions

Open the application in a clean browser context.

### Steps To Reproduce

1. Open the `Column settings` menu for a column.
2. Enter text in `Column description...`.
3. Enter text in `Column policy...`.
4. Look for a save, apply, or confirmation control for these fields.
5. Click outside the settings menu.
6. Reopen the column description or settings.

### Expected Result

The UI clearly communicates how column description and policy changes are saved. This could be an explicit save button,
autosave indicator, or immediate confirmation.

### Actual Result

Column description and policy changes are saved immediately while typing, but there is no explicit save control or
autosave feedback. This is inconsistent with the WIP section, which has a dedicated `Save WIP` button, and makes the save
behavior hard to discover.

## BUG-018: Card title tooltip advertises unavailable double-click edit

Requirement: UX Requirements - Visual Text  
Severity: Low  
Priority: Medium  
Reproducibility: 100%

### Preconditions

Open the application in a clean browser context and create a card.

### Steps To Reproduce

1. Hover the card title.
2. Observe the tooltip text.
3. Click the card title once.
4. Close the modal.
5. Double-click the card title.

### Expected Result

The tooltip accurately describes available interactions. If it says double-click edits the title, double-clicking should
open inline title editing.

### Actual Result

The tooltip says `Click to open, double-click to edit title`. Single click opens the card modal, but double-clicking does
not enter inline title edit mode.

## BUG-019: Clear all leaves stale text in the search input

Requirement: FR12, FR13  
Severity: Medium  
Priority: Medium  
Reproducibility: 100%

### Preconditions

Open the application with at least two cards with different titles.

### Steps To Reproduce

1. Type a matching value into the global search input, for example `Alpha`.
2. Verify that the board is filtered to matching cards.
3. Click `Clear all`.
4. Observe the search input and visible board results.

### Expected Result

The search state and the search input are both cleared, and all cards become visible.

### Actual Result

All cards become visible, but the search input still displays the previously entered text.

## BUG-020: Card description allows HTML/JavaScript injection

Requirement: Security  
Severity: Critical  
Priority: High  
Reproducibility: 100%

### Preconditions

Open the application and create a card.

### Steps To Reproduce

1. Open the card edit modal.
2. Enter an HTML payload in the description field, for example:

```html
<img src="x" onerror="window.__xss=1" />
```

3. Save the card.
4. Observe the rendered card description.

### Expected Result

The card description is shown as safe text. HTML tags and JavaScript are not interpreted by the browser.

### Actual Result

The description is interpreted as HTML. The test payload creates an image element and runs JavaScript from the `onerror`
handler.

## BUG-021: Expanded card display mode is not available

Requirement: UX Requirements - Information Density  
Severity: Medium  
Priority: Low  
Reproducibility: 100%

### Preconditions

Open the application with at least one card.

### Steps To Reproduce

1. Open the Kanban board.
2. Look for a control that switches cards between compact and expanded display modes.
3. Open a card and check whether the display mode can be changed from the card modal.
4. Check the board toolbar and card controls.

### Expected Result

The user can switch between compact and expanded card layout, or the application provides another clear way to use the
optional expanded mode described in the requirements.

### Actual Result

No compact/expanded mode control is available on the board, on cards, or in the card modal.
