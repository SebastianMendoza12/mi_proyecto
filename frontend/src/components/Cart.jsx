import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

export default function Cart() {
    const {
        cart,
        removeFromCart,
        updateQuantity,
        cartTotal,
        isCartOpen,
        toggleCart,
        clearCart
    } = useCart();

    const navigate = useNavigate();

    if (!isCartOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-hidden">
            <div
                className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm transition-opacity"
                onClick={toggleCart}
            ></div>

            <div className="absolute inset-y-0 right-0 max-w-full flex">
                <div className="w-screen max-w-md transform transition-transform ease-in-out duration-500 sm:duration-700 bg-white shadow-2xl flex flex-col h-full">

                    {/* Header */}
                    <div className="px-6 py-4 bg-white border-b border-gray-100 flex items-center justify-between">
                        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                            <span>🛒</span> Tu Pedido
                        </h2>
                        <button
                            onClick={toggleCart}
                            className="p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Cart Items */}
                    <div className="flex-1 overflow-y-auto p-6">
                        {cart.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-4xl">
                                    🍽️
                                </div>
                                <h3 className="text-lg font-medium text-gray-900">Tu carrito está vacío</h3>
                                <p className="text-gray-500 max-w-xs">
                                    ¡Agrega algunas deliciosas hamburguesas o acompañamientos para comenzar!
                                </p>
                                <button
                                    onClick={toggleCart}
                                    className="px-6 py-2 bg-red-600 text-white rounded-full font-bold hover:bg-red-700 transition-colors"
                                >
                                    Ver Menú
                                </button>
                            </div>
                        ) : (
                            <ul className="space-y-6">
                                {cart.map((item) => (
                                    <li key={item.id} className="flex gap-4 animate-fade-in">
                                        <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
                                            {item.imagen ? (
                                                <img
                                                    src={item.imagen}
                                                    alt={item.nombre}
                                                    className="h-full w-full object-cover object-center"
                                                />
                                            ) : (
                                                <div className="h-full w-full flex items-center justify-center text-2xl">🍔</div>
                                            )}
                                        </div>

                                        <div className="flex flex-1 flex-col">
                                            <div>
                                                <div className="flex justify-between text-base font-medium text-gray-900">
                                                    <h3 className="line-clamp-1">{item.nombre}</h3>
                                                    <p className="ml-4">${(parseFloat(item.precio) * item.quantity).toLocaleString('es-CO')}</p>
                                                </div>
                                                <p className="mt-1 text-sm text-gray-500 line-clamp-1">{item.categoria_nombre}</p>
                                            </div>
                                            <div className="flex flex-1 items-end justify-between text-sm">
                                                <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-1">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                        className="w-6 h-6 flex items-center justify-center bg-white rounded shadow-sm text-gray-600 hover:text-red-600 font-bold"
                                                    >
                                                        -
                                                    </button>
                                                    <span className="font-medium text-gray-900 w-4 text-center">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                        className="w-6 h-6 flex items-center justify-center bg-white rounded shadow-sm text-gray-600 hover:text-green-600 font-bold"
                                                    >
                                                        +
                                                    </button>
                                                </div>

                                                <button
                                                    type="button"
                                                    onClick={() => removeFromCart(item.id)}
                                                    className="font-medium text-red-500 hover:text-red-700 transition-colors"
                                                >
                                                    Eliminar
                                                </button>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* Footer */}
                    {cart.length > 0 && (
                        <div className="border-t border-gray-100 bg-gray-50 p-6 space-y-4">
                            <div className="flex justify-between text-base font-medium text-gray-900">
                                <p>Subtotal</p>
                                <p>${cartTotal.toLocaleString('es-CO')}</p>
                            </div>
                            <p className="mt-0.5 text-sm text-gray-500">
                                El envío y los impuestos se calculan al finalizar la compra.
                            </p>
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    onClick={clearCart}
                                    className="flex items-center justify-center rounded-xl border border-gray-300 bg-white px-6 py-3 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 transition-colors"
                                >
                                    Vaciar
                                </button>
                                <button
                                    onClick={() => {
                                        alert("Funcionalidad de pago próximamente!");
                                    }}
                                    className="flex items-center justify-center rounded-xl border border-transparent bg-gray-900 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-gray-800 transition-colors"
                                >
                                    Pagar
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
