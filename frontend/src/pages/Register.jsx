import { useState } from "react";
import { registerUser } from "../services/api";  // Asumiendo que api.js tiene registerUser con Axios

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);

    // Limpieza automática: Remueve tokens viejos antes de register (evita "expired")
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");  // Si usas refresh tokens

    try {
      await registerUser({ username, password });
      setMessage({ text: "✅ Usuario creado exitosamente. Ahora puedes iniciar sesión.", type: "success" });
      setUsername("");
      setPassword("");  // Limpia campos para UX mejor
    } catch (err) {
      const status = err.response?.status;
      const errorDetail = err.response?.data?.detail || err.response?.data?.error || err.message || "";

      let errorText = "❌ Error al registrar usuario. Inténtalo de nuevo.";

      // Manejo específico para errores comunes del backend
      if (status === 401 || errorDetail.includes("Token is expired") || errorDetail.includes("unauthorized") || errorDetail.includes("authentication")) {
        errorText = "❌ Error temporal en la autenticación. Limpia la caché e inténtalo de nuevo.";  // Amigable para "Token expired"
        // Limpia storage extra si es auth error
        localStorage.clear();  // Borra todo local para reset completo (solo en este caso)
      } else if (errorDetail.includes("already exists") || errorDetail.includes("taken") || status === 409) {
        errorText = "❌ El usuario ya existe. Elige otro nombre.";
      } else if (errorDetail.includes("password") || status === 400) {
        errorText = "❌ La contraseña debe tener al menos 8 caracteres y ser segura.";
      } else if (errorDetail.includes("network") || !err.response) {
        errorText = "❌ Error de conexión. Verifica tu internet e inténtalo de nuevo.";
      } else {
        errorText = `❌ ${errorDetail || "Ocurrió un error inesperado. Contacta soporte."}`;
      }

      setMessage({ text: errorText, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg mx-auto bg-white shadow-xl rounded-2xl p-6 sm:p-8">
      <form onSubmit={handleRegister} className="w-full flex flex-col items-center space-y-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Registro de Usuario</h2>

        <input
          type="text"
          placeholder="Usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
        />

        <button
          type="submit"
          disabled={loading}
          className={`w-full p-4 rounded-xl text-white font-semibold transition-all duration-200 transform hover:scale-105 ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 shadow-md"
          }`}
        >
          {loading ? "⏳ Cargando..." : "📝 Registrarse"}
        </button>

        {message && (
          <p
            className={`text-sm font-medium text-center px-4 py-2 rounded-lg w-full ${
              message.type === "error"
                ? "bg-red-100 text-red-700 border border-red-300"
                : "bg-green-100 text-green-700 border border-green-300"
            }`}
          >
            {message.text}
          </p>
        )}
      </form>
    </div>
  );
}

export default Register;
