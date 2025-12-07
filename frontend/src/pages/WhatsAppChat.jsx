import { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/LogotipoProyecto.png";

export default function WhatsAppChat() {
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([
        {
            id: 1,
            text: "¡Hola! Bienvenido a FastFood.exe 🍔",
            sender: "bot",
            time: "10:30"
        },
        {
            id: 2,
            text: "¿En qué puedo ayudarte hoy?",
            sender: "bot",
            time: "10:30"
        }
    ]);

    const handleSend = () => {
        if (!message.trim()) return;

        const newMessage = {
            id: messages.length + 1,
            text: message,
            sender: "user",
            time: new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })
        };

        setMessages([...messages, newMessage]);
        setMessage("");

        // Auto-reply
        setTimeout(() => {
            const reply = {
                id: messages.length + 2,
                text: "Gracias por tu mensaje. Este es un chat de demostración. Para pedidos reales, visita nuestro menú principal.",
                sender: "bot",
                time: new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })
            };
            setMessages(prev => [...prev, reply]);
        }, 1000);
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            {/* WhatsApp Header */}
            <div className="bg-[#075E54] text-white p-4 shadow-lg">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link to="/" className="text-white hover:opacity-80 transition-opacity">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </Link>
                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                            <img src={logo} alt="FastFood" className="w-8 h-8 object-contain" />
                        </div>
                        <div>
                            <h1 className="font-bold">FastFood.exe</h1>
                            <p className="text-xs opacity-80">En línea</p>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <button className="hover:opacity-80 transition-opacity">
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                            </svg>
                        </button>
                        <button className="hover:opacity-80 transition-opacity">
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Chat Background */}
            <div className="flex-1 bg-[#ECE5DD] bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] bg-repeat overflow-y-auto">
                <div className="max-w-4xl mx-auto p-4 space-y-3">
                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`max-w-md px-4 py-2 rounded-lg shadow-md ${msg.sender === 'user'
                                        ? 'bg-[#DCF8C6] rounded-br-none'
                                        : 'bg-white rounded-bl-none'
                                    }`}
                            >
                                <p className="text-gray-900 text-sm">{msg.text}</p>
                                <p className="text-xs text-gray-500 text-right mt-1">{msg.time}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Input Area */}
            <div className="bg-[#F0F0F0] p-4 border-t border-gray-300">
                <div className="max-w-4xl mx-auto flex items-center gap-2">
                    <button className="p-2 text-gray-600 hover:text-gray-800 transition-colors">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7zm2.85 11.1l-.85.6V16h-4v-2.3l-.85-.6C7.8 12.16 7 10.63 7 9c0-2.76 2.24-5 5-5s5 2.24 5 5c0 1.63-.8 3.16-2.15 4.1z" />
                        </svg>
                    </button>

                    <div className="flex-1 bg-white rounded-full px-4 py-2 shadow-sm">
                        <input
                            type="text"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Escribe un mensaje..."
                            className="w-full outline-none text-gray-900 placeholder-gray-500"
                        />
                    </div>

                    <button
                        onClick={handleSend}
                        className="p-3 bg-[#075E54] text-white rounded-full hover:bg-[#128C7E] transition-colors shadow-lg"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Demo Notice */}
            <div className="bg-yellow-50 border-t border-yellow-200 p-3">
                <div className="max-w-4xl mx-auto text-center">
                    <p className="text-sm text-yellow-800">
                        <span className="font-bold">⚠️ Chat de Demostración</span> - Este es un chat de prueba.
                        <Link to="/" className="text-red-600 ml-1 font-medium hover:underline">Volver al menú →</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
