import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/LogotipoProyecto.png";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");

  // ====== DATOS ESTÁTICOS ======
  const categories = [
    { id: 1, name: "Los más vendidos", icon: "🏆", slug: "mas-vendidos" },
    { id: 2, name: "Pollo", icon: "🍗", slug: "pollo" },
    { id: 3, name: "Combos", icon: "🍔", slug: "combos" },
    { id: 4, name: "Ligeros", icon: "🥗", slug: "ligeros" },
    { id: 5, name: "Acompañantes", icon: "🍟", slug: "acompanantes" },
    { id: 6, name: "Apartados", icon: "🎂", slug: "apartados" },
    { id: 7, name: "Especiales", icon: "✨", slug: "especiales" },
  ];

  const products = [
    {
      id: 1,
      name: "2 pizzas medianas + 1 ltr de gaseosa",
      price: 53900,
      image: "https://via.placeholder.com/300x200/FF6B6B/FFFFFF?text=Pizza",
      category: "combos"
    },
    {
      id: 2,
      name: "4 perros calientes + 1 ltr de gaseosa",
      price: 42900,
      image: "https://via.placeholder.com/300x200/4ECDC4/FFFFFF?text=Hot+Dogs",
      category: "combos"
    },
    {
      id: 3,
      name: "3 hamburguesas doble carne + ltr de gaseosa",
      price: 60900,
      image: "https://via.placeholder.com/300x200/95E1D3/FFFFFF?text=Burgers",
      category: "combos"
    },
    {
      id: 4,
      name: "1 picada para dos + 1 ltr de gaseosa",
      price: 35900,
      image: "https://via.placeholder.com/300x200/F38181/FFFFFF?text=Picada",
      category: "apartados"
    }
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Buscando:", searchQuery);
  };


  return (
    <div className="min-h-screen bg-gray-50">
      {/* ========== HEADER ========== */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <img src={logo} alt="FastFood.exe" className="h-12 w-auto" />
          </div>

          {/* Buscador */}
          <form onSubmit={handleSearch} className="flex-1 max-w-2xl mx-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Ingresa el nombre del producto"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 pr-12 rounded-lg border-2 border-gray-300 focus:border-gray-400 focus:outline-none"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2 rounded-lg font-semibold text-white"
                style={{ backgroundColor: '#DC143C' }}
              >
                BUSCAR
              </button>
            </div>
          </form>

          {/* Botón Iniciar Sesión */}
          <Link
            to="/login"
            className="px-6 py-3 rounded-full font-semibold text-white hover:opacity-90 transition-opacity"
            style={{ backgroundColor: '#808080' }}
          >
            INICIAR SESIÓN
          </Link>
        </div>
      </header>

      {/* ========== CATEGORÍAS ========== */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
          {categories.map((cat) => (
            <button
              key={cat.id}
              className="flex flex-col items-center gap-2 p-4 bg-white rounded-lg shadow hover:shadow-lg transition-shadow"
            >
              <span className="text-4xl">{cat.icon}</span>
              <span className="text-sm font-medium text-gray-700 text-center">
                {cat.name}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* ========== PRODUCTOS ========== */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Los más vendidos</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold text-gray-800 mb-2 text-sm">
                  {product.name}
                </h3>
                <p className="text-2xl font-bold text-gray-900 mb-4">
                  ${product.price.toLocaleString('es-CO')}
                </p>
                <button
                  className="w-full py-3 rounded-lg font-semibold text-white transition-colors"
                  style={{ backgroundColor: '#228B22' }}
                >
                  Añadir al carrito
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========== ICONOS SOCIALES ========== */}
      <div className="fixed left-4 top-1/2 -translate-y-1/2 flex flex-col gap-4">
        <a href="#" className="text-4xl hover:scale-110 transition-transform">📷</a>
        <a href="#" className="text-4xl hover:scale-110 transition-transform">📘</a>
        <a href="#" className="text-4xl hover:scale-110 transition-transform">🐦</a>
        <a href="#" className="text-4xl hover:scale-110 transition-transform">▶️</a>
      </div>

      {/* ========== FOOTER COOKIES ========== */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-800 text-white p-4 flex justify-between items-center">
        <p className="text-sm">
          Este sitio web utiliza ciertas tecnologías de seguimiento, como cookies, para recopilar información sobre cómo accede y utiliza nuestros sitios y servicios.
        </p>
        <div className="flex gap-4">
          <button className="px-4 py-2 bg-transparent border border-white rounded hover:bg-white hover:text-gray-800 transition-colors">
            ADMINISTRAR
          </button>
          <button className="px-4 py-2 bg-green-600 rounded hover:bg-green-700 transition-colors">
            ACEPTAR
          </button>
        </div>
      </div>
    </div>
  );
}
