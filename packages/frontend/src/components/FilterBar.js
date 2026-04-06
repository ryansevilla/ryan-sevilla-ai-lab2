import React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';

const STATUS_OPTIONS = ['All', 'Active', 'Completed'];

/**
 * Search input and status filter controls.
 *
 * @param {{
 *   statusFilter: string,
 *   onStatusChange: (value: string) => void,
 *   searchQuery: string,
 *   onSearchChange: (value: string) => void,
 * }} props
 */
function FilterBar({ statusFilter, onStatusChange, searchQuery, onSearchChange }) {
  const handleStatusChange = (_e, newValue) => {
    if (newValue !== null) onStatusChange(newValue);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        gap: 2,
        mb: 3,
        alignItems: { sm: 'center' },
      }}
    >
      <TextField
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Search tasks…"
        size="small"
        fullWidth
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon aria-hidden="true" />
            </InputAdornment>
          ),
        }}
        inputProps={{ 'aria-label': 'Search tasks' }}
      />

      <ToggleButtonGroup
        value={statusFilter}
        exclusive
        onChange={handleStatusChange}
        aria-label="Filter tasks by status"
        size="small"
        sx={{ flexShrink: 0 }}
      >
        {STATUS_OPTIONS.map((option) => (
          <ToggleButton key={option} value={option} aria-label={`Show ${option} tasks`}>
            {option}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    </Box>
  );
}

export default FilterBar;
