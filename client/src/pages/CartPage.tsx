import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/CartPage.css";

interface CartItem {
    id: number;        // ID của dòng cart_item
    productId: number; // ID của sản phẩm để click xem chi tiết
    name: string;
    image: string;
    price: number;
    quantity: number;
}

const formatVND = (amount: number) =>
    amount.toLocaleString("vi-VN") + " VNĐ";

const CartPage: React.FC = () => {
    const navigate = useNavigate();
    const [items, setItems] = useState<CartItem[]>([]);
    const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
    const [loading, setLoading] = useState<boolean>(true);
    const [errorMsg, setErrorMsg] = useState<string>("");

    // Lấy Token của user từ localStorage để gửi kèm trong Header Request
    const token = localStorage.getItem("accessToken");

    // 1. Fetch dữ liệu giỏ hàng thật từ Backend lên
    const fetchCartData = () => {
        if (!token) {
            setErrorMsg("Vui lòng đăng nhập để xem giỏ hàng của bạn nhé!");
            setLoading(false);
            return;
        }

        fetch("http://localhost:8080/api/cart", {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
            .then((res) => {
                if (res.status === 401) throw new Error("Hết phiên đăng nhập!");
                if (!res.ok) throw new Error("Không thể tải dữ liệu giỏ hàng");
                return res.json();
            })
            .then((data: CartItem[]) => {
                setItems(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setErrorMsg(err.message || "Đã xảy ra lỗi hệ thống.");
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchCartData();
    }, []);

    const isAllSelected = items.length > 0 && selectedIds.size === items.length;
    const isIndeterminate = selectedIds.size > 0 && selectedIds.size < items.length;

    const toggleSelectAll = () => {
        if (isAllSelected) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(items.map((i) => i.id)));
        }
    };

    const toggleSelectOne = (id: number) => {
        setSelectedIds((prev) => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    };

    // 2. Tăng giảm số lượng đồng bộ xuống DB
    const changeQty = (id: number, delta: number) => {
        // Cập nhật nhanh local state trước để UI chạy mượt (Optimistic Update)
        setItems((prev) =>
            prev.map((item) =>
                item.id === id
                    ? { ...item, quantity: Math.max(1, item.quantity + delta) }
                    : item
            )
        );

        fetch(`http://localhost:8080/api/cart/items/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ delta })
        })
            .then((res) => {
                if (!res.ok) {
                    // Nếu lỗi (ví dụ: quá số lượng trong kho), reload lại data thực tế
                    fetchCartData();
                    res.text().then(text => alert(text));
                }
            })
            .catch((err) => console.error("Lỗi cập nhật số lượng:", err));
    };

    // 3. Xóa một sản phẩm đơn lẻ khỏi giỏ hàng
    const removeItem = (id: number) => {
        if (!window.confirm("Ní có chắc muốn xóa sản phẩm này khỏi giỏ hàng không?")) return;

        fetch(`http://localhost:8080/api/cart/items/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
            .then((res) => {
                if (res.ok) {
                    setItems((prev) => prev.filter((item) => item.id !== id));
                    setSelectedIds((prev) => {
                        const next = new Set(prev);
                        next.delete(id);
                        return next;
                    });
                }
            })
            .catch((err) => console.error("Lỗi khi xóa sản phẩm:", err));
    };

    // 4. Xóa hàng loạt các sản phẩm đã chọn bằng Checkbox
    const removeSelected = () => {
        if (!window.confirm(`Ní chắc chắn muốn xóa ${selectedIds.size} mục đã chọn chứ?`)) return;

        const idsArray = Array.from(selectedIds);

        fetch("http://localhost:8080/api/cart/items/remove-multiple", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(idsArray)
        })
            .then((res) => {
                if (res.ok) {
                    setItems((prev) => prev.filter((item) => !selectedIds.has(item.id)));
                    setSelectedIds(new Set());
                }
            })
            .catch((err) => console.error("Lỗi khi xóa nhiều sản phẩm:", err));
    };

    const selectedItems = items.filter((i) => selectedIds.has(i.id));
    const selectedQty = selectedItems.reduce((sum, i) => sum + i.quantity, 0);
    const selectedAmount = selectedItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

    const handleBuy = () => {
        // Điều hướng sang trang thanh toán cùng danh sách các mã mặt hàng đã chọn mua
        alert(`Tiến hành thanh toán ${selectedQty} sản phẩm — ${formatVND(selectedAmount)}`);
        navigate("/checkout", { state: { selectedItems } });
    };

    const handlePrint = () => window.print();

    if (loading) {
        return (
            <div className="cart-page d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
                <div className="spinner-border text-success" role="status"></div>
                <span className="ms-2 fw-bold text-muted">Đang tải giỏ hàng của ní...</span>
            </div>
        );
    }

    if (errorMsg) {
        return (
            <div className="cart-page">
                <div className="cart-container text-center py-5 bg-white rounded shadow-sm">
                    <h4 className="text-warning fw-bold mb-3">⚠️ Thông báo</h4>
                    <p className="text-muted">{errorMsg}</p>
                    <button onClick={() => navigate("/login")} className="btn btn-success rounded-pill px-4 mt-2">Đăng nhập ngay</button>
                </div>
            </div>
        );
    }

    const isEmpty = items.length === 0;

    return (
        <div className="cart-page" style={{ marginTop: "80px" }}>
            <div className="cart-container">
                <a href="/" className="cart-continue-btn print-hide">
                    ← Tiếp tục mua hàng
                </a>

                {isEmpty ? (
                    <div className="cart-empty-wrapper">
                        <p className="cart-empty-title">Chưa có đơn hàng</p>
                        <div className="cart-empty-icon">🛒</div>
                        <p className="cart-empty-hint">
                            Hãy thêm sản phẩm vào giỏ để bắt đầu mua sắm!
                        </p>
                    </div>
                ) : (
                    <div id="cart-invoice" className="cart-table-wrapper">
                        <div className="cart-invoice-header">
                            <h2>🐾 PetShop — Hóa đơn mua hàng</h2>
                            <p>Ngày: {new Date().toLocaleDateString("vi-VN")}</p>
                        </div>
                        <table className="cart-table">
                            <thead>
                            <tr>
                                <th className="cart-checkbox-col print-hide">
                                    <input type="checkbox" className="cart-checkbox" checked={isAllSelected}
                                           ref={(el) => { if (el) el.indeterminate = isIndeterminate; }}
                                           onChange={toggleSelectAll} title="Chọn tất cả" />
                                </th>
                                <th>Sản phẩm</th>
                                <th>Đơn giá</th>
                                <th className="cart-th-center">Số lượng</th>
                                <th className="cart-th-right">Thành tiền</th>
                                <th className="print-hide" style={{ width: "60px" }} />
                            </tr>
                            </thead>
                            <tbody>
                            {items.map((item) => {
                                const isSelected = selectedIds.has(item.id);
                                return (
                                    <tr key={item.id} className={isSelected ? "cart-row-selected" : ""}>
                                        <td className="cart-checkbox-col print-hide">
                                            <input type="checkbox" className="cart-checkbox" checked={isSelected} onChange={() => toggleSelectOne(item.id)} />
                                        </td>
                                        <td>
                                            <div className="cart-product-cell">
                                                {item.image ? (
                                                    <img src={item.image} alt={item.name} className="cart-product-img" />
                                                ) : (
                                                    <div className="cart-product-img-placeholder">🐾</div>
                                                )}
                                                <span className="cart-product-name" style={{ cursor: "pointer" }} onClick={() => navigate(`/product/${item.productId}`)}>
                                                        {item.name}
                                                    </span>
                                            </div>
                                        </td>
                                        <td>
                                            <span className="cart-unit-price">{formatVND(item.price)}</span>
                                        </td>
                                        <td className="cart-td-center">
                                            <div className="cart-stepper print-hide">
                                                <button className="cart-step-btn" onClick={() => changeQty(item.id, -1)} disabled={item.quantity <= 1}>
                                                    −
                                                </button>
                                                <span className="cart-step-qty">{item.quantity}</span>
                                                <button className="cart-step-btn" onClick={() => changeQty(item.id, +1)}>
                                                    +
                                                </button>
                                            </div>
                                            <span style={{ display: "none" }} className="print-qty">{item.quantity}</span>
                                        </td>
                                        <td className="cart-td-right">
                                            <span className="cart-total-price">{formatVND(item.price * item.quantity)}</span>
                                        </td>
                                        <td className="cart-td-center print-hide">
                                            <button className="cart-delete-btn" onClick={() => removeItem(item.id)} title="Xóa sản phẩm">
                                                Xóa
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                            </tbody>
                        </table>
                        <div className="cart-footer-summary">
                            <span>Tổng tiền:{" "}
                                <strong>{formatVND(selectedAmount || items.reduce((s, i) => s + i.price * i.quantity, 0))}</strong>
                            </span>
                        </div>
                    </div>
                )}
            </div>

            {!isEmpty && (
                <div className="cart-bottom-bar print-hide">
                    <div className="cart-bottom-inner">
                        <div className="cart-bottom-left">
                            <label className="cart-bottom-select-all">
                                <input type="checkbox" className="cart-checkbox" checked={isAllSelected}
                                       ref={(el) => { if (el) el.indeterminate = isIndeterminate; }} onChange={toggleSelectAll} />
                                Chọn tất cả ({items.length})
                            </label>
                            <button className="cart-bottom-delete" onClick={removeSelected} disabled={selectedIds.size === 0}>
                                Xóa phần đã chọn
                            </button>
                            <button className="cart-bottom-delete" onClick={handlePrint}>
                                🖨️ In hóa đơn
                            </button>
                        </div>
                        <div className="cart-bottom-right">
                            <div>
                                <span className="cart-bottom-total-label">
                                    Tổng cộng ({selectedQty} sản phẩm):{" "}
                                </span>
                                <span className="cart-bottom-total-amount">
                                    {formatVND(selectedAmount)}
                                </span>
                            </div>
                            <button className="cart-buy-btn" onClick={handleBuy} disabled={selectedIds.size === 0}>
                                Mua hàng
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CartPage;