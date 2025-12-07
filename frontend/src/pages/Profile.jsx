import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../services/api";
import logo from "../assets/LogotipoProyecto.png";

export default function Profile() {
    const [user, setUser] = useState({
        username: "",
        email: "",
        phone: "",
        address: ""
    });
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("access_token");
        const username = localStorage.getItem("username");

        if (!token) {
            navigate("/login");
            return;
        }

        setIsLoggedIn(true);
        setUser(prev => ({
            ...prev,
            username: username || "Usuario",
            email: `${username}@example.com`,
            phone: "+57 300 123 4567",
            address: "Pamplona, Norte de Santander"
        }));
    }, [navigate]);

    const handleLogout = () => {
        logout();
        setIsLoggedIn(false);
        navigate("/");
    };

    if (!isLoggedIn) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-red-50 to-orange-50">
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
                            ← Volver al inicio
                        </Link>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="max-w-4xl mx-auto px-4 py-12">
                {/* Profile Card */}
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
                    {/* Cover Image */}
                    <div className="h-48 bg-gradient-to-r from-red-600 via-orange-600 to-red-600 relative">
                        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=1000')] bg-cover bg-center opacity-20"></div>
                    </div>

                    {/* Profile Info */}
                    <div className="relative px-8 pb-8">
                        {/* Avatar */}
                        <div className="flex flex-col md:flex-row md:items-end md:justify-between -mt-16 mb-6">
                            <div className="flex items-end gap-6">
                                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-red-600 to-orange-600 p-1 shadow-2xl">
                                    <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                                        <span className="text-5xl">👤</span>
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <h1 className="text-3xl font-bold text-gray-900">{user.username}</h1>
                                    <p className="text-gray-500 mt-1">Cliente desde 2025</p>
                                </div>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="mt-4 md:mt-0 px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all shadow-lg shadow-red-200 font-medium"
                            >
                                Cerrar Sesión
                            </button>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-4 mb-8">
                            <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-4 text-center">
                                <div className="text-3xl font-bold text-red-600">12</div>
                                <div className="text-sm text-gray-600 mt-1">Pedidos</div>
                            </div>
                            <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-2xl p-4 text-center">
                                <div className="text-3xl font-bold text-orange-600">8</div>
                                <div className="text-sm text-gray-600 mt-1">Favoritos</div>
                            </div>
                            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-4 text-center">
                                <div className="text-3xl font-bold text-green-600">4.8</div>
                                <div className="text-sm text-gray-600 mt-1">Rating</div>
                            </div>
                        </div>

                        {/* User Details */}
                        <div className="space-y-4">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Información Personal</h2>

                            <div className="bg-gray-50 rounded-xl p-4 flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center">
                                    <span className="text-2xl">📧</span>
                                </div>
                                <div className="flex-1">
                                    <div className="text-xs text-gray-500">Correo Electrónico</div>
                                    <div className="text-gray-900 font-medium">{user.email}</div>
                                </div>
                            </div>

                            <div className="bg-gray-50 rounded-xl p-4 flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center">
                                    <span className="text-2xl">📱</span>
                                </div>
                                <div className="flex-1">
                                    <div className="text-xs text-gray-500">Teléfono</div>
                                    <div className="text-gray-900 font-medium">{user.phone}</div>
                                </div>
                            </div>

                            <div className="bg-gray-50 rounded-xl p-4 flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                                    <span className="text-2xl">📍</span>
                                </div>
                                <div className="flex-1">
                                    <div className="text-xs text-gray-500">Ubicación</div>
                                    <div className="text-gray-900 font-medium">{user.address}</div>
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Link
                                to="/"
                                className="px-6 py-4 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-xl hover:shadow-xl hover:-translate-y-1 transition-all font-bold text-center flex items-center justify-center gap-2"
                            >
                                <span>🛍️</span>
                                Ver Menú
                            </Link>
                            <Link
                                to="/feedback"
                                className="px-6 py-4 bg-gray-900 text-white rounded-xl hover:shadow-xl hover:-translate-y-1 transition-all font-bold text-center flex items-center justify-center gap-2"
                            >
                                <span>💬</span>
                                Dejar Comentario
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
