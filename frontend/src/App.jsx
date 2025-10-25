import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";

function Navbar() {
  const location = useLocation();
  
  // No mostrar navbar en login/register (ya tienen su propio diseño completo)
  if (location.pathname === "/login" || location.pathname === "/register") {
    return null;
  }
  
  return (
    <div className="w-full bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800">
            🍔 FastFood.exe
          </h1>
          
          <nav className="flex gap-4">
            <Link
              to="/login"
              className="px-6 py-2.5 rounded-lg font-semibold transition-all duration-200 bg-indigo-600 text-white hover:bg-indigo-700 shadow-md hover:shadow-lg transform hover:scale-105"
            >
              👤 Iniciar Sesión
            </Link>

            <Link
              to="/register"
              className="px-6 py-2.5 rounded-lg font-semibold transition-all duration-200 bg-purple-600 text-white hover:bg-purple-700 shadow-md hover:shadow-lg transform hover:scale-105"
            >
              ➕ Registrarse
            </Link>
          </nav>
        </div>
      </div>
    </div>
  );
}

function Welcome() { 
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-80px)] px-4">
      <div className="max-w-2xl w-full bg-white shadow-2xl rounded-2xl p-8 sm:p-12 text-center">
        <div className="text-6xl mb-6">🍔</div>
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
          Bienvenido a FastFood.exe
        </h2>
        <p className="text-gray-600 text-lg mb-8">
          La plataforma más rápida para gestionar tus pedidos de comida.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/login"
            className="px-8 py-3 rounded-lg font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Iniciar Sesión
          </Link>
          <Link
            to="/register"
            className="px-8 py-3 rounded-lg font-semibold bg-purple-600 text-white hover:bg-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Crear Cuenta
          </Link>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 w-full">
        <Navbar />
        
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;