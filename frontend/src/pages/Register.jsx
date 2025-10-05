import { useState } from "react";
import axios from "axios";

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
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/register/`,
        { username, password }
      );
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
    <form onSubmit={handleRegister} className="flex flex-col items-center">
      <h2 className="text-xl font-semibold mb-4">Registro</h2>

      <input
        type="text"
        placeholder="Usuario"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
        className="w-full p-2 mb-3 border border-gray-300 rounded-md"
      />

      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        className="w-full p-2 mb-3 border border-gray-300 rounded-md"
      />

      <button
        type="submit"
        disabled={loading}
        className={`w-full p-2 rounded-md text-white ${
          loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {loading ? "Cargando..." : "Registrarse"}
      </button>

      {message && (
        <p
          className={`mt-3 text-sm ${
            message.type === "error" ? "text-red-600" : "text-green-600"
          }`}
        >
          {message.text}
        </p>
      )}
    </form>
  );
}

export default Register;
