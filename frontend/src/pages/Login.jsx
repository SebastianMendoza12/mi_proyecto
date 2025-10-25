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
    <div className="min-h-screen bg-gray-100 text-gray-900 flex justify-center items-center">
      <div className="max-w-screen-xl bg-white shadow-lg rounded-lg overflow-hidden flex flex-col lg:flex-row w-full m-4">
        {/* --- LADO IZQUIERDO (imagen local) --- */}
        <div className="flex-1 bg-indigo-100 hidden lg:flex items-center justify-center">
          <img
            src={logo}
            alt="Logo FastFood.exe"
            className="max-w-[80%] max-h-[80%] object-contain rounded-xl shadow-lg"
          />
        </div>

        {/* --- LADO DERECHO (formulario) --- */}
        <div className="flex-1 p-8 flex flex-col justify-center items-center">
          <h1 className="text-3xl font-bold mb-6 text-gray-800">Iniciar Sesión</h1>

          <form onSubmit={handleLogin} className="w-full max-w-sm space-y-4">
            <input
              type="text"
              placeholder="Usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
            />

            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
            />

            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-indigo-500 text-white py-3 rounded-lg font-semibold transition-all ${
                loading ? "opacity-50 cursor-not-allowed" : "hover:bg-indigo-600"
              }`}
            >
              {loading ? "Iniciando..." : "Entrar"}
            </button>

            {message && (
              <p
                className={`text-center font-medium mt-2 ${
                  message.type === "error" ? "text-red-500" : "text-green-500"
                }`}
              >
                {message.text}
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );

}

export default Login;
