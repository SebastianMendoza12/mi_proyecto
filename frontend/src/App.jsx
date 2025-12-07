import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import RegisterSuccess from "./pages/RegisterSuccess";
import Buscar from "./pages/Buscar";
import Profile from "./pages/Profile";
import WhatsAppChat from "./pages/WhatsAppChat";
import Feedback from "./pages/Feedback";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ProductForm from "./pages/admin/ProductForm";
import { CartProvider } from "./context/CartContext";
import Cart from "./components/Cart";

// Simple Protected Route Component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("access_token");
  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
};

function App() {
  return (
    <CartProvider>
      <Router>
        <Cart />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/register-success" element={<RegisterSuccess />} />
          <Route path="/buscar" element={<Buscar />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/whatsapp" element={<WhatsAppChat />} />
          <Route path="/feedback" element={<Feedback />} />

          {/* Admin Routes - Temporarily without protection for demo */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/products/new" element={<ProductForm />} />
          <Route path="/admin/products/edit/:id" element={<ProductForm />} />
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;