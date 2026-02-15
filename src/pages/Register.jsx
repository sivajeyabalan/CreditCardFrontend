import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { registerUser } from "../api/applicationApi";

const Register = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [form, setForm] = useState({ fullName: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      // basic client-side validation
      if (!form.fullName || !form.email || !form.password) {
        setError("All fields are required");
        setLoading(false);
        return;
      }

      const res = await registerUser(form);
      // assume backend returns { token }
      if (res && res.token) {
        login(res.token);
        navigate("/dashboard");
      } else {
        navigate("/login");
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      {/* Left Branding */}
      <div style={styles.left}>
        <div>
          <h1 style={styles.brandTitle}>ABC Bank</h1>
          <p style={styles.brandSubtitle}>Smart Credit Solutions for a Digital Future</p>
        </div>
      </div>

      {/* Right Register Form */}
      <div style={styles.right}>
        <div style={styles.card}>
          <h2 style={styles.title}>Create your account</h2>
          <p style={styles.subtitle}>Sign up and start your application journey</p>

          <form onSubmit={handleRegister} style={styles.form}>
            <input name="fullName" placeholder="Full name" value={form.fullName} onChange={handleChange} required style={styles.input} />
            <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required style={styles.input} />
            <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required style={styles.input} />

            {error && <div style={{ color: "#ef4444" }}>{error}</div>}

            <button type="submit" style={styles.button} disabled={loading}>
              {loading ? "Registering..." : "Register →"}
            </button>

            <div style={{ marginTop: 12 }}>
              Already have an account? <Link to="/login">Login</Link>
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
    background: "linear-gradient(135deg, #10b981, #059669)",
    color: "#fff",
    fontWeight: "600",
    cursor: "pointer",
  },
};

export default Register;
