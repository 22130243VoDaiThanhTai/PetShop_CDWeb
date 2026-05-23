import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

import petShopLogo from '../assets/Logo.png';
import cartIcon from '../assets/Cart.png';

interface Category {
    id: number;
    name: string;
}

export default function Header() {
    const navigate = useNavigate();
    const location = useLocation();

    const [searchQuery, setSearchQuery] = useState('');

    const [listCategory] = useState<Category[]>([
        { id: 1, name: "Thức ăn thú cưng" },
        { id: 2, name: "Đồ chơi & Phụ kiện" },
        { id: 3, name: "Chuồng & Đệm ngủ" }
    ]);

    const [user, setUser] = useState({ isAuthenticated: false, username: '' });
    const [cartCount] = useState(3);

    useEffect(() => {
        const isAuth = localStorage.getItem("isAuthenticated") === "true";
        const savedUsername = localStorage.getItem("username");

        if (isAuth && savedUsername) {
            setUser({ isAuthenticated: true, username: savedUsername });
        } else {
            setUser({ isAuthenticated: false, username: '' });
        }
    }, [location.pathname]); // <--- ĐIỂM MẤU CHỐT LÀ CHỖ NÀY

    const handleLogout = async (e: React.MouseEvent) => {
        e.preventDefault();

        try {
            // Lấy token hiện tại để gửi cho backend
            const token = localStorage.getItem("accessToken");

            // Gọi API đăng xuất
            await fetch("http://localhost:8080/api/auth/logout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": token ? `Bearer ${token}` : ""
                }
            });
        } catch (error) {
            console.error("Lỗi khi đăng xuất ở server:", error);
        } finally {
            localStorage.removeItem("isAuthenticated");
            localStorage.removeItem("username");
            localStorage.removeItem("accessToken"); // Xóa luôn token

            // Reset state về rỗng
            setUser({ isAuthenticated: false, username: '' });

            // Chuyển hướng về trang chủ hoặc trang đăng nhập
            navigate("/");
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?searched=${searchQuery}`);
        }
    };

    return (
        <nav className="navbar navbar-expand-lg bg-white fixed-top shadow-sm">
            <div className="container">
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#petshopNavbar">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <Link className="navbar-brand me-4" to="/">
                    <img src={petShopLogo} width="65" height="65" alt="PetShop Logo" style={{ borderRadius: '8px' }} />
                </Link>

                <div className="collapse navbar-collapse" id="petshopNavbar">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0 gap-2">
                        <li className="nav-item"><Link className="nav-link active" to="/">Trang chủ</Link></li>
                        <li className="nav-item"><Link className="nav-link" to="/introduce">Giới thiệu</Link></li>

                        <li className="nav-item dropdown">
                            <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                Sản Phẩm
                            </a>
                            <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                                {listCategory.map((category) => (
                                    <li key={category.id}>
                                        <Link className="dropdown-item" to={`/category/${category.id}`}>{category.name}</Link>
                                    </li>
                                ))}
                            </ul>
                        </li>

                        <li className="nav-item"><Link className="nav-link" to="/contact">Liên hệ</Link></li>
                    </ul>

                    <form className="d-flex me-4" role="search" onSubmit={handleSearch} style={{ width: '300px' }}>
                        <input className="form-control search-input" type="search" placeholder="Tìm kiếm..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                        <button className="btn btn-outline-info search-btn" type="submit">Tìm</button>
                    </form>

                    <div className="d-flex align-items-center gap-3">
                        {user.isAuthenticated ? (
                            <div className="dropdown">
                                <a className="nav-link dropdown-toggle fw-bold text-primary" href="#" id="userDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    {user.username}
                                </a>
                                <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                                    <li><Link className="dropdown-item" to="/profile">Hồ sơ cá nhân</Link></li>
                                    <li><Link className="dropdown-item" to="/orders">Đơn hàng</Link></li>
                                    <li><hr className="dropdown-divider" /></li>
                                    <li><a className="dropdown-item text-danger" href="#" onClick={handleLogout} style={{cursor: "pointer"}}>Đăng xuất</a></li>
                                </ul>
                            </div>
                        ) : (
                            <div className="d-flex gap-2">
                                <Link to="/login" className="btn btn-outline-primary btn-sm px-3 rounded-pill">Đăng nhập</Link>
                                <Link to="/register" className="btn btn-primary btn-sm px-3 rounded-pill">Đăng ký</Link>
                            </div>
                        )}

                        <Link to="/cart" className="cart-icon-container ms-2 position-relative">
                            <img src={cartIcon} width="32" height="32" alt="Giỏ hàng" />
                            {cartCount > 0 && (
                                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '0.65rem' }}>
                                    {cartCount}
                                </span>
                            )}
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}