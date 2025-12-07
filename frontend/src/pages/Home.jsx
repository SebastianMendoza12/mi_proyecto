import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { logout, getProductos, getCategorias } from "../services/api";
import logo from "../assets/LogotipoProyecto.png";
import { useCart } from "../context/CartContext";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);
  const navigate = useNavigate();

  // Cart Context
  const { addToCart, cartCount, toggleCart } = useCart();

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Verificar sesión y cargar datos iniciales
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const user = localStorage.getItem("username");
    if (token) {
      setIsLoggedIn(true);
      setUsername(user || "Usuario");
    }
    fetchCategories();
  }, []);

  // Fetch products when filters change
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchProducts();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [currentPage, selectedCategory, searchQuery]);

  const fetchCategories = async () => {
    try {
      const catRes = await getCategorias();
      const categoriesData = catRes.data?.results || catRes.data || [];
      if (Array.isArray(categoriesData)) {
        setCategories([
          { id: null, nombre: "Todos", icono: "🍽️" },
          ...categoriesData.filter(cat => cat.nombre !== "Categoría de prueba")
        ]);
      }
    } catch (err) {
      console.error("Error loading categories:", err);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        page: currentPage,
        search: searchQuery,
        categoria: selectedCategory
      };

      // Remove null/empty params
      Object.keys(params).forEach(key => {
        if (!params[key]) delete params[key];
      });

      const res = await getProductos(params);

      if (res.data.results) {
        setProducts(res.data.results);
        setFilteredProducts(res.data.results); // Keep compatibility
        setTotalCount(res.data.count);
        setTotalPages(Math.ceil(res.data.count / 12));
      } else {
        setProducts(res.data);
        setFilteredProducts(res.data);
        setTotalCount(res.data.length);
        setTotalPages(1);
      }
    } catch (err) {
      console.error("Error loading products:", err);
      setError("Error al cargar productos. Por favor intente de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    setIsLoggedIn(false);
    setUsername("");
    navigate("/");
  };

  const handleCategoryClick = (id) => {
    setSelectedCategory(id);
    setCurrentPage(1); // Reset to first page on filter change
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page on search change
  };

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleAddToCart = (product) => {
    addToCart(product);
    showNotification(`¡${product.nombre} añadido al carrito!`);
  };

  // Logic to display correct count even if API returns 0 but products are shown
  const displayCount = totalCount > 0 ? totalCount : products.length;

  return (
    <div className="min-h-screen bg-gray-50 font-sans selection:bg-red-100 selection:text-red-900">
      {/* Notificación Toast */}
      {notification && (
        <div className="fixed top-24 right-4 z-50 animate-fade-in">
          <div className="bg-gray-900 text-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-gray-700">
            <span className="text-green-400 text-xl">✓</span>
            <p className="font-medium">{notification}</p>
          </div>
        </div>
      )}

      {/* ========== HEADER ========== */}
      <header className="bg-white/95 backdrop-blur-md shadow-sm sticky top-0 z-40 border-b border-gray-100 h-[72px]">
        <div className="max-w-7xl mx-auto px-4 h-full flex items-center">
          <div className="flex flex-1 items-center justify-between gap-4">

            {/* Logo y Marca */}
            <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate("/")}>
              <img src={logo} alt="FastFood.exe" className="h-10 w-auto drop-shadow-sm group-hover:scale-105 transition-transform" />
              <span className="text-2xl font-extrabold text-gray-900 tracking-tight hidden sm:block">
                FastFood<span className="text-red-600">.exe</span>
              </span>
            </div>

            {/* Buscador Mejorado */}
            <div className="flex-1 max-w-xl w-full flex items-center gap-2 mx-4">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Buscar..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="w-full px-4 py-2 rounded-full border border-gray-200 bg-gray-100 focus:bg-white focus:border-red-500 focus:ring-4 focus:ring-red-500/10 focus:outline-none transition-all duration-300 placeholder-gray-500 font-medium text-sm"
                />
              </div>
              <button
                className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-full transition-all shadow-lg shadow-red-600/30 hover:shadow-red-600/40 hover:-translate-y-0.5"
                onClick={() => fetchProducts()}
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>

            {/* Botones Auth y Cart */}
            <div className="flex items-center gap-3">
              {/* Cart Button */}
              <button
                onClick={toggleCart}
                className="relative p-2 rounded-full text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors mr-2"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute top-0 right-0 bg-red-600 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-sm">
                    {cartCount}
                  </span>
                )}
              </button>

              {isLoggedIn ? (
                <div className="flex items-center gap-3">
                  <div className="hidden lg:flex flex-col items-end mr-2">
                    <span className="text-xs text-gray-500 font-medium">Bienvenido</span>
                    <span className="text-sm font-bold text-gray-900 leading-none">{username}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="p-2 rounded-full text-gray-500 hover:text-red-600 hover:bg-red-50 transition-all"
                    title="Cerrar sesión"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    to="/login"
                    className="px-4 py-2 rounded-full text-sm font-bold text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-all hidden sm:block"
                  >
                    Ingresar
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2 rounded-full text-sm font-bold text-white bg-red-600 hover:bg-red-700 shadow-lg shadow-red-600/30 hover:shadow-red-600/40 hover:-translate-y-0.5 transition-all"
                  >
                    Registrarse
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ========== HERO SECTION ========== */}
      {!selectedCategory && !searchQuery && (
        <section className="relative bg-gray-900 text-white overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=1965&auto=format&fit=crop')] bg-cover bg-center opacity-40"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent"></div>
          <div className="relative max-w-7xl mx-auto px-4 py-24 md:py-32 flex flex-col items-start justify-center min-h-[500px]">
            <span className="bg-red-600 text-white px-4 py-1 rounded-full text-sm font-bold mb-6 animate-fade-in">
              🔥 La mejor comida rápida de la ciudad
            </span>
            <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight animate-slide-up">
              Sabor que <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">
                te hace volver.
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-lg mb-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
              Ingredientes frescos, recetas originales y entrega en tiempo récord. ¿Qué esperas para probar?
            </p>
            <button
              onClick={() => document.getElementById('menu').scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-4 bg-white text-gray-900 rounded-full font-bold text-lg hover:bg-gray-100 hover:scale-105 transition-all shadow-xl animate-slide-up"
              style={{ animationDelay: '0.2s' }}
            >
              Ver Menú Completo
            </button>
          </div>
        </section>
      )}

      {/* ========== CATEGORÍAS ========== */}
      <section id="menu" className="bg-white border-b border-gray-100 py-3 sticky top-[72px] z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide snap-x">
            {categories.map((cat) => (
              <button
                key={cat.id || 'all'}
                onClick={() => handleCategoryClick(cat.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full transition-all duration-300 whitespace-nowrap snap-start border ${selectedCategory === cat.id
                  ? 'bg-gray-900 text-white border-gray-900 shadow-md transform scale-105'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400 hover:bg-gray-50'
                  }`}
              >
                <span className="text-xl">
                  {cat.icono || "🍽️"}
                </span>
                <span className="text-sm font-bold">
                  {cat.nombre}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ========== PRODUCTOS ========== */}
      <section className="py-12 px-4 bg-gray-50 min-h-[600px]">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">
                {selectedCategory
                  ? categories.find(c => c.id === selectedCategory)?.nombre
                  : 'Menú Principal'}
              </h2>
            </div>
          </div>

          {error ? (
            <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-red-100">
              <div className="bg-red-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">⚠️</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Hubo un problema</h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">{error}</p>
              <button
                onClick={fetchProducts}
                className="px-8 py-3 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-all font-bold"
              >
                Intentar de nuevo
              </button>
            </div>
          ) : loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                <div key={n} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 h-[400px] animate-pulse">
                  <div className="h-56 bg-gray-200"></div>
                  <div className="p-6 space-y-4">
                    <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-10 bg-gray-200 rounded-xl mt-4"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                {products.length > 0 ? (
                  products.map((product) => (
                    <div
                      key={product.id}
                      className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group border border-gray-100 flex flex-col relative"
                    >
                      {/* Badge de Stock */}
                      {product.stock <= 5 && product.stock > 0 && (
                        <div className="absolute top-4 left-4 z-10 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                          ¡Pocos quedan!
                        </div>
                      )}

                      {/* Imagen */}
                      <div className="relative h-64 overflow-hidden bg-gray-100">
                        {product.imagen ? (
                          <img
                            src={product.imagen}
                            alt={product.nombre}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            onError={(e) => {
                              console.error("Error cargando imagen:", product.imagen);
                              e.target.style.display = 'none';
                              e.target.parentElement.querySelector('.fallback-icon').style.display = 'flex';
                            }}
                          />
                        ) : null}
                        <div className="fallback-icon w-full h-full flex items-center justify-center bg-gray-50 text-6xl opacity-50" style={{ display: product.imagen ? 'none' : 'flex' }}>
                          🍔
                        </div>

                        {/* Precio Flotante */}
                        <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl shadow-lg border border-gray-100">
                          <span className="text-gray-900 font-black text-lg">
                            ${parseFloat(product.precio).toLocaleString('es-CO')}
                          </span>
                        </div>

                        {/* Overlay Agotado */}
                        {product.stock <= 0 && (
                          <div className="absolute inset-0 bg-gray-900/60 flex items-center justify-center backdrop-blur-[2px]">
                            <span className="bg-red-600 text-white px-6 py-2 rounded-full font-bold transform -rotate-6 shadow-xl border-2 border-white text-lg tracking-wider">
                              AGOTADO
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Contenido */}
                      <div className="p-6 flex-1 flex flex-col">
                        <div className="mb-4">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-bold text-gray-900 text-xl leading-tight group-hover:text-red-600 transition-colors">
                              {product.nombre}
                            </h3>
                          </div>
                          <p className="text-gray-500 text-sm line-clamp-2 leading-relaxed h-10">
                            {product.descripcion || "Una deliciosa opción para hoy."}
                          </p>
                        </div>

                        <div className="mt-auto pt-4 border-t border-gray-50">
                          <button
                            onClick={() => handleAddToCart(product)}
                            disabled={product.stock <= 0}
                            className={`w-full py-3.5 rounded-xl font-bold text-white shadow-lg shadow-gray-200 transition-all flex items-center justify-center gap-2 ${product.stock > 0
                              ? 'bg-gray-900 hover:bg-red-600 hover:shadow-red-500/30 hover:-translate-y-1 active:scale-95'
                              : 'bg-gray-300 cursor-not-allowed shadow-none'
                              }`}
                          >
                            {product.stock > 0 ? (
                              <>
                                <span>Agregar al pedido</span>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                  <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                                </svg>
                              </>
                            ) : (
                              'No disponible'
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full flex flex-col items-center justify-center py-24 bg-white rounded-3xl border border-gray-100 shadow-sm text-center px-4">
                    <div className="bg-gray-50 p-6 rounded-full mb-6">
                      <span className="text-6xl">🔍</span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">No encontramos resultados</h3>
                    <p className="text-gray-500 mb-8 max-w-md">
                      Intenta con otra categoría o busca algo diferente. ¡Tenemos muchas opciones deliciosas!
                    </p>
                    <button
                      onClick={() => { setSelectedCategory(null); setSearchQuery(""); }}
                      className="px-8 py-3 bg-red-600 text-white font-bold rounded-full hover:bg-red-700 transition-all shadow-lg shadow-red-600/30"
                    >
                      Ver todo el menú
                    </button>
                  </div>
                )}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 pb-8">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>

                  <div className="flex gap-1">
                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`w-10 h-10 rounded-lg font-medium transition-all ${currentPage === i + 1
                          ? 'bg-red-600 text-white shadow-lg shadow-red-200'
                          : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                          }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* ========== FOOTER ========== */}
      <footer className="bg-gray-900 text-white pt-20 pb-10 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <img src={logo} alt="FastFood.exe" className="h-10 w-auto grayscale brightness-200" />
                <span className="text-2xl font-bold tracking-tight">FastFood.exe</span>
              </div>
              <p className="text-gray-400 leading-relaxed max-w-sm">
                Llevamos el sabor a otro nivel. Ingredientes frescos, recetas únicas y la entrega más rápida de la ciudad.
              </p>
            </div>

            <div>
              <h4 className="text-lg font-bold mb-6 text-white">Navegación</h4>
              <ul className="space-y-4 text-gray-400">
                <li><Link to="/" className="hover:text-red-500 transition-colors flex items-center gap-3"><span>🏠</span> Inicio</Link></li>
                <li><a href="https://www.google.com/maps/place/Universidad+de+Pamplona/@7.3795445,-72.6540855,17z" target="_blank" rel="noopener noreferrer" className="hover:text-red-500 transition-colors flex items-center gap-3"><span>📍</span> Ubicación</a></li>
                <li><Link to="/profile" className="hover:text-red-500 transition-colors flex items-center gap-3"><span>👤</span> Mi Cuenta</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-bold mb-6 text-white">Síguenos</h4>
              <div className="flex gap-4"><Link to="/whatsapp" className="w-12 h-12 rounded-2xl bg-gray-800 flex items-center justify-center hover:bg-red-600 hover:-translate-y-1 transition-all"><span className="text-2xl">📱</span></Link><a href="https://www.instagram.com/p/CxZUvXFr9cq/" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-2xl bg-gray-800 flex items-center justify-center hover:bg-red-600 hover:-translate-y-1 transition-all"><span className="text-2xl">📸</span></a><Link to="/feedback" className="w-12 h-12 rounded-2xl bg-gray-800 flex items-center justify-center hover:bg-red-600 hover:-translate-y-1 transition-all"><span className="text-2xl">💬</span></Link>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
            <p>© 2025 FastFood.exe. Todos los derechos reservados.</p>
            <div className="flex gap-8">
              <a href="#" className="hover:text-white transition-colors">Privacidad</a>
              <a href="#" className="hover:text-white transition-colors">Términos</a>
              <a href="#" className="hover:text-white transition-colors">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}