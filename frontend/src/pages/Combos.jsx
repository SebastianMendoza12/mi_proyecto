import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/LogotipoProyecto.png";

export default function Combos() {
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

  const combos = [
    { id: 1, name: "Combo hamburguesa + bebida + papas", price: 24900, image: "" },
    { id: 2, name: "Combo pizza + bebida + postre", price: 34900, image: "" },
    { id: 3, name: "Combo perros + bebida + papas", price: 21900, image: "" },
    { id: 4, name: "Combo familiar 4 personas", price: 89900, image: "" },
    { id: 5, name: "Combo ejecutivo hamburguesa + café", price: 18900, image: "" },
    { id: 6, name: "Combo niños nuggets + bebida + juguete", price: 19900, image: "" },
    { id: 7, name: "Combo picada para dos + 2 bebidas", price: 59900, image: "" },
    { id: 8, name: "Combo super ahorro 3 items", price: 29900, image: "" },
  ];

  const combosFiltrados = combos
    .filter((c) => c.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => (ordenar === "precio" ? a.price - b.price : a.name.localeCompare(b.name)));

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("username");
    setIsLoggedIn(false);
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-white">
      {/* ========== HEADER ========== */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* LOGO */}
            <button onClick={() => navigate("/")} className="flex justify-center">
              <img src={logo} alt="FastFood.exe" className="h-14 w-auto sm:h-16" />
            </button>

            {/* CONTROLES DEL USUARIO */}
            {isLoggedIn && (
              <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
                <span className="text-gray-700 font-semibold text-center">
                  BIENVENIDO {username.toUpperCase()}
                </span>

                <button
                  onClick={() => navigate("/mi-cuenta")}
                  className="px-6 py-2 sm:py-3 rounded-full font-semibold text-white transition-all"
                  style={{ backgroundColor: "#808080" }}
                >
                  MI CUENTA
                </button>

                <button
                  onClick={handleLogout}
                  className="px-6 py-2 sm:py-3 rounded-full font-semibold text-white transition-all hover:opacity-90"
                  style={{ backgroundColor: "#DC143C" }}
                >
                  CERRAR SESIÓN
                </button>
              </div>
            )}
          </div>

          {/* TÍTULO */}
          <h1 className="text-3xl sm:text-4xl font-bold mt-6">Sección de combos</h1>

          {/* BUSCADOR */}
          <form className="mt-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* INPUT */}
              <div className="relative col-span-2">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl">🔍</span>
                <input
                  type="text"
                  placeholder="Ingresa el nombre del producto"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-lg border-2 border-gray-300 focus:border-gray-400"
                />
              </div>

              {/* ORDENAR */}
              <select
                value={ordenar}
                onChange={(e) => setOrdenar(e.target.value)}
                className="w-full py-3 rounded-lg border-2 border-gray-300 bg-white font-semibold cursor-pointer"
              >
                <option value="nombre">Nombre</option>
                <option value="precio">Precio</option>
              </select>
            </div>
          </form>
        </div>
      </header>

      {/* ========== PRODUCTOS ========== */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">

          <p className="text-gray-600 mb-6">
            Se encontraron <strong>{combosFiltrados.length}</strong> combo(s)
          </p>

          {combosFiltrados.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No se encontraron combos 😞</p>
              <button
                onClick={() => navigate("/")}
                className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg font-semibold"
              >
                Volver al inicio
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {combosFiltrados.map((combo) => (
                <div
                  key={combo.id}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                >
                  <div className="w-full h-40 sm:h-48 bg-gray-200 flex items-center justify-center text-4xl">
                    {combo.image ? (
                      <img src={combo.image} alt={combo.name} className="w-full h-full object-cover" />
                    ) : (
                      "🍱"
                    )}
                  </div>

                  <div className="p-5">
                    <h3 className="font-semibold text-gray-800 mb-2 text-sm min-h-10">{combo.name}</h3>
                    <p className="text-2xl font-bold text-gray-900 mb-3">
                      ${combo.price.toLocaleString("es-CO")}
                    </p>
                    <button
                      className="w-full py-3 rounded-lg font-bold text-white transition-all hover:opacity-90"
                      style={{ backgroundColor: "#28A745" }}
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
      <footer className="bg-gray-900 text-white py-8 mt-10">
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-center sm:flex-row sm:justify-end gap-4">
          <span className="font-semibold text-lg">Contacto</span>
          <div className="flex gap-6 text-3xl">
            <a href="#" className="hover:scale-110 transition-transform">📘</a>
            <a href="#" className="hover:scale-110 transition-transform">𝕏</a>
            <a href="#" className="hover:scale-110 transition-transform">▶️</a>
            <a href="#" className="hover:scale-110 transition-transform">📷</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
