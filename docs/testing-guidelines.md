# TODO App Testing Guidelines

## General Principles

- All new features must include appropriate tests before merging.
- Every test must be **isolated and independent** — each test sets up its own data and does not rely on the state left by another test.
- **Setup and teardown hooks** (`beforeEach`, `afterEach`, `beforeAll`, `afterAll`) are required wherever shared state or side effects exist, so tests pass reliably across multiple runs.
- Tests must be maintainable: prefer clear naming, minimal duplication, and the Page Object Model (POM) pattern where applicable.

---

## Unit Tests

**Framework:** Jest

Unit tests verify individual functions and React components in isolation, with all external dependencies mocked.

### File Naming

- Use the convention `*.test.js` or `*.test.ts`.
- Name each test file to match the source file it covers (e.g., `app.test.js` tests `app.js`).

### Directory Conventions

| Layer | Location |
|---|---|
| Backend | `packages/backend/__tests__/` |
| Frontend | `packages/frontend/src/__tests__/` |

---

## Integration Tests

**Framework:** Jest + Supertest

Integration tests exercise backend API endpoints using real HTTP requests against a running Express app. They validate routing, middleware, request/response shapes, and status codes.

### File Naming

- Use the convention `*.test.js` or `*.test.ts`.
- Name files based on the resource or feature being tested (e.g., `todos-api.test.js` for TODO API endpoints).

### Directory Convention

| Layer | Location |
|---|---|
| Backend API | `packages/backend/__tests__/integration/` |

---

## End-to-End (E2E) Tests

**Framework:** Playwright (required — do not substitute Cypress or another framework)

E2E tests validate complete UI workflows through real browser automation. Focus on **happy paths and key edge cases**, not exhaustive coverage.

### Scope

- Limit to **5–8 critical user journeys** per feature area.
- Examples: creating a task, editing a task, marking a task complete, filtering by status, deleting a task.

### File Naming

- Use the convention `*.spec.js` or `*.spec.ts`.
- Name files based on the user journey they cover (e.g., `todo-workflow.spec.js`).

### Directory Convention

| Layer | Location |
|---|---|
| E2E | `tests/e2e/` |

### Playwright Configuration Requirements

- **One browser only** — configure Playwright to run against a single browser (e.g., Chromium) to keep CI fast and deterministic.
- **Page Object Model (POM)** — all page interactions must be encapsulated in POM classes stored under `tests/e2e/pages/`. Tests import and use these classes; selectors and actions must not be inlined directly in spec files.

---

## Port Configuration

Always use environment variables with sensible defaults so CI/CD workflows can detect ports dynamically.

```js
// Backend
const PORT = process.env.PORT || 3030;

// Frontend (React default; override with PORT env var)
// PORT=3000 (default Create React App behavior)
```

- Playwright's `baseURL` must also read from an environment variable (e.g., `process.env.BASE_URL || 'http://localhost:3000'`).
- Never hard-code port numbers inside test files.
