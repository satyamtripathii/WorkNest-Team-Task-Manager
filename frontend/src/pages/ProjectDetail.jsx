import { ClipboardList, Filter, Plus, RefreshCw, Users } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { apiRequest } from "../api/client.js";
import TaskList from "../components/TaskList.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const emptyTask = { title: "", description: "", assignedTo: "", status: "Todo", dueDate: "" };

const ProjectDetail = () => {
  const { id } = useParams();
  const { isAdmin } = useAuth();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState(emptyTask);
  const [filters, setFilters] = useState({ status: "", assignedTo: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const members = useMemo(() => project?.teamMembers || [], [project]);

  const buildQuery = () => {
    const params = new URLSearchParams();
    if (filters.status) params.set("status", filters.status);
    if (filters.assignedTo && isAdmin) params.set("assignedTo", filters.assignedTo);
    const query = params.toString();
    return query ? `?${query}` : "";
  };

  const loadProject = async () => {
    setLoading(true);
    setError("");
    try {
      const [projectData, taskData] = await Promise.all([
        apiRequest(`/projects/${id}`),
        apiRequest(`/projects/${id}/tasks${buildQuery()}`)
      ]);
      setProject(projectData.project);
      setTasks(taskData.tasks);
      setForm((curr) => ({
        ...curr,
        assignedTo: curr.assignedTo || projectData.project.teamMembers[0]?._id || ""
      }));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadProject(); }, [id, filters.status, filters.assignedTo]);

  const createTask = async (event) => {
    event.preventDefault();
    setError("");
    try {
      await apiRequest(`/projects/${id}/tasks`, { method: "POST", body: form });
      setForm({ ...emptyTask, assignedTo: members[0]?._id || "" });
      loadProject();
    } catch (err) {
      setError(err.message);
    }
  };

  const updateStatus = async (task, status) => {
    const data = await apiRequest(`/tasks/${task._id}`, {
      method: "PATCH",
      body: { status }
    });
    setTasks((curr) => curr.map((t) => (t._id === task._id ? data.task : t)));
  };

  const deleteTask = async (task) => {
    if (!window.confirm(`Delete "${task.title}"?`)) return;
    await apiRequest(`/tasks/${task._id}`, { method: "DELETE" });
    setTasks((curr) => curr.filter((t) => t._id !== task._id));
  };

  return (
    <section className="page">
      <div className="page-header">
        <div>
          <p className="eyebrow">
            <Link to="/projects">← Projects</Link>
          </p>
          <h1>{project?.name || "Project"}</h1>
          {project?.description && (
            <p className="lead">{project.description}</p>
          )}
        </div>
        <button className="secondary-button" type="button" onClick={loadProject}>
          <RefreshCw size={15} />
          Refresh
        </button>
      </div>

      {error ? <div className="alert error">{error}</div> : null}

      {isAdmin ? (
        <form className="task-form" onSubmit={createTask}>
          <div className="form-title">
            <div className="form-title-icon">
              <ClipboardList size={19} />
            </div>
            <div>
              <strong>Create new task</strong>
              <span>Assign ownership, set a due date, and track delivery.</span>
            </div>
          </div>

          <div className="form-grid">
            <label>
              Task title
              <input
                placeholder="e.g. Design landing page"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
              />
            </label>
            <label>
              Assign to
              <select
                value={form.assignedTo}
                onChange={(e) => setForm({ ...form, assignedTo: e.target.value })}
                required
              >
                {members.map((m) => (
                  <option value={m._id} key={m._id}>{m.name}</option>
                ))}
              </select>
            </label>
            <label>
              Status
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
              >
                <option>Todo</option>
                <option>In Progress</option>
                <option>Done</option>
              </select>
            </label>
            <label>
              Due date
              <input
                type="date"
                value={form.dueDate}
                onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                required
              />
            </label>
          </div>

          <label style={{ marginTop: 4 }}>
            Description (optional)
            <textarea
              rows="3"
              placeholder="Add context or instructions for this task…"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </label>

          <div className="form-actions">
            <button className="primary-button" type="submit" disabled={!members.length}>
              <Plus size={16} />
              Create task
            </button>
            {!members.length && (
              <span style={{ fontSize: "0.85rem", color: "var(--ink-4)" }}>
                Add team members to the project first.
              </span>
            )}
          </div>
        </form>
      ) : null}

      {/* Filters */}
      <div className="filters">
        <span className="filter-label">
          <Filter size={15} />
          Filter
        </span>
        <label>
          Status
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          >
            <option value="">All statuses</option>
            <option>Todo</option>
            <option>In Progress</option>
            <option>Done</option>
          </select>
        </label>
        {isAdmin && (
          <label>
            Assigned to
            <select
              value={filters.assignedTo}
              onChange={(e) => setFilters({ ...filters, assignedTo: e.target.value })}
            >
              <option value="">All members</option>
              {members.map((m) => (
                <option value={m._id} key={m._id}>{m.name}</option>
              ))}
            </select>
          </label>
        )}
        <span className="member-count">
          <Users size={14} />
          {members.length} member{members.length !== 1 ? "s" : ""}
        </span>
      </div>

      {loading ? (
        <div className="screen-message compact">Loading tasks…</div>
      ) : (
        <TaskList
          tasks={tasks}
          onStatusChange={updateStatus}
          onDelete={deleteTask}
          canDelete={isAdmin}
        />
      )}
    </section>
  );
};

export default ProjectDetail;
