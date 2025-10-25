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
    <div className="min-h-screen flex">
      {/* Lado izquierdo - Logo */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-yellow-100 to-yellow-200 items-center justify-center p-12">
        <img 
          src={logo} 
          alt="FastFood.exe Logo" 
          className="max-w-md w-full h-auto object-contain"
        />
      </div>

      {/* Lado derecho - Formulario */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-white">
        <div className="w-full max-w-md">
          {/* Logo para móvil */}
          <div className="lg:hidden flex justify-center mb-8">
            <img 
              src={logo} 
              alt="FastFood.exe Logo" 
              className="w-48 h-auto object-contain"
            />
          </div>

          <form onSubmit={handleLogin} className="w-full flex flex-col space-y-6">
            <h2 className="text-4xl font-bold text-center mb-8 text-gray-900">INICIAR SESIÓN</h2>

            <input
              type="text"
              placeholder="Usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full p-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-200 text-lg"
            />

            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-200 text-lg"
            />

            <button
              type="submit"
              disabled={loading}
              className={`w-full p-4 rounded-lg text-black font-semibold text-lg transition-all duration-200 ${
                loading
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-yellow-300 hover:bg-yellow-400 border-2 border-black"
              }`}
            >
              {loading ? "Cargando..." : "Continuar"}
            </button>

            <div className="text-center">
              <a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                ¿Has olvidado la contraseña?
              </a>
            </div>

            {message && (
              <p
                className={`text-sm font-medium text-center px-4 py-3 rounded-lg w-full ${
                  message.type === "error"
                    ? "bg-red-100 text-red-700 border-2 border-red-300"
                    : "bg-green-100 text-green-700 border-2 border-green-300"
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
