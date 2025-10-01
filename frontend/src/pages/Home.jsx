import { useEffect, useState } from "react";

export default function Home() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setMessage("Bienvenido, estás logueado!");
    } else {
      setMessage("Debes iniciar sesión");
    }
  }, []);

  return <h2>{message}</h2>;
}
