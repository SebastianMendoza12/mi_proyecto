import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/LogotipoProyecto.png";

export default function Postres() {
  const [searchQuery, setSearchQuery] = useState("");
  const [ordenar, setOrdenar] = useState("nombre");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const user = localStorage.getItem("username");
    if (token) {
      setIsLoggedIn(true);
      setUsername(user || "Usuario");
    }
  }, []);

  const postres = [
    { id: 1, name: "Helado de vainilla", price: 7900, image: "" },
    { id: 2, name: "Helado de chocolate", price: 7900, image: "" },
    { id: 3, name: "Helado de fresa", price: 7900, image: "" },
    { id: 4, name: "Brownie con helado", price: 12900, image: "" },
    { id: 5, name: "Cheesecake", price: 14900, image: "" },
    { id: 6, name: "Torta de chocolate", price: 16900, image: "" },
    { id: 7, name: "Fresas con crema", price: 11900, image: "" },
    { id: 8, name: "Tiramisú", price: 13900, image: "" },
  ];

  const postresFiltrados = postres
    .filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (ordenar === "precio") {
        return a.price - b.price;
      }
      return a.name.localeCompare(b.name);
    });

  const handleSearch = (e) => {
    e.preventDefault();
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("username");
    setIsLoggedIn(false);
    setUsername("");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-white">
      {/* ========== HEADER ========== */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-6">
            <button onClick={() => navigate("/")} className="cursor-pointer">
              <img src={logo} alt="FastFood.exe" className="h-16 w-auto" />
            </button>

            <div className="flex items-center gap-4">
              {isLoggedIn ? (
                <>
                  <span className="text-gray-700 font-semibold">
                    BIENVENIDO {username.toUpperCase()}
                  </span>
                  <button
                    onClick={() => navigate("/")}
                    className="px-6 py-3 rounded-full font-semibold text-white transition-all"
                    style={{ backgroundColor: '#808080' }}
                  >
                    MI CUENTA
                  </button>
                  <button
                    onClick={handleLogout}
                    className="px-6 py-3 rounded-full font-semibold text-white transition-all hover:opacity-90"
                    style={{ backgroundColor: '#DC143C' }}
                  >
                    CERRAR SESIÓN
                  </button>
                </>
              ) : null}
            </div>
          </div>

          <div className="mb-6">
            <h1 className="text-4xl font-bold">Sección de postres</h1>
          </div>

          <form onSubmit={handleSearch} className="relative">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  🔍
                </span>
                <input
                  type="text"
                  placeholder="Ingresa el nombre del producto"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-lg border-2 border-gray-300 focus:border-gray-400 focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="px-8 py-3 rounded-lg font-bold text-white transition-all"
                style={{ backgroundColor: '#FFD700' }}
              >
                BUSCAR
              </button>
              <select
                value={ordenar}
                onChange={(e) => setOrdenar(e.target.value)}
                className="px-4 py-3 rounded-lg border-2 border-gray-300 bg-white font-semibold cursor-pointer"
              >
                <option value="nombre">Nombre</option>
                <option value="precio">Ordenar por precio</option>
              </select>
            </div>
          </form>
        </div>
      </header>

      {/* ========== PRODUCTOS ========== */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-gray-600 mb-6">
            Se encontraron <strong>{postresFiltrados.length}</strong> postre(s)
          </p>

          {postresFiltrados.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                No se encontraron postres 😞
              </p>
              <button
                onClick={() => navigate("/")}
                className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg font-semibold"
              >
                Volver al inicio
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {postresFiltrados.map((postre) => (
                <div
                  key={postre.id}
                  className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
                >
                  <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-4xl">
                    {postre.image ? (
                      <img
                        src={postre.image}
                        alt={postre.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      "🍰"
                    )}
                  </div>

                  <div className="p-5">
                    <h3 className="font-semibold text-gray-800 mb-3 text-sm h-10">
                      {postre.name}
                    </h3>
                    <p className="text-2xl font-bold text-gray-900 mb-4">
                      ${postre.price.toLocaleString('es-CO')}
                    </p>
                    <button
                      className="w-full py-3 rounded-lg font-bold text-white transition-all hover:opacity-90"
                      style={{ backgroundColor: '#28A745' }}
                    >
                      Añadir al carrito
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ========== FOOTER ========== */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 flex justify-end items-center">
          <div className="flex items-center gap-6">
            <span className="font-semibold text-lg">contacto</span>
            <a href="#" className="text-3xl hover:scale-110 transition-transform">📘</a>
            <a href="#" className="text-3xl hover:scale-110 transition-transform">𝕏</a>
            <a href="#" className="text-3xl hover:scale-110 transition-transform">▶️</a>
            <a href="#" className="text-3xl hover:scale-110 transition-transform">📷</a>
          </div>
        </div>
      </footer>
    </div>
  );
}