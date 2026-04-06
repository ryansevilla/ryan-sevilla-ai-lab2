import React from 'react';
import Chip from '@mui/material/Chip';

const PRIORITY_COLORS = {
  High: 'error',
  Medium: 'warning',
  Low: 'default',
};

/**
 * Displays a task's priority as a MUI Chip with the appropriate color.
 * @param {{ priority: 'High'|'Medium'|'Low' }} props
 */
function PriorityChip({ priority }) {
  return (
    <Chip
      label={priority}
      color={PRIORITY_COLORS[priority] || 'default'}
      size="small"
      aria-label={`Priority: ${priority}`}
    />
  );
}

export default PriorityChip;
