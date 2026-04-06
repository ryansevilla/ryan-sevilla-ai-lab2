const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const Database = require('better-sqlite3');
const todoService = require('./services/todoService');

// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Initialize SQLite database (file-based for persistence)
const DB_PATH = process.env.DB_PATH || path.join(__dirname, '..', 'todos.db');
const db = new Database(DB_PATH);

// Enable WAL mode for better concurrent performance
db.pragma('journal_mode = WAL');

// Create todos table
db.exec(`
  CREATE TABLE IF NOT EXISTS todos (
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

// Health check endpoint
app.get('/', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Backend server is running' });
});

// GET /api/todos — fetch all todos
app.get('/api/todos', (req, res) => {
  try {
    const todos = todoService.getAllTodos(db);
    res.json(todos);
  } catch (error) {
    console.error('Error fetching todos:', error);
    res.status(500).json({ error: 'Failed to fetch todos' });
  }
});

// POST /api/todos — create a new todo
app.post('/api/todos', (req, res) => {
  try {
    const { title, description, priority, due_date } = req.body;

    if (!title || typeof title !== 'string' || title.trim() === '') {
      return res.status(400).json({ error: 'Title is required and cannot be empty' });
    }

    const validPriorities = ['Low', 'Medium', 'High'];
    if (priority && !validPriorities.includes(priority)) {
      return res.status(400).json({ error: 'Priority must be Low, Medium, or High' });
    }

    if (due_date && isNaN(Date.parse(due_date))) {
      return res.status(400).json({ error: 'Invalid due_date format' });
    }

    const todo = todoService.createTodo(db, { title, description, priority, due_date });
    res.status(201).json(todo);
  } catch (error) {
    console.error('Error creating todo:', error);
    res.status(500).json({ error: 'Failed to create todo' });
  }
});

// PUT /api/todos/:id — update title, description, priority, due_date
app.put('/api/todos/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Valid todo ID is required' });
    }

    const { title, description, priority, due_date } = req.body;

    if (title !== undefined && (typeof title !== 'string' || title.trim() === '')) {
      return res.status(400).json({ error: 'Title cannot be empty' });
    }

    const validPriorities = ['Low', 'Medium', 'High'];
    if (priority && !validPriorities.includes(priority)) {
      return res.status(400).json({ error: 'Priority must be Low, Medium, or High' });
    }

    if (due_date && isNaN(Date.parse(due_date))) {
      return res.status(400).json({ error: 'Invalid due_date format' });
    }

    const existing = todoService.getTodoById(db, id);
    if (!existing) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    const updated = todoService.updateTodo(db, id, { title, description, priority, due_date });
    res.json(updated);
  } catch (error) {
    console.error('Error updating todo:', error);
    res.status(500).json({ error: 'Failed to update todo' });
  }
});

// PATCH /api/todos/:id/toggle — toggle completed status
app.patch('/api/todos/:id/toggle', (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Valid todo ID is required' });
    }

    const existing = todoService.getTodoById(db, id);
    if (!existing) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    const updated = todoService.toggleTodo(db, id);
    res.json(updated);
  } catch (error) {
    console.error('Error toggling todo:', error);
    res.status(500).json({ error: 'Failed to toggle todo' });
  }
});

// DELETE /api/todos/:id — permanently delete a todo
app.delete('/api/todos/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Valid todo ID is required' });
    }

    const existing = todoService.getTodoById(db, id);
    if (!existing) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    todoService.deleteTodo(db, id);
    res.json({ message: 'Todo deleted successfully', id });
  } catch (error) {
    console.error('Error deleting todo:', error);
    res.status(500).json({ error: 'Failed to delete todo' });
  }
});

module.exports = { app, db };