/**
 * Filters todos by status and keyword search.
 * Pure function — returns a new array without mutating the input.
 *
 * @param {object[]} todos
 * @param {'All'|'Active'|'Completed'} statusFilter
 * @param {string} searchQuery
 * @returns {object[]}
 */
function filterTodos(todos, statusFilter, searchQuery) {
  const keyword = searchQuery.trim().toLowerCase();

  return todos.filter((todo) => {
    if (statusFilter === 'Active' && todo.completed) return false;
    if (statusFilter === 'Completed' && !todo.completed) return false;

    if (keyword) {
      const inTitle = todo.title.toLowerCase().includes(keyword);
      const inDescription = (todo.description || '').toLowerCase().includes(keyword);
      if (!inTitle && !inDescription) return false;
    }

    return true;
  });
}

export { filterTodos };
