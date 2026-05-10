import { CalendarClock, FolderKanban, Trash2, UserRound } from "lucide-react";
import StatusBadge from "./StatusBadge.jsx";

const formatDate = (date) =>
  new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(new Date(date));

const isOverdue = (task) =>
  task.status !== "Done" && new Date(task.dueDate) < new Date();

const TaskList = ({ tasks, onStatusChange, onDelete, canDelete = false }) => {
  if (!tasks.length) {
    return (
      <div className="empty-state">
        No tasks match this view. Try adjusting the filters above.
      </div>
    );
  }

  return (
    <div className="task-list">
      {tasks.map((task) => (
        <article
          className={`task-row ${isOverdue(task) ? "overdue" : ""}`}
          key={task._id}
        >
          <div className="task-row-indicator" />

          <div className="task-main">
            <div className="task-title-line">
              <h3>{task.title}</h3>
              <StatusBadge status={task.status} />
              {isOverdue(task) && (
                <span
                  style={{
                    fontSize: "0.72rem",
                    fontWeight: 700,
                    color: "var(--red)",
                    background: "var(--red-bg)",
                    borderRadius: "99px",
                    padding: "3px 10px"
                  }}
                >
                  OVERDUE
                </span>
              )}
            </div>

            {task.description && (
              <p>{task.description}</p>
            )}

            <div className="task-meta">
              {task.project?.name && (
                <span>
                  <FolderKanban size={13} />
                  {task.project.name}
                </span>
              )}
              <span>
                <UserRound size={13} />
                {task.assignedTo?.name}
              </span>
              <span>
                <CalendarClock size={13} />
                {formatDate(task.dueDate)}
              </span>
            </div>
          </div>

          <div className="task-actions">
            <select
              aria-label="Update task status"
              value={task.status}
              onChange={(e) => onStatusChange(task, e.target.value)}
            >
              <option>Todo</option>
              <option>In Progress</option>
              <option>Done</option>
            </select>
            {canDelete && (
              <button
                className="icon-button danger"
                type="button"
                onClick={() => onDelete(task)}
                title="Delete task"
              >
                <Trash2 size={15} />
              </button>
            )}
          </div>
        </article>
      ))}
    </div>
  );
};

export default TaskList;
