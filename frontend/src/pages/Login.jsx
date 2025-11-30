import { useState, useCallback } from "react";
import { useNavigate, Navigate, Link } from "react-router-dom";
import { api } from "../api/axios";
import { useAuth } from "../context/authContext";

const Login = () => {
  // 1. Always declare ALL hooks at the top
  const { isAuthenticated, login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  // This hook was causing the error because it was unreachable before
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setLoading(true);
      setError("");

      try {
        const { data } = await api.post("/auth/login", form);
        login(data.token, data.user);
        navigate("/dashboard");
      } catch (err) {
        setError(err.response?.data?.message || "Login failed");
      } finally {
        setLoading(false);
      }
    },
    [form, login, navigate]
  );

  // 2. Perform conditional return/redirect AFTER all hooks
  if (isAuthenticated) return <Navigate to="/dashboard" />;

  return (
    <div className="auth-card">
      <h2>Login</h2>
      <form onSubmit={handleSubmit} className="form">
        <label>
          Email
          <input
            name="email"
            type="email"
            required
            value={form.email}
            onChange={handleChange}
          />
        </label>
        <label>
          Password
          <input
            name="password"
            type="password"
            required
            value={form.password}
            onChange={handleChange}
          />
        </label>

        {error && <p className="error">{error}</p>}

        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
      <p style={{marginTop: '1rem', textAlign: 'center'}}>
        Don't have an account? <Link to="/register">Register</Link>
      </p>
    </div>
  );
};

export default Login;