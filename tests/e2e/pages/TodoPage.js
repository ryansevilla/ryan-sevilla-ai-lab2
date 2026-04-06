/**
 * TodoPage — Page Object Model for the TODO app.
 * Encapsulates all selectors and interactions so spec files stay clean.
 */
class TodoPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto(process.env.BASE_URL || 'http://localhost:3000');
  }

  // ---- Add Task dialog ----

  async openAddTaskDialog() {
    await this.page.getByRole('button', { name: /add new task/i }).click();
    await this.page.waitForSelector('[role="dialog"]');
  }

  async fillTaskForm({ title, description, priority, dueDate } = {}) {
    if (title !== undefined) {
      await this.page.getByLabel('Task title').fill(title);
    }
    if (description !== undefined) {
      await this.page.getByLabel('Task description').fill(description);
    }
    if (priority !== undefined) {
      await this.page.getByLabel('Task priority').click();
      await this.page.getByRole('option', { name: priority }).click();
    }
    if (dueDate !== undefined) {
      await this.page.getByLabel('Task due date').fill(dueDate);
    }
  }

  async submitTaskForm(buttonLabel = /add task/i) {
    await this.page.getByRole('button', { name: buttonLabel }).click();
  }

  async closeDialog() {
    await this.page.getByRole('button', { name: /cancel/i }).click();
  }

  // ---- Task card interactions ----

  async getTodoCards() {
    return this.page.getByTestId('todo-card').all();
  }

  async getTodoCardByTitle(title) {
    return this.page.getByTestId('todo-card').filter({ hasText: title });
  }

  async toggleTodo(title) {
    const card = await this.getTodoCardByTitle(title);
    await card.getByRole('button', { name: /mark task (complete|incomplete)/i }).click();
  }

  async editTodo(title) {
    const card = await this.getTodoCardByTitle(title);
    await card.getByRole('button', { name: /edit task/i }).click();
    await this.page.waitForSelector('[role="dialog"]');
  }

  async deleteTodo(title) {
    const card = await this.getTodoCardByTitle(title);
    await card.getByRole('button', { name: /delete task/i }).click();
  }

  // ---- Filter bar ----

  async filterByStatus(status) {
    await this.page.getByRole('button', { name: new RegExp(`show ${status} tasks`, 'i') }).click();
  }

  async search(query) {
    await this.page.getByLabel('Search tasks').fill(query);
  }

  // ---- Assertions ----

  async waitForTodo(title) {
    await this.page.getByText(title).waitFor({ state: 'visible' });
  }

  async waitForTodoGone(title) {
    await this.page.getByText(title).waitFor({ state: 'hidden' });
  }
}

module.exports = { TodoPage };
