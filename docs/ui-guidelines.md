# TODO App UI Guidelines

## Component Library

- All UI components must use **Material UI (MUI v5)** (`@mui/material`).
- Do not use custom-built replacements for components that MUI already provides (buttons, inputs, dialogs, chips, etc.).
- Use MUI's `ThemeProvider` and `CssBaseline` at the app root to enforce consistent styling.

## Color Palette

| Role | Color | MUI Token |
|---|---|---|
| Primary (actions, links) | Indigo 600 | `primary.main` → `#3949AB` |
| Primary dark (hover) | Indigo 800 | `primary.dark` → `#283593` |
| Secondary (priority badges, accents) | Amber 600 | `secondary.main` → `#FFB300` |
| Error / Overdue | Red 600 | `error.main` → `#E53935` |
| Success / Complete | Green 600 | `success.main` → `#43A047` |
| Background | Grey 50 | `background.default` → `#FAFAFA` |
| Surface (cards, dialogs) | White | `background.paper` → `#FFFFFF` |
| Body text | Grey 900 | `text.primary` → `#212121` |
| Secondary text | Grey 600 | `text.secondary` → `#757575` |

Define these values in a single MUI theme object; never hard-code hex values in component files.

## Typography

- Font family: **Roboto** (loaded via `@fontsource/roboto`).
- Task titles: `typography.subtitle1` (16 px, medium weight).
- Descriptions and metadata: `typography.body2` (14 px, regular weight).
- Section headings: `typography.h6` (20 px, medium weight).

## Button Styles

| Use case | Variant | Color |
|---|---|---|
| Primary action (Add Task, Save) | `contained` | `primary` |
| Destructive action (Delete) | `outlined` | `error` |
| Secondary / cancel action | `text` | `primary` |
| Icon-only action (Edit, Check) | `IconButton` | inherit |

- All buttons must include a descriptive `aria-label` when they contain only an icon.
- Minimum touch target size: **44 × 44 px** (use MUI `size="medium"` or larger).
- Do not disable buttons; prefer showing an inline validation message instead.

## Priority Indicators

Display task priority using MUI `Chip` components:

| Priority | Chip color |
|---|---|
| High | `error` |
| Medium | `warning` |
| Low | `default` |

## Layout

- Maximum content width: **800 px**, centered with `margin: auto`.
- Page padding: `24px` on desktop, `16px` on mobile (use MUI `Container`).
- Task cards use MUI `Card` with `elevation={1}` and `8px` border-radius.
- Spacing follows the MUI 8 px grid — use `theme.spacing()` exclusively; never use arbitrary `px` values in `sx` props.

## Accessibility Requirements

1. The app must meet **WCAG 2.1 Level AA** contrast ratios for all text and interactive elements.
2. Every form field must have an associated `<label>` or `aria-label`.
3. Interactive elements must be reachable and operable via **keyboard only** (Tab, Enter, Space, Escape).
4. Focus must be moved to the first field of a dialog/modal when it opens, and returned to the trigger element when it closes.
5. Dynamic content updates (task added, deleted, marked complete) must be announced via an `aria-live="polite"` region.
6. Color must never be the **sole** indicator of state (e.g., overdue tasks show both a red color and an "Overdue" label).
7. All images and decorative icons must have `alt=""` or `aria-hidden="true"`.

## Responsive Behavior

- The task list stacks vertically on all screen sizes.
- The filter/search bar collapses into a single row on screens ≥ 600 px and stacks vertically below 600 px.
- Font sizes and touch targets must not decrease on small screens.
