import Register from "./pages/Register";
import Login from "./pages/Login";

function App() {
  return (
    <div style={{ textAlign: "center", marginTop: "40px" }}>
      <h1>🍔 FastFood</h1>
      <Register />
      <hr style={{ margin: "40px" }} />
      <Login />
    </div>
  );
}

export default App;
