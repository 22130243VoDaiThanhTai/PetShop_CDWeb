import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';

// Component tạm thời cho Trang Chủ trong khi đợi làm các trang chi tiết
const HomePlaceholder = () => (
    <div className="container text-center" style={{ minHeight: '50vh', padding: '100px 0' }}>
      <h2 className="text-muted">Nội dung Trang Chủ PetShop sẽ hiển thị tại đây</h2>
      <p className="text-secondary">Hệ thống đang chạy ổn định với React + TypeScript!</p>
    </div>
);

function App() {
  return (
      <Router>
        {/* 1. Thanh điều hướng Header (Luôn cố định ở trên) */}
        <Header />

        {/* Khoảng cách đệm 90px để nội dung không bị cái Header fixed-top đè lên */}
        <div style={{ marginTop: '95px' }}></div>

        {/* 2. Phần nội dung thay đổi linh hoạt theo từng trang */}
        <main style={{ minHeight: '60vh' }}>
          <Routes>
            <Route path="/" element={<HomePlaceholder />} />
            {/* Sau này bạn làm thêm trang nào thì thêm Route vào đây, ví dụ:
          <Route path="/introduce" element={<Introduce />} />
          <Route path="/cart" element={<Cart />} />
          */}
          </Routes>
        </main>

        {/* 3. Chân trang Footer (Luôn nằm ở dưới cùng) */}
        <Footer />
      </Router>
  );
}

export default App;