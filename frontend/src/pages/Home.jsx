import { useEffect, useState } from "react";

export default function Home() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      setMessage("✅ Bienvenido, estás logueado!");
    } else {
      setMessage("⚠️ Debes iniciar sesión para continuar");
    }
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-2 sm:px-4 lg:px-8 w-full">
      <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg bg-white shadow-xl rounded-2xl p-6 sm:p-8 flex flex-col items-center text-center">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 sm:mb-8 text-gray-800">🍔 FastFood</h1>
        <h2 className="text-xl font-semibold mb-6 text-gray-700">
          {message}
        </h2>
      </div>
    </div>
  );
}
