const request = require('supertest');
const Database = require('better-sqlite3');

// Build a fresh in-memory app for each test run to avoid file-based DB conflicts
let app;
let db;

beforeEach(() => {
  // Override DB_PATH to use in-memory database
  process.env.DB_PATH = ':memory:';
  jest.resetModules();
  ({ app, db } = require('../../src/app'));
});

afterEach(() => {
  if (db) db.close();
  delete process.env.DB_PATH;
});

// ---------------------------------------------------------------------------
// Helper
// ---------------------------------------------------------------------------
const createTodo = async (overrides = {}) => {
  const payload = { title: 'Test Task', priority: 'Medium', ...overrides };
  const res = await request(app).post('/api/todos').send(payload);
  expect(res.status).toBe(201);
  return res.body;
};

// ---------------------------------------------------------------------------
// GET /api/todos
// ---------------------------------------------------------------------------
describe('GET /api/todos', () => {
  it('returns 200 and an empty array when there are no todos', async () => {
    const res = await request(app).get('/api/todos');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body).toHaveLength(0);
  });

  it('returns all created todos', async () => {
    await createTodo({ title: 'Task A' });
    await createTodo({ title: 'Task B' });
    const res = await request(app).get('/api/todos');
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
  });
});

// ---------------------------------------------------------------------------
// POST /api/todos
// ---------------------------------------------------------------------------
describe('POST /api/todos', () => {
  it('creates a todo and returns 201 with the full record', async () => {
    const res = await request(app)
      .post('/api/todos')
      .send({ title: 'Buy milk', description: 'Whole milk', priority: 'Low' });

    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({
      title: 'Buy milk',
      description: 'Whole milk',
      priority: 'Low',
      completed: 0,
    });
    expect(res.body.id).toBeDefined();
  });

  it('returns 400 when title is missing', async () => {
    const res = await request(app).post('/api/todos').send({ description: 'No title' });
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/title/i);
  });

  it('returns 400 when title is whitespace only', async () => {
    const res = await request(app).post('/api/todos').send({ title: '   ' });
    expect(res.status).toBe(400);
  });

  it('returns 400 for an invalid priority value', async () => {
    const res = await request(app)
      .post('/api/todos')
      .send({ title: 'Task', priority: 'Critical' });
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/priority/i);
  });

  it('returns 400 for an invalid due_date', async () => {
    const res = await request(app)
      .post('/api/todos')
      .send({ title: 'Task', due_date: 'not-a-date' });
    expect(res.status).toBe(400);
  });
});

// ---------------------------------------------------------------------------
// PUT /api/todos/:id
// ---------------------------------------------------------------------------
describe('PUT /api/todos/:id', () => {
  it('updates the todo and returns the updated record', async () => {
    const todo = await createTodo({ title: 'Original Title' });
    const res = await request(app)
      .put(`/api/todos/${todo.id}`)
      .send({ title: 'Updated Title', priority: 'High' });

    expect(res.status).toBe(200);
    expect(res.body.title).toBe('Updated Title');
    expect(res.body.priority).toBe('High');
  });

  it('returns 404 for a non-existent todo', async () => {
    const res = await request(app)
      .put('/api/todos/9999')
      .send({ title: 'Ghost Task' });
    expect(res.status).toBe(404);
  });

  it('returns 400 when trying to set an empty title', async () => {
    const todo = await createTodo();
    const res = await request(app)
      .put(`/api/todos/${todo.id}`)
      .send({ title: '' });
    expect(res.status).toBe(400);
  });
});

// ---------------------------------------------------------------------------
// PATCH /api/todos/:id/toggle
// ---------------------------------------------------------------------------
describe('PATCH /api/todos/:id/toggle', () => {
  it('toggles completed from 0 to 1', async () => {
    const todo = await createTodo();
    const res = await request(app).patch(`/api/todos/${todo.id}/toggle`);
    expect(res.status).toBe(200);
    expect(res.body.completed).toBe(1);
  });

  it('toggles completed from 1 back to 0', async () => {
    const todo = await createTodo();
    await request(app).patch(`/api/todos/${todo.id}/toggle`);
    const res = await request(app).patch(`/api/todos/${todo.id}/toggle`);
    expect(res.status).toBe(200);
    expect(res.body.completed).toBe(0);
  });

  it('returns 404 for a non-existent todo', async () => {
    const res = await request(app).patch('/api/todos/9999/toggle');
    expect(res.status).toBe(404);
  });
});

// ---------------------------------------------------------------------------
// DELETE /api/todos/:id
// ---------------------------------------------------------------------------
describe('DELETE /api/todos/:id', () => {
  it('deletes the todo and returns 200', async () => {
    const todo = await createTodo();
    const res = await request(app).delete(`/api/todos/${todo.id}`);
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(todo.id);
  });

  it('returns 404 when deleting a non-existent todo', async () => {
    const res = await request(app).delete('/api/todos/9999');
    expect(res.status).toBe(404);
  });

  it('returns 400 for a non-numeric id', async () => {
    const res = await request(app).delete('/api/todos/abc');
    expect(res.status).toBe(400);
  });

  it('removes the todo so it no longer appears in GET /api/todos', async () => {
    const todo = await createTodo({ title: 'Gone soon' });
    await request(app).delete(`/api/todos/${todo.id}`);
    const res = await request(app).get('/api/todos');
    const ids = res.body.map((t) => t.id);
    expect(ids).not.toContain(todo.id);
  });
});
