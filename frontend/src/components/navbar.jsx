import "./../styles/admin.css";

export default function Navbar() {
  return (
    <header className="navbar">
      <h3>Inicio</h3>
      <input type="text" placeholder="Buscar..." className="search-bar" />
      <div className="nav-right">
        <span className="user">🔔 Admin</span>
        <button className="logout-btn">Cerrar sesión</button>
      </div>
    </header>
  );
}
