import "./../styles/admin.css";

export default function CardPanel({ titulo }) {
  return (
    <div className="card-panel">
      <div className="card-header">
        <h4>{titulo}</h4>
        <div className="actions">
          <button>Añadir</button>
          <button>Modificar</button>
        </div>
      </div>
      <div className="card-body"></div>
    </div>
  );
}
