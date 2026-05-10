import { BriefcaseBusiness, ClipboardList, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await login(form.email, form.password);
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="auth-page">
      {/* Left showcase */}
      <section className="auth-showcase">
        <div className="showcase-badge">
          <BriefcaseBusiness size={16} />
          Office Task Suite
        </div>
        <h1>Where great teams get great work done.</h1>
        <p>
          Assign tasks, hit deadlines, and keep every team member aligned — all in one place.
        </p>
        <div className="showcase-list">
          <span>Project briefs</span>
          <span>Role-based access</span>
          <span>Deadline tracking</span>
          <span>Team dashboards</span>
        </div>
      </section>

      {/* Right panel */}
      <section className="auth-panel">
        <div className="auth-logo">
          <div className="auth-logo-mark">
            <ClipboardList size={22} />
          </div>
          <div>
            <strong>WorkNest</strong>
            <span>Team Task Manager</span>
          </div>
        </div>

        <div className="auth-heading">
          <h1>Sign in to your workspace</h1>
          <p>Enter your credentials to access your projects and tasks.</p>
        </div>

        <form className="form" onSubmit={handleSubmit}>
          {error ? <div className="alert error">{error}</div> : null}

          <label>
            Email address
            <input
              type="email"
              placeholder="ABC123@company.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </label>

          <label>
            Password
            <input
              type="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </label>

          <button className="primary-button" disabled={submitting} type="submit" style={{ marginTop: 4 }}>
            {submitting ? "Signing in…" : "Sign in →"}
          </button>
        </form>

        <div className="auth-note" style={{ marginTop: 16 }}>
          <ShieldCheck size={16} />
          JWT secured workspace with encrypted passwords.
        </div>

        <p className="auth-switch">
          New to WorkNest?{" "}
          <Link to="/signup">Create a free account</Link>
        </p>
      </section>
    </main>
  );
};

export default Login;
