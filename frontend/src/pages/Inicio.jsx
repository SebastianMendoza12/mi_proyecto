import Navbar from "../components/navbar";
import CardPanel from "../components/cardpanel";
import "./../styles/admin.css";

export default function Inicio() {
  return (
    <div className="dashboard-container">
      
      <main className="dashboard-main">
        <Navbar />
        <section className="dashboard-content">
          <CardPanel titulo="Productos" />
          <CardPanel titulo="Usuarios" />
          <CardPanel titulo="Ventas" />
          <div className="acciones-recientes">
            <h4>Acciones recientes</h4>
            <div className="acciones-box"></div>
          </div>
        </section>
      </main>
    </div>
  );
}
