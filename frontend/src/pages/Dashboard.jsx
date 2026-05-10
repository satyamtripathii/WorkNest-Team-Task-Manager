import {
  BriefcaseBusiness,
  CheckCircle2,
  Clock3,
  ListTodo,
  RefreshCw,
  TrendingUp
} from "lucide-react";
import { useEffect, useState } from "react";
import { apiRequest } from "../api/client.js";
import TaskList from "../components/TaskList.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const Dashboard = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [counts, setCounts] = useState({ completed: 0, pending: 0, overdue: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboard = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await apiRequest("/tasks/my-dashboard");
      setTasks(data.tasks);
      setCounts(data.counts);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadDashboard(); }, []);

  const updateStatus = async (task, status) => {
    const data = await apiRequest(`/tasks/${task._id}`, {
      method: "PATCH",
      body: { status }
    });
    setTasks((current) =>
      current.map((item) => (item._id === task._id ? data.task : item))
    );
    loadDashboard();
  };

  const completionRate =
    tasks.length > 0 ? Math.round((counts.completed / tasks.length) * 100) : 0;

  const firstName = user.name.split(" ")[0];

  return (
    <section className="page">
      {/* Hero */}
      <div className="hero-panel">
        <div>
          <p className="eyebrow">Dashboard Overview</p>
          <h1>Welcome back, {firstName} 👋</h1>
          <p>You're all caught up. Let's make today count.</p>
        </div>
         <p style={{ color: 'rgba(255, 255, 255, 0.85)', fontSize: '1.5rem', marginTop: 8 }}>
          {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
        <div className="hero-metrics">
          <span>Completion Rate</span>
          <strong>{completionRate}%</strong>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <article className="stat-card pending">
          <div className="stat-icon">
            <ListTodo size={20} />
          </div>
          <strong>{counts.pending}</strong>
          <span>Pending</span>
          <small>Open items on your desk</small>
        </article>

        <article className="stat-card completed">
          <div className="stat-icon">
            <CheckCircle2 size={20} />
          </div>
          <strong>{counts.completed}</strong>
          <span>Completed</span>
          <small>Finished and filed away</small>
        </article>

        <article className="stat-card overdue">
          <div className="stat-icon">
            <Clock3 size={20} />
          </div>
          <strong>{counts.overdue}</strong>
          <span>Overdue</span>
          <small>Needs attention today</small>
        </article>

        <article className="stat-card total">
          <div className="stat-icon">
            <BriefcaseBusiness size={20} />
          </div>
          <strong>{tasks.length}</strong>
          <span>Total Tasks</span>
          <small>All assignments tracked</small>
        </article>

        <article className="stat-card pulse-card">
          <div className="stat-icon">
            <TrendingUp size={20} />
          </div>
          <div>
            <strong>{counts.overdue ? "Needs Attention" : "All Clear"}</strong>
            <span>Team Pulse</span>
            <small>
              {counts.overdue
                ? "Clear overdue tasks before adding new ones."
                : "No overdue work in your current queue."}
            </small>
          </div>
        </article>
      </div>

      {/* Tasks */}
      <div className="page-header" style={{ marginBottom: 16 }}>
        <div className="section-heading" style={{ marginBottom: 0 }}>
          <h2>My Tasks</h2>
        </div>
        <button className="secondary-button" type="button" onClick={loadDashboard}>
          <RefreshCw size={15} />
          Refresh
        </button>
      </div>

      {error ? <div className="alert error">{error}</div> : null}

      {loading ? (
        <div className="screen-message compact">Loading your tasks…</div>
      ) : (
        <TaskList tasks={tasks} onStatusChange={updateStatus} />
      )}
    </section>
  );
};

export default Dashboard;
