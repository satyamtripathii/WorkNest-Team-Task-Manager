import { ClipboardCheck, ShieldCheck, UsersRound } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const Signup = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "Member" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await signup(form);
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
          <UsersRound size={16} />
          Team Onboarding
        </div>
        <h1>Your whole team. One workspace. Zero chaos.</h1>
        <p>
          Get set up in seconds — manage your team as an Admin or jump straight into your tasks as a Member.
        </p>
        <div className="showcase-list">
          <span>Admin controls</span>
          <span>Member dashboards</span>
          <span>Live project boards</span>
          <span>Deadline alerts</span>
        </div>
      </section>

      {/* Right panel */}
      <section className="auth-panel">
        <div className="auth-logo">
          <div className="auth-logo-mark">
            <ClipboardCheck size={22} />
          </div>
          <div>
            <strong>WorkNest</strong>
            <span>Team Task Manager</span>
          </div>
        </div>

        <div className="auth-heading">
          <h1>Create your account</h1>
          <p>
            Choose <strong>Admin</strong> to manage projects, or <strong>Member</strong> for assigned work.
          </p>
        </div>

        <form className="form" onSubmit={handleSubmit}>
          {error ? <div className="alert error">{error}</div> : null}

          <label>
            Full name
            <input
              placeholder="Gill Bates"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </label>

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
              placeholder="At least 8 characters"
              minLength={8}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </label>

          <label>
            Role
            <select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            >
              <option value="Member">Member — view assigned work</option>
              <option value="Admin">Admin — manage projects & team</option>
            </select>
          </label>

          <button className="primary-button" disabled={submitting} type="submit" style={{ marginTop: 4 }}>
            {submitting ? "Creating account…" : "Create account →"}
          </button>
        </form>

        <div className="auth-note" style={{ marginTop: 16 }}>
          <ShieldCheck size={16} />
          Passwords are hashed with bcrypt before storage.
        </div>

        <p className="auth-switch">
          Already registered? <Link to="/login">Sign in instead</Link>
        </p>
      </section>
    </main>
  );
};

export default Signup;
