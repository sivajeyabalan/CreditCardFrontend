import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div style={styles.sidebar}>
      <h3 style={styles.logo}>ABC Bank</h3>

      <nav style={styles.nav}>
        <Link style={styles.link} to="/dashboard">
          Dashboard
        </Link>
        <Link style={styles.link} to="/apply">
          Apply Card
        </Link>
        <Link style={styles.link} to="/track">
          Track Application
        </Link>
      </nav>
    </div>
  );
};

const styles = {
  sidebar: {
    width: "220px",
    backgroundColor: "#FFFFFF",
    color: "#fff",
    minHeight: "100vh",
    padding: "20px",
  },
  logo: {
    marginBottom: "30px",
  },
  nav: {
    display: "flex",
    flexDirection: "column",
  },
  link: {
    color: "#000000",
    textDecoration: "none",
    marginBottom: "15px",
  },
};

export default Sidebar;
