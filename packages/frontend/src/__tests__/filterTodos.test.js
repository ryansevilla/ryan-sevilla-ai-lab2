import { filterTodos } from '../utils/filterTodos';

const makeTodo = (overrides = {}) => ({
  id: Math.random(),
  title: 'Test Task',
  description: '',
  completed: 0,
  priority: 'Medium',
  due_date: null,
  created_at: '2026-01-01T00:00:00.000Z',
  ...overrides,
});

describe('filterTodos', () => {
  const activeTodo = makeTodo({ title: 'Active task', completed: 0 });
  const completedTodo = makeTodo({ title: 'Done task', completed: 1 });
  const todos = [activeTodo, completedTodo];

  describe('status filter', () => {
    it('returns all todos when status is All', () => {
      expect(filterTodos(todos, 'All', '')).toHaveLength(2);
    });

    it('returns only incomplete todos when status is Active', () => {
      const result = filterTodos(todos, 'Active', '');
      expect(result).toHaveLength(1);
      expect(result[0].title).toBe('Active task');
    });

    it('returns only completed todos when status is Completed', () => {
      const result = filterTodos(todos, 'Completed', '');
      expect(result).toHaveLength(1);
      expect(result[0].title).toBe('Done task');
    });
  });

  describe('keyword search', () => {
    it('matches against the title (case-insensitive)', () => {
      const result = filterTodos(todos, 'All', 'ACTIVE');
      expect(result).toHaveLength(1);
      expect(result[0].title).toBe('Active task');
    });

    it('matches against the description', () => {
      const withDesc = makeTodo({ description: 'important meeting' });
      const result = filterTodos([withDesc, activeTodo], 'All', 'meeting');
      expect(result).toHaveLength(1);
      expect(result[0].description).toBe('important meeting');
    });

    it('ignores leading and trailing whitespace in the search query', () => {
      const result = filterTodos(todos, 'All', '  Active  ');
      expect(result).toHaveLength(1);
    });

    it('returns empty array when no todos match the keyword', () => {
      expect(filterTodos(todos, 'All', 'xyz_no_match')).toHaveLength(0);
    });
  });

  describe('combined filters', () => {
    it('applies both status and keyword filter simultaneously', () => {
      const result = filterTodos(todos, 'Completed', 'done');
      expect(result).toHaveLength(1);
      expect(result[0].title).toBe('Done task');
    });
  });

  it('does not mutate the original array', () => {
    const original = [...todos];
    filterTodos(todos, 'Active', 'task');
    expect(todos).toEqual(original);
  });
});
