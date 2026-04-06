import { sortTodos, isOverdue } from '../utils/sortTodos';

const today = new Date().toISOString().split('T')[0];
const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

const makeTodo = (overrides = {}) => ({
  id: Math.random(),
  title: 'Test',
  description: '',
  completed: 0,
  priority: 'Medium',
  due_date: null,
  created_at: '2026-01-01T00:00:00.000Z',
  ...overrides,
});

describe('isOverdue', () => {
  it('returns false when there is no due date', () => {
    expect(isOverdue(makeTodo())).toBe(false);
  });

  it('returns false when the todo is completed', () => {
    expect(isOverdue(makeTodo({ due_date: yesterday, completed: 1 }))).toBe(false);
  });

  it('returns true when due date is in the past and todo is incomplete', () => {
    expect(isOverdue(makeTodo({ due_date: yesterday }))).toBe(true);
  });

  it('returns false when due date is today', () => {
    expect(isOverdue(makeTodo({ due_date: today }))).toBe(false);
  });

  it('returns false when due date is in the future', () => {
    expect(isOverdue(makeTodo({ due_date: tomorrow }))).toBe(false);
  });
});

describe('sortTodos', () => {
  it('does not mutate the original array', () => {
    const todos = [makeTodo({ title: 'A' }), makeTodo({ title: 'B' })];
    const original = [...todos];
    sortTodos(todos);
    expect(todos).toEqual(original);
  });

  it('places overdue todos before non-overdue todos', () => {
    const overdueTodo = makeTodo({ title: 'Overdue', due_date: yesterday });
    const normal = makeTodo({ title: 'Normal' });
    const sorted = sortTodos([normal, overdueTodo]);
    expect(sorted[0].title).toBe('Overdue');
  });

  it('sorts by due date ascending when both are non-overdue', () => {
    const soon = makeTodo({ title: 'Soon', due_date: tomorrow });
    const later = makeTodo({ title: 'Later', due_date: '2099-12-31' });
    const sorted = sortTodos([later, soon]);
    expect(sorted[0].title).toBe('Soon');
  });

  it('places todos with due dates before todos without due dates', () => {
    const withDue = makeTodo({ title: 'Has due', due_date: '2099-01-01' });
    const withoutDue = makeTodo({ title: 'No due' });
    const sorted = sortTodos([withoutDue, withDue]);
    expect(sorted[0].title).toBe('Has due');
  });

  it('sorts by priority when due dates are equal', () => {
    const high = makeTodo({ title: 'High', priority: 'High', due_date: tomorrow });
    const low = makeTodo({ title: 'Low', priority: 'Low', due_date: tomorrow });
    const sorted = sortTodos([low, high]);
    expect(sorted[0].title).toBe('High');
  });

  it('sorts by created_at descending (newest first) as last tiebreaker', () => {
    const older = makeTodo({ title: 'Older', created_at: '2026-01-01T00:00:00.000Z' });
    const newer = makeTodo({ title: 'Newer', created_at: '2026-06-01T00:00:00.000Z' });
    const sorted = sortTodos([older, newer]);
    expect(sorted[0].title).toBe('Newer');
  });
});
