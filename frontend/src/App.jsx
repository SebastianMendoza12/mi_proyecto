import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";

function Navbar() {
  const location = useLocation();

  return (
    <nav className="flex justify-center gap-4 mb-8 w-full">
      <Link
        to="/login"
        className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
          location.pathname === "/login"
            ? "bg-blue-600 text-white shadow-md"
            : "bg-gray-200 text-gray-700 hover:bg-gray-300 hover:shadow-sm"
        }`}
      >
        Iniciar Sesión
      </Link>

      <Link
        to="/register"
        className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
          location.pathname === "/register"
            ? "bg-blue-600 text-white shadow-md"
            : "bg-gray-200 text-gray-700 hover:bg-gray-300 hover:shadow-sm"
        }`}
      >
        Registrarse
      </Link>
    </nav>
  );
}

function App() {
  return (
    <Router>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
        <h1 className="text-4xl font-bold mb-8 text-gray-800">🍔 FastFood</h1>
        <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8">
          <Navbar />
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
