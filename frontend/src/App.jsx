import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";

function Navbar() {
  const location = useLocation();

  const isLogin = location.pathname === "/login" || location.pathname === "/";
  const isRegister = location.pathname === "/register";

  return (
    <nav style={{ marginBottom: "25px", display: "flex", gap: "10px" }}>
      <Link
        to="/login"
        style={{
          pointerEvents: isLogin ? "none" : "auto",
          backgroundColor: isLogin ? "#6c757d" : "#007bff",
          color: "white",
          padding: "10px 20px",
          borderRadius: "6px",
          textDecoration: "none",
          opacity: isLogin ? 0.7 : 1,
        }}
      >
        Login
      </Link>
      <Link
        to="/register"
        style={{
          pointerEvents: isRegister ? "none" : "auto",
          backgroundColor: isRegister ? "#6c757d" : "#007bff",
          color: "white",
          padding: "10px 20px",
          borderRadius: "6px",
          textDecoration: "none",
          opacity: isRegister ? 0.7 : 1,
        }}
      >
        Registro
      </Link>
    </nav>
  );
}

function App() {
  return (
    <Router>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          background: "linear-gradient(135deg, #f5f7fa, #c3cfe2)",
          padding: "20px",
        }}
      >
        <h1 style={{ marginBottom: "20px", color: "#333" }}>🍔 FastFood</h1>
        <Navbar />
        <div
          style={{
            background: "#fff",
            padding: "40px 30px",
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            width: "100%",
            maxWidth: "350px",
          }}
        >
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

export default App;
