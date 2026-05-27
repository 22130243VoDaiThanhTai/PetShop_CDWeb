import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import CartPage from "./pages/CartPage";
import CategoryPage from './pages/CategoryPage';
import ProductDetailPage from './pages/ProductDetailPage';
import SearchPage from './pages/SearchPage';

const HomePlaceholder = () => (
    <div className="container text-center" style={{ minHeight: '50vh', padding: '100px 0' }}>
      <h2 className="text-muted">Nội dung Trang Chủ PetShop sẽ hiển thị tại đây</h2>
      <p className="text-secondary">Hệ thống đang chạy ổn định với React + TypeScript!</p>
    </div>
);

function App() {
  return (
      <Router>
        <Header />

        <div style={{ marginTop: '95px' }}></div>

        <main style={{ minHeight: '60vh' }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/cart" element={<CartPage />} />
              <Route path="/category/:id" element={<CategoryPage />} />
              <Route path="/product/:id" element={<ProductDetailPage />} />
              <Route path="/search" element={<SearchPage />} />

          </Routes>
        </main>

        <Footer />
      </Router>
  );
}

export default App;