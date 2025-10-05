import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";

function Navbar() {
  const location = useLocation();

  return (
    <nav className="flex justify-center gap-4 mb-6">
      <Link
        to="/login"
        className={`px-4 py-2 rounded-md font-medium ${
          location.pathname === "/login"
            ? "bg-blue-600 text-white cursor-default"
            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
        }`}
      >
        Login
      </Link>

      <Link
        to="/register"
        className={`px-4 py-2 rounded-md font-medium ${
          location.pathname === "/register"
            ? "bg-blue-600 text-white cursor-default"
            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
        }`}
      >
        Registro
      </Link>
    </nav>
  );
}

function App() {
  return (
    <Router>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
        <h1 className="text-3xl font-bold mb-8">🍔 FastFood</h1>
        <div className="w-full max-w-sm bg-white shadow-lg rounded-2xl p-6">
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
