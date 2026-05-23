import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import LoginImage from "../assets/LoginImage.png";

// Import file CSS riêng biệt vừa tạo
import "../styles/RegisterPage.css";

const ADDRESS_DATA: Record<string, Record<string, string[]>> = {
    "Hồ Chí Minh": {
        "Thành phố Thủ Đức": ["Phường Linh Đông", "Phường Linh Tây", "Phường Linh Chiểu", "Phường Linh Trung", "Phường Hiệp Bình Phước", "Phường Bình Thọ"],
        "Quận 1": ["Phường Bến Nghé", "Phường Bến Thành", "Phường Cầu Kho", "Phường Cầu Ông Lãnh", "Phường Đa Kao", "Phường Nguyễn Thái Bình"],
        "Quận 3": ["Phường 1", "Phường 2", "Phường 3", "Phường 4", "Phường 5", "Phường Võ Thị Sáu"],
        "Quận Bình Thạnh": ["Phường 1", "Phường 2", "Phường 3", "Phường 6", "Phường 11", "Phường 13", "Phường 25", "Phường 26"]
    },
    "Hà Nội": {
        "Quận Đống Đa": ["Phường Cát Linh", "Phường Hàng Bột", "Phường Khâm Thiên", "Phường Nam Đồng", "Phường Ô Chợ Dừa", "Phường Quốc Tử Giám"],
        "Quận Hoàn Kiếm": ["Phường Hàng Bạc", "Phường Hàng Bồ", "Phường Hàng Đào", "Phường Hàng Gai", "Phường Hàng Trống", "Phường Tràng Tiền"],
        "Quận Cầu Giấy": ["Phường Dịch Vọng", "Phường Dịch Vọng Hậu", "Phường Mai Dịch", "Phường Nghĩa Đô", "Phường Nghĩa Tân", "Phường Quan Hoa"]
    },
    "Đà Nẵng": {
        "Quận Hải Châu": ["Phường Bình Hiên", "Phường Bình Thuận", "Phường Hải Châu I", "Phường Hải Châu II", "Phường Nam Dương", "Phường Phước Ninh"],
        "Quận Thanh Khê": ["Phường An Khê", "Phường Chính Gián", "Phường Hòa Khê", "Phường Tam Thuận", "Phường Thanh Khê Đông", "Phường Tân Chính"]
    }
};

interface FormState {
    username: string; email: string; lastName: string; firstName: string;
    password: string; confirmPassword: string; phone: string;
    province: string; district: string; ward: string;
}

interface FormErrors {
    username: string; email: string; lastName: string; firstName: string;
    password: string; confirmPassword: string; phone: string;
}

type FormField = keyof FormState;
type ErrorField = keyof FormErrors;

function validateRegister(form: FormState): FormErrors {
    const e: FormErrors = { username: "", email: "", lastName: "", firstName: "", password: "", confirmPassword: "", phone: "" };

    if (!form.username.trim()) {
        e.username = "Vui lòng nhập tên người dùng.";
    } else if (form.username.trim().length < 3) {
        e.username = "Tên người dùng phải có ít nhất 3 ký tự.";
    } else if (/\s/.test(form.username)) {
        e.username = "Tên người dùng không được chứa khoảng trắng.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.email.trim()) {
        e.email = "Vui lòng nhập email.";
    } else if (!emailRegex.test(form.email.trim())) {
        e.email = "Email không hợp lệ (ví dụ: ten@gmail.com).";
    }

    if (!form.lastName.trim())  e.lastName  = "Vui lòng nhập họ.";
    if (!form.firstName.trim()) e.firstName = "Vui lòng nhập tên.";

    if (!form.password) {
        e.password = "Vui lòng nhập mật khẩu.";
    } else if (form.password.length < 8) {
        e.password = "Mật khẩu phải có ít nhất 8 ký tự.";
    } else if (form.password.length > 32) {
        e.password = "Mật khẩu không được vượt quá 32 ký tự.";
    } else if (!/[A-Z]/.test(form.password)) {
        e.password = "Mật khẩu phải có ít nhất 1 chữ hoa (A–Z).";
    } else if (!/[0-9]/.test(form.password)) {
        e.password = "Mật khẩu phải có ít nhất 1 chữ số (0–9).";
    }

    if (!form.confirmPassword) {
        e.confirmPassword = "Vui lòng nhập lại mật khẩu.";
    } else if (form.confirmPassword !== form.password) {
        e.confirmPassword = "Mật khẩu nhập lại không khớp.";
    }

    if (form.phone.trim()) {
        const phoneRegex = /^(0|\+84)[3-9][0-9]{8}$/;
        if (!phoneRegex.test(form.phone.trim())) {
            e.phone = "Số điện thoại không hợp lệ (ví dụ: 0912345678).";
        }
    }
    return e;
}

