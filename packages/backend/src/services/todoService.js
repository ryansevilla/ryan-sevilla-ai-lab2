/**
 * todoService — pure data-access functions for the todos table.
 * Each function accepts a `db` instance so they remain testable in isolation.
 */

/**
 * Returns all todos ordered by creation time (newest first).
 * @param {import('better-sqlite3').Database} db
 * @returns {object[]}
 */
function getAllTodos(db) {
  return db.prepare('SELECT * FROM todos ORDER BY created_at DESC').all();
}

/**
 * Returns a single todo by id, or undefined if not found.
 * @param {import('better-sqlite3').Database} db
 * @param {number} id
 * @returns {object|undefined}
 */
function getTodoById(db, id) {
  return db.prepare('SELECT * FROM todos WHERE id = ?').get(id);
}

/**
 * Creates a new todo and returns the persisted record.
 * @param {import('better-sqlite3').Database} db
 * @param {{ title: string, description?: string, priority?: string, due_date?: string }} data
 * @returns {object}
 */
function createTodo(db, { title, description = '', priority = 'Medium', due_date = null }) {
  const stmt = db.prepare(`
    INSERT INTO todos (title, description, priority, due_date)
    VALUES (?, ?, ?, ?)
  `);
  const result = stmt.run(title.trim(), description || '', priority, due_date || null);
  return getTodoById(db, result.lastInsertRowid);
}

/**
 * Updates editable fields on a todo and returns the updated record.
 * Only fields provided in `data` are changed.
 * @param {import('better-sqlite3').Database} db
 * @param {number} id
 * @param {{ title?: string, description?: string, priority?: string, due_date?: string }} data
 * @returns {object}
 */
function updateTodo(db, id, { title, description, priority, due_date }) {
  const existing = getTodoById(db, id);
  const newTitle = title !== undefined ? title.trim() : existing.title;
  const newDescription = description !== undefined ? description : existing.description;
  const newPriority = priority !== undefined ? priority : existing.priority;
  const newDueDate = due_date !== undefined ? due_date || null : existing.due_date;

  db.prepare(`
    UPDATE todos
    SET title = ?, description = ?, priority = ?, due_date = ?, updated_at = datetime('now')
    WHERE id = ?
  `).run(newTitle, newDescription, newPriority, newDueDate, id);

  return getTodoById(db, id);
}

/**
 * Toggles the completed status of a todo and returns the updated record.
 * @param {import('better-sqlite3').Database} db
 * @param {number} id
 * @returns {object}
 */
function toggleTodo(db, id) {
  db.prepare(`
    UPDATE todos
    SET completed = CASE WHEN completed = 0 THEN 1 ELSE 0 END,
        updated_at = datetime('now')
    WHERE id = ?
  `).run(id);
  return getTodoById(db, id);
}

/**
 * Permanently deletes a todo.
 * @param {import('better-sqlite3').Database} db
 * @param {number} id
 */
function deleteTodo(db, id) {
  db.prepare('DELETE FROM todos WHERE id = ?').run(id);
}

module.exports = { getAllTodos, getTodoById, createTodo, updateTodo, toggleTodo, deleteTodo };
