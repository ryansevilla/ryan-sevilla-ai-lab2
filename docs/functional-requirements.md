# TODO App Functional Requirements

## Task Management

1. The user can create a new task with a required title and an optional description.
2. The user can edit an existing task's title and description.
3. The user can delete a task permanently.
4. The user can mark a task as complete or toggle it back to incomplete.

## Due Dates & Priority

5. The user can add an optional due date to any task.
6. The user can assign a priority level to a task: Low, Medium, or High.
7. Tasks with a past due date that are not yet complete are visually marked as overdue.

## Sorting & Filtering

8. Tasks are sorted by default in this order: overdue first, then by due date (ascending), then by priority (High → Medium → Low), then by creation time (newest first).
9. The user can filter tasks by status: All, Active, or Completed.
10. The user can search tasks by keyword matched against the title or description.

## Data & Persistence

11. Tasks are saved to persistent storage so they survive a page refresh or browser restart.
12. Each task stores at minimum: a unique ID, title, description, completion status, priority, due date, created-at timestamp, and updated-at timestamp.
13. Input validation prevents saving a task with an empty or whitespace-only title.
14. The task list updates immediately after any create, edit, complete, or delete action with no manual refresh required.
