import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

const decodeToken = (token) => {
  try {
    const [, payload] = token.split(".");
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem("token") || "");
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  useEffect(() => {
    if (user) localStorage.setItem("user", JSON.stringify(user));
    else localStorage.removeItem("user");
  }, [user]);

  const login = (tokenFromApi, userFromApi) => {
    const decoded = decodeToken(tokenFromApi);
    setToken(tokenFromApi);
    if (userFromApi) {
      setUser({ ...userFromApi });
    } else if (decoded) {
      setUser({ id: decoded.id, role: decoded.role || "user" });
    }
  };

  const logout = () => {
    setToken("");
    setUser(null);
  };

  const value = { token, user, login, logout, isAuthenticated: !!token };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);