const todoService = require('../src/services/todoService');
const Database = require('better-sqlite3');

// Use an in-memory database for unit tests
let db;

beforeEach(() => {
  db = new Database(':memory:');
  db.exec(`
    CREATE TABLE todos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT DEFAULT '',
      completed INTEGER DEFAULT 0,
      priority TEXT DEFAULT 'Medium',
      due_date TEXT DEFAULT NULL,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    )
  `);
});

afterEach(() => {
  db.close();
});

describe('todoService', () => {
  describe('createTodo', () => {
    it('creates a todo with required fields', () => {
      const todo = todoService.createTodo(db, { title: 'Buy groceries' });

      expect(todo).toMatchObject({
        title: 'Buy groceries',
        description: '',
        completed: 0,
        priority: 'Medium',
        due_date: null,
      });
      expect(todo.id).toBeDefined();
    });

    it('trims whitespace from the title', () => {
      const todo = todoService.createTodo(db, { title: '  Clean room  ' });
      expect(todo.title).toBe('Clean room');
    });

    it('stores optional description, priority, and due_date', () => {
      const todo = todoService.createTodo(db, {
        title: 'Exercise',
        description: 'Go for a run',
        priority: 'High',
        due_date: '2026-12-31',
      });

      expect(todo.description).toBe('Go for a run');
      expect(todo.priority).toBe('High');
      expect(todo.due_date).toBe('2026-12-31');
    });
  });

  describe('getAllTodos', () => {
    it('returns an empty array when there are no todos', () => {
      expect(todoService.getAllTodos(db)).toEqual([]);
    });

    it('returns all created todos', () => {
      todoService.createTodo(db, { title: 'Task A' });
      todoService.createTodo(db, { title: 'Task B' });
      const todos = todoService.getAllTodos(db);
      expect(todos).toHaveLength(2);
    });
  });

  describe('getTodoById', () => {
    it('returns the correct todo', () => {
      const created = todoService.createTodo(db, { title: 'Find me' });
      const found = todoService.getTodoById(db, created.id);
      expect(found.title).toBe('Find me');
    });

    it('returns undefined for a non-existent id', () => {
      expect(todoService.getTodoById(db, 9999)).toBeUndefined();
    });
  });

  describe('updateTodo', () => {
    it('updates only the provided fields', () => {
      const todo = todoService.createTodo(db, { title: 'Original', priority: 'Low' });
      const updated = todoService.updateTodo(db, todo.id, { title: 'Updated' });

      expect(updated.title).toBe('Updated');
      expect(updated.priority).toBe('Low');
    });

    it('trims whitespace from updated title', () => {
      const todo = todoService.createTodo(db, { title: 'Trim me' });
      const updated = todoService.updateTodo(db, todo.id, { title: '  Trimmed  ' });
      expect(updated.title).toBe('Trimmed');
    });
  });

  describe('toggleTodo', () => {
    it('marks an incomplete todo as completed', () => {
      const todo = todoService.createTodo(db, { title: 'Toggle me' });
      expect(todo.completed).toBe(0);

      const toggled = todoService.toggleTodo(db, todo.id);
      expect(toggled.completed).toBe(1);
    });

    it('marks a completed todo as incomplete', () => {
      const todo = todoService.createTodo(db, { title: 'Toggle me back' });
      todoService.toggleTodo(db, todo.id);
      const toggled = todoService.toggleTodo(db, todo.id);
      expect(toggled.completed).toBe(0);
    });
  });

  describe('deleteTodo', () => {
    it('removes the todo from the database', () => {
      const todo = todoService.createTodo(db, { title: 'Delete me' });
      todoService.deleteTodo(db, todo.id);
      expect(todoService.getTodoById(db, todo.id)).toBeUndefined();
    });
  });
});
