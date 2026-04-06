# TODO App Coding Guidelines

This document describes the coding style, formatting rules, and quality principles that all contributors and AI assistants must follow when working on this project.

---

## General Formatting

Consistent formatting reduces noise in code reviews and keeps the codebase readable. All JavaScript and JSX files must follow these rules:

- **Indentation:** 2 spaces — never tabs.
- **Quotes:** single quotes for strings in JS/JSX (`'hello'`), double quotes only inside JSX attribute values (`<Component label="hello" />`).
- **Semicolons:** always include a trailing semicolon at the end of statements.
- **Line length:** keep lines under **100 characters**. Break long expressions at logical boundaries (e.g., after a comma or before a binary operator).
- **Trailing commas:** include trailing commas in multi-line arrays, objects, and function parameter lists. This produces cleaner diffs.
- **Blank lines:** one blank line between top-level declarations; no consecutive blank lines inside a function body.

These rules are enforced automatically by **ESLint** and **Prettier** — do not bypass them with `// eslint-disable` comments unless there is a documented reason.

---

## Import Organization

Imports at the top of every file must be grouped and ordered as follows:

1. **Node built-ins** (e.g., `path`, `fs`)
2. **Third-party packages** (e.g., `react`, `express`, `@mui/material`)
3. **Internal modules** — absolute or relative imports from within the project

Leave one blank line between each group. Within a group, sort imports alphabetically by module name.

```js
// 1. Node built-ins
import path from 'path';

// 2. Third-party packages
import express from 'express';
import { Button } from '@mui/material';

// 3. Internal modules
import TodoList from '../components/TodoList';
import { formatDate } from '../utils/date';
```

Named imports from the same module must be listed on a single line when they fit within the line-length limit; otherwise break them onto individual lines, one per line, with a trailing comma.

---

## Linter Usage

The project uses **ESLint** with the `eslint:recommended` ruleset, extended with React and React Hooks rules on the frontend.

- Run `npm run lint` in a package directory before committing. The CI pipeline will fail on lint errors.
- Fix all errors; warnings may be left if fixing them would require a large unrelated refactor, but they should not accumulate.
- Never commit with `--no-verify` to skip the pre-commit lint check.
- ESLint configuration lives in each package's `package.json` or `.eslintrc` file. Do not add package-level overrides without updating the shared config first.

---

## Naming Conventions

Clear, self-describing names are preferred over abbreviations or single-letter identifiers (except conventional loop counters like `i`).

| Entity | Convention | Example |
|---|---|---|
| Variables and functions | `camelCase` | `fetchTodos`, `isComplete` |
| React components | `PascalCase` | `TodoCard`, `FilterBar` |
| Constants (module-level) | `UPPER_SNAKE_CASE` | `MAX_TITLE_LENGTH` |
| CSS class names | `kebab-case` | `todo-card__title` |
| Test describe blocks | Plain English sentence | `'when a task is marked complete'` |
| Test it/test blocks | Plain English sentence starting with a verb | `'renders the task title'` |

---

## DRY Principle

Do not Repeat Yourself. If the same logic appears in more than one place, extract it into a shared utility, hook, or component:

- **Shared utilities** belong in `packages/backend/src/utils/` (backend) or `packages/frontend/src/utils/` (frontend).
- **Shared React logic** belongs in a custom hook under `packages/frontend/src/hooks/`.
- **Reusable UI fragments** belong in `packages/frontend/src/components/`.

Duplication is acceptable only when the two pieces of code happen to look the same today but represent genuinely different concerns that will evolve independently.

---

## Single Responsibility

Each function, component, or module should do one thing and do it well:

- A React component either manages state **or** renders UI — not both. Lift state into a parent or a custom hook when a presentational component starts accumulating logic.
- An Express route handler validates the request and delegates business logic to a service function; it does not contain SQL queries or complex transformations inline.
- Utility functions must be pure (no side effects) wherever possible.

---

## Error Handling

- **Backend:** all async route handlers must be wrapped in try/catch (or use an async error-handling middleware). Never let an unhandled promise rejection crash the server.
- **Frontend:** use React error boundaries for component trees that fetch data. Show a user-friendly message rather than a blank screen on failure.
- Log errors with enough context to debug (request ID, relevant IDs), but never log sensitive user data.

---

## Comments and Documentation

Write code that explains itself through good naming. Add a comment only when the *why* is not obvious from the *what*:

- **Good comment:** `// Debounce to avoid flooding the API on every keystroke`
- **Bad comment:** `// Increment i by 1` above `i++`

JSDoc comments are required on exported utility functions and service methods. They are not required on React component props (use PropTypes or TypeScript types instead).

---

## Code Review Checklist

Before opening a pull request, verify that the code:

- [ ] Passes `npm run lint` with no errors
- [ ] Passes all existing tests (`npm test`)
- [ ] Includes new or updated tests for the changed behavior
- [ ] Does not introduce hard-coded secrets, ports, or environment-specific values
- [ ] Follows the naming conventions and import order described above
- [ ] Does not duplicate logic that already exists elsewhere in the codebase
