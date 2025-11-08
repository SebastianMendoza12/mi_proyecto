import { useSearchParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getProductos } from "../services/api";
import logo from "../assets/LogotipoProyecto.png";

export default function Buscar() {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const query = searchParams.get("q");
    if (query) {
      getProductos({ search: query })
        .then(res => {
          const data = res.data.results || res.data;
          setProducts(data);
        })
        .catch(err => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [searchParams]);

  if (loading) return <p className="text-center py-8">Buscando...</p>;

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-white border-b border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <button onClick={() => navigate("/")} className="cursor-pointer">
            <img src={logo} alt="FastFood.exe" className="h-20 w-auto" />
          </button>
          <h1 className="text-2xl font-bold">
            Resultados para: "{searchParams.get("q")}"
          </h1>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <p className="text-gray-600 mb-6">
          Se encontraron <strong>{products.length}</strong> producto(s)
        </p>

        {products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No se encontraron productos 😞
            </p>
            <button
              onClick={() => navigate("/")}
              className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg"
            >
              Volver al inicio
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((p) => (
              <div
                key={p.id}
                className="bg-white rounded-2xl overflow-hidden shadow-lg"
              >
                {p.imagen ? (
                  <img src={p.imagen} alt={p.nombre} className="w-full h-48 object-cover" />
                ) : (
                  <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                    📷
                  </div>
                )}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-800 mb-2">{p.nombre}</h3>
                  <p className="text-2xl font-bold mb-3">
                    ${p.precio.toLocaleString('es-CO')}
                  </p>
                  <button
                    className="w-full py-2 bg-green-500 text-white rounded-lg"
                    disabled={p.stock <= 0}
                  >
                    {p.stock > 0 ? 'Añadir' : 'Agotado'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}