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
    <div className="flex flex-row min-h-screen overflow-hidden">
      {/* ===== LADO IZQUIERDO - LOGO ===== */}
      <div 
        className="w-[48.75%] flex items-center justify-center"
        style={{ backgroundColor: '#FFF9E6' }}
      >
        <img 
          src={logo} 
          alt="FastFood.exe Logo" 
          className="w-full h-full object-contain p-4 md:p-8"
        />
      </div>

      {/* ===== LADO DERECHO - FORMULARIO ===== */}
      <div 
        className="w-[51.25%] flex items-center justify-center p-4 md:p-8 lg:p-12 overflow-y-auto"
        style={{ backgroundColor: '#FFFFFF' }}
      >
        <div className="w-full max-w-md space-y-4 md:space-y-6 lg:space-y-8">
          
          {/* ===== TÍTULO ===== */}
          <h2 
            className="text-center font-bold"
            style={{ 
              fontSize: 'clamp(24px, 4vw, 48px)',
              fontFamily: 'Arial, sans-serif',
              color: '#000000',
              letterSpacing: '2px'
            }}
          >
            INICIAR SESIÓN
          </h2>

          <form onSubmit={handleLogin} className="space-y-3 md:space-y-4 lg:space-y-6">
            
            {/* ===== INPUT USUARIO ===== */}
            <input
              type="text"
              placeholder="Usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full rounded-lg focus:outline-none focus:ring-2 transition-all duration-200"
              style={{
                padding: 'clamp(10px, 1.5vw, 16px)',
                fontSize: 'clamp(14px, 1.8vw, 18px)',
                fontFamily: 'Arial, sans-serif',
                border: '2px solid #D1D5DB',
                backgroundColor: '#FFFFFF'
              }}
            />

            {/* ===== INPUT CONTRASEÑA ===== */}
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-lg focus:outline-none focus:ring-2 transition-all duration-200"
              style={{
                padding: 'clamp(10px, 1.5vw, 16px)',
                fontSize: 'clamp(14px, 1.8vw, 18px)',
                fontFamily: 'Arial, sans-serif',
                border: '2px solid #D1D5DB',
                backgroundColor: '#FFFFFF'
              }}
            />

            {/* ===== BOTÓN CONTINUAR ===== */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg font-semibold transition-all duration-200 hover:opacity-90"
              style={{
                padding: 'clamp(10px, 1.5vw, 16px)',
                fontSize: 'clamp(16px, 2vw, 20px)',
                fontFamily: 'Arial, sans-serif',
                backgroundColor: loading ? '#D1D5DB' : '#FDE68A',
                color: '#000000',
                border: '2px solid #000000',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? "Cargando..." : "Continuar"}
            </button>

            {/* ===== LINK OLVIDÓ CONTRASEÑA ===== */}
            <div className="text-center pt-2">
              <a 
                href="#" 
                className="hover:underline transition-colors"
                style={{
                  fontSize: 'clamp(11px, 1.2vw, 14px)',
                  fontFamily: 'Arial, sans-serif',
                  color: '#6B7280'
                }}
              >
                ¿Has olvidado la contraseña?
              </a>
            </div>

            {/* ===== MENSAJE DE ERROR/ÉXITO ===== */}
            {message && (
              <p
                className="text-center px-4 py-3 rounded-lg w-full font-medium"
                style={{
                  fontSize: 'clamp(11px, 1.2vw, 14px)',
                  backgroundColor: message.type === "error" ? '#FEE2E2' : '#D1FAE5',
                  color: message.type === "error" ? '#991B1B' : '#065F46',
                  border: `2px solid ${message.type === "error" ? '#FCA5A5' : '#6EE7B7'}`
                }}
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
