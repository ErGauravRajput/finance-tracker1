import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { useTheme } from "../context/themeContext";

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="nav-left">
        <span className="brand">Finance Tracker</span>
        {isAuthenticated && (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/transactions">Transactions</Link>
            <Link to="/analytics">Analytics</Link>
            {/* Show Users link only for Admin */}
            {user?.role === "admin" && <Link to="/users">Users</Link>}
          </>
        )}
      </div>

      <div className="nav-right">
        <button onClick={toggleTheme} className="btn-secondary">
          {theme === "light" ? "🌙" : "☀️"}
        </button>

        {isAuthenticated ? (
          <>
            <span className="role-pill">{user?.name} ({user?.role})</span>
            <button onClick={handleLogout} className="btn-primary">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn-main">
              Login
            </Link>
            <Link to="/register" className="btn-main">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;