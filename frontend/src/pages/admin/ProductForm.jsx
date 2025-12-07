import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createAdminProducto, getAdminProducto, updateAdminProducto, getCategorias } from "../../services/api";

const ProductForm = () => {
    const [formData, setFormData] = useState({
        nombre: "",
        descripcion: "",
        precio: "",
        categoria: "",
        imagen: "",
        disponible: true,
        stock: 0,
    });
    const [categorias, setCategorias] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingCategorias, setLoadingCategorias] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = !!id;

    useEffect(() => {
        fetchCategorias();
        if (isEdit) {
            fetchProduct();
        }
    }, [id]);

    const fetchCategorias = async () => {
        try {
            setLoadingCategorias(true);
            const res = await getCategorias();
            setCategorias(res.data.results || res.data);
        } catch (err) {
            console.error("Error al cargar categorías:", err);
            setError("No se pudieron cargar las categorías");
        } finally {
            setLoadingCategorias(false);
        }
    };

    const fetchProduct = async () => {
        try {
            const res = await getAdminProducto(id);
            setFormData({
                nombre: res.data.nombre,
                descripcion: res.data.descripcion,
                precio: res.data.precio,
                categoria: res.data.categoria,
                imagen: res.data.imagen || "",
                disponible: res.data.disponible,
                stock: res.data.stock,
            });
        } catch (err) {
            console.error("Error al cargar el producto:", err);
            setError("Error al cargar el producto.");
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            // Convert to proper types
            const payload = {
                ...formData,
                categoria: parseInt(formData.categoria, 10),
                precio: parseFloat(formData.precio),
                stock: parseInt(formData.stock, 10)
            };

            if (isEdit) {
                await updateAdminProducto(id, payload);
            } else {
                await createAdminProducto(payload);
            }

            setSuccess(true);
            setTimeout(() => {
                navigate("/admin/dashboard");
            }, 1000);
        } catch (err) {
            console.error("Error al guardar producto:", err);
            const errorMsg = err.response?.data?.detail
                || err.response?.data?.error
                || JSON.stringify(err.response?.data)
                || "Error al guardar el producto. Verifique los datos.";
            setError(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-12 px-4">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={() => navigate("/admin/dashboard")}
                        className="text-slate-600 hover:text-slate-900 flex items-center gap-2 mb-4 transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Volver al Dashboard
                    </button>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                        {isEdit ? "Editar Producto" : "Nuevo Producto"}
                    </h1>
                    <p className="text-slate-600 mt-2">
                        {isEdit ? "Actualiza la información del producto" : "Completa los datos para crear un nuevo producto"}
                    </p>
                </div>

                {/* Success Message */}
                {success && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3 animate-fade-in">
                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-green-800 font-medium">¡Producto guardado exitosamente!</span>
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
                        <svg className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-red-800">{error}</span>
                    </div>
                )}

                {/* Form Card */}
                <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Nombre */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Nombre del Producto <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="nombre"
                                value={formData.nombre}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none bg-white/50"
                                placeholder="Ej: Pizza Margarita"
                                required
                            />
                        </div>

                        {/* Descripción */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Descripción
                            </label>
                            <textarea
                                name="descripcion"
                                value={formData.descripcion}
                                onChange={handleChange}
                                rows={4}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none bg-white/50 resize-none"
                                placeholder="Describe el producto..."
                            />
                        </div>

                        {/* Grid 2 columns */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Precio */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Precio <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-medium">$</span>
                                    <input
                                        type="number"
                                        name="precio"
                                        value={formData.precio}
                                        onChange={handleChange}
                                        className="w-full pl-8 pr-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none bg-white/50"
                                        placeholder="0.00"
                                        required
                                        step="0.01"
                                        min="0"
                                    />
                                </div>
                            </div>

                            {/* Stock */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Stock <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    name="stock"
                                    value={formData.stock}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none bg-white/50"
                                    placeholder="0"
                                    required
                                    min="0"
                                />
                            </div>
                        </div>

                        {/* Categoría - DROPDOWN */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Categoría <span className="text-red-500">*</span>
                            </label>
                            {loadingCategorias ? (
                                <div className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-400">
                                    Cargando categorías...
                                </div>
                            ) : (
                                <select
                                    name="categoria"
                                    value={formData.categoria}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none bg-white/50 cursor-pointer"
                                    required
                                >
                                    <option value="">Selecciona una categoría</option>
                                    {categorias.map((cat) => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.icono} {cat.nombre}
                                        </option>
                                    ))}
                                </select>
                            )}
                        </div>

                        {/* Imagen URL */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                URL de la Imagen
                            </label>
                            <input
                                type="url"
                                name="imagen"
                                value={formData.imagen}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none bg-white/50"
                                placeholder="https://ejemplo.com/imagen.jpg"
                            />
                            {formData.imagen && (
                                <div className="mt-3 rounded-xl overflow-hidden border border-slate-200">
                                    <img
                                        src={formData.imagen}
                                        alt="Preview"
                                        className="w-full h-48 object-cover"
                                        onError={(e) => {
                                            e.target.src = "https://via.placeholder.com/400x300?text=Imagen+no+disponible";
                                        }}
                                    />
                                </div>
                            )}
                        </div>

                        {/* Disponible */}
                        <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
                            <input
                                type="checkbox"
                                name="disponible"
                                id="disponible"
                                checked={formData.disponible}
                                onChange={handleChange}
                                className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-2 focus:ring-indigo-200 cursor-pointer"
                            />
                            <label htmlFor="disponible" className="text-sm font-medium text-slate-700 cursor-pointer">
                                Producto disponible para la venta
                            </label>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-4 pt-4">
                            <button
                                type="button"
                                onClick={() => navigate("/admin/dashboard")}
                                className="flex-1 px-6 py-3 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-all font-medium"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={loading || loadingCategorias}
                                className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all font-medium shadow-lg shadow-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Guardando...
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        {isEdit ? "Actualizar Producto" : "Crear Producto"}
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ProductForm;
