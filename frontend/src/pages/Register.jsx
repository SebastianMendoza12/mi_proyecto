import { useState } from "react";
import { registerUser } from "../services/api";

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
      await registerUser({ username, password });
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
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleRegister}
        className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md flex flex-col items-center"
      >
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">
          Registro de Usuario
        </h2>

        <input
          type="text"
          placeholder="Usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          type="submit"
          disabled={loading}
          className={`w-full p-3 rounded-lg text-white font-semibold transition ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Cargando..." : "Registrarse"}
        </button>

        {message && (
          <p
            className={`mt-4 text-sm ${
              message.type === "error" ? "text-red-600" : "text-green-600"
            }`}
          >
            {message.text}
          </p>
        )}
      </form>
    </div>
  );
}

export default Register;
