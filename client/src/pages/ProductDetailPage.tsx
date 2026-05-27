import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import '../styles/ProductDetailPage.css';

interface Product {
    id: number;
    categoryId: number;
    name: string;
    price: number;
    stockQuantity: number;
    imageUrl: string;
    description: string;
}

export default function ProductDetailPage() {
    const { id } = useParams<{ id: string }>(); // Lấy ID sản phẩm trên thanh URL
    const navigate = useNavigate();

    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1); // State quản lý số lượng đặt mua

    useEffect(() => {
        setLoading(true);
        fetch(`http://localhost:8080/api/products/${id}`)
            .then(res => {
                if (!res.ok) throw new Error("Không tìm thấy sản phẩm");
                return res.json();
            })
            .then(data => {
                setProduct(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [id]);

    // Hàm tăng số lượng mua
    const handleIncrease = () => {
        if (product && quantity < product.stockQuantity) {
            setQuantity(prev => prev + 1);
        }
    };

    // Hàm giảm số lượng mua
    const handleDecrease = () => {
        if (quantity > 1) {
            setQuantity(prev => prev - 1);
        }
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    };

    if (loading) {
        return (
            <div className="container text-center" style={{ marginTop: '150px', minHeight: '50vh' }}>
                <div className="spinner-border text-success" role="status"></div>
                <p className="mt-2 text-muted">Đang tải thông tin sản phẩm...</p>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="container text-center" style={{ marginTop: '150px', minHeight: '50vh' }}>
                <h3 className="text-danger">⚠️ Sản phẩm không tồn tại hoặc đã bị xóa!</h3>
                <Link to="/category/4" className="btn btn-success mt-3 rounded-pill px-4">Quay lại cửa hàng</Link>
            </div>
        );
    }

    return (
        <div className="container product-detail-container">
            {/* Breadcrumb dẫn đường xinh xắn */}
            <nav aria-label="breadcrumb" className="mb-4">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item"><Link to="/" className="text-decoration-none text-muted">Trang chủ</Link></li>
                    <li className="breadcrumb-item"><Link to="/category/4" className="text-decoration-none text-muted">Sản phẩm</Link></li>
                    <li className="breadcrumb-item active text-success fw-bold" aria-current="page">{product.name}</li>
                </ol>
            </nav>

            <div className="row g-5">
                {/* BÊN TRÁI: HÌNH ẢNH SẢN PHẨM */}
                <div className="col-12 col-md-6">
                    <div className="detail-img-wrapper">
                        <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="detail-img"
                            onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/500x500?text=PetShop' }}
                        />
                    </div>
                </div>

                {/* BÊN PHẢI: THÔNG TIN CHI TIẾT */}
                <div className="col-12 col-md-6 d-flex flex-column justify-content-between">
                    <div>
                        <h1 className="fw-bold mb-3 h2">{product.name}</h1>

                        {/* Tình trạng kho hàng */}
                        <div className="mb-4">
                            {product.stockQuantity > 0 ? (
                                <span className="badge bg-success-subtle text-success border border-success px-3 py-2 rounded-pill fw-bold">
                                    🟢 Còn hàng (Trong kho còn: {product.stockQuantity})
                                </span>
                            ) : (
                                <span className="badge bg-danger-subtle text-danger border border-danger px-3 py-2 rounded-pill fw-bold">
                                    🔴 Hết hàng mẫu
                                </span>
                            )}
                        </div>

                        {/* Giá tiền */}
                        <h2 className="text-danger fw-bold mb-4 display-6">
                            {formatPrice(product.price)}
                        </h2>

                        <hr />

                        {/* Mô tả ngắn */}
                        <h6 className="fw-bold text-uppercase text-muted mb-2">Mô tả sản phẩm:</h6>
                        <p className="text-secondary lh-lg mb-4" style={{ whiteSpace: 'pre-line' }}>
                            {product.description || "Chưa có mô tả chi tiết cho sản phẩm này."}
                        </p>
                    </div>

                    {/* HÀNH ĐỘNG: CHỌN SỐ LƯỢNG & MUA HÀNG */}
                    <div className="mt-4">
                        {product.stockQuantity > 0 && (
                            <div className="d-flex align-items-center gap-3 mb-4">
                                <span className="fw-bold text-muted text-uppercase small">Số lượng:</span>
                                <div className="d-flex align-items-center">
                                    <button className="btn btn-outline-secondary quantity-btn rounded-start" onClick={handleDecrease}>-</button>
                                    <div className="quantity-display">{quantity}</div>
                                    <button className="btn btn-outline-secondary quantity-btn rounded-end" onClick={handleIncrease}>+</button>
                                </div>
                            </div>
                        )}

                        <div className="row g-3 mb-4">
                            <div className="col-12 col-sm-6">
                                <button
                                    className="btn btn-success btn-lg w-100 rounded-pill fw-bold py-3"
                                    disabled={product.stockQuantity <= 0}
                                >
                                    🛒 THÊM VÀO GIỎ HÀNG
                                </button>
                            </div>
                            <div className="col-12 col-sm-6">
                                <button
                                    className="btn btn-danger btn-lg w-100 rounded-pill fw-bold py-3"
                                    disabled={product.stockQuantity <= 0}
                                    onClick={() => navigate('/cart')}
                                >
                                    MUA NGAY
                                </button>
                            </div>
                        </div>

                        {/* Khung cam kết an tâm cho khách hàng */}
                        <div className="policy-box">
                            <div className="row text-center text-sm-start g-2">
                                <div className="col-12 col-sm-6 small text-success fw-bold">🛡️ Cam kết 100% chính hãng</div>
                                <div className="col-12 col-sm-6 small text-success fw-bold">🔄 Đổi trả trong vòng 7 ngày</div>
                                <div className="col-12 col-sm-6 small text-success fw-bold">🚚 Ship COD hỏa tốc toàn quốc</div>
                                <div className="col-12 col-sm-6 small text-success fw-bold">📞 Hỗ trợ tư vấn chăm sóc 24/7</div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}