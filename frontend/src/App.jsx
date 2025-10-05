import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
  return (
    <Router>
      <div style={styles.container}>
        <h1 style={styles.title}>🍔 FastFood</h1>

        <nav style={styles.nav}>
          <Link to="/login" style={styles.link}>Login</Link>
          <Link to="/register" style={styles.link}>Registro</Link>
        </nav>

        <div style={styles.card}>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    backgroundColor: "#fafafa",
  },
  title: {
    marginBottom: "20px",
    color: "#e74c3c",
  },
  nav: {
    display: "flex",
    gap: "20px",
    marginBottom: "30px",
  },
  link: {
    textDecoration: "none",
    color: "#3498db",
    fontWeight: "bold",
    fontSize: "18px",
  },
  card: {
    backgroundColor: "white",
    padding: "30px",
    borderRadius: "10px",
    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
    width: "300px",
    textAlign: "center",
  },
};

export default App;
