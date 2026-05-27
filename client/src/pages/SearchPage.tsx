import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import '../styles/SearchPage.css';

interface Product {
    id: number;
    name: string;
    price: number;
    stockQuantity: number;
    imageUrl: string;
    description: string;
}

export default function SearchPage() {
    const location = useLocation();

    // Lấy query string từ URL (Ví dụ: ?searched=chó -> lấy chữ "chó")
    const searchParams = new URLSearchParams(location.search);
    const keyword = searchParams.get('searched') || '';

    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!keyword) {
            setProducts([]);
            setLoading(false);
            return;
        }

        setLoading(true);
        // Gọi API tìm kiếm của Spring Boot
        fetch(`http://localhost:8080/api/products/search?keyword=${encodeURIComponent(keyword)}`)
            .then(res => {
                if (!res.ok) throw new Error("Lỗi khi tìm kiếm");
                return res.json();
            })
            .then(data => {
                setProducts(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Lỗi:", err);
                setLoading(false);
            });
    }, [keyword]); // Chạy lại mỗi khi keyword trên URL thay đổi

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    };

    return (
        <div className="container search-page-container mb-5">
            <div className="mb-4 pb-2 border-bottom">
                <h3 className="fw-bold text-dark m-0">
                    Kết quả tìm kiếm cho: <span className="text-success">"{keyword}"</span>
                </h3>
                <p className="text-muted mt-2">Tìm thấy <strong>{products.length}</strong> sản phẩm phù hợp.</p>
            </div>

            {loading ? (
                <div className="d-flex justify-content-center align-items-center" style={{ height: '200px' }}>
                    <div className="spinner-border text-success" role="status"></div>
                </div>
            ) : products.length === 0 ? (
                <div className="text-center mt-5 p-5 bg-light rounded shadow-sm">
                    <h1 className="display-1 text-muted">🔍</h1>
                    <h4 className="mt-3 text-secondary">Rất tiếc, không tìm thấy sản phẩm nào!</h4>
                    <p className="text-muted">Vui lòng thử lại với từ khóa khác hoặc kiểm tra lỗi chính tả.</p>
                    <Link to="/category/4" className="btn btn-outline-success mt-3 rounded-pill px-4">
                        Xem tất cả sản phẩm
                    </Link>
                </div>
            ) : (
                <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
                    {products.map(product => (
                        <div className="col" key={product.id}>
                            <div className="card h-100 border-0 shadow-sm search-product-card">

                                <span className="position-absolute top-0 start-0 m-2 badge bg-warning text-dark rounded-pill shadow-sm" style={{ zIndex: 1 }}>
                                    Còn: {product.stockQuantity}
                                </span>

                                <div className="p-3 bg-light search-img-wrapper">
                                    <img
                                        src={product.imageUrl}
                                        className="card-img-top search-img"
                                        alt={product.name}
                                        onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/300x300?text=PetShop' }}
                                    />
                                </div>
                                <div className="card-body d-flex flex-column">
                                    <h6 className="card-title fw-bold search-text-truncate" style={{ height: '40px' }}>
                                        {product.name}
                                    </h6>
                                    <p className="card-text text-muted small mb-3 search-text-truncate" style={{ height: '36px' }}>
                                        {product.description}
                                    </p>
                                    <div className="mt-auto">
                                        <h5 className="text-danger fw-bold mb-3">{formatPrice(product.price)}</h5>
                                        <div className="row g-2">
                                            <div className="col-6">
                                                <Link to={`/product/${product.id}`} className="btn btn-outline-success btn-sm w-100 rounded-pill fw-bold">Chi tiết</Link>
                                            </div>
                                            <div className="col-6">
                                                <button className="btn btn-success btn-sm w-100 rounded-pill fw-bold">Thêm giỏ</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}