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
      {/* SIEMPRE horizontal, ocupa ~49% del ancho */}
      <div 
        className="w-[49%] min-h-screen flex items-center justify-center"
        style={{ backgroundColor: '#FFF9E6' }} // 🎨 CAMBIAR COLOR DE FONDO AQUÍ (mismo del logo)
      >
        <img 
          src={logo} 
          alt="FastFood.exe Logo" 
          className="h-auto"
          style={{
            width: '60%',           // 📏 TAMAÑO DEL LOGO (ajusta entre 40% - 80%)
            maxWidth: '500px',      // 📏 TAMAÑO MÁXIMO (ajusta según necesites)
            objectFit: 'contain'
          }}
        />
      </div>

      {/* ===== LADO DERECHO - FORMULARIO ===== */}
      {/* SIEMPRE horizontal, ocupa ~51% del ancho */}
      <div 
        className="w-[51%] min-h-screen flex items-center justify-center overflow-y-auto"
        style={{ backgroundColor: '#FFFFFF' }} // 🎨 CAMBIAR COLOR DE FONDO AQUÍ
      >
        <div className="w-full px-8 py-12" style={{ maxWidth: '480px' }}> {/* 📐 Cambiar maxWidth para ancho del form */}
          
          {/* ===== TÍTULO ===== */}
          <h2 
            className="text-center font-bold mb-12"
            style={{ 
              fontSize: '48px',        // 📝 TAMAÑO DE FUENTE DEL TÍTULO
              fontFamily: 'Arial, sans-serif', // 🔤 TIPO DE LETRA
              color: '#000000',        // 🎨 COLOR DEL TÍTULO
              letterSpacing: '2px'     // 📏 ESPACIADO ENTRE LETRAS
            }}
          >
            INICIAR SESIÓN
          </h2>

          <form onSubmit={handleLogin} className="space-y-6">
            
            {/* ===== INPUT USUARIO ===== */}
            <input
              type="text"
              placeholder="Usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all duration-200"
              style={{
                padding: '16px',           // 📏 PADDING INTERNO DEL INPUT
                fontSize: '18px',          // 📝 TAMAÑO DE FUENTE
                fontFamily: 'Arial, sans-serif', // 🔤 TIPO DE LETRA
                border: '2px solid #D1D5DB', // 🎨 BORDE (color y grosor)
                backgroundColor: '#FFFFFF'  // 🎨 FONDO DEL INPUT
              }}
            />

            {/* ===== INPUT CONTRASEÑA ===== */}
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all duration-200"
              style={{
                padding: '16px',           // 📏 PADDING INTERNO DEL INPUT
                fontSize: '18px',          // 📝 TAMAÑO DE FUENTE
                fontFamily: 'Arial, sans-serif', // 🔤 TIPO DE LETRA
                border: '2px solid #D1D5DB', // 🎨 BORDE
                backgroundColor: '#FFFFFF'  // 🎨 FONDO DEL INPUT
              }}
            />

            {/* ===== BOTÓN CONTINUAR ===== */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg font-semibold transition-all duration-200 hover:opacity-90"
              style={{
                padding: '16px',                    // 📏 PADDING (altura del botón)
                fontSize: '20px',                   // 📝 TAMAÑO DE FUENTE
                fontFamily: 'Arial, sans-serif',    // 🔤 TIPO DE LETRA
                backgroundColor: loading ? '#D1D5DB' : '#FDE68A', // 🎨 COLOR DE FONDO (amarillo)
                color: '#000000',                   // 🎨 COLOR DEL TEXTO
                border: '2px solid #000000',        // 🎨 BORDE NEGRO
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
                  fontSize: '14px',              // 📝 TAMAÑO DE FUENTE
                  fontFamily: 'Arial, sans-serif', // 🔤 TIPO DE LETRA
                  color: '#6B7280'               // 🎨 COLOR DEL TEXTO (gris)
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
                  fontSize: '14px',  // 📝 TAMAÑO DE FUENTE
                  backgroundColor: message.type === "error" ? '#FEE2E2' : '#D1FAE5', // 🎨 FONDO
                  color: message.type === "error" ? '#991B1B' : '#065F46', // 🎨 COLOR TEXTO
                  border: `2px solid ${message.type === "error" ? '#FCA5A5' : '#6EE7B7'}` // 🎨 BORDE
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
