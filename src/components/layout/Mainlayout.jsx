import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const MainLayout = ({ children }) => {
  return (
    <div style={styles.container}>
      <Navbar />
      <div style={styles.main}>
        <Sidebar />
        <div style={styles.content}>{children}</div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#f4f6f9",
  },
  main: {
    display: "flex",
  },
  content: {
    flex: 1,
    padding: "30px",
  },
};

export default MainLayout;
