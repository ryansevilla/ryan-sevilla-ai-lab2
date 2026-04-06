import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import AddIcon from '@mui/icons-material/Add';

import useTodos from './hooks/useTodos';
import TodoCard from './components/TodoCard';
import TodoForm from './components/TodoForm';
import FilterBar from './components/FilterBar';

function App() {
  const {
    todos,
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
  } = useTodos();

  const [formOpen, setFormOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);

  const handleOpenCreate = () => {
    setEditingTodo(null);
    setFormOpen(true);
  };

  const handleOpenEdit = (todo) => {
    setEditingTodo(todo);
    setFormOpen(true);
  };

  const handleFormClose = () => {
    setFormOpen(false);
    setEditingTodo(null);
  };

  const handleSave = async (data) => {
    if (editingTodo) {
      await updateTodo(editingTodo.id, data);
    } else {
      await createTodo(data);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: { xs: 2, sm: 3 } }}>
      {/* Accessible live region for dynamic announcements */}
      <Box
        aria-live="polite"
        aria-atomic="true"
        sx={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0,0,0,0)', whiteSpace: 'nowrap' }}
      >
        {announcement}
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Box>
          <Typography variant="h5" component="h1" fontWeight="medium">
            To Do App
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Keep track of your tasks
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleOpenCreate}
          aria-label="Add new task"
          size="medium"
        >
          Add Task
        </Button>
      </Box>

      <FilterBar
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress aria-label="Loading tasks" />
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {!loading && !error && todos.length === 0 && (
        <Typography color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
          No tasks found. Add one to get started!
        </Typography>
      )}

      {!loading && todos.map((todo) => (
        <TodoCard
          key={todo.id}
          todo={todo}
          onToggle={toggleTodo}
          onEdit={handleOpenEdit}
          onDelete={deleteTodo}
        />
      ))}

      <TodoForm
        open={formOpen}
        initialData={editingTodo}
        onSave={handleSave}
        onClose={handleFormClose}
      />
    </Container>
  );
}

export default App;
