import { useState, useEffect, useCallback } from 'react';
import { sortTodos } from '../utils/sortTodos';
import { filterTodos } from '../utils/filterTodos';

const API_BASE = '/api/todos';

/**
 * Custom hook encapsulating all TODO state management and API interactions.
 * Returns sorted and filtered todos along with CRUD action handlers.
 */
function useTodos() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [announcement, setAnnouncement] = useState('');

  const announce = useCallback((message) => {
    setAnnouncement('');
    // Defer so the aria-live region re-announces even for identical messages
    setTimeout(() => setAnnouncement(message), 50);
  }, []);

  const fetchTodos = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(API_BASE);
      if (!response.ok) throw new Error('Failed to fetch todos');
      const data = await response.json();
      setTodos(data);
      setError(null);
    } catch (err) {
      setError('Failed to load todos. Please try again.');
      console.error('Error fetching todos:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  const createTodo = useCallback(async (todoData) => {
    const response = await fetch(API_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(todoData),
    });
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || 'Failed to create todo');
    }
    const created = await response.json();
    setTodos((prev) => [created, ...prev]);
    announce(`Task "${created.title}" added.`);
    return created;
  }, [announce]);

  const updateTodo = useCallback(async (id, todoData) => {
    const response = await fetch(`${API_BASE}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(todoData),
    });
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || 'Failed to update todo');
    }
    const updated = await response.json();
    setTodos((prev) => prev.map((t) => (t.id === id ? updated : t)));
    announce(`Task "${updated.title}" updated.`);
    return updated;
  }, [announce]);

  const toggleTodo = useCallback(async (id) => {
    const response = await fetch(`${API_BASE}/${id}/toggle`, { method: 'PATCH' });
    if (!response.ok) throw new Error('Failed to toggle todo');
    const updated = await response.json();
    setTodos((prev) => prev.map((t) => (t.id === id ? updated : t)));
    const status = updated.completed ? 'completed' : 'marked incomplete';
    announce(`Task "${updated.title}" ${status}.`);
    return updated;
  }, [announce]);

  const deleteTodo = useCallback(async (id) => {
    const todo = todos.find((t) => t.id === id);
    const response = await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
    if (!response.ok) throw new Error('Failed to delete todo');
    setTodos((prev) => prev.filter((t) => t.id !== id));
    if (todo) announce(`Task "${todo.title}" deleted.`);
  }, [todos, announce]);

  const visibleTodos = sortTodos(filterTodos(todos, statusFilter, searchQuery));

  return {
    todos: visibleTodos,
    loading,
    error,
    statusFilter,
    setStatusFilter,
    searchQuery,
    setSearchQuery,
    announcement,
    createTodo,
    updateTodo,
    toggleTodo,
    deleteTodo,
  };
}

export default useTodos;
