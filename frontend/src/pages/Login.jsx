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
    <div className="flex min-h-[90vh] w-full bg-gray-100 rounded-2xl shadow-lg overflow-hidden">
      {/* Lado Izquierdo - Imagen */}
      <div className="hidden md:flex w-1/2 bg-blue-50 items-center justify-center">
        <img
          src={logo}
          alt="Logo"
          className="object-cover w-full h-full"
          style={{ objectPosition: "center" }}
        />
      </div>

      {/* Lado Derecho - Formulario */}
      <div className="flex flex-col justify-center items-center w-full md:w-1/2 p-8 sm:p-12 bg-white">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">Iniciar Sesión</h2>

        <form
          onSubmit={handleLogin}
          className="w-full max-w-sm sm:max-w-md flex flex-col gap-5"
        >
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
            {loading ? "⏳ Cargando..." : "Entrar"}
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
    </div>
  );
}

export default Login;
