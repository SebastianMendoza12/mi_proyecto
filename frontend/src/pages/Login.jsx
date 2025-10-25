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
    <div className="flex flex-col lg:flex-row min-h-screen">
      {/* ===== LADO IZQUIERDO - LOGO ===== */}
      {/* 📱 En móvil: arriba | 💻 En desktop: izquierda (48.75%) */}
      <div 
        className="w-full lg:w-[48.75%] flex items-center justify-center py-8 lg:py-0"
        style={{ backgroundColor: '#FFF9E6' }} // 🎨 CAMBIAR COLOR DE FONDO AQUÍ
      >
        <img 
          src={logo} 
          alt="FastFood.exe Logo" 
          className="w-3/4 max-w-sm lg:w-full lg:max-w-none lg:h-full object-contain p-4 lg:p-8"
        />
      </div>

      {/* ===== LADO DERECHO - FORMULARIO ===== */}
      {/* 📱 En móvil: abajo | 💻 En desktop: derecha (51.25%) */}
      <div 
        className="w-full lg:w-[51.25%] flex items-center justify-center p-6 sm:p-8 lg:p-12"
        style={{ backgroundColor: '#FFFFFF' }} // 🎨 CAMBIAR COLOR DE FONDO AQUÍ
      >
        <div className="w-full max-w-md space-y-6 sm:space-y-8">
          
          {/* ===== TÍTULO ===== */}
          <h2 
            className="text-center font-bold mb-8 sm:mb-12"
            style={{ 
              fontSize: 'clamp(32px, 5vw, 48px)', // 📱 32px móvil → 💻 48px desktop (se adapta automáticamente)
              fontFamily: 'Arial, sans-serif',
              color: '#000000',
              letterSpacing: '2px'
            }}
          >
            INICIAR SESIÓN
          </h2>

          <form onSubmit={handleLogin} className="space-y-4 sm:space-y-6">
            
            {/* ===== INPUT USUARIO ===== */}
            <input
              type="text"
              placeholder="Usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full rounded-lg focus:outline-none focus:ring-2 transition-all duration-200"
              style={{
                padding: 'clamp(12px, 2vw, 16px)', // 📱 12px móvil → 💻 16px desktop
                fontSize: 'clamp(16px, 2vw, 18px)', // 📱 16px móvil → 💻 18px desktop
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
                padding: 'clamp(12px, 2vw, 16px)',
                fontSize: 'clamp(16px, 2vw, 18px)',
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
                padding: 'clamp(12px, 2vw, 16px)',
                fontSize: 'clamp(18px, 2.5vw, 20px)',
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
                  fontSize: 'clamp(12px, 1.5vw, 14px)',
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
                  fontSize: 'clamp(12px, 1.5vw, 14px)',
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
