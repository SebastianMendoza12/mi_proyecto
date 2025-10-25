import logo from "../assets/LogotipoProyecto.png";

export default function AuthLayout({ children }) {
  return (
    <div className="flex w-full min-h-screen">
      {/* Izquierda: logo */}
      <div className="hidden md:flex w-[702px] items-center justify-center bg-gray-100">
        <img
          src={logo}
          alt="Logo"
          className="object-contain max-h-[80%] max-w-[80%]"
        />
      </div>

      {/* Derecha: formulario */}
      <div className="flex-1 flex items-center justify-center bg-white">
        {children}
      </div>
    </div>
  );
}
