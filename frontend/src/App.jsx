import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Buscar from "./pages/Buscar";
import Bebidas from "./pages/Bebidas";
import Hamburguesas from "./pages/Hamburguesas";
import Combos from "./pages/Combos";
import Postres from "./pages/Postres";
import Pizzas from "./pages/Pizzas";
import Perros from "./pages/Perros";
import VerifyCode from "./pages/VerifyCode";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/buscar" element={<Buscar />} />
        <Route path="/bebidas" element={<Bebidas />} />
        <Route path="/hamburguesas" element={<Hamburguesas />} />
        <Route path="/combos" element={<Combos />} />
        <Route path="/postres" element={<Postres />} />
        <Route path="/pizzas" element={<Pizzas />} />
        <Route path="/perros" element={<Perros />} />
        <Route path="/verify-code" element={<VerifyCode />} />
      </Routes>
    </Router>
  );
}

export default App;