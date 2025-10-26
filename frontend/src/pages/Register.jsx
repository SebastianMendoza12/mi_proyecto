import { useState } from "react";
import { registerUser } from "../services/api";  // Asumiendo que api.js tiene registerUser con Axios
import logo from "../assets/LogotipoProyecto.png";

function Register() {
  const [username, setUsername] = useState("");
  const [telefono, setTelefono] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const checkPasswordStrength = (pass) => {
    if (!pass) return { level: 0, text: "", color: "", bgColor: "", width: "0%" };

    let strength = 0;
    const checks = {
      length: pass.length >= 8,
      uppercase: /[A-Z]/.test(pass),
      lowercase: /[a-z]/.test(pass),
      number: /[0-9]/.test(pass),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(pass),
    };

    if (checks.length) strength++;
    if (checks.uppercase && checks.lowercase) strength++;
    if (checks.number) strength++;
    if (checks.special) strength++;

    if (strength <= 1) {
      return { 
        level: 1, 
        text: "Débil", 
        color: "text-red-600", 
        bgColor: "bg-red-500",
        width: "33%",
        requirements: checks
      };
    } else if (strength <= 3) {
      return { 
        level: 2, 
        text: "Media", 
        color: "text-yellow-600", 
        bgColor: "bg-yellow-500",
        width: "66%",
        requirements: checks
      };
    } else {
      return { 
        level: 3, 
        text: "Fuerte", 
        color: "text-green-600", 
        bgColor: "bg-green-500",
        width: "100%",
        requirements: checks
      };
    }
  };

  const passwordStrength = checkPasswordStrength(password);

  // Validar que las contraseñas coincidan
  const passwordsMatch = password && confirmPassword && password === confirmPassword;
  const showPasswordMismatch = confirmPassword && password !== confirmPassword;

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage(null);
    if (password !== confirmPassword) {setMessage({ text: "❌ Las contraseñas no coinciden", type: "error" });
      return;
    }
    setLoading(true);

    // Limpieza automática: Remueve tokens viejos antes de register (evita "expired")
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token"); 

    try {
      await registerUser({ username, password });
      setMessage({ text: "✅ Usuario creado exitosamente. Ahora puedes iniciar sesión.", type: "success" });
      setUsername("");
      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      const status = err.response?.status;
      const errorDetail = err.response?.data?.detail || err.response?.data?.error || err.message || "";

      let errorText = "❌ Error al registrar usuario. Inténtalo de nuevo.";

      // Manejo específico para errores comunes del backend
      if (status === 401 || errorDetail.includes("Token is expired") || errorDetail.includes("unauthorized") || errorDetail.includes("authentication")) {
        errorText = "❌ Error temporal en la autenticación. Limpia la caché e inténtalo de nuevo.";  // Amigable para "Token expired"
        // Limpia storage extra si es auth error
        localStorage.clear();  // Borra todo local para reset completo (solo en este caso)
      } else if (errorDetail.includes("already exists") || errorDetail.includes("taken") || status === 409) {
        errorText = "❌ El usuario ya existe. Elige otro nombre.";
      } else if (errorDetail.includes("password") || status === 400) {
        errorText = "❌ La contraseña no cumple los requisitos de seguridad.";
      } else if (errorDetail.includes("network") || !err.response) {
        errorText = "❌ Error de conexión. Verifica tu internet e inténtalo de nuevo.";
      } else {
        errorText = `❌ ${errorDetail || "Ocurrió un error inesperado. Contacta soporte."}`;
      }

      setMessage({ text: errorText, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex w-full">
    
      {/* Lado Izquierdo - Logo con fondo crema/beige */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-12" style={{ backgroundColor: "#FDFED6" }}>
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
          <div className="text-center mb-10">
            <h1 className="text-4xl sm:text-5xl font-black text-gray-900 mb-3">
              REGISTRARSE
            </h1>
          </div>

          {/* Formulario */}
          <form onSubmit={handleRegister} className="space-y-6">
            {/* Input Usuario */}
            <div>
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
            <div>
              <input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-6 py-4 rounded-lg border-2 border-gray-300 focus:border-gray-400 focus:outline-none transition-all duration-200 text-gray-700 placeholder-gray-400"
              />

              {/* ============ Barra de seguridad ============ */}
              {password && (
                <div className="mt-3 space-y-2">
                  {/* Barra de progreso */}
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${passwordStrength.bgColor} transition-all duration-300`}
                      style={{ width: passwordStrength.width }}
                    />
                  </div>

                  {/* Texto de nivel */}
                  <p className={`text-sm font-semibold ${passwordStrength.color}`}>
                    Seguridad: {passwordStrength.text}
                  </p>

                  {/* Requisitos */}
                  <div className="text-xs space-y-1 text-gray-600">
                    <p className={passwordStrength.requirements?.length ? "text-green-600" : ""}>
                      {passwordStrength.requirements?.length ? "✓" : "○"} Mínimo 8 caracteres
                    </p>
                    <p className={passwordStrength.requirements?.uppercase && passwordStrength.requirements?.lowercase ? "text-green-600" : ""}>
                      {passwordStrength.requirements?.uppercase && passwordStrength.requirements?.lowercase ? "✓" : "○"} Mayúsculas y minúsculas
                    </p>
                    <p className={passwordStrength.requirements?.number ? "text-green-600" : ""}>
                      {passwordStrength.requirements?.number ? "✓" : "○"} Al menos un número
                    </p>
                    <p className={passwordStrength.requirements?.special ? "text-green-600" : ""}>
                      {passwordStrength.requirements?.special ? "✓" : "○"} Carácter especial (!@#$%^&*)
                    </p>
                  </div>
                </div>
              )}
              {/* ============ FIN BARRA ============ */}

            </div>
            
            {/* Confirmar Contraseña */}
            <div>
              <input
                type="password"
                placeholder="Confirmar contraseña"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className={`w-full px-6 py-4 rounded-lg border-2 transition-all duration-200 text-gray-700 placeholder-gray-400 focus:outline-none ${
                  showPasswordMismatch 
                    ? "border-red-400 focus:border-red-500" 
                    : passwordsMatch 
                    ? "border-green-400 focus:border-green-500"
                    : "border-gray-300 focus:border-gray-400"
                }`}
              />
              {confirmPassword && (
                <p className={`mt-2 text-sm font-medium ${passwordsMatch ? "text-green-600" : "text-red-600"}`}>
                  {passwordsMatch ? "✓ Las contraseñas coinciden" : "✗ Las contraseñas no coinciden"}
                </p>
              )}
            </div>

            {/* Botón Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-5 rounded-lg font-bold text-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: "#F5F0D8", color: "#000" }}
            >
              {loading ? "Creando cuenta..." : "Registrarse"}
            </button>

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

          {/* Footer - Enlace a Inicio de Sesión */}
          <div className="mt-8 text-center">
            <p className="text-gray-600 text-sm">
              ¿Ya tienes cuenta?{" "}
              <a
                href="/login"
                className="text-indigo-600 hover:text-indigo-700 font-semibold hover:underline"
              >
                Inicia sesión aquí
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
