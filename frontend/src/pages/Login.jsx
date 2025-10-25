import { useState } from "react";
import { loginUser  } from "../services/api";
import logo from "../assets/LogotipoProyecto.png";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);

    try {
      const res = await loginUser ({ username, password });
      setMessage({ text: "✅ Inicio de sesión exitoso", type: "success" });
      console.log("Token:", res.data);
      
    } catch (err) {
      const errorDetail = err.response?.data?.detail || err.response?.data?.error || "";
      let errorText = "❌ Error al iniciar sesión";
      
      
      if (errorDetail.includes("No active account") || errorDetail.includes("credentials") || errorDetail.includes("invalid")) {
        errorText = "❌ Usuario o contraseña incorrectos. Inténtalo de nuevo";
      } else if (errorDetail.includes("network") || !err.response) {
        errorText = "❌ Error de conexión. Verifica tu internet e inténtalo de nuevo";
      } else if (errorDetail.includes("inactive")) {
        errorText = "❌ Cuenta inactiva. Contacta al administrador";
      } else {
        errorText = `❌ ${errorDetail || "Ocurrió un error inesperado"}`;  // Solo si es necesario
      }
      
      setMessage({ text: errorText, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="flex flex-col lg:flex-row w-full h-screen bg-gray-100">
    {/* Sección Izquierda (Logo) */}
    <div className="lg:w-1/2 w-full flex justify-center items-center bg-white">
      <img
        src={logo}
        alt="Logo FastFood.exe"
        className="max-w-full h-auto object-contain p-8"
      />
    </div>

    {/* Sección Derecha (Formulario) */}
    <div className="lg:w-1/2 w-full flex justify-center items-center bg-white shadow-inner">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-sm sm:max-w-md lg:max-w-lg mx-auto flex flex-col items-center space-y-6 p-6 sm:p-8"
      >
        <h2 className="text-3xl font-bold mb-6 text-gray-800">Iniciar Sesión</h2>

        <input
          type="text"
          placeholder="Usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
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
          {loading ? "⏳ Cargando..." : "🚀 Entrar"}
        </button>

        <p className="text-sm text-gray-600 mt-2 hover:text-blue-500 cursor-pointer">
          ¿Olvidaste tu contraseña?
        </p>

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
  </div>
);

}

export default Login;