const hasErrors = (errors: FormErrors) => Object.values(errors).some((v) => v !== "");

const RegisterPage: React.FC = () => {
    const emptyForm: FormState = { username: "", email: "", lastName: "", firstName: "", password: "", confirmPassword: "", phone: "", province: "", district: "", ward: "" };
    const emptyErrors: FormErrors = { username: "", email: "", lastName: "", firstName: "", password: "", confirmPassword: "", phone: "" };

    const [form, setForm]               = useState<FormState>(emptyForm);
    const [fieldErrors, setFieldErrors] = useState<FormErrors>(emptyErrors);
    const [active, setActive]           = useState<Record<FormField, boolean>>(
        Object.fromEntries(Object.keys(emptyForm).map((k) => [k, false])) as Record<FormField, boolean>
    );
    const [bannerMsg, setBannerMsg]     = useState("");
    const [bannerType, setBannerType]   = useState<"error" | "success">("error");
    const [loading, setLoading]         = useState(false);
    const [touched, setTouched]         = useState<Set<ErrorField>>(new Set());

    // Khởi tạo hook chuyển trang
    const navigate = useNavigate();

    const touch = (field: ErrorField) => setTouched((prev) => new Set(prev).add(field));
    const touchAll = () => setTouched(new Set(Object.keys(emptyErrors) as ErrorField[]));
    const showError = (field: ErrorField): string => touched.has(field) ? fieldErrors[field] : "";

    const districts = form.province ? Object.keys(ADDRESS_DATA[form.province] || {}) : [];
    const wards     = form.province && form.district ? (ADDRESS_DATA[form.province]?.[form.district] || []) : [];

    const handleChange = (field: FormField) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        let newForm = { ...form, [field]: e.target.value };
        if (field === "province") newForm = { ...newForm, district: "", ward: "" };
        if (field === "district") newForm = { ...newForm, ward: "" };
        setForm(newForm);
        if (field in emptyErrors) {
            touch(field as ErrorField);
            setFieldErrors(validateRegister(newForm));
        }
    };

    const handleFocus = (field: FormField) => () => setActive((prev) => ({ ...prev, [field]: true }));
    const handleBlur = (field: FormField) => () => {
        setActive((prev) => ({ ...prev, [field]: false }));
        if (field in emptyErrors) {
            touch(field as ErrorField);
            setFieldErrors(validateRegister(form));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        touchAll();
        const errors = validateRegister(form);
        setFieldErrors(errors);
        if (hasErrors(errors)) return;

        setLoading(true);
        setBannerMsg("");
        try {
            // Sửa đường dẫn API trỏ thẳng tới Spring Boot
            const response = await fetch("http://localhost:8080/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username: form.username, email: form.email, lastName: form.lastName, firstName: form.firstName,
                    password: form.password, phone: form.phone || null, province: form.province || null,
                    district: form.district || null, ward: form.ward || null,
                }),
            });
            const data = await response.json();
            if (response.ok) {
                setBannerType("success");
                setBannerMsg("Đăng ký thành công! Đang chuyển hướng sang trang đăng nhập...");

                // Chờ 1.5s để user thấy thông báo rồi mới chuyển hướng về trang login
                setTimeout(() => {
                    navigate("/login");
                }, 1500);
            } else {
                setBannerType("error");
                setBannerMsg(data.message || "Đăng ký thất bại. Vui lòng thử lại.");
            }
        } catch {
            setBannerType("error");
            setBannerMsg("Không thể kết nối đến máy chủ. Vui lòng thử lại.");
        } finally {
            setLoading(false);
        }
    };

    const getInputClassName = (field: ErrorField) => {
        const isError = touched.has(field) && fieldErrors[field];
        return `register-input-group ${isError ? "error" : ""} ${active[field] ? "focused" : ""}`;
    };

    return (
        <div className="register-page-wrapper py-5">
            <main className="register-main">
                <div className="container register-container">
                    <div className="row align-items-start g-5">

                        {/* ── LEFT: Form Điền Thông Tin ── */}
                        <div className="col-12 col-md-6">
                            <h1 className="register-title">Đăng ký tài khoản</h1>
                            <p className="login-hint">
                                Bạn đã có tài khoản?{" "}
                                <Link to="/login" className="login-link">Đăng nhập tại đây.</Link>
                            </p>

                            {/* Banner thông báo hệ thống */}
                            <div
                                className={`register-alert-banner ${
                                    bannerType === "error" ? "register-alert-error" : "register-alert-success"
                                }`}
                                style={{ visibility: bannerMsg ? "visible" : "hidden" }}
                            >
                                {bannerType === "error" ? "⚠️" : "✅"}&nbsp;&nbsp;{bannerMsg}
                            </div>

                            <form onSubmit={handleSubmit} noValidate>

                                {/* ──────── THÔNG TIN TÀI KHOẢN ──────── */}
                                <div className="register-section-label">Thông tin tài khoản</div>

                                {/* Username */}
                                <div className="register-field-wrapper">
                                    <label className="register-label">Tên người dùng :</label>
                                    <div className={getInputClassName("username")}>
                                        <span className="register-input-icon">👤</span>
                                        <input type="text" placeholder="Nhập tên người dùng..."
                                               value={form.username} onChange={handleChange("username")}
                                               onFocus={handleFocus("username")} onBlur={handleBlur("username")}
                                               className="register-input-field" autoComplete="username" />
                                    </div>
                                    <div className="register-field-error">{showError("username")}</div>
                                </div>

                                {/* Email */}
                                <div className="register-field-wrapper">
                                    <label className="register-label">Email :</label>
                                    <div className={getInputClassName("email")}>
                                        <span className="register-input-icon">✉️</span>
                                        <input type="email" placeholder="ten@email.com"
                                               value={form.email} onChange={handleChange("email")}
                                               onFocus={handleFocus("email")} onBlur={handleBlur("email")}
                                               className="register-input-field" autoComplete="email" />
                                    </div>
                                    <div className="register-field-error">{showError("email")}</div>
                                </div>

                                {/* Họ và Tên trên 1 dòng */}
                                <div className="row g-3 mb-2">
                                    <div className="col-6 register-field-wrapper">
                                        <label className="register-label">Họ * :</label>
                                        <div className={getInputClassName("lastName")}>
                                            <span className="register-input-icon">👤</span>
                                            <input type="text" placeholder="Họ..."
                                                   value={form.lastName} onChange={handleChange("lastName")}
                                                   onFocus={handleFocus("lastName")} onBlur={handleBlur("lastName")}
                                                   className="register-input-field" autoComplete="family-name" />
                                        </div>
                                        <div className="register-field-error">{showError("lastName")}</div>
                                    </div>
                                    <div className="col-6 register-field-wrapper">
                                        <label className="register-label">Tên * :</label>
                                        <div className={getInputClassName("firstName")}>
                                            <span className="register-input-icon">👤</span>
                                            <input type="text" placeholder="Tên..."
                                                   value={form.firstName} onChange={handleChange("firstName")}
                                                   onFocus={handleFocus("firstName")} onBlur={handleBlur("firstName")}
                                                   className="register-input-field" autoComplete="given-name" />
                                        </div>
                                        <div className="register-field-error">{showError("firstName")}</div>
                                    </div>
                                </div>

                                {/* Mật khẩu */}
                                <div className="register-field-wrapper">
                                    <label className="register-label">Mật khẩu :</label>
                                    <div className={getInputClassName("password")}>
                                        <span className="register-input-icon">🔒</span>
                                        <input type="password" placeholder="Nhập mật khẩu..."
                                               value={form.password} onChange={handleChange("password")}
                                               onFocus={handleFocus("password")} onBlur={handleBlur("password")}
                                               className="register-input-field" autoComplete="new-password" />
                                    </div>
                                    <div className={showError("password") ? "register-field-error" : "register-password-hint"}>
                                        {showError("password") ? showError("password") : active.password ? "8–32 ký tự, ít nhất 1 chữ hoa và 1 chữ số" : ""}
                                    </div>
                                </div>

                                {/* Nhập lại mật khẩu */}
                                <div className="register-field-wrapper">
                                    <label className="register-label">Nhập lại mật khẩu :</label>
                                    <div className={getInputClassName("confirmPassword")}>
                                        <span className="register-input-icon">🔑</span>
                                        <input type="password" placeholder="Nhập lại mật khẩu..."
                                               value={form.confirmPassword} onChange={handleChange("confirmPassword")}
                                               onFocus={handleFocus("confirmPassword")} onBlur={handleBlur("confirmPassword")}
                                               className="register-input-field" autoComplete="new-password" />
                                    </div>
                                    <div className="register-field-error">{showError("confirmPassword")}</div>
                                </div>

                                {/* ──────── THÔNG TIN LIÊN HỆ ──────── */}
                                <div className="register-section-label">
                                    Thông tin liên hệ <span className="register-optional-tag">(không bắt buộc)</span>
                                </div>

                                {/* Số điện thoại */}
                                <div className="register-field-wrapper">
                                    <label className="register-label">Số điện thoại :</label>
                                    <div className={getInputClassName("phone")}>
                                        <span className="register-input-icon">📱</span>
                                        <input type="tel" placeholder="0912 345 678"
                                               value={form.phone} onChange={handleChange("phone")}
                                               onFocus={handleFocus("phone")} onBlur={handleBlur("phone")}
                                               className="register-input-field" autoComplete="tel" />
                                    </div>
                                    <div className="register-field-error">{showError("phone")}</div>
                                </div>

                                {/* ──────── ĐỊA CHỈ ──────── */}
                                <div className="register-section-label">
                                    Địa chỉ <span className="register-optional-tag">(không bắt buộc)</span>
                                </div>

                                {/* Tỉnh / Thành phố */}
                                <div className="register-field-wrapper mb-3">
                                    <label className="register-label">Tỉnh / Thành phố :</label>
                                    <div className={`register-input-group ${active.province ? "focused" : ""}`}>
                                        <span className="register-input-icon">📍</span>
                                        <select value={form.province} onChange={handleChange("province")}
                                                onFocus={handleFocus("province")} onBlur={handleBlur("province")}
                                                className="register-select-field">
                                            <option value="">-- Chọn Tỉnh/Thành phố --</option>
                                            {Object.keys(ADDRESS_DATA).map((p) => (
                                                <option key={p} value={p}>{p}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Quận / Huyện */}
                                <div className="register-field-wrapper mb-3">
                                    <label className={`register-label ${!form.province ? "register-label-disabled" : ""}`}>
                                        Quận / Huyện :
                                    </label>
                                    <div className={`register-input-group ${!form.province ? "disabled" : ""} ${active.district ? "focused" : ""}`}>
                                        <span className="register-input-icon">🏘️</span>
                                        <select value={form.district} onChange={handleChange("district")}
                                                onFocus={handleFocus("district")} onBlur={handleBlur("district")}
                                                disabled={!form.province} className="register-select-field">
                                            <option value="">-- Chọn Quận/Huyện --</option>
                                            {districts.map((d) => (
                                                <option key={d} value={d}>{d}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Phường / Xã */}
                                <div className="register-field-wrapper mb-4">
                                    <label className={`register-label ${!form.district ? "register-label-disabled" : ""}`}>
                                        Phường / Xã :
                                    </label>
                                    <div className={`register-input-group ${!form.district ? "disabled" : ""} ${active.ward ? "focused" : ""}`}>
                                        <span className="register-input-icon">🏠</span>
                                        <select value={form.ward} onChange={handleChange("ward")}
                                                onFocus={handleFocus("ward")} onBlur={handleBlur("ward")}
                                                disabled={!form.district} className="register-select-field">
                                            <option value="">-- Chọn Phường/Xã --</option>
                                            {wards.map((w) => (
                                                <option key={w} value={w}>{w}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Nút bấm Submit */}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="register-submit-btn"
                                    style={loading ? { opacity: 0.7, cursor: "not-allowed" } : {}}
                                >
                                    {loading ? "Đang đăng ký..." : "Đăng ký"}
                                </button>
                            </form>
                        </div>

                        {/* ── RIGHT: Ảnh Minh Họa (Sticky) ── */}
                        <div className="col-12 col-md-6 d-flex justify-content-center register-illustration-side">
                            <div className="register-illustration-box">
                                <img src={LoginImage} alt="PetShop Illustration" className="register-illustration-img" />
                            </div>
                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
};

export default RegisterPage;