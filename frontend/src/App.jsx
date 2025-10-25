import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta principal */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Rutas públicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Ruta protegida temporal (Home) */}
        <Route path="/home" element={<Home />} />

        {/* Si no existe la ruta */}
        <Route path="*" element={<h1 className="text-center mt-10 text-2xl font-bold">404 - Página no encontrada</h1>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
