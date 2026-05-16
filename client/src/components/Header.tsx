import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

// Import tài nguyên ảnh đúng chuẩn cấu trúc của bạn
import petShopLogo from '../assets/Logo.png';
import cartIcon from '../assets/Cart.png';

interface Category {
    id: number;
    name: string;
}

export default function Header() {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');

    // Giả định danh mục và trạng thái đăng nhập
    const [listCategory] = useState<Category[]>([
        { id: 1, name: "Thức ăn thú cưng" },
        { id: 2, name: "Đồ chơi & Phụ kiện" },
        { id: 3, name: "Chuồng & Đệm ngủ" }
    ]);

    const [user] = useState({ isAuthenticated: false, username: '' });
    const [cartCount] = useState(3); // Giả lập số lượng giỏ hàng bằng 3

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?searched=${searchQuery}`);
        }
    };

    return (
        <nav className="navbar navbar-expand-lg bg-white fixed-top">
            <div className="container">
                {/* Nút bấm Menu trên Mobile */}
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#petshopNavbar">
                    <span className="navbar-toggler-icon"></span>
                </button>

                {/* Logo Shop */}
                <Link className="navbar-brand me-4" to="/">
                    <img src={petShopLogo} width="65" height="65" alt="PetShop Logo" style={{ borderRadius: '8px' }} />
                </Link>

                {/* Menu Điều hướng chính */}
                <div className="collapse navbar-collapse" id="petshopNavbar">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0 gap-2">
                        <li className="nav-item">
                            <Link className="nav-link active" to="/">Trang chủ</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/introduce">Giới thiệu</Link>
                        </li>

                        {/* Dropdown Sản Phẩm */}
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

                        <li className="nav-item">
                            <Link className="nav-link" to="/contact">Liên hệ</Link>
                        </li>
                    </ul>

                    {/* Thanh Tìm Kiếm độc lập */}
                    <form className="d-flex me-4" role="search" onSubmit={handleSearch} style={{ width: '300px' }}>
                        <input
                            className="form-control search-input"
                            type="search"
                            placeholder="Tìm kiếm..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <button className="btn btn-outline-info search-btn" type="submit">Tìm</button>
                    </form>

                    {/* Cụm chức năng Thành viên & Giỏ hàng */}
                    <div className="d-flex align-items-center gap-3">
                        <div className="dropdown">
                            <a className="nav-link dropdown-toggle" href="#" id="userDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                {user.isAuthenticated ? user.username : 'PetShop'}
                            </a>
                            <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                                {!user.isAuthenticated ? (
                                    <>
                                        <li><Link className="dropdown-item" to="/login">Đăng nhập</Link></li>
                                        <li><Link className="dropdown-item" to="/register">Đăng ký</Link></li>
                                    </>
                                ) : (
                                    <li><Link className="dropdown-item" to="/logout">Đăng xuất</Link></li>
                                )}
                            </ul>
                        </div>

                        {/* Giỏ hàng độc lập */}
                        <Link to="/cart" className="cart-icon-container ms-2">
                            <img src={cartIcon} width="32" height="32" alt="Giỏ hàng" />
                            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}