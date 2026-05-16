import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';

// 1. Nạp CSS và JS của Bootstrap để giao diện và Dropdown hoạt động
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

// 2. Nạp CSS tùy biến của dự án (nếu bạn tạo file custom.css trong folder styles)
import './styles/custom.css';
// Hoặc nếu bạn viết code CSS vào file App.css thì đổi dòng trên thành: import './App.css';

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);

reportWebVitals();