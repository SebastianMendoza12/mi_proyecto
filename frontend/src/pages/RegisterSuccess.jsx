import { useNavigate } from "react-router-dom";
import logo from "../assets/LogotipoProyecto.png";

export default function RegisterSuccess() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-white flex w-full">

            {/* Lado Izquierdo - Logo con fondo crema/beige (Igual que Register) */}
            <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-12" style={{ backgroundColor: "#FDFED6" }}>
                <div className="flex items-center justify-center w-full h-full">
                    <img src={logo} alt="FastFood.exe Logo" className="max-w-md w-full h-auto object-contain" />
                </div>
            </div>

            {/* Lado Derecho - Mensaje de Éxito */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 bg-white">
                <div className="w-full max-w-md text-center">

                    {/* Icono de Éxito */}
                    <div className="mb-8 flex justify-center">
                        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center animate-scale-in">
                            <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                    </div>

                    {/* Título */}
                    <h1 className="text-4xl font-black text-gray-900 mb-4">
                        ¡Registro Exitoso!
                    </h1>

                    {/* Mensaje */}
                    <p className="text-gray-600 text-lg mb-10 leading-relaxed">
                        Tu cuenta ha sido creada correctamente. Ahora puedes iniciar sesión para disfrutar de nuestras deliciosas hamburguesas.
                    </p>

                    {/* Botón Ir a Login */}
                    <button
                        onClick={() => navigate("/login")}
                        className="w-full py-5 rounded-lg font-bold text-lg transition-all duration-200 hover:shadow-lg transform hover:-translate-y-1"
                        style={{ backgroundColor: "#F5F0D8", color: "#000" }}
                    >
                        Iniciar Sesión
                    </button>

                </div>
            </div>
        </div>
    );
}
