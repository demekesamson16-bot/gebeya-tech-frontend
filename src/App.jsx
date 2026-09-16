import { useState, useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { tg } from './telegram';

// Pages
import Home from './pages/Home';
import Product from './pages/Product';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import Admin from './pages/Admin';
import ImeiCheck from './pages/ImeiCheck';

// Hooks
import { useCart } from './hooks/useCart';

// Components
import BottomNav from './components/BottomNav';

export default function App() {
  const cart = useCart();
  const location = useLocation();
  const navigate = useNavigate();

  // Telegram native back button
  useEffect(() => {
    if (!tg) return;

    const onBack = () => {
      if (location.pathname === '/') return;
      navigate(-1);
    };

    tg.BackButton.onClick(onBack);
    return () => tg.BackButton.offClick(onBack);
  }, [navigate, location.pathname]);

  // Show/hide Telegram's back arrow depending on the page
  useEffect(() => {
    if (!tg) return;

    const isRoot = location.pathname === '/';
    if (isRoot) {
      tg.BackButton.hide();
    } else {
      tg.BackButton.show();
    }
  }, [location.pathname]);

  return (
    <div className="app-shell">
      <Routes>
        <Route path="/" element={<Home cart={cart} />} />
        <Route path="/product/:id" element={<Product cart={cart} />} />
        <Route path="/cart" element={<Cart cart={cart} />} />
        <Route path="/checkout" element={<Checkout cart={cart} />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/imei" element={<ImeiCheck />} />
      </Routes>

      {location.pathname !== '/checkout' && (
        <BottomNav cartCount={cart.count} />
      )}
    </div>
  );
}