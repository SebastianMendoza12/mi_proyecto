import { useState } from "react";
import { registerUser  } from "../services/api";

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);

    try {
      await registerUser ({ username, password });
      setMessage({ text: "✅ Usuario creado exitosamente", type: "success" });
      setUsername("");
      setPassword("");
    } catch (err) {
      setMessage({
        text:
          err.response?.data?.error ||
          err.response?.data?.detail ||
          "❌ Error al registrar usuario",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleRegister}
      className="w-full flex flex-col items-center space-y-6"
    >
      <h2 className="text-2xl font-bold mb-6 text-gray-800">➕ Registro de Usuario</h2>

      <input
        type="text"
        placeholder="Usuario"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
        className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
      />

      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
      />

      <button
        type="submit"
        disabled={loading}
        className={`w-full p-4 rounded-xl text-white font-semibold transition-all duration-200 transform hover:scale-105 ${
          loading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700 shadow-md"
        }`}
      >
        {loading ? "⏳ Cargando..." : "📝 Registrarse"}
      </button>

      {message && (
        <p
          className={`text-sm font-medium text-center px-4 py-2 rounded-lg ${
            message.type === "error"
              ? "bg-red-100 text-red-700 border border-red-300"
              : "bg-green-100 text-green-700 border border-green-300"
          }`}
        >
          {message.text}
        </p>
      )}
    </form>
  );
}

export default Register;
