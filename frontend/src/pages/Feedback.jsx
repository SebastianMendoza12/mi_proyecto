import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/LogotipoProyecto.png";

export default function Feedback() {
    const [rating, setRating] = useState(0);
    const [hoveredRating, setHoveredRating] = useState(0);
    const [comment, setComment] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

        if (rating === 0) {
            alert("Por favor selecciona una calificación");
            return;
        }

        // Here you would typically send to backend
        console.log({ rating, comment });
        setSubmitted(true);

        // Redirect after 2 seconds
        setTimeout(() => {
            navigate("/");
        }, 2000);
    };

    if (submitted) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-3xl shadow-2xl p-12 text-center max-w-md animate-fade-in">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-3">¡Gracias!</h2>
                    <p className="text-gray-600 mb-6">
                        Tu opinión es muy importante para nosotros.
                    </p>
                    <p className="text-sm text-gray-500">Redirigiendo al inicio...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-red-50">
            {/* Header */}
            <header className="bg-white/95 backdrop-blur-md shadow-sm sticky top-0 z-40 border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
                            <img src={logo} alt="FastFood.exe" className="h-10 w-auto drop-shadow-sm" />
                            <span className="text-2xl font-extrabold text-gray-900 tracking-tight">
                                FastFood<span className="text-red-600">.exe</span>
                            </span>
                        </div>
                        <Link
                            to="/"
                            className="px-4 py-2 rounded-full text-sm font-bold text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-all"
                        >
                            ← Volver
                        </Link>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="max-w-2xl mx-auto px-4 py-12">
                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
                    {/* Header Section */}
                    <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 p-8 text-center text-white">
                        <div className="text-6xl mb-4">💬</div>
                        <h1 className="text-3xl font-bold mb-2">Tu Opinión Importa</h1>
                        <p className="text-purple-100">
                            Ayúdanos a mejorar compartiendo tu experiencia
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="p-8">
                        {/* Rating Section */}
                        <div className="mb-8">
                            <label className="block text-lg font-bold text-gray-900 mb-4 text-center">
                                ¿Cómo calificarías tu experiencia?
                            </label>
                            <div className="flex justify-center gap-3">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setRating(star)}
                                        onMouseEnter={() => setHoveredRating(star)}
                                        onMouseLeave={() => setHoveredRating(0)}
                                        className="transition-transform hover:scale-125 focus:outline-none"
                                    >
                                        <svg
                                            className={`w-14 h-14 ${star <= (hoveredRating || rating)
                                                    ? 'text-yellow-400 fill-current'
                                                    : 'text-gray-300'
                                                }`}
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                                            />
                                        </svg>
                                    </button>
                                ))}
                            </div>
                            {rating > 0 && (
                                <p className="text-center mt-4 text-gray-600">
                                    {rating === 1 && "😞 Necesitamos mejorar"}
                                    {rating === 2 && "😐 Por debajo de lo esperado"}
                                    {rating === 3 && "😊 Bien"}
                                    {rating === 4 && "😃 Muy bien"}
                                    {rating === 5 && "🤩 ¡Excelente!"}
                                </p>
                            )}
                        </div>

                        {/* Comment Section */}
                        <div className="mb-8">
                            <label className="block text-lg font-bold text-gray-900 mb-3">
                                Cuéntanos más (opcional)
                            </label>
                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="¿Qué te gustó? ¿Qué podemos mejorar?"
                                rows={5}
                                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all outline-none resize-none"
                            />
                            <p className="text-sm text-gray-500 mt-2">
                                {comment.length}/500 caracteres
                            </p>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="w-full py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 text-white rounded-xl font-bold text-lg hover:shadow-2xl hover:-translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                            disabled={rating === 0}
                        >
                            {rating === 0 ? 'Selecciona una calificación' : 'Enviar Opinión'}
                        </button>
                    </form>

                    {/* Footer Info */}
                    <div className="bg-gray-50 p-6 text-center border-t border-gray-200">
                        <p className="text-sm text-gray-600">
                            Tus comentarios son completamente anónimos y nos ayudan a mejorar nuestro servicio
                        </p>
                    </div>
                </div>

                {/* Additional Info */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                    <div className="bg-white rounded-2xl p-6 shadow-lg">
                        <div className="text-3xl mb-2">⚡</div>
                        <div className="font-bold text-gray-900">Rápido</div>
                        <div className="text-sm text-gray-600 mt-1">Solo toma 30 segundos</div>
                    </div>
                    <div className="bg-white rounded-2xl p-6 shadow-lg">
                        <div className="text-3xl mb-2">🔒</div>
                        <div className="font-bold text-gray-900">Privado</div>
                        <div className="text-sm text-gray-600 mt-1">Tu información está segura</div>
                    </div>
                    <div className="bg-white rounded-2xl p-6 shadow-lg">
                        <div className="text-3xl mb-2">💡</div>
                        <div className="font-bold text-gray-900">Útil</div>
                        <div className="text-sm text-gray-600 mt-1">Nos ayuda a mejorar</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
