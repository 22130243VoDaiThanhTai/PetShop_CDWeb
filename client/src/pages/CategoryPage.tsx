import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import '../styles/CategoryPage.css';

interface Product {
    id: number;
    categoryId: number;
    name: string;
    price: number;
    stockQuantity: number;
    imageUrl: string;
    description: string;
}

export default function CategoryPage() {
    // Lấy tham số 'id' từ đường dẫn (ví dụ: /category/1 -> id = "1")
    const { id } = useParams<{ id: string }>();

    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [categoryName, setCategoryName] = useState("Sản Phẩm");

    useEffect(() => {
        setLoading(true);

        // Xác định tên danh mục để hiển thị lên tiêu đề
        if (id === '1') setCategoryName("Thức Ăn Thú Cưng");
        else if (id === '2') setCategoryName("Đồ Chơi & Phụ Kiện");
        else if (id === '3') setCategoryName("Chuồng & Đệm Ngủ");
        else setCategoryName("Tất Cả Sản Phẩm");

        // Nếu id = 4 (All) thì gọi API lấy tất cả, ngược lại gọi theo category
        const apiUrl = (id === '4' || !id)
            ? 'http://localhost:8080/api/products'
            : `http://localhost:8080/api/products/category/${id}`;

        fetch(apiUrl)
            .then(res => {
                if (!res.ok) throw new Error("Lỗi fetch dữ liệu");
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

    }, [id]); // Chạy lại mỗi khi đổi danh mục trên Header

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    };

    return (
        <div className="container category-page-container">
            {/* Header của trang danh mục */}
            <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
                <h2 className="fw-bold text-success m-0">🐾 {categoryName}</h2>
                <span className="text-muted fw-bold">{products.length} sản phẩm</span>
            </div>

            {loading ? (
                <div className="d-flex justify-content-center align-items-center" style={{ height: '200px' }}>
                    <div className="spinner-border text-success" role="status"></div>
                </div>
            ) : products.length === 0 ? (
                <div className="text-center text-muted mt-5">
                    <h4>Chưa có sản phẩm nào trong danh mục này.</h4>
                    <Link to="/category/4" className="btn btn-outline-success mt-3 rounded-pill fw-bold">Xem tất cả sản phẩm</Link>
                </div>
            ) : (
                <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4 mb-5">
                    {products.map(product => (
                        <div className="col" key={product.id}>
                            <div className="card h-100 border-0 shadow-sm product-card">

                                {/* Badge số lượng tồn kho */}
                                <span className="position-absolute top-0 start-0 m-2 badge bg-warning text-dark rounded-pill shadow-sm" style={{ zIndex: 1 }}>
                                    Còn: {product.stockQuantity}
                                </span>

                                <div className="p-3 bg-light product-img-wrapper">
                                    <img
                                        src={product.imageUrl}
                                        className="card-img-top product-img"
                                        alt={product.name}
                                        onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/300x300?text=PetShop' }}
                                    />
                                </div>
                                <div className="card-body d-flex flex-column">
                                    <h6 className="card-title fw-bold text-truncate-2 product-title">
                                        {product.name}
                                    </h6>
                                    <p className="card-text text-muted small mb-3 text-truncate-2 product-desc">
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