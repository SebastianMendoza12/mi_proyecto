import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../services/api";
import logo from "../assets/LogotipoProyecto.png";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
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

  const handleLogout = () => {
    logout();
    setIsLoggedIn(false);
    setUsername("");
    navigate("/");
  };

  const categories = [
    { id: 1, name: "Bebidas", icon: "🥤" },
    { id: 2, name: "hamburguesas", icon: "🍔" },
    { id: 3, name: "Combos", icon: "🍱" },
    { id: 4, name: "Postres", icon: "🍰" },
    { id: 5, name: "Acompañantes", icon: "🍟" },
    { id: 6, name: "pizzza", icon: "🍕" },
    { id: 7, name: "perros", icon: "🌭" },
  ];

  const products = [
    {
      id: 1,
      name: "2 pizzas medianas + 1 ltr de gaseosa",
      price: 53900,
      image: "https://i.imgur.com/y1uU7sl.png",
    },
    {
      id: 2,
      name: "4 perros calientes + 1 ltr de gaseosa",
      price: 42900,
      image: "https://i.imgur.com/9azrY7v.png",
    },
    {
      id: 3,
      name: "3 hamburguesas doble carne + ltr de gaseosa",
      price: 60900,
      image: "https://i.imgur.com/8pP6zRb.png",
    },
    {
      id: 4,
      name: "1 picada para dos + 1 ltr de gaseosa",
      price: 35900,
      image: "https://i.imgur.com/xLzMJbC.png",
    },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Buscando:", searchQuery);
  };

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* HEADER */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          {/* Logo */}
          <img src={logo} alt="FastFood.exe" className="h-16" />

          {/* Botones */}
          <div className="flex gap-3">
            {isLoggedIn ? (
              <>
                <span className="text-gray-700 font-semibold mt-2">
                  BIENVENIDO {username.toUpperCase()}
                </span>
                <Link
                  to="/mi-cuenta"
                  className="px-6 py-2 rounded-full font-semibold text-white"
                  style={{ backgroundColor: "#808080" }}
                >
                  MI CUENTA
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-6 py-2 rounded-full font-semibold text-white hover:opacity-90"
                  style={{ backgroundColor: "#DC143C" }}
                >
                  CERRAR SESIÓN
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-6 py-2 rounded-full font-semibold text-white hover:opacity-90"
                  style={{ backgroundColor: "#808080" }}
                >
                  INICIAR SESIÓN
                </Link>
                <Link
                  to="/register"
                  className="px-6 py-2 rounded-full font-semibold text-white hover:opacity-90"
                  style={{ backgroundColor: "#808080" }}
                >
                  REGISTRARSE
                </Link>
              </>
            )}
          </div>
        </div>

        {/* BUSCADOR */}
        <div className="bg-gray-100 py-4">
          <form
            onSubmit={handleSearch}
            className="max-w-6xl mx-auto flex gap-2 items-center px-6"
          >
            <div className="relative flex-1">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl">
                🔍
              </span>
              <input
                type="text"
                placeholder="Ingresa el nombre del producto"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-md border border-gray-300 focus:border-gray-400 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="px-8 py-3 rounded-md font-bold text-white hover:opacity-90"
              style={{ backgroundColor: "#DC143C" }}
            >
              BUSCAR
            </button>
          </form>
        </div>
      </header>

      {/* CATEGORÍAS */}
      <section className="bg-gray-200 py-6">
        <div className="max-w-6xl mx-auto flex justify-center flex-wrap gap-5">
          {categories.map((cat) => (
            <button
              key={cat.id}
              className="bg-white px-6 py-4 rounded-2xl shadow-sm hover:shadow-lg flex flex-col items-center gap-2 min-w-[100px] transition-all"
            >
              <span className="text-3xl">{cat.icon}</span>
              <span className="text-gray-700 text-sm font-medium">
                {cat.name}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* PRODUCTOS */}
      <section className="py-14">
        <h2 className="text-4xl font-bold text-center mb-10">
          Lo más vendido
        </h2>
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 px-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all"
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover rounded-t-2xl"
              />
              <div className="p-4 text-center">
                <h3 className="text-gray-800 font-semibold text-sm mb-2 h-10">
                  {product.name}
                </h3>
                <p className="text-lg font-bold mb-4">
                  ${product.price.toLocaleString("es-CO")}
                </p>
                <button
                  className="w-full py-2 rounded-lg font-semibold text-white hover:opacity-90"
                  style={{ backgroundColor: "#28A745" }}
                >
                  Añadir al carrito 🛒
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-white py-10 border-t border-gray-200">
        <div className="max-w-7xl mx-auto flex justify-end items-center px-6">
          <div className="flex items-center gap-6 text-gray-800">
            <span className="font-semibold text-lg">contacto</span>
            <a href="#" className="text-2xl hover:scale-110 transition">
              <i className="fab fa-facebook"></i>
            </a>
            <a href="#" className="text-2xl hover:scale-110 transition">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="#" className="text-2xl hover:scale-110 transition">
              <i className="fab fa-youtube"></i>
            </a>
            <a href="#" className="text-2xl hover:scale-110 transition">
              <i className="fab fa-instagram"></i>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
