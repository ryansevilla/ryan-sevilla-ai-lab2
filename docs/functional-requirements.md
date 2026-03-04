# TODO App Functional Requirements

## Core Requirements

1. The user can create a new task with a required title.
2. The user can view a list of all tasks.
3. The user can edit an existing task's title and description.
4. The user can mark a task as complete or incomplete.
5. The user can delete a task.
6. The user can set an optional due date for a task.
7. The user can assign a priority level to a task (for example: low, medium, high).
8. The user can filter tasks by status (all, active, completed).
9. The user can sort tasks in a defined order (for example: due date, priority, then creation time).
10. The user can search tasks by keyword in the title or description.

## Data and Behavior Requirements

1. The app preserves tasks between sessions (persistent storage).
2. Each task includes at minimum: unique ID, title, completion status, created timestamp, and updated timestamp.
3. Overdue tasks are visually identifiable when the due date has passed and the task is not complete.
4. Input validation prevents saving a task with an empty title.
5. Task list updates immediately after create, edit, complete, or delete actions.
