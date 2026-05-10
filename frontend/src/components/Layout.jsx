import {
  BriefcaseBusiness,
  Building2,
  FolderKanban,
  LayoutDashboard,
  LogOut,
  Search
} from "lucide-react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const Layout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const initials = user.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-mark">
            <BriefcaseBusiness size={20} />
          </span>
          <div>
            <strong>WorkNest</strong>
            <span>Team Task Manager</span>
          </div>
        </div>

        <p className="sidebar-section-label">Workspace</p>
        <div className="sidebar-workspace">
          <div className="sidebar-workspace-icon">
            <Building2 size={17} />
          </div>
          <div>
            <strong>Head Office</strong>
            <span>{user.role} workspace</span>
          </div>
        </div>

        <p className="sidebar-section-label">Navigation</p>
        <nav className="nav-links">
          <NavLink to="/">
            <LayoutDashboard size={17} />
            Dashboard
          </NavLink>
          <NavLink to="/projects">
            <FolderKanban size={17} />
            Projects
          </NavLink>
        </nav>

        <div className="sidebar-footer">
          <div className="avatar">{initials}</div>
          <div className="sidebar-footer-info">
            <strong>{user.name}</strong>
            <span>{user.email}</span>
          </div>
          <button
            className="logout-btn"
            type="button"
            onClick={handleLogout}
            title="Log out"
          >
            <LogOut size={15} />
          </button>
        </div>
      </aside>

      <main className="content">
        <header className="topbar">
          <div className="search-box">
            <Search size={16} />
            <span>Search projects, tasks…</span>
          </div>
          <div className="topbar-right">
            <div className="topbar-user">
              <span className="avatar">{initials}</span>
              <div>
                <strong>{user.name}</strong>
                <span>{user.role}</span>
              </div>
            </div>
          </div>
        </header>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
