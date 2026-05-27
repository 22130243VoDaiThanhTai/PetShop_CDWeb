import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/HomePage.css';

import banner1 from '../assets/banner1.png';
import banner2 from '../assets/banner2.png';
import banner3 from '../assets/banner3.png';

interface Product {
    id: number;
    name: string;
    price: number;
    imageUrl: string;
    description: string;
}

export default function HomePage() {
    const [hotProducts, setHotProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    // Gọi API lấy 4 sản phẩm nổi bật
    useEffect(() => {
        fetch('http://localhost:8080/api/products/featured')
            .then(res => res.json())
            .then(data => {
                setHotProducts(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Lỗi khi fetch sản phẩm:", err);
                setLoading(false);
            });
    }, []);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    };

    return (
        <div style={{ marginTop: '90px' }}>

            {/* 1. HERO BANNER (Dùng ảnh banner1) */}
            <div className="container mb-5">
                <Link to="/category/4">
                    <img
                        src={banner1}
                        alt="New Arrival"
                        className="img-fluid w-100 rounded shadow-sm hover-zoom"
                    />
                </Link>
            </div>

            {/* 2. FEATURE ICONS */}
            <div className="container mb-5 border-bottom pb-4">
                <div className="row text-center">
                    <div className="col-6 col-md-3 feature-icon-box">
                        <h1 className="text-success mb-2">🚚</h1>
                        <h6 className="fw-bold">Vận chuyển toàn quốc</h6>
                        <small className="text-muted">Vận chuyển nhanh chóng</small>
                    </div>
                    <div className="col-6 col-md-3 feature-icon-box">
                        <h1 className="text-success mb-2">🎁</h1>
                        <h6 className="fw-bold">Ưu đãi hấp dẫn</h6>
                        <small className="text-muted">Nhiều ưu đãi khuyến mãi hot</small>
                    </div>
                    <div className="col-6 col-md-3 feature-icon-box">
                        <h1 className="text-success mb-2">🛡️</h1>
                        <h6 className="fw-bold">Bảo đảm chất lượng</h6>
                        <small className="text-muted">Sản phẩm đã được kiểm định</small>
                    </div>
                    <div className="col-6 col-md-3 feature-icon-box">
                        <h1 className="text-success mb-2">🎧</h1>
                        <h6 className="fw-bold">Hotline: 0822221982</h6>
                        <small className="text-muted">Đội ngũ hotline hỗ trợ</small>
                    </div>
                </div>
            </div>

            {/* 3. HÀNG HOT 🔥 (Sản phẩm nổi bật) */}
            <div className="container mb-5">
                <div className="text-center mb-4">
                    <h2 className="fw-bold text-uppercase">HÀNG HOT 🔥</h2>
                    <p className="text-muted">Những sản phẩm phổ biến của PetShop</p>
                </div>

                {loading ? (
                    <div className="text-center"><div className="spinner-border text-success"></div></div>
                ) : (
                    <div className="row row-cols-1 row-cols-sm-2 row-cols-md-4 g-4">
                        {hotProducts.map(product => (
                            <div className="col" key={product.id}>
                                <div className="card h-100 border-0 shadow-sm product-card">
                                    <div className="p-3 bg-light d-flex align-items-center justify-content-center" style={{height: '200px', borderRadius: '12px 12px 0 0'}}>
                                        <img src={product.imageUrl} className="card-img-top" alt={product.name} style={{maxHeight: '100%', objectFit: 'contain'}} />
                                    </div>
                                    <div className="card-body d-flex flex-column">
                                        <h6 className="card-title fw-bold text-truncate-2" style={{ height: '40px', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                                            {product.name}
                                        </h6>
                                        <div className="mt-auto">
                                            <h5 className="text-danger fw-bold mb-3">{formatPrice(product.price)}</h5>
                                            <button className="btn btn-outline-success w-100 rounded-pill btn-sm fw-bold">Thêm vào giỏ</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* 4. MIDDLE BANNER (Dùng ảnh banner2) */}
            <div className="container mb-5">
                <Link to="category/4">
                    <img
                        src={banner2}
                        alt="Sale up to 60%"
                        className="img-fluid w-100 rounded shadow-sm hover-zoom"
                    />
                </Link>
            </div>

            {/* 5. TESTIMONIALS (KHÁCH HÀNG ĐÃ NÓI GÌ) */}
            <div className="container mb-5 pt-5">
                <h3 className="text-center fw-bold mb-5">Khách hàng đã nói gì</h3>
                <div className="row g-4 mt-3">
                    <div className="col-md-4">
                        <div className="testimonial-card text-center h-100 mt-4">
                            <img src="https://i.pravatar.cc/150?img=1" alt="Avatar" className="testimonial-img" />
                            <h5 className="fw-bold mt-2">Nguyễn Thu Hà</h5>
                            <div className="text-warning mb-2">★★★★★</div>
                            <p className="text-muted small">"Từ ngày biết đến PetShop, bé Miu nhà mình lười ăn cỡ nào cũng bị khuất phục bởi mấy loại súp thưởng ở đây. Hàng chuẩn chính hãng, giao nhanh, đóng gói siêu kỹ!"</p>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="testimonial-card text-center h-100 mt-4">
                            <img src="https://i.pravatar.cc/150?img=11" alt="Avatar" className="testimonial-img" />
                            <h5 className="fw-bold mt-2">Trần Hoàng Nam</h5>
                            <div className="text-warning mb-2">★★★★★</div>
                            <p className="text-muted small">"Vừa sắm cái chuồng ghép đa năng cho cu cậu Golden. Lắp ráp dễ ợt, khung sắt chắc chắn, giá lại còn đang sale rẻ hơn nhiều so với mấy shop ngoài thú y. 10 điểm không có nhưng."</p>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="testimonial-card text-center h-100 mt-4">
                            <img src="https://i.pravatar.cc/150?img=5" alt="Avatar" className="testimonial-img" />
                            <h5 className="fw-bold mt-2">Lê Mai Phượng</h5>
                            <div className="text-warning mb-2">★★★★☆</div>
                            <p className="text-muted small">"Các bạn nhân viên tư vấn siêu nhiệt tình, mình mới nuôi mèo chưa biết mua loại hạt nào thì được recommend Royal Canin Mother & Babycat. Bé nhà mình ăn phổng phao hẳn."</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* 6. BOTTOM BANNER (Dùng ảnh banner3) */}
            <div className="container mb-5">
                <Link to="/register">
                    <img
                        src={banner3}
                        alt="Cùng mua sắm đơn hàng đầu tiên nhé"
                        className="img-fluid w-100 rounded shadow-sm hover-zoom"
                    />
                </Link>
            </div>

        </div>
    );
}