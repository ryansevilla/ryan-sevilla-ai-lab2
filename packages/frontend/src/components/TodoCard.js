import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTheme } from '@mui/material/styles';
import PriorityChip from './PriorityChip';
import { isOverdue } from '../utils/sortTodos';

/**
 * Renders a single TODO item as a MUI Card.
 *
 * @param {{
 *   todo: object,
 *   onToggle: (id: number) => void,
 *   onEdit: (todo: object) => void,
 *   onDelete: (id: number) => void,
 * }} props
 */
function TodoCard({ todo, onToggle, onEdit, onDelete }) {
  const theme = useTheme();
  const overdue = isOverdue(todo);

  const cardSx = {
    mb: 2,
    borderRadius: '8px',
    borderLeft: overdue
      ? `4px solid ${theme.palette.error.main}`
      : todo.completed
      ? `4px solid ${theme.palette.success.main}`
      : `4px solid transparent`,
    opacity: todo.completed ? 0.75 : 1,
  };

  return (
    <Card elevation={1} sx={cardSx} data-testid="todo-card">
      <CardContent sx={{ pb: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', mb: 0.5 }}>
          <Typography
            variant="subtitle1"
            component="span"
            sx={{
              flexGrow: 1,
              textDecoration: todo.completed ? 'line-through' : 'none',
              color: todo.completed ? 'text.secondary' : 'text.primary',
            }}
          >
            {todo.title}
          </Typography>
          <PriorityChip priority={todo.priority} />
          {overdue && (
            <Chip
              label="Overdue"
              color="error"
              size="small"
              aria-label="This task is overdue"
            />
          )}
          {todo.completed && (
            <Chip label="Completed" color="success" size="small" />
          )}
        </Box>

        {todo.description && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
            {todo.description}
          </Typography>
        )}

        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          {todo.due_date && (
            <Typography
              variant="body2"
              color={overdue ? 'error.main' : 'text.secondary'}
              aria-label={`Due date: ${todo.due_date}`}
            >
              Due: {todo.due_date}
            </Typography>
          )}
          <Typography variant="body2" color="text.secondary">
            Created: {new Date(todo.created_at).toLocaleDateString()}
          </Typography>
        </Box>
      </CardContent>

      <CardActions sx={{ justifyContent: 'flex-end', pt: 0 }}>
        <Tooltip title={todo.completed ? 'Mark incomplete' : 'Mark complete'}>
          <IconButton
            onClick={() => onToggle(todo.id)}
            color={todo.completed ? 'success' : 'default'}
            aria-label={todo.completed ? 'Mark task incomplete' : 'Mark task complete'}
            size="medium"
          >
            {todo.completed ? <CheckCircleIcon /> : <CheckCircleOutlineIcon />}
          </IconButton>
        </Tooltip>

        <Tooltip title="Edit task">
          <IconButton
            onClick={() => onEdit(todo)}
            aria-label="Edit task"
            size="medium"
          >
            <EditIcon />
          </IconButton>
        </Tooltip>

        <Tooltip title="Delete task">
          <IconButton
            onClick={() => onDelete(todo.id)}
            color="error"
            aria-label="Delete task"
            size="medium"
          >
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </CardActions>
    </Card>
  );
}

export default TodoCard;
