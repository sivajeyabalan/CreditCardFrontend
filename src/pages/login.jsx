import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { loginUser } from "../api/applicationApi";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const getErrorMessage = (err) => {
    if (!err) return "Login failed. Check credentials.";
    const resp = err.response?.data;
    if (!resp) return err.message || "Login failed. Check credentials.";
    // backend may return a string or an object
    if (typeof resp === 'string') return resp;
    if (typeof resp === 'object') return resp.message || JSON.stringify(resp);
    return String(resp);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    // client-side validation
    if (!form.email || !form.password) {
      setError("Please enter email and password.");
      return;
    }

    setLoading(true);
    try {
      const res = await loginUser(form);
      // assume backend returns { token: "..." }
      if (res && res.token) {
        login(res.token);
        navigate("/dashboard");
      } else {
        setError("Login failed: invalid response from server");
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      {/* Left Branding Section */}
      <div style={styles.left}>
        <div>
          <h1 style={styles.brandTitle}>ABC Bank</h1>
          <p style={styles.brandSubtitle}>
            Smart Credit Solutions for a Digital Future
          </p>
        </div>
      </div>

      {/* Right Login Section */}
      <div style={styles.right}>
        <div style={styles.card}>
          <h2 style={styles.title}>Welcome Back</h2>
          <p style={styles.subtitle}>Login to access your dashboard</p>

          <form onSubmit={handleLogin} style={styles.form}>
            <input
              type="email"
              name="email"
              placeholder="Email address"
              style={styles.input}
              required
              value={form.email}
              onChange={handleChange}
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              style={styles.input}
              required
              value={form.password}
              onChange={handleChange}
            />

            {error && <div style={{ color: "#ef4444" }}>{error}</div>}

            <button type="submit" style={styles.button} disabled={loading}>
              {loading ? "Logging in..." : "Login →"}
            </button>

            <div style={{ marginTop: "12px", fontSize: "14px" }}>
              Don't have an account? <Link to="/register">Register</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    height: "100vh",
    fontFamily: "Inter, sans-serif",
  },
  left: {
    flex: 1,
    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    padding: "40px",
  },
  brandTitle: {
    fontSize: "40px",
    fontWeight: "700",
  },
  brandSubtitle: {
    marginTop: "15px",
    fontSize: "16px",
    opacity: 0.9,
  },
  right: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f9fafb",
  },
  card: {
    backgroundColor: "#fff",
    padding: "50px",
    borderRadius: "16px",
    boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
    width: "400px",
  },
  title: {
    marginBottom: "5px",
  },
  subtitle: {
    marginBottom: "25px",
    color: "#6b7280",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  input: {
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #e5e7eb",
    fontSize: "14px",
  },
  button: {
    padding: "12px",
    borderRadius: "8px",
    border: "none",
    background: "linear-gradient(135deg, #6366f1, #4f46e5)",
    color: "#fff",
    fontWeight: "600",
    cursor: "pointer",
  },
};

export default Login;
