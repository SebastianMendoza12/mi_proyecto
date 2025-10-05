import { useState } from "react";
import axios from "axios";

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
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/login/`,
        { username, password }
      );
      setMessage({ text: "✅ Inicio de sesión exitoso", type: "success" });
      console.log("Token:", res.data);
    } catch (err) {
      setMessage({
        text: err.response?.data?.detail || "❌ Error al iniciar sesión",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin} className="flex flex-col items-center">
      <h2 className="text-xl font-semibold mb-4">Iniciar sesión</h2>

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
        {loading ? "Cargando..." : "Entrar"}
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

export default Login;
