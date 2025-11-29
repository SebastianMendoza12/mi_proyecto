import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { verificarCodigo, reenviarCodigo } from "../services/api";
import logo from "../assets/LogotipoProyecto.png";

export default function VerifyCode() {
  const navigate = useNavigate();
  const location = useLocation();
  const [codigo, setCodigo] = useState(["", "", "", "", "", ""]);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [countdown, setCountdown] = useState(0);
  
  const inputRefs = useRef([]);
  const userId = location.state?.userId;
  const email = location.state?.email || "";

  useEffect(() => {
    if (!userId) {
      navigate("/login");
    }
  }, [userId, navigate]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setResendDisabled(false);
    }
  }, [countdown]);

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    
    const newCodigo = [...codigo];
    newCodigo[index] = value.slice(-1);
    setCodigo(newCodigo);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !codigo[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;
    
    const newCodigo = pastedData.split("").concat(Array(6).fill("")).slice(0, 6);
    setCodigo(newCodigo);
    
    const nextEmpty = newCodigo.findIndex(c => !c);
    inputRefs.current[nextEmpty === -1 ? 5 : nextEmpty]?.focus();
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    const codigoCompleto = codigo.join("");
    
    if (codigoCompleto.length !== 6) {
      setMessage({ text: "Por favor ingresa los 6 dígitos", type: "error" });
      return;
    }

    setMessage(null);
    setLoading(true);

    try {
      const res = await verificarCodigo({ user_id: userId, codigo: codigoCompleto });
      
      if (res.data.access) {
        localStorage.setItem("access_token", res.data.access);
        localStorage.setItem("refresh_token", res.data.refresh);
        localStorage.setItem("username", res.data.username);
      }
      
      setMessage({ text: "✓ Verificación exitosa", type: "success" });
      setTimeout(() => navigate("/"), 1000);
      
    } catch (err) {
      const errorDetail = err.response?.data?.error || "Error al verificar el código";
      setMessage({ text: errorDetail, type: "error" });
      setCodigo(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResendDisabled(true);
    setCountdown(60);
    setMessage(null);

    try {
      const res = await reenviarCodigo({ user_id: userId });
      
      // Mostrar código en desarrollo si está disponible
      if (res.data.codigo_debug) {
        console.log("🔐 CÓDIGO REENVIADO:", res.data.codigo_debug);
        alert(`⚠️ MODO DESARROLLO\nCódigo: ${res.data.codigo_debug}\n\n(En producción llegará por email)`);
      }
      
      setMessage({ text: "✓ Código reenviado. Revisa tu email", type: "success" });
    } catch (err) {
      setMessage({ text: "Error al reenviar el código", type: "error" });
      setResendDisabled(false);
      setCountdown(0);
    }
  };

  const emailMasked = email.replace(/(.{3})(.*)(@.*)/, "$1***$3");

  return (
    <div className="min-h-screen bg-white flex w-full">
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-12" style={{ backgroundColor: '#FDFED6' }}>
        <div className="flex items-center justify-center w-full h-full">
          <img src={logo} alt="FastFood.exe Logo" className="max-w-md w-full h-auto object-contain" />
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 bg-white">
        <div className="w-full max-w-md">
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-black text-gray-900 mb-4">
              VERIFICACIÓN EN DOS PASOS
            </h1>
            <p className="text-gray-600">
              Introduce el código de 6 dígitos enviado a<br />
              <span className="font-semibold">📧 {emailMasked}</span>
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Revisa tu bandeja de entrada o spam
            </p>
          </div>

          <form onSubmit={handleVerify}>
            <div className="flex justify-center gap-3 mb-8">
              {codigo.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  className="w-14 h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:border-gray-400 focus:outline-none transition-all"
                />
              ))}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-lg font-bold text-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed mb-6"
              style={{ backgroundColor: '#F5F0D8', color: '#000' }}
            >
              {loading ? "Verificando..." : "Verificar"}
            </button>

            {message && (
              <div
                className={`p-4 rounded-lg border-2 mb-6 ${
                  message.type === "error"
                    ? "bg-red-50 border-red-300 text-red-800"
                    : "bg-green-50 border-green-300 text-green-800"
                }`}
              >
                <p className="text-sm font-medium text-center">{message.text}</p>
              </div>
            )}

            <div className="text-center mb-4">
              <p className="text-gray-600 text-sm mb-2">¿No recibiste el código?</p>
              <button
                type="button"
                onClick={handleResend}
                disabled={resendDisabled}
                className="text-indigo-600 hover:text-indigo-700 font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {resendDisabled ? `Reenviar (${countdown}s)` : "Reenviar"}
              </button>
            </div>

            <div className="text-center">
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="text-gray-600 hover:text-gray-900 text-sm font-medium hover:underline"
              >
                Volver a Iniciar Sesión
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}