import React, { useState, useEffect, useCallback } from "react";
import "../styles/CheckOutPage.css";

// ─── Types ───────────────────────────────────────────────────────────────────

interface CartItem {
    id: number;
    productId: number;
    name: string;
    image: string;
    price: number;
    quantity: number;
}

interface Province {
    ProvinceID: number;
    ProvinceName: string;
}

interface District {
    DistrictID: number;
    DistrictName: string;
}

interface Ward {
    WardCode: string;
    WardName: string;
}

type PaymentMethod = "COD" | "MOMO";
type Step = 1 | 2 | 3;

// ─── Constants ───────────────────────────────────────────────────────────────

const API_BASE = "http://localhost:8080/api";

// ─── Helpers ─────────────────────────────────────────────────────────────────

const formatVND = (amount: number) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);

const authHeader = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("accessToken") || ""}`,
});

// ─── StepIndicator ───────────────────────────────────────────────────────────

const StepIndicator: React.FC<{ current: Step }> = ({ current }) => {
    const steps = [
        { num: 1 as Step, label: "Địa chỉ" },
        { num: 2 as Step, label: "Thanh toán" },
        { num: 3 as Step, label: "Xác nhận" },
    ];

    return (
        <div className="checkout-steps">
            {steps.map((s, i) => (
                <React.Fragment key={s.num}>
                    <div className={`step-item ${current === s.num ? "active" : ""} ${current > s.num ? "done" : ""}`}>
                        <div className="step-circle">
                            {current > s.num ? (
                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                    <path
                                        d="M2 7l3.5 3.5L12 3.5"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            ) : (
                                s.num
                            )}
                        </div>
                        <span className="step-label">{s.label}</span>
                    </div>
                    {i < steps.length - 1 && (
                        <div className={`step-line ${current > s.num ? "done" : ""}`} />
                    )}
                </React.Fragment>
            ))}
        </div>
    );
};

// ─── OrderSummary ─────────────────────────────────────────────────────────────

interface OrderSummaryProps {
    items: CartItem[];
    shippingFee: number | null;
    selectedIds?: Set<number>;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ items, shippingFee, selectedIds }) => {
    const displayItems = selectedIds ? items.filter((i) => selectedIds.has(i.id)) : items;
    const subtotal = displayItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const total = subtotal + (shippingFee ?? 0);

    return (
        <aside className="order-summary">
            <h3 className="summary-title">Đơn hàng của bạn</h3>

            <div className="summary-items">
                {displayItems.map((item) => (
                    <div key={item.id} className="summary-item">
                        <div className="summary-item-img-wrap">
                            <img src={item.image} alt={item.name} className="summary-item-img" />
                            <span className="summary-item-qty">{item.quantity}</span>
                        </div>
                        <div className="summary-item-info">
                            <p className="summary-item-name">{item.name}</p>
                            <p className="summary-item-price">{formatVND(item.price)}</p>
                        </div>
                        <p className="summary-item-total">{formatVND(item.price * item.quantity)}</p>
                    </div>
                ))}
            </div>

            <div className="summary-divider" />

            <div className="summary-row">
                <span>Tạm tính</span>
                <span>{formatVND(subtotal)}</span>
            </div>
            <div className="summary-row">
                <span>Phí vận chuyển</span>
                <span className={shippingFee === null ? "fee-pending" : "fee-value"}>
          {shippingFee === null ? "Chưa tính" : formatVND(shippingFee)}
        </span>
            </div>

            <div className="summary-divider" />

            <div className="summary-row total-row">
                <span>Tổng cộng</span>
                <span className="total-amount">{formatVND(total)}</span>
            </div>
        </aside>
    );
};

// ─── CheckoutPage ─────────────────────────────────────────────────────────────

const CheckoutPage: React.FC = () => {
    // ── Cart state ──────────────────────────────────────────────────────────────
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
    const [loadingCart, setLoadingCart] = useState(true);

    // ── Address state ───────────────────────────────────────────────────────────
    const [provinces, setProvinces] = useState<Province[]>([]);
    const [districts, setDistricts] = useState<District[]>([]);
    const [wards, setWards] = useState<Ward[]>([]);

    const [selectedProvince, setSelectedProvince] = useState<Province | null>(null);
    const [selectedDistrict, setSelectedDistrict] = useState<District | null>(null);
    const [selectedWard, setSelectedWard] = useState<Ward | null>(null);
    const [detailAddress, setDetailAddress] = useState("");
    const [recipientName, setRecipientName] = useState("");
    const [recipientPhone, setRecipientPhone] = useState("");

    const [loadingDistricts, setLoadingDistricts] = useState(false);
    const [loadingWards, setLoadingWards] = useState(false);

    // ── Shipping fee state ──────────────────────────────────────────────────────
    const [shippingFee, setShippingFee] = useState<number | null>(null);
    const [loadingFee, setLoadingFee] = useState(false);
    const [orderNote, setOrderNote] = useState("");

    // ── Payment & UI state ──────────────────────────────────────────────────────
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("COD");
    const [step, setStep] = useState<Step>(1);
    const [placingOrder, setPlacingOrder] = useState(false);
    const [orderId, setOrderId] = useState<number | null>(null);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

    // ── Load cart ───────────────────────────────────────────────────────────────
    useEffect(() => {
        const fetchCart = async () => {
            try {
                const res = await fetch(`${API_BASE}/cart`, { headers: authHeader() });
                if (!res.ok) throw new Error();
                const data: CartItem[] = await res.json();
                setCartItems(data);
                setSelectedIds(new Set(data.map((i) => i.id)));
            } catch {
                showToast("Không thể tải giỏ hàng.", "error");
            } finally {
                setLoadingCart(false);
            }
        };
        fetchCart();
    }, []);

    // ── Load provinces ──────────────────────────────────────────────────────────
    useEffect(() => {
        fetch(`${API_BASE}/shipping/provinces`)
            .then((r) => r.json())
            .then((data) => setProvinces(data?.data ?? []))
            .catch(() => showToast("Không tải được danh sách tỉnh thành.", "error"));
    }, []);

    // ── Load districts when province changes ────────────────────────────────────
    useEffect(() => {
        if (!selectedProvince) return;
        setDistricts([]);
        setWards([]);
        setSelectedDistrict(null);
        setSelectedWard(null);
        setShippingFee(null);
        setLoadingDistricts(true);

        fetch(`${API_BASE}/shipping/districts?province_id=${selectedProvince.ProvinceID}`)
            .then((r) => r.json())
            .then((data) => setDistricts(data?.data ?? []))
            .catch(() => showToast("Không tải được danh sách quận/huyện.", "error"))
            .finally(() => setLoadingDistricts(false));
    }, [selectedProvince]);

    // ── Load wards when district changes ────────────────────────────────────────
    useEffect(() => {
        if (!selectedDistrict) return;
        setWards([]);
        setSelectedWard(null);
        setShippingFee(null);
        setLoadingWards(true);

        fetch(`${API_BASE}/shipping/wards?district_id=${selectedDistrict.DistrictID}`)
            .then((r) => r.json())
            .then((data) => setWards(data?.data ?? []))
            .catch(() => showToast("Không tải được danh sách phường/xã.", "error"))
            .finally(() => setLoadingWards(false));
    }, [selectedDistrict]);

    // ── Calculate shipping fee ───────────────────────────────────────────────────
    const calculateFee = useCallback(async (districtId: number, wardCode: string) => {
        setLoadingFee(true);
        setShippingFee(null);
        try {
            const res = await fetch(`${API_BASE}/shipping/fee`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ district_id: districtId, ward_code: wardCode }),
            });
            const data = await res.json();
            if (data.status === "success") {
                setShippingFee(data.fee);
            } else {
                showToast("Không tính được phí vận chuyển.", "error");
            }
        } catch {
            showToast("Lỗi khi tính phí vận chuyển.", "error");
        } finally {
            setLoadingFee(false);
        }
    }, []);

    useEffect(() => {
        if (selectedDistrict && selectedWard) {
            calculateFee(selectedDistrict.DistrictID, selectedWard.WardCode);
        }
    }, [selectedDistrict, selectedWard, calculateFee]);

    // ── Toast helper ─────────────────────────────────────────────────────────────
    const showToast = (msg: string, type: "success" | "error") => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3500);
    };

    // ── Validate step 1 ──────────────────────────────────────────────────────────
    const validateAddress = (): boolean => {
        const newErrors: Record<string, string> = {};
        if (!recipientName.trim()) newErrors.name = "Vui lòng nhập họ tên người nhận";
        if (!recipientPhone.trim() || !/^(0[3-9]\d{8})$/.test(recipientPhone))
            newErrors.phone = "Số điện thoại không hợp lệ";
        if (!selectedProvince) newErrors.province = "Vui lòng chọn tỉnh/thành phố";
        if (!selectedDistrict) newErrors.district = "Vui lòng chọn quận/huyện";
        if (!selectedWard) newErrors.ward = "Vui lòng chọn phường/xã";
        if (!detailAddress.trim()) newErrors.detail = "Vui lòng nhập địa chỉ cụ thể";
        if (selectedIds.size === 0) newErrors.cart = "Chưa chọn sản phẩm nào";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // ── Place order ───────────────────────────────────────────────────────────────
    const placeOrder = async () => {
        setPlacingOrder(true);
        const fullAddress = `${detailAddress}, ${selectedWard?.WardName}, ${selectedDistrict?.DistrictName}, ${selectedProvince?.ProvinceName}`;
        const selectedItems = cartItems.filter((i) => selectedIds.has(i.id));
        const subtotal = selectedItems.reduce((s, i) => s + i.price * i.quantity, 0);
        const total = subtotal + (shippingFee ?? 0);

        try {
            const res = await fetch(`${API_BASE}/orders`, {
                method: "POST",
                headers: authHeader(),
                body: JSON.stringify({
                    shippingAddress: fullAddress,
                    recipientName,
                    recipientPhone,
                    paymentMethod,
                    shippingFee: shippingFee ?? 0,
                    totalAmount: total,
                    cartItemIds: Array.from(selectedIds),
                    note: orderNote,
                }),
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.message || "Đặt hàng thất bại");
            }

            const data = await res.json();
            setOrderId(data.orderId);
            showToast("Đặt hàng thành công! 🎉", "success");
            window.dispatchEvent(new Event("cartUpdated"));
        } catch (e: any) {
            showToast(e.message ?? "Có lỗi xảy ra, vui lòng thử lại.", "error");
        } finally {
            setPlacingOrder(false);
        }
    };

    // ─── Render: Loading ─────────────────────────────────────────────────────────
    if (loadingCart) {
        return (
            <div className="checkout-loading">
                <div className="loading-spinner" />
                <p>Đang tải giỏ hàng...</p>
            </div>
        );
    }

    // ─── Render: Empty cart ───────────────────────────────────────────────────────
    if (cartItems.length === 0) {
        return (
            <div className="checkout-empty">
                <div className="empty-icon">🛒</div>
                <h2>Giỏ hàng trống</h2>
                <p>Hãy thêm sản phẩm vào giỏ hàng trước khi thanh toán.</p>
                <a href="/" className="btn-back-shop">Tiếp tục mua sắm</a>
            </div>
        );
    }

    // ─── Render: Main ─────────────────────────────────────────────────────────────
    return (
        <>
            {/* Toast */}
            {toast && (
                <div className={`checkout-toast ${toast.type}`}>
                    {toast.type === "success" ? "✓" : "✕"} {toast.msg}
                </div>
            )}

            <div className="checkout-page">
                <div className="checkout-container">

                    {/* ── Page header ── */}
                    <div className="checkout-header">
                        <h1 className="checkout-title">Thanh toán</h1>
                        <StepIndicator current={step} />
                    </div>

                    <div className="checkout-body">
                        <main className="checkout-main">

                            {/* ══════════════════════════════════════════════════════════
                  STEP 1 – Địa chỉ giao hàng
              ══════════════════════════════════════════════════════════ */}
                            {step === 1 && (
                                <section className="checkout-card" key="step1">
                                    <h2 className="card-title">
                                        <span className="card-title-icon">📍</span>
                                        Địa chỉ giao hàng
                                    </h2>

                                    {/* Chọn sản phẩm */}
                                    <div className="field-group">
                                        <label className="field-label">Sản phẩm được chọn</label>
                                        <div className="cart-select-list">
                                            <label className="cart-select-item select-all">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedIds.size === cartItems.length}
                                                    onChange={(e) =>
                                                        setSelectedIds(
                                                            e.target.checked
                                                                ? new Set(cartItems.map((i) => i.id))
                                                                : new Set()
                                                        )
                                                    }
                                                />
                                                <span>Chọn tất cả ({cartItems.length} sản phẩm)</span>
                                            </label>

                                            {cartItems.map((item) => (
                                                <label key={item.id} className="cart-select-item">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedIds.has(item.id)}
                                                        onChange={(e) => {
                                                            const next = new Set(selectedIds);
                                                            e.target.checked ? next.add(item.id) : next.delete(item.id);
                                                            setSelectedIds(next);
                                                        }}
                                                    />
                                                    <img src={item.image} alt={item.name} className="cart-select-img" />
                                                    <span className="cart-select-name">{item.name}</span>
                                                    <span className="cart-select-qty">×{item.quantity}</span>
                                                    <span className="cart-select-price">
                            {formatVND(item.price * item.quantity)}
                          </span>
                                                </label>
                                            ))}
                                        </div>
                                        {errors.cart && <p className="field-error">{errors.cart}</p>}
                                    </div>

                                    {/* Họ tên & SĐT */}
                                    <div className="fields-row">
                                        <div className="field-group">
                                            <label className="field-label">Họ và tên người nhận *</label>
                                            <input
                                                className={`field-input ${errors.name ? "input-error" : ""}`}
                                                placeholder="Nguyễn Văn A"
                                                value={recipientName}
                                                onChange={(e) => setRecipientName(e.target.value)}
                                            />
                                            {errors.name && <p className="field-error">{errors.name}</p>}
                                        </div>

                                        <div className="field-group">
                                            <label className="field-label">Số điện thoại *</label>
                                            <input
                                                className={`field-input ${errors.phone ? "input-error" : ""}`}
                                                placeholder="0901234567"
                                                value={recipientPhone}
                                                onChange={(e) => setRecipientPhone(e.target.value)}
                                                maxLength={10}
                                            />
                                            {errors.phone && <p className="field-error">{errors.phone}</p>}
                                        </div>
                                    </div>

                                    {/* Tỉnh / Thành phố */}
                                    <div className="field-group">
                                        <label className="field-label">Tỉnh / Thành phố *</label>
                                        <div className="select-wrap">
                                            <select
                                                className={`field-select ${errors.province ? "input-error" : ""}`}
                                                value={selectedProvince?.ProvinceID ?? ""}
                                                onChange={(e) => {
                                                    const found = provinces.find(
                                                        (p) => p.ProvinceID === Number(e.target.value)
                                                    );
                                                    setSelectedProvince(found ?? null);
                                                }}
                                            >
                                                <option value="">-- Chọn tỉnh / thành phố --</option>
                                                {provinces.map((p) => (
                                                    <option key={p.ProvinceID} value={p.ProvinceID}>
                                                        {p.ProvinceName}
                                                    </option>
                                                ))}
                                            </select>
                                            <span className="select-arrow">▾</span>
                                        </div>
                                        {errors.province && <p className="field-error">{errors.province}</p>}
                                    </div>

                                    {/* Quận / Huyện */}
                                    <div className="field-group">
                                        <label className="field-label">Quận / Huyện *</label>
                                        <div className="select-wrap">
                                            <select
                                                className={`field-select ${errors.district ? "input-error" : ""}`}
                                                value={selectedDistrict?.DistrictID ?? ""}
                                                disabled={!selectedProvince || loadingDistricts}
                                                onChange={(e) => {
                                                    const found = districts.find(
                                                        (d) => d.DistrictID === Number(e.target.value)
                                                    );
                                                    setSelectedDistrict(found ?? null);
                                                }}
                                            >
                                                <option value="">
                                                    {loadingDistricts
                                                        ? "Đang tải..."
                                                        : !selectedProvince
                                                            ? "Chọn tỉnh trước"
                                                            : "-- Chọn quận / huyện --"}
                                                </option>
                                                {districts.map((d) => (
                                                    <option key={d.DistrictID} value={d.DistrictID}>
                                                        {d.DistrictName}
                                                    </option>
                                                ))}
                                            </select>
                                            <span className="select-arrow">▾</span>
                                        </div>
                                        {errors.district && <p className="field-error">{errors.district}</p>}
                                    </div>

                                    {/* Phường / Xã */}
                                    <div className="field-group">
                                        <label className="field-label">Phường / Xã *</label>
                                        <div className="select-wrap">
                                            <select
                                                className={`field-select ${errors.ward ? "input-error" : ""}`}
                                                value={selectedWard?.WardCode ?? ""}
                                                disabled={!selectedDistrict || loadingWards}
                                                onChange={(e) => {
                                                    const found = wards.find((w) => w.WardCode === e.target.value);
                                                    setSelectedWard(found ?? null);
                                                }}
                                            >
                                                <option value="">
                                                    {loadingWards
                                                        ? "Đang tải..."
                                                        : !selectedDistrict
                                                            ? "Chọn quận trước"
                                                            : "-- Chọn phường / xã --"}
                                                </option>
                                                {wards.map((w) => (
                                                    <option key={w.WardCode} value={w.WardCode}>
                                                        {w.WardName}
                                                    </option>
                                                ))}
                                            </select>
                                            <span className="select-arrow">▾</span>
                                        </div>
                                        {errors.ward && <p className="field-error">{errors.ward}</p>}
                                    </div>

                                    {/* Địa chỉ cụ thể */}
                                    <div className="field-group">
                                        <label className="field-label">Địa chỉ cụ thể *</label>
                                        <input
                                            className={`field-input ${errors.detail ? "input-error" : ""}`}
                                            placeholder="Số nhà, tên đường..."
                                            value={detailAddress}
                                            onChange={(e) => setDetailAddress(e.target.value)}
                                        />
                                        {errors.detail && <p className="field-error">{errors.detail}</p>}
                                    </div>

                                    {/* Ghi chú đơn hàng */}
                                    <div className="field-group">
                                        <label className="field-label">
                                            Ghi chú <span className="field-optional">(tuỳ chọn)</span>
                                        </label>
                                        <textarea
                                            className="field-textarea"
                                            placeholder="Ví dụ: Giao giờ hành chính, gọi trước khi giao..."
                                            value={orderNote}
                                            onChange={(e) => setOrderNote(e.target.value)}
                                            rows={3}
                                            maxLength={300}
                                        />
                                        <p className="field-hint">{orderNote.length}/300 ký tự</p>
                                    </div>

                                    {/* Phí vận chuyển */}
                                    {(loadingFee || shippingFee !== null) && (
                                        <div className={`fee-badge ${loadingFee ? "loading" : ""}`}>
                                            {loadingFee ? (
                                                <>
                                                    <span className="fee-spinner" /> Đang tính phí vận chuyển...
                                                </>
                                            ) : (
                                                <>🚚 Phí vận chuyển: <strong>{formatVND(shippingFee!)}</strong></>
                                            )}
                                        </div>
                                    )}

                                    <div className="card-actions">
                                        <a href="/cart" className="btn-secondary">← Quay lại giỏ hàng</a>
                                        <button
                                            className="btn-primary"
                                            onClick={() => { if (validateAddress()) setStep(2); }}
                                            disabled={loadingFee || shippingFee === null}
                                        >
                                            Tiếp tục →
                                        </button>
                                    </div>
                                </section>
                            )}

                            {/* ══════════════════════════════════════════════════════════
                  STEP 2 – Phương thức thanh toán
              ══════════════════════════════════════════════════════════ */}
                            {step === 2 && (
                                <section className="checkout-card" key="step2">
                                    <h2 className="card-title">
                                        <span className="card-title-icon">💳</span>
                                        Phương thức thanh toán
                                    </h2>

                                    <div className="payment-options">
                                        {/* COD */}
                                        <label className={`payment-option ${paymentMethod === "COD" ? "selected" : ""}`}>
                                            <input
                                                type="radio"
                                                name="payment"
                                                value="COD"
                                                checked={paymentMethod === "COD"}
                                                onChange={() => setPaymentMethod("COD")}
                                            />
                                            <div className="payment-option-icon cod-icon">💵</div>
                                            <div className="payment-option-info">
                                                <p className="payment-option-name">Thanh toán khi nhận hàng</p>
                                                <p className="payment-option-desc">Trả tiền mặt khi shipper giao hàng</p>
                                            </div>
                                            <div className="payment-option-check">✓</div>
                                        </label>

                                        {/* MoMo */}
                                        <label className={`payment-option ${paymentMethod === "MOMO" ? "selected" : ""}`}>
                                            <input
                                                type="radio"
                                                name="payment"
                                                value="MOMO"
                                                checked={paymentMethod === "MOMO"}
                                                onChange={() => setPaymentMethod("MOMO")}
                                            />
                                            <div className="payment-option-icon momo-icon">
                                                <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" width="28" height="28">
                                                    <rect width="40" height="40" rx="8" fill="#A50064" />
                                                    <text
                                                        x="50%"
                                                        y="55%"
                                                        dominantBaseline="middle"
                                                        textAnchor="middle"
                                                        fill="white"
                                                        fontSize="10"
                                                        fontWeight="bold"
                                                    >
                                                        MoMo
                                                    </text>
                                                </svg>
                                            </div>
                                            <div className="payment-option-info">
                                                <p className="payment-option-name">Ví MoMo</p>
                                                <p className="payment-option-desc">Thanh toán qua ví điện tử MoMo</p>
                                            </div>
                                            <div className="payment-option-check">✓</div>
                                        </label>
                                    </div>

                                    {paymentMethod === "MOMO" && (
                                        <div className="momo-note">
                                            <span>ℹ️</span>
                                            <p>Bạn sẽ được chuyển đến ứng dụng MoMo để hoàn tất thanh toán sau khi đặt hàng.</p>
                                        </div>
                                    )}

                                    {/* Tóm tắt địa chỉ */}
                                    <div className="address-summary-box">
                                        <div className="address-summary-header">
                                            <span>📍 Địa chỉ giao hàng</span>
                                            <button className="btn-edit" onClick={() => setStep(1)}>Sửa</button>
                                        </div>
                                        <p className="address-summary-text">
                                            <strong>{recipientName}</strong> — {recipientPhone}
                                        </p>
                                        <p className="address-summary-text">
                                            {detailAddress}, {selectedWard?.WardName},{" "}
                                            {selectedDistrict?.DistrictName}, {selectedProvince?.ProvinceName}
                                        </p>
                                    </div>

                                    <div className="card-actions">
                                        <button className="btn-secondary" onClick={() => setStep(1)}>← Quay lại</button>
                                        <button className="btn-primary" onClick={() => setStep(3)}>
                                            Xem xác nhận →
                                        </button>
                                    </div>
                                </section>
                            )}

                            {/* ══════════════════════════════════════════════════════════
                  STEP 3 – Xác nhận đơn hàng
              ══════════════════════════════════════════════════════════ */}
                            {step === 3 && orderId === null && (
                                <section className="checkout-card" key="step3">
                                    <h2 className="card-title">
                                        <span className="card-title-icon">✅</span>
                                        Xác nhận đơn hàng
                                    </h2>

                                    <div className="confirm-row">
                                        <span className="confirm-label">Người nhận</span>
                                        <span className="confirm-value">
                      {recipientName} — {recipientPhone}
                    </span>
                                    </div>
                                    <div className="confirm-row">
                                        <span className="confirm-label">Địa chỉ</span>
                                        <span className="confirm-value">
                      {detailAddress}, {selectedWard?.WardName},{" "}
                                            {selectedDistrict?.DistrictName}, {selectedProvince?.ProvinceName}
                    </span>
                                    </div>
                                    <div className="confirm-row">
                                        <span className="confirm-label">Phí vận chuyển</span>
                                        <span className="confirm-value">{formatVND(shippingFee ?? 0)}</span>
                                    </div>
                                    {orderNote && (
                                        <div className="confirm-row">
                                            <span className="confirm-label">Ghi chú</span>
                                            <span className="confirm-value">{orderNote}</span>
                                        </div>
                                    )}
                                    <div className="confirm-row">
                                        <span className="confirm-label">Thanh toán</span>
                                        <span className="confirm-value">
                      {paymentMethod === "COD" ? "💵 Tiền mặt khi nhận hàng" : "💜 Ví MoMo"}
                    </span>
                                    </div>
                                    <div className="confirm-row total-confirm-row">
                                        <span className="confirm-label">Tổng thanh toán</span>
                                        <span className="confirm-total">
                      {formatVND(
                          cartItems
                              .filter((i) => selectedIds.has(i.id))
                              .reduce((s, i) => s + i.price * i.quantity, 0) + (shippingFee ?? 0)
                      )}
                    </span>
                                    </div>

                                    <div className="card-actions">
                                        <button className="btn-secondary" onClick={() => setStep(2)}>← Quay lại</button>
                                        <button
                                            className="btn-place-order"
                                            onClick={placeOrder}
                                            disabled={placingOrder}
                                        >
                                            {placingOrder ? (
                                                <><span className="fee-spinner" /> Đang đặt hàng...</>
                                            ) : (
                                                "🛍️ Đặt hàng ngay"
                                            )}
                                        </button>
                                    </div>
                                </section>
                            )}

                            {/* ══════════════════════════════════════════════════════════
                  Đặt hàng thành công
              ══════════════════════════════════════════════════════════ */}
                            {step === 3 && orderId !== null && (
                                <section className="checkout-card success-card" key="success">
                                    <div className="success-icon">🎉</div>
                                    <h2 className="success-title">Đặt hàng thành công!</h2>
                                    <p className="success-desc">
                                        Cảm ơn bạn đã mua sắm tại PetShop. Đơn hàng{" "}
                                        <strong>#{orderId}</strong> của bạn đã được ghi nhận.
                                    </p>
                                    <p className="success-sub">
                                        {paymentMethod === "COD"
                                            ? "Bạn sẽ thanh toán khi nhận hàng."
                                            : "Vui lòng thanh toán qua MoMo để hoàn tất đơn hàng."}
                                    </p>
                                    <div className="success-actions">
                                        <a href="/" className="btn-primary">Tiếp tục mua sắm</a>
                                        <a href="/orders" className="btn-secondary">Xem đơn hàng của tôi</a>
                                    </div>
                                </section>
                            )}

                        </main>

                        {/* ── Sidebar summary ── */}
                        {!(step === 3 && orderId !== null) && (
                            <OrderSummary
                                items={cartItems}
                                shippingFee={shippingFee}
                                selectedIds={selectedIds}
                            />
                        )}
                    </div>

                </div>
            </div>
        </>
    );
};

export default CheckoutPage;