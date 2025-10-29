import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../services/api";
import logo from "../assets/LogotipoProyecto.png";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  // Verificar si está logueado
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

  // ====== DATOS ESTÁTICOS ======
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
      image: "",
    },
    {
      id: 2,
      name: "4 perros calientes + 1 ltr de gaseosa",
      price: 42900,
      image: "",
    },
    {
      id: 3,
      name: "3 hamburguesas doble carne + ltr de gaseosa",
      price: 60900,
      image: "",
    },
    {
      id: 4,
      name: "1 picada para dos + 1 ltr de gaseosa",
      price: 35900,
      image: "",
    }
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Buscando:", searchQuery);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* ========== HEADER ========== */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-6">
            {/* Logo */}
            <img src={logo} alt="FastFood.exe" className="h-24 w-auto" />

            {/* Botones según estado de login */}
            <div className="flex items-center gap-4">
              {isLoggedIn ? (
                <>
                  <span className="text-gray-700 font-semibold">
                    BIENVENIDO {username.toUpperCase()}
                  </span>
                  <Link
                    to="/mi-cuenta"
                    className="px-6 py-3 rounded-full font-semibold text-white transition-all"
                    style={{ backgroundColor: '#808080' }}
                  >
                    MI CUENTA
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="px-6 py-3 rounded-full font-semibold text-white transition-all hover:opacity-90"
                    style={{ backgroundColor: '#DC143C' }}
                  >
                    CERRAR SESIÓN
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="px-8 py-3 rounded-full font-semibold text-white transition-all"
                    style={{ backgroundColor: '#808080' }}
                  >
                    INICIAR SESIÓN
                  </Link>
                  <Link
                    to="/register"
                    className="px-8 py-3 rounded-full font-semibold text-white transition-all"
                    style={{ backgroundColor: '#808080' }}
                  >
                    REGISTRARSE
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Buscador */}
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
                style={{ backgroundColor: '#DC143C' }}
              >
                BUSCAR
              </button>
            </div>
          </form>
        </div>
      </header>

      {/* ========== CATEGORÍAS ========== */}
      <section style={{ backgroundColor: '#F5F5F5' }} className="py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-center gap-4 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat.id}
                className="flex flex-col items-center gap-2 px-6 py-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow min-w-[120px]"
              >
                <span className="text-3xl">{cat.icon}</span>
                <span className="text-sm font-medium text-gray-700">
                  {cat.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ========== PRODUCTOS ========== */}
      <section className="py-12 flex-grow">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-10">Lo mas vendido</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="aspect-w-16 aspect-h-12">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />
                </div>
                <div className="p-5">
                  <h3 className="font-semibold text-gray-800 mb-3 text-sm h-10">
                    {product.name}
                  </h3>
                  <p className="text-2xl font-bold text-gray-900 mb-4">
                    ${product.price.toLocaleString('es-CO')}
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
        </div>
      </section>

      {/* ========== FOOTER ========== */}
      <footer className="bg-gray-900 text-white py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 flex justify-end items-center">
          <div className="flex items-center gap-6">
            <span className="font-semibold text-lg">contacto</span>
            <a href="#" className="text-3xl hover:scale-110 transition-transform">
              <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
            <a href="#" className="text-3xl hover:scale-110 transition-transform">
              <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
              </svg>
            </a>
            <a href="#" className="text-3xl hover:scale-110 transition-transform">
              <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </a>
            <a href="#" className="text-3xl hover:scale-110 transition-transform">
              <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24">
                <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/>
              </svg>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}