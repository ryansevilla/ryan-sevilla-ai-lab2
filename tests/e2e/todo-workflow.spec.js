const { test, expect } = require('@playwright/test');
const { TodoPage } = require('./pages/TodoPage');

// ---------------------------------------------------------------------------
// Each test creates its own tasks to stay isolated and independent.
// ---------------------------------------------------------------------------

test.describe('TODO App — critical user journeys', () => {
  let todoPage;

  test.beforeEach(async ({ page }) => {
    todoPage = new TodoPage(page);
    await todoPage.goto();
  });

  // 1. Create a task and verify it appears in the list
  test('creates a new task and displays it in the list', async () => {
    const title = `Create Test ${Date.now()}`;

    await todoPage.openAddTaskDialog();
    await todoPage.fillTaskForm({ title, description: 'A test task' });
    await todoPage.submitTaskForm(/add task/i);

    await todoPage.waitForTodo(title);
  });

  // 2. Edit a task's title
  test('edits an existing task title', async () => {
    const original = `Edit Me ${Date.now()}`;
    const updated = `Edited ${Date.now()}`;

    await todoPage.openAddTaskDialog();
    await todoPage.fillTaskForm({ title: original });
    await todoPage.submitTaskForm(/add task/i);
    await todoPage.waitForTodo(original);

    await todoPage.editTodo(original);
    await todoPage.fillTaskForm({ title: updated });
    await todoPage.submitTaskForm(/save changes/i);

    await todoPage.waitForTodo(updated);
  });

  // 3. Mark a task complete
  test('marks a task as complete and shows the Completed chip', async () => {
    const title = `Complete Me ${Date.now()}`;

    await todoPage.openAddTaskDialog();
    await todoPage.fillTaskForm({ title });
    await todoPage.submitTaskForm(/add task/i);
    await todoPage.waitForTodo(title);

    await todoPage.toggleTodo(title);

    const card = await todoPage.getTodoCardByTitle(title);
    await expect(card.getByText('Completed')).toBeVisible();
  });

  // 4. Delete a task — it must disappear from the list
  test('deletes a task and removes it from the list', async ({ page }) => {
    const title = `Delete Me ${Date.now()}`;

    await todoPage.openAddTaskDialog();
    await todoPage.fillTaskForm({ title });
    await todoPage.submitTaskForm(/add task/i);
    await todoPage.waitForTodo(title);

    await todoPage.deleteTodo(title);

    await expect(page.getByText(title)).toHaveCount(0);
  });

  // 5. Filter by Active status hides completed tasks
  test('filters tasks by Active status', async ({ page }) => {
    const activeTitle = `Active ${Date.now()}`;
    const completedTitle = `Completed ${Date.now()}`;

    await todoPage.openAddTaskDialog();
    await todoPage.fillTaskForm({ title: activeTitle });
    await todoPage.submitTaskForm(/add task/i);
    await todoPage.waitForTodo(activeTitle);

    await todoPage.openAddTaskDialog();
    await todoPage.fillTaskForm({ title: completedTitle });
    await todoPage.submitTaskForm(/add task/i);
    await todoPage.waitForTodo(completedTitle);
    await todoPage.toggleTodo(completedTitle);

    await todoPage.filterByStatus('Active');

    await expect(page.getByText(activeTitle)).toBeVisible();
    await expect(page.getByText(completedTitle)).toHaveCount(0);
  });

  // 6. Filter by Completed status hides active tasks
  test('filters tasks by Completed status', async ({ page }) => {
    const activeTitle = `Stay Active ${Date.now()}`;
    const completedTitle = `I Am Done ${Date.now()}`;

    await todoPage.openAddTaskDialog();
    await todoPage.fillTaskForm({ title: activeTitle });
    await todoPage.submitTaskForm(/add task/i);
    await todoPage.waitForTodo(activeTitle);

    await todoPage.openAddTaskDialog();
    await todoPage.fillTaskForm({ title: completedTitle });
    await todoPage.submitTaskForm(/add task/i);
    await todoPage.waitForTodo(completedTitle);
    await todoPage.toggleTodo(completedTitle);

    await todoPage.filterByStatus('Completed');

    await expect(page.getByText(completedTitle)).toBeVisible();
    await expect(page.getByText(activeTitle)).toHaveCount(0);
  });

  // 7. Search by keyword
  test('searches tasks by keyword and shows only matching results', async ({ page }) => {
    const matchTitle = `Searchable Unique Keyword ${Date.now()}`;
    const noMatchTitle = `Unrelated Task ${Date.now()}`;

    await todoPage.openAddTaskDialog();
    await todoPage.fillTaskForm({ title: matchTitle });
    await todoPage.submitTaskForm(/add task/i);
    await todoPage.waitForTodo(matchTitle);

    await todoPage.openAddTaskDialog();
    await todoPage.fillTaskForm({ title: noMatchTitle });
    await todoPage.submitTaskForm(/add task/i);
    await todoPage.waitForTodo(noMatchTitle);

    await todoPage.search('Searchable Unique Keyword');

    await expect(page.getByText(matchTitle)).toBeVisible();
    await expect(page.getByText(noMatchTitle)).toHaveCount(0);
  });

  // 8. Validate that an empty title shows an error and does not submit
  test('shows validation error when submitting an empty title', async ({ page }) => {
    await todoPage.openAddTaskDialog();
    await todoPage.submitTaskForm(/add task/i);

    await expect(page.getByText(/title is required/i)).toBeVisible();
    await expect(page.getByRole('dialog')).toBeVisible();
  });
});
