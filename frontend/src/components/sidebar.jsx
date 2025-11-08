import { Link } from "react-router-dom";
import "./../styles/admin.css";

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <h2>Admin Panel</h2>
      <nav>
        <ul>
          <li><Link to="/">🏠 Dashboard</Link></li>
          <li><Link to="/usuarios">👤 Usuarios</Link></li>
          <li><Link to="/productos">📦 Productos</Link></li>
          <li><Link to="/ventas">🛒 Ventas</Link></li>
          <li><Link to="/configuracion">⚙️ Configuración</Link></li>
        </ul>
      </nav>
    </aside>
  );
}
