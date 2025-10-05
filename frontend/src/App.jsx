import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";

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
          backgroundColor: "#f8f9fa",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <h1 style={{ marginBottom: "30px" }}>🍔 FastFood</h1>

        {/* Enlaces de navegación */}
        <nav style={{ marginBottom: "20px" }}>
          <Link to="/login" style={{ margin: "0 15px" }}>Login</Link>
          <Link to="/register" style={{ margin: "0 15px" }}>Registro</Link>
        </nav>

        <div
          style={{
            background: "#fff",
            padding: "40px",
            borderRadius: "10px",
            boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
            width: "300px",
            textAlign: "center",
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
