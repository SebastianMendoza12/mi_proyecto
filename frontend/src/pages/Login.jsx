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
    <div className="fixed inset-0 flex flex-row">
      {/* ===== LADO IZQUIERDO - LOGO ===== */}
      <div 
        className="w-1/2 h-full flex items-center justify-center"
        style={{ backgroundColor: '#FFF9E6' }} // 🎨 Color de fondo (igual al del logo)
      >
        <img 
          src={logo} 
          alt="FastFood.exe Logo" 
          className="object-contain"
          style={{
            width: '450px',      // 📏 Tamaño del logo (ajusta aquí: 350px, 400px, 500px, etc)
            height: 'auto'
          }}
        />
      </div>

      {/* ===== LADO DERECHO - FORMULARIO ===== */}
      <div 
        className="w-1/2 h-full flex items-center justify-center"
        style={{ backgroundColor: '#FFFFFF' }} // 🎨 Fondo blanco
      >
        <div className="w-full px-12" style={{ maxWidth: '500px' }}> {/* 📐 Ancho del formulario */}
          
          {/* ===== TÍTULO ===== */}
          <h2 
            className="text-center font-bold mb-16"
            style={{ 
              fontSize: '48px',                    // 📝 Tamaño del título
              fontFamily: 'Arial, sans-serif',     // 🔤 Tipo de letra
              color: '#000000',                    // 🎨 Color
              letterSpacing: '2px',                // 📏 Espaciado
              fontWeight: '900'
            }}
          >
            INICIAR SESIÓN
          </h2>

          <form onSubmit={handleLogin} className="space-y-5"> {/* 📐 Espacio entre elementos: space-y-4, 5, 6 */}
            
            {/* ===== INPUT USUARIO ===== */}
            <input
              type="text"
              placeholder="Usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all duration-200"
              style={{
                padding: '16px 20px',              // 📏 Padding interno
                fontSize: '16px',                  // 📝 Tamaño fuente
                fontFamily: 'Arial, sans-serif',   // 🔤 Tipo letra
                border: '1px solid #E5E7EB',       // 🎨 Borde
                borderRadius: '8px',               // 📐 Redondeo esquinas
                backgroundColor: '#FFFFFF',
                color: '#9CA3AF'                   // 🎨 Color placeholder
              }}
            />

            {/* ===== INPUT CONTRASEÑA ===== */}
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all duration-200"
              style={{
                padding: '16px 20px',
                fontSize: '16px',
                fontFamily: 'Arial, sans-serif',
                border: '1px solid #E5E7EB',
                borderRadius: '8px',
                backgroundColor: '#FFFFFF',
                color: '#9CA3AF'
              }}
            />

            {/* ===== BOTÓN CONTINUAR ===== */}
            <button
              type="submit"
              disabled={loading}
              className="w-full font-semibold transition-all duration-200 hover:opacity-90 mt-6"
              style={{
                padding: '16px',                               // 📏 Altura del botón
                fontSize: '18px',                              // 📝 Tamaño texto
                fontFamily: 'Arial, sans-serif',               // 🔤 Tipo letra
                backgroundColor: loading ? '#D1D5DB' : '#FDE68A', // 🎨 Color fondo (amarillo)
                color: '#000000',                              // 🎨 Color texto
                border: '2px solid #000000',                   // 🎨 Borde negro
                borderRadius: '8px',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontWeight: '600'
              }}
            >
              {loading ? "Cargando..." : "Continuar"}
            </button>

            {/* ===== LINK OLVIDÓ CONTRASEÑA ===== */}
            <div className="text-center pt-4">
              <a 
                href="#" 
                className="hover:underline transition-colors"
                style={{
                  fontSize: '14px',                  // 📝 Tamaño
                  fontFamily: 'Arial, sans-serif',   // 🔤 Tipo letra
                  color: '#6B7280'                   // 🎨 Color gris
                }}
              >
                ¿Has olvidado la contraseña?
              </a>
            </div>

            {/* ===== MENSAJE DE ERROR/ÉXITO ===== */}
            {message && (
              <p
                className="text-center px-4 py-3 w-full font-medium mt-4"
                style={{
                  fontSize: '14px',
                  backgroundColor: message.type === "error" ? '#FEE2E2' : '#D1FAE5',
                  color: message.type === "error" ? '#991B1B' : '#065F46',
                  border: `2px solid ${message.type === "error" ? '#FCA5A5' : '#6EE7B7'}`,
                  borderRadius: '8px'
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
