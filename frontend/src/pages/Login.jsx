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
      localStorage.setItem("username", username);
      console.log("Token:", res.data);
      setTimeout(() => {
        window.location.href = "/";
      }, 1000);
      
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
        errorText = `❌ ${errorDetail || "Ocurrió un error inesperado"}`;  
      }
      
      setMessage({ text: errorText, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex w-full">
      
      {/* Lado Izquierdo - Logo con fondo crema/beige */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-12" style={{ backgroundColor: '#FDFED6' }}>
        <div className="flex items-center justify-center w-full h-full">
          <img
            src={logo}
            alt="FastFood.exe Logo"
            className="max-w-md w-full h-auto object-contain"
          />
        </div>
      </div>

      {/* Lado Derecho - Formulario */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 bg-white">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center" style={{ marginBottom: '3rem' }}>
            <h1 className="text-4xl sm:text-5xl font-black text-gray-900">
              INICIAR SESIÓN
            </h1>
          </div>

          {/* Formulario */}
          <form onSubmit={handleLogin}>
            {/* Input Usuario */}
            <div style={{ marginBottom: '1.5rem' }}>
              <input
                type="text"
                placeholder="Usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full px-6 py-4 rounded-lg border-2 border-gray-300 focus:border-gray-400 focus:outline-none transition-all duration-200 text-gray-700 placeholder-gray-400"
              />
            </div>

            {/* Input Contraseña */}
            <div style={{ marginBottom: '1.5rem' }}>
              <input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-6 py-4 rounded-lg border-2 border-gray-300 focus:border-gray-400 focus:outline-none transition-all duration-200 text-gray-700 placeholder-gray-400"
              />
            </div>

            {/* Botón Submit */}
            <div style={{ marginBottom: '1.5rem' }}>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-5 rounded-lg font-bold text-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                style={{ backgroundColor: '#F5F0D8', color: '#000' }}
              >
                {loading ? "Cargando..." : "Continuar"}
              </button>
            </div>

            {/* Mensaje de Error/Éxito */}
            {message && (
              <div
                className={`p-4 rounded-lg border-2 ${
                  message.type === "error"
                    ? "bg-red-50 border-red-300 text-red-800"
                    : "bg-green-50 border-green-300 text-green-800"
                }`}
              >
                <p className="text-sm font-medium text-center">
                  {message.text}
                </p>
              </div>
            )}
          </form>

          {/* Footer - Enlace recuperar contraseña */}
          <div className="text-center">
            <a
              href="#"
              className="text-gray-600 hover:text-gray-900 text-sm font-medium hover:underline"
            >
              ¿Has olvidado la contraseña?
            </a>
          </div>

          {/* Footer - Enlace a Registro */}
          <div className="text-center">
            <p className="text-gray-600 text-sm">
              ¿No tienes cuenta?{" "}
              <a
                href="/register"
                className="text-indigo-600 hover:text-indigo-700 font-semibold hover:underline"
              >
                Regístrate aquí
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );

}

export default Login;
