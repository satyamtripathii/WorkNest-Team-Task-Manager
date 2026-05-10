import {
  Building2,
  Edit3,
  FolderPlus,
  Layers3,
  Trash2,
  Users
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "../api/client.js";
import { useAuth } from "../context/AuthContext.jsx";

const emptyProject = { name: "", description: "", teamMembers: [] };

const Projects = () => {
  const { isAdmin } = useAuth();
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState(emptyProject);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const memberUsers = useMemo(
    () => users.filter((u) => u.role === "Member" || u.role === "Admin"),
    [users]
  );

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const [projectData, userData] = await Promise.all([
        apiRequest("/projects"),
        isAdmin ? apiRequest("/users") : Promise.resolve({ users: [] })
      ]);
      setProjects(projectData.projects);
      setUsers(userData.users);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, [isAdmin]);

  const toggleMember = (id) => {
    setForm((current) => ({
      ...current,
      teamMembers: current.teamMembers.includes(id)
        ? current.teamMembers.filter((mid) => mid !== id)
        : [...current.teamMembers, id]
    }));
  };

  const resetForm = () => { setForm(emptyProject); setEditingId(null); };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    try {
      const path = editingId ? `/projects/${editingId}` : "/projects";
      const method = editingId ? "PATCH" : "POST";
      await apiRequest(path, { method, body: form });
      resetForm();
      loadData();
    } catch (err) {
      setError(err.message);
    }
  };

  const startEdit = (project) => {
    setEditingId(project._id);
    setForm({
      name: project.name,
      description: project.description || "",
      teamMembers: project.teamMembers.map((m) => m._id)
    });
  };

  const deleteProject = async (project) => {
    if (!window.confirm(`Delete "${project.name}" and all its tasks?`)) return;
    await apiRequest(`/projects/${project._id}`, { method: "DELETE" });
    setProjects((curr) => curr.filter((p) => p._id !== project._id));
  };

  return (
    <section className="page">
      <div className="page-header">
        <div>
          <p className="eyebrow">Office Portfolio</p>
          <h1>Projects</h1>
          <p className="lead">
            Organize team initiatives, assign the right people, and track every
            project from one place.
          </p>
        </div>
      </div>

      {error ? <div className="alert error">{error}</div> : null}

      {isAdmin ? (
        <form className="project-form" onSubmit={handleSubmit}>
          <div className="form-title">
            <div className="form-title-icon">
              <Building2 size={19} />
            </div>
            <div>
              <strong>{editingId ? "Update project" : "New project"}</strong>
              <span>Set the scope and assign the right people.</span>
            </div>
          </div>

          <div className="form-grid">
            <label>
              Project name
              <input
                placeholder="e.g. Website Redesign"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </label>
            <label>
              Description
              <input
                placeholder="Brief description of this project"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </label>
          </div>

          <div className="member-picker" style={{ marginTop: 16 }}>
            <span className="member-picker-label">
              <Users size={15} />
              Team members
            </span>
            <div className="member-pills">
              {memberUsers.map((u) => (
                <label className="check-pill" key={u._id}>
                  <input
                    type="checkbox"
                    checked={form.teamMembers.includes(u._id)}
                    onChange={() => toggleMember(u._id)}
                  />
                  {u.name}
                </label>
              ))}
              {memberUsers.length === 0 && (
                <span style={{ fontSize: "0.85rem", color: "var(--ink-4)" }}>
                  No users available
                </span>
              )}
            </div>
          </div>

          <div className="form-actions">
            <button className="primary-button" type="submit">
              <FolderPlus size={16} />
              {editingId ? "Update project" : "Create project"}
            </button>
            {editingId && (
              <button className="secondary-button" type="button" onClick={resetForm}>
                Cancel
              </button>
            )}
          </div>
        </form>
      ) : null}

      {loading ? (
        <div className="screen-message compact">Loading projects…</div>
      ) : projects.length === 0 ? (
        <div className="empty-state">
          No projects yet. {isAdmin ? "Create one above to get started." : "You haven't been added to any projects."}
        </div>
      ) : (
        <div className="project-grid">
          {projects.map((project) => (
            <article className="project-card" key={project._id}>
              <div className="project-card-top-bar" />
              <div className="project-icon">
                <Layers3 size={21} />
              </div>
              <div>
                <h2>{project.name}</h2>
                <p>{project.description || "No description provided."}</p>
              </div>
              <div className="project-detail-line">
                <span>{project.teamMembers.length} member{project.teamMembers.length !== 1 ? "s" : ""}</span>
                <span>By {project.createdBy?.name || "Admin"}</span>
              </div>
              {project.teamMembers.length > 0 && (
                <div className="project-members">
                  {project.teamMembers.map((member) => (
                    <span key={member._id}>{member.name}</span>
                  ))}
                </div>
              )}
              <div className="card-actions">
                <Link className="secondary-button" to={`/projects/${project._id}`}>
                  Open project →
                </Link>
                {isAdmin && (
                  <>
                    <button
                      className="icon-button"
                      type="button"
                      onClick={() => startEdit(project)}
                      title="Edit project"
                    >
                      <Edit3 size={15} />
                    </button>
                    <button
                      className="icon-button danger"
                      type="button"
                      onClick={() => deleteProject(project)}
                      title="Delete project"
                    >
                      <Trash2 size={15} />
                    </button>
                  </>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
};

export default Projects;
