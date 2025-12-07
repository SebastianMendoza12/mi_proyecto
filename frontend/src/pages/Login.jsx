import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login, verifyCode } from "../services/api";
import logo from "../assets/LogotipoProyecto.png";

function Login() {
  const [step, setStep] = useState(1); // 1 = credentials, 2 = code verification
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [sessionId, setSessionId] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);

    try {
      const res = await login({ username, password });

      if (res.data.requires_2fa) {
        // Show code verification step
        setSessionId(res.data.session_id);
        setUserEmail(res.data.email);
        setStep(2);
        setMessage({
          text: res.data.debug_code
            ? `Código de prueba: ${res.data.debug_code}`
            : "Código de verificación enviado. Revisa la consola del servidor.",
          type: "success"
        });
      } else {
        // Direct login (no 2FA required)
        localStorage.setItem("access_token", res.data.access);
        localStorage.setItem("refresh_token", res.data.refresh);
        localStorage.setItem("username", res.data.username);
        setMessage({ text: "Inicio de sesión exitoso", type: "success" });
        setTimeout(() => navigate("/"), 1000);
      }

    } catch (err) {
      const errorDetail = err.response?.data?.error || "";
      let errorText = "Error al iniciar sesión";

      if (errorDetail.includes("Credenciales incorrectas") || err.response?.status === 401) {
        errorText = "Usuario o contraseña incorrectos";
      } else if (!err.response) {
        errorText = "Error de conexión. Verifica que el servidor esté corriendo.";
      } else {
        errorText = errorDetail || "Ocurrió un error inesperado";
      }

      setMessage({ text: errorText, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleCodeSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);

    try {
      const res = await verifyCode({ session_id: sessionId, codigo: code });

      // Store tokens
      localStorage.setItem("access_token", res.data.access);
      localStorage.setItem("refresh_token", res.data.refresh);
      localStorage.setItem("username", res.data.username);

      setMessage({ text: "Verificación exitosa", type: "success" });
      setTimeout(() => navigate("/"), 1000);

    } catch (err) {
      const errorDetail = err.response?.data?.error || "";
      let errorText = "Error en la verificación";

      if (errorDetail.includes("Código incorrecto")) {
        errorText = "Código incorrecto. Inténtalo de nuevo.";
      } else if (errorDetail.includes("expirado")) {
        errorText = "El código ha expirado. Inicia sesión nuevamente.";
        setTimeout(() => {
          setStep(1);
          setCode("");
          setPassword("");
        }, 2000);
      } else if (errorDetail.includes("Sesión inválida")) {
        errorText = "Sesión inválida. Inicia sesión nuevamente.";
        setTimeout(() => {
          setStep(1);
          setCode("");
          setPassword("");
        }, 2000);
      } else {
        errorText = errorDetail || "Ocurrió un error inesperado";
      }

      setMessage({ text: errorText, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    setStep(1);
    setCode("");
    setPassword("");
    setMessage(null);
  };

  return (
    <div className="min-h-screen bg-white flex w-full">

      {/* Lado Izquierdo - Logo con fondo crema/beige */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-12" style={{ backgroundColor: '#FDFED6' }}>
        <div className="flex items-center justify-center w-full h-full">
          <img src={logo} alt="FastFood.exe Logo" className="max-w-md w-full h-auto object-contain" />
        </div>
      </div>

      {/* Lado Derecho - Formulario */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 bg-white">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center" style={{ marginBottom: '3rem' }}>
            <h1 className="text-4xl sm:text-5xl font-black text-gray-900">
              {step === 1 ? "INICIAR SESIÓN" : "VERIFICACIÓN"}
            </h1>
            {step === 2 && (
              <p className="text-gray-600 mt-4 text-sm">
                Ingresa el código de 6 dígitos enviado a <span className="font-semibold">{userEmail}</span>
              </p>
            )}
          </div>

          {/* Step 1: Credentials */}
          {step === 1 && (
            <form onSubmit={handleLoginSubmit}>
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
            </form>
          )}

          {/* Step 2: Code Verification */}
          {step === 2 && (
            <form onSubmit={handleCodeSubmit}>
              {/* Input Código */}
              <div style={{ marginBottom: '1.5rem' }}>
                <input
                  type="text"
                  placeholder="000000"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  required
                  maxLength={6}
                  className="w-full px-6 py-4 rounded-lg border-2 border-gray-300 focus:border-gray-400 focus:outline-none transition-all duration-200 text-gray-700 placeholder-gray-400 text-center text-2xl tracking-widest font-bold"
                  autoFocus
                />
                <p className="text-xs text-gray-500 mt-2 text-center">
                  Revisa la consola del servidor para ver el código
                </p>
              </div>

              {/* Botón Submit */}
              <div style={{ marginBottom: '1.5rem' }}>
                <button
                  type="submit"
                  disabled={loading || code.length !== 6}
                  className="w-full py-5 rounded-lg font-bold text-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                  style={{ backgroundColor: '#F5F0D8', color: '#000' }}
                >
                  {loading ? "Verificando..." : "Verificar Código"}
                </button>
              </div>

              {/* Botón Volver */}
              <div style={{ marginBottom: '1.5rem' }}>
                <button
                  type="button"
                  onClick={handleBackToLogin}
                  className="w-full py-3 rounded-lg font-medium text-sm transition-all duration-200 border-2 border-gray-300 hover:border-gray-400 text-gray-700"
                >
                  ← Volver al inicio de sesión
                </button>
              </div>
            </form>
          )}

          {/* Mensaje de Error/Éxito */}
          {message && (
            <div
              className={`p-4 rounded-lg border-2 mb-4 ${message.type === "error"
                ? "bg-red-50 border-red-300 text-red-800"
                : "bg-green-50 border-green-300 text-green-800"
                }`}
            >
              <p className="text-sm font-medium text-center"> {message.text} </p>
            </div>
          )}

          {/* Footer - Solo en step 1 */}
          {step === 1 && (
            <>
              <div className="text-center mb-4">
                <a
                  href="#"
                  className="text-gray-600 hover:text-gray-900 text-sm font-medium hover:underline"
                >
                  ¿Has olvidado la contraseña?
                </a>
              </div>

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
            </>
          )}
        </div>
      </div>
    </div>
  );

}

export default Login;
