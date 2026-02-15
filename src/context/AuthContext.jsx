import { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import api from "../api/axiosConfig";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // Validate token with backend on app load
      validateToken(token);
    } else {
      setLoading(false);
    }
  }, []);

  const getUserFromToken = (token) => {
    try {
      const decoded = jwtDecode(token);
      const email = decoded?.sub || decoded?.email || "";
      return { token, email };
    } catch (e) {
      return { token };
    }
  };

  const validateToken = async (token) => {
    try {
      // Make a request to a protected endpoint to validate token
      // We'll use dashboard endpoint as it requires authentication
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      };

      // Try to fetch dashboard - if succeeds, token is valid
      await api.get("/dashboard", config);
      setUser(getUserFromToken(token));
    } catch (error) {
      // Token is invalid or expired
      localStorage.removeItem("token");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = (token) => {
    localStorage.setItem("token", token);
    setUser(getUserFromToken(token));
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
