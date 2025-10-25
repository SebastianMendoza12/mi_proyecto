import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";

function Navbar() {
  const location = useLocation();

  // 🔥 RUTAS SIN NAVBAR (pantalla completa lado a lado)
  const noNavbarRoutes = ["/login", "/register", "/2fa"];
  if (noNavbarRoutes.includes(location.pathname)) {
    return null;
  }

  return (
    <div className="flex flex-col items-center bg-white shadow-lg rounded-xl p-4 sm:p-6 mb-6 w-full max-w-sm sm:max-w-md lg:max-w-lg mx-auto">  {/* Caja global para título y botones: siempre arriba */}
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 text-gray-800">🍔 FastFood.exe</h1>  {/* Título siempre visible */}
      
      <nav className="flex flex-col sm:flex-row justify-center gap-4 w-full">  {/* Botones en caja, responsive */}
        <Link
          to="/login"
          className={`px-6 sm:px-8 py-3 rounded-xl font-semibold transition-all duration-200 text-center w-full sm:w-auto shadow-sm border border-gray-200 hover:border-blue-300 ${
            location.pathname === "/login"
              ? "bg-blue-600 text-white shadow-md border-blue-600"
              : "bg-white text-gray-700 hover:bg-blue-50 hover:shadow-md"
          }`}
        >
          👤 Iniciar Sesión
        </Link>

        <Link
          to="/register"
          className={`px-6 sm:px-8 py-3 rounded-xl font-semibold transition-all duration-200 text-center w-full sm:w-auto shadow-sm border border-gray-200 hover:border-blue-300 ${
            location.pathname === "/register"
              ? "bg-blue-600 text-white shadow-md border-blue-600"
              : "bg-white text-gray-700 hover:bg-blue-50 hover:shadow-md"
          }`}
        >
          ➕ Registrarse
        </Link>
      </nav>
    </div>
  );
}

function Welcome() { 
  return (
    <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg mx-auto text-center bg-white shadow-xl rounded-2xl p-6 sm:p-8">
      <p className="text-gray-600 text-sm sm:text-base">
        Bienvenido a FastFood.exe. Elige una opción para comenzar tu experiencia.
      </p>
    </div>
  );
}

function App() {
  const location = useLocation();
  
  // 🔥 RUTAS CON DISEÑO ESPECIAL (pantalla completa, sin contenedores)
  const fullScreenRoutes = ["/login", "/register", "/2fa"];
  const isFullScreenPage = fullScreenRoutes.includes(location.pathname);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-2 sm:px-4 lg:px-8 w-full">
      <Navbar />  {/* Navbar GLOBAL: Siempre arriba, con título y botones */}
        
      <Routes>  {/* Contenido que cambia debajo del navbar */}
        <Route path="/" element={<Welcome />} />  {/* Home: Solo mensaje de bienvenida, SIN casillas */}
        <Route path="/login" element={<Login />} />  {/* Login: Formulario debajo */}
        <Route path="/register" element={<Register />} />  {/* Register: Formulario debajo */}
      </Routes>
    </div>
  );
}

// Wrapper para que useLocation funcione
function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

export default App;
