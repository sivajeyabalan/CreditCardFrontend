import { useEffect, useState, useContext } from "react";
import { getDashboardData } from "../api/applicationApi";
import { AuthContext } from "../context/AuthContext";

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copiedAppNo, setCopiedAppNo] = useState("");

  const getErrorMessage = (err) => {
    if (!err) return "Failed to load dashboard";
    const resp = err.response?.data;
    if (!resp) return err.message || "Failed to load dashboard";
    if (typeof resp === 'string') return resp;
    if (typeof resp === 'object') return resp.message || JSON.stringify(resp);
    return String(resp);
  };

  const handleCopy = async (appNo) => {
    try {
      await navigator.clipboard.writeText(appNo);
      setCopiedAppNo(appNo);
      setTimeout(() => setCopiedAppNo(""), 1500);
    } catch (e) {
      // fallback: ignore silently
    }
  };

  useEffect(() => {
    const fetch = async () => {
      setError("");
      setLoading(true);
      try {
        const res = await getDashboardData();
        setData(res);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  return (
    <div style={styles.wrapper}>
      <div style={styles.header}>
        <h2>Dashboard Overview</h2>
        <p>Welcome back, {user?.email || "User"} 👋</p>
      </div>

      <div style={styles.cards}>
        <div style={styles.card}>
          <h3 style={styles.cardLabel}>Total Applications</h3>
          <p style={styles.number}>{loading ? "..." : data?.totalApplications ?? 0}</p>
        </div>

        <div style={styles.card}>
          <h3 style={styles.cardLabel}>Approved</h3>
          <p style={styles.number}>{loading ? "..." : data?.approved ?? 0}</p>
        </div>

        <div style={styles.card}>
          <h3 style={styles.cardLabel}>Pending</h3>
          <p style={styles.number}>{loading ? "..." : data?.pending ?? 0}</p>
        </div>

        <div style={styles.card}>
          <h3 style={styles.cardLabel}>Rejected</h3>
          <p style={styles.number}>{loading ? "..." : data?.rejected ?? 0}</p>
        </div>
      </div>

      <div style={styles.section}>
        <h3>Recent Applications</h3>
        {error && <div style={{ color: "#ef4444" }}>{error}</div>}
        <div style={styles.table}>
          <div style={styles.rowHeader}>
            <span>Application #</span>
            <span>Name</span>
            <span>Applied On</span>
            <span>Status</span>
            <span>Credit Limit</span>
          </div>

          {loading && <div>Loading...</div>}

          {!loading && data?.recentApplications?.length === 0 && (
            <div style={{ padding: 12 }}>No recent applications</div>
          )}

          {!loading && data?.recentApplications?.map((app) => (
            <div key={app.applicationNumber} style={styles.row}>
              <span>
                <button
                  type="button"
                  style={styles.appNoButton}
                  onClick={() => handleCopy(app.applicationNumber)}
                  title="Click to copy"
                >
                  {app.applicationNumber}
                </button>
                {copiedAppNo === app.applicationNumber && (
                  <span style={styles.copiedBadge}>Copied</span>
                )}
              </span>
              <span>{app.fullName}</span>
              <span>{app.appliedOn ? new Date(app.appliedOn).toLocaleString() : "-"}</span>
              <span style={{ color: app.status === "APPROVED" ? "#10b981" : app.status === "PENDING" ? "#f59e0b" : "#ef4444" }}>{app.status}</span>
              <span>{typeof app.creditLimit === "number" ? `₹${app.creditLimit.toLocaleString()}` : "-"}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const styles = {
  wrapper: {
    padding: "32px",
    backgroundColor: "#f8f9fb",
    minHeight: "100vh",
  },
  header: {
    marginBottom: "24px",
  },
  cards: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "16px",
    marginBottom: "28px",
  },
  card: {
    padding: "18px",
    borderRadius: "12px",
    backgroundColor: "#ffffff",
    border: "1px solid #e5e7eb",
  },
  cardLabel: {
    margin: 0,
    fontSize: "13px",
    fontWeight: 600,
    color: "#6b7280",
    letterSpacing: "0.2px",
  },
  number: {
    fontSize: "24px",
    fontWeight: 700,
    marginTop: "8px",
    color: "#111827",
  },
  section: {
    backgroundColor: "#ffffff",
    padding: "20px",
    borderRadius: "12px",
    border: "1px solid #e5e7eb",
  },
  table: {
    marginTop: "16px",
  },
  rowHeader: {
    display: "grid",
    gridTemplateColumns: "1.3fr 1fr 1.3fr 0.7fr 0.8fr",
    fontWeight: 600,
    fontSize: "12px",
    textTransform: "uppercase",
    color: "#6b7280",
    letterSpacing: "0.4px",
    paddingBottom: "8px",
    borderBottom: "1px solid #e5e7eb",
  },
  row: {
    display: "grid",
    gridTemplateColumns: "1.3fr 1fr 1.3fr 0.7fr 0.8fr",
    padding: "10px 0",
    borderBottom: "1px solid #f3f4f6",
    fontSize: "14px",
    color: "#111827",
  },
  appNoButton: {
    padding: 0,
    border: "none",
    background: "transparent",
    cursor: "pointer",
    color: "#2563eb",
    textDecoration: "underline",
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, \"Liberation Mono\", \"Courier New\", monospace",
  },
  copiedBadge: {
    marginLeft: "8px",
    fontSize: "11px",
    color: "#10b981",
    background: "#ecfdf5",
    border: "1px solid #a7f3d0",
    padding: "2px 6px",
    borderRadius: "999px",
  },
};

export default Dashboard;
