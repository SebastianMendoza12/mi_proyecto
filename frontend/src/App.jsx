import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";

function Navbar() {
  const location = useLocation();

  return (
    <nav className="flex flex-col sm:flex-row justify-center gap-4 mb-8 w-full">  {/* flex-col en móvil para apilar enlaces */}
      <Link
        to="/login"
        className={`px-4 sm:px-6 py-3 rounded-xl font-semibold transition-all duration-200 text-center w-full sm:w-auto ${
          location.pathname === "/login"
            ? "bg-blue-600 text-white shadow-md"
            : "bg-gray-200 text-gray-700 hover:bg-gray-300 hover:shadow-sm"
        }`}
      >
        Iniciar Sesión
      </Link>

      <Link
        to="/register"
        className={`px-4 sm:px-6 py-3 rounded-xl font-semibold transition-all duration-200 text-center w-full sm:w-auto ${
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
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-2 sm:px-4 lg:px-8 w-full">  {/* px responsive: pequeño en móvil, grande en PC */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 sm:mb-8 text-gray-800">🍔 FastFood</h1>  {/* Tamaño de fuente responsive */}
        <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg bg-white shadow-xl rounded-2xl p-6 sm:p-8">  {/* Ancho y padding responsive */}
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
