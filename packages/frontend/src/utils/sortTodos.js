const PRIORITY_ORDER = { High: 0, Medium: 1, Low: 2 };

/**
 * Returns true when a todo is past its due date and not yet completed.
 * @param {object} todo
 * @returns {boolean}
 */
function isOverdue(todo) {
  if (!todo.due_date || todo.completed) return false;
  return new Date(todo.due_date) < new Date(new Date().toDateString());
}

/**
 * Sorts todos by: overdue first → due date asc → priority (High→Med→Low) → created_at desc.
 * Pure function — returns a new array without mutating the input.
 * @param {object[]} todos
 * @returns {object[]}
 */
function sortTodos(todos) {
  return [...todos].sort((a, b) => {
    const aOverdue = isOverdue(a) ? 0 : 1;
    const bOverdue = isOverdue(b) ? 0 : 1;
    if (aOverdue !== bOverdue) return aOverdue - bOverdue;

    // Due date ascending; nulls go last
    if (a.due_date && b.due_date) {
      const dateDiff = new Date(a.due_date) - new Date(b.due_date);
      if (dateDiff !== 0) return dateDiff;
    } else if (a.due_date) {
      return -1;
    } else if (b.due_date) {
      return 1;
    }

    // Priority descending (High first)
    const aPriority = PRIORITY_ORDER[a.priority] ?? 1;
    const bPriority = PRIORITY_ORDER[b.priority] ?? 1;
    if (aPriority !== bPriority) return aPriority - bPriority;

    // Creation time descending (newest first)
    return new Date(b.created_at) - new Date(a.created_at);
  });
}

export { sortTodos, isOverdue };
