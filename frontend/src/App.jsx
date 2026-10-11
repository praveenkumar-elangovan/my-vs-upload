
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { useSelector } from "react-redux";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";


function AppRoutes() {
  const token = useSelector((state) => state.auth.token);

  return (
    <>
      <Navbar />

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />

          <Route
            path="/login"
            element={token ? <Navigate to="/" replace /> : <Login />}
          />

          <Route
            path="/register"
            element={token ? <Navigate to="/" replace /> : <Register />}
          />

          <Route
            path="/checkout"
            element={
              token ? <Checkout /> : <Navigate to="/login" replace />
            }
          />

          <Route
            path="/orders"
            element={
              token ? <Orders /> : <Navigate to="/login" replace />
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Footer />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;