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
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* LADO IZQUIERDO */}
      <div className="hidden md:flex md:w-1/2 bg-[#FFFBD2] items-center justify-center">
        <img
          src={logo}
          alt="Logo FastFood.exe"
          className="w-72 h-auto object-contain"
        />
      </div>

      {/* LADO DERECHO */}
      <div className="flex w-full md:w-1/2 items-center justify-center bg-white">
        <div className="w-full max-w-md px-8 py-10">
          <h2 className="text-3xl font-extrabold text-black text-center mb-10">
            INICIAR SESIÓN
          </h2>

          <form
            onSubmit={handleLogin}
            className="flex flex-col items-center space-y-6"
          >
            <input
              type="text"
              placeholder="Usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FFFBD2]"
            />

            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FFFBD2]"
            />

            <button
              type="submit"
              disabled={loading}
              className={`w-full p-3 rounded-md font-semibold transition-all duration-200 ${
                loading
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-[#FFFBD2] hover:bg-[#FFF9AA] text-black border border-gray-400"
              }`}
            >
              {loading ? "Cargando..." : "Continuar"}
            </button>

            <p className="text-sm text-gray-700 hover:underline cursor-pointer">
              ¿Has olvidado la contraseña?
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
    </div>
  );
}

export default Login;
