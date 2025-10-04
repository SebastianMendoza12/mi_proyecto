import { useState } from "react";
import axios from "axios";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const backendUrl = "https://fastfood-fapu.onrender.com";

      const res = await axios.post(`${backendUrl}/api/auth/register/`, {
        username,
        password,
      });

      alert("Usuario registrado correctamente");
    } catch (err) {
      if (err.response) {
        alert("Error en registro: " + (err.response.data.error || "Error desconocido"));
      } else {
        alert("No se pudo conectar con el servidor");
      }
    }
  };

  return (
    <form onSubmit={handleRegister}>
      <h2>Registro</h2>

      <input
        type="text"
        placeholder="Usuario"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button type="submit">Registrar</button>
    </form>
  );
}
