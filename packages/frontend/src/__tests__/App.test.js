import React, { act } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { ThemeProvider } from '@mui/material/styles';
import App from '../App';
import theme from '../theme';

const SAMPLE_TODOS = [
  {
    id: 1,
    title: 'Buy groceries',
    description: 'Milk and eggs',
    completed: 0,
    priority: 'High',
    due_date: null,
    created_at: '2026-01-01T00:00:00.000Z',
    updated_at: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 2,
    title: 'Read a book',
    description: '',
    completed: 1,
    priority: 'Low',
    due_date: null,
    created_at: '2026-01-02T00:00:00.000Z',
    updated_at: '2026-01-02T00:00:00.000Z',
  },
];

const server = setupServer(
  rest.get('/api/todos', (_req, res, ctx) => res(ctx.status(200), ctx.json(SAMPLE_TODOS))),

  rest.post('/api/todos', async (req, res, ctx) => {
    const body = await req.json();
    if (!body.title || body.title.trim() === '') {
      return res(ctx.status(400), ctx.json({ error: 'Title is required and cannot be empty' }));
    }
    return res(
      ctx.status(201),
      ctx.json({
        id: 3,
        title: body.title,
        description: body.description || '',
        completed: 0,
        priority: body.priority || 'Medium',
        due_date: body.due_date || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }),
    );
  }),

  rest.patch('/api/todos/:id/toggle', (req, res, ctx) => {
    const id = parseInt(req.params.id, 10);
    const todo = SAMPLE_TODOS.find((t) => t.id === id);
    if (!todo) return res(ctx.status(404), ctx.json({ error: 'Todo not found' }));
    return res(ctx.status(200), ctx.json({ ...todo, completed: todo.completed ? 0 : 1 }));
  }),

  rest.delete('/api/todos/:id', (req, res, ctx) => {
    const id = parseInt(req.params.id, 10);
    return res(ctx.status(200), ctx.json({ message: 'Todo deleted successfully', id }));
  }),
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

const renderApp = () =>
  render(
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>,
  );

describe('App Component', () => {
  it('renders the app heading', async () => {
    await act(async () => {
      renderApp();
    });
    expect(screen.getByText('To Do App')).toBeInTheDocument();
  });

  it('displays todos loaded from the API', async () => {
    renderApp();
    await waitFor(() => {
      expect(screen.getByText('Buy groceries')).toBeInTheDocument();
      expect(screen.getByText('Read a book')).toBeInTheDocument();
    });
  });

  it('opens the Add Task dialog when the button is clicked', async () => {
    const user = userEvent.setup();
    renderApp();
    await waitFor(() => screen.getByText('Buy groceries'));
    await user.click(screen.getByRole('button', { name: /add new task/i }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByLabelText(/task title/i)).toBeInTheDocument();
  });

  it('adds a new task via the form', async () => {
    const user = userEvent.setup();
    renderApp();
    await waitFor(() => screen.getByText('Buy groceries'));

    await user.click(screen.getByRole('button', { name: /add new task/i }));
    await user.type(screen.getByLabelText(/task title/i), 'New Task');
    await user.click(screen.getByRole('button', { name: /add task/i }));

    await waitFor(() => expect(screen.getByText('New Task')).toBeInTheDocument());
  });

  it('shows an error message when the API fails to load', async () => {
    server.use(
      rest.get('/api/todos', (_req, res, ctx) => res(ctx.status(500))),
    );
    renderApp();
    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });
  });
});
