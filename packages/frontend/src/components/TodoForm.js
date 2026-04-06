import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';

const PRIORITIES = ['Low', 'Medium', 'High'];

const EMPTY_FORM = {
  title: '',
  description: '',
  priority: 'Medium',
  due_date: '',
};

/**
 * Dialog form for creating or editing a TODO.
 *
 * @param {{
 *   open: boolean,
 *   initialData: object|null,
 *   onSave: (data: object) => Promise<void>,
 *   onClose: () => void,
 * }} props
 */
function TodoForm({ open, initialData, onSave, onClose }) {
  const isEditing = Boolean(initialData);
  const [form, setForm] = useState(EMPTY_FORM);
  const [titleError, setTitleError] = useState('');
  const [saving, setSaving] = useState(false);

  // Populate form when editing an existing todo
  useEffect(() => {
    if (open) {
      setForm(
        initialData
          ? {
              title: initialData.title,
              description: initialData.description || '',
              priority: initialData.priority || 'Medium',
              due_date: initialData.due_date || '',
            }
          : EMPTY_FORM,
      );
      setTitleError('');
    }
  }, [open, initialData]);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    if (field === 'title') setTitleError('');
  };

  const handleSave = async () => {
    if (!form.title.trim()) {
      setTitleError('Title is required.');
      return;
    }
    try {
      setSaving(true);
      await onSave({
        title: form.title.trim(),
        description: form.description,
        priority: form.priority,
        due_date: form.due_date || null,
      });
      onClose();
    } catch (err) {
      setTitleError(err.message || 'Failed to save task.');
    } finally {
      setSaving(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      onKeyDown={handleKeyDown}
      maxWidth="sm"
      fullWidth
      aria-labelledby="todo-form-title"
    >
      <DialogTitle id="todo-form-title">
        {isEditing ? 'Edit Task' : 'Add New Task'}
      </DialogTitle>

      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            label="Title"
            value={form.title}
            onChange={handleChange('title')}
            error={Boolean(titleError)}
            helperText={titleError || ' '}
            required
            autoFocus
            fullWidth
            inputProps={{ 'aria-label': 'Task title' }}
          />

          <TextField
            label="Description"
            value={form.description}
            onChange={handleChange('description')}
            multiline
            minRows={2}
            fullWidth
            inputProps={{ 'aria-label': 'Task description' }}
          />

          <TextField
            label="Priority"
            value={form.priority}
            onChange={handleChange('priority')}
            select
            fullWidth
            inputProps={{ 'aria-label': 'Task priority' }}
          >
            {PRIORITIES.map((p) => (
              <MenuItem key={p} value={p}>
                {p}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Due Date"
            type="date"
            value={form.due_date}
            onChange={handleChange('due_date')}
            fullWidth
            InputLabelProps={{ shrink: true }}
            inputProps={{ 'aria-label': 'Task due date' }}
          />
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="primary" aria-label="Cancel">
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          color="primary"
          disabled={saving}
          aria-label={isEditing ? 'Save changes' : 'Add task'}
        >
          {isEditing ? 'Save Changes' : 'Add Task'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default TodoForm;
