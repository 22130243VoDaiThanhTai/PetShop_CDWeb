import React, { useState } from "react";
import "../styles/CartPage.css";

interface CartItem {
    id: number;
    name: string;
    image: string;
    price: number;
    quantity: number;
}

const INITIAL_ITEMS: CartItem[] = [
    { id: 1, name: "Thức ăn hạt Royal Canin cho mèo 2kg", image: "", price: 285000, quantity: 2 },
    { id: 2, name: "Đồ chơi cần câu lông vũ cho mèo",     image: "", price:  45000, quantity: 1 },
    { id: 3, name: "Chuồng chó inox gấp gọn size M",      image: "", price: 650000, quantity: 1 },
];

const formatVND = (amount: number) =>
    amount.toLocaleString("vi-VN") + " VNĐ";

const CartPage: React.FC = () => {
    const [items, setItems]           = useState<CartItem[]>(INITIAL_ITEMS);
    const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

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

    const changeQty = (id: number, delta: number) => {
        setItems((prev) =>
            prev.map((item) =>
                item.id === id
                    ? { ...item, quantity: Math.max(1, item.quantity + delta) }
                    : item
            )
        );
    };

    const removeItem = (id: number) => {
        setItems((prev) => prev.filter((item) => item.id !== id));
        setSelectedIds((prev) => { const next = new Set(prev); next.delete(id); return next; });
    };

    const removeSelected = () => {
        setItems((prev) => prev.filter((item) => !selectedIds.has(item.id)));
        setSelectedIds(new Set());
    };

    const selectedItems   = items.filter((i) => selectedIds.has(i.id));
    const selectedQty     = selectedItems.reduce((sum, i) => sum + i.quantity, 0);
    const selectedAmount  = selectedItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

    const handleBuy = () => {
        // TODO: navigate("/checkout") với danh sách selectedIds
        alert(`Tiến hành thanh toán ${selectedQty} sản phẩm — ${formatVND(selectedAmount)}`);
    };

    const handlePrint = () => window.print();

    const isEmpty = items.length === 0;

    return (
        <div className="cart-page">
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
                                        ref={(el) => {
                                            if (el) el.indeterminate = isIndeterminate;
                                        }} onChange={toggleSelectAll} title="Chọn tất cả"/>
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
                                            <input type="checkbox" className="cart-checkbox" checked={isSelected} onChange={() => toggleSelectOne(item.id)}/>
                                        </td>
                                        <td>
                                            <div className="cart-product-cell">
                                                {item.image ? (
                                                    <img src={item.image} alt={item.name} className="cart-product-img"/>
                                                ) : (
                                                    <div className="cart-product-img-placeholder">🐾</div>
                                                )}
                                                <span className="cart-product-name">{item.name}</span>
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
                                    ref={(el) => {
                                        if (el) el.indeterminate = isIndeterminate;
                                    }} onChange={toggleSelectAll}/>
                                Chọn tất cả ({items.length})
                            </label>
                            <button className="cart-bottom-delete" onClick={removeSelected} disabled={selectedIds.size === 0}>
                                Xóa tất cả
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