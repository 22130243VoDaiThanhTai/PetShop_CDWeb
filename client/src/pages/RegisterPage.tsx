import React, { useState } from "react";
import LoginImage from "../assets/LoginImage.png";

// ============================================================
// RegisterPage.tsx — validate đầy đủ + phone + address
// Đặt file này tại: client/src/pages/RegisterPage.tsx
// ============================================================

const ADDRESS_DATA: Record<string, Record<string, string[]>> = {
    "Hồ Chí Minh": {
        "Thành phố Thủ Đức": [
            "Phường Linh Đông", "Phường Linh Tây", "Phường Linh Chiểu",
            "Phường Linh Trung", "Phường Hiệp Bình Phước", "Phường Bình Thọ",
        ],
        "Quận 1": [
            "Phường Bến Nghé", "Phường Bến Thành", "Phường Cầu Kho",
            "Phường Cầu Ông Lãnh", "Phường Đa Kao", "Phường Nguyễn Thái Bình",
        ],
        "Quận 3": [
            "Phường 1", "Phường 2", "Phường 3", "Phường 4",
            "Phường 5", "Phường Võ Thị Sáu",
        ],
        "Quận Bình Thạnh": [
            "Phường 1", "Phường 2", "Phường 3", "Phường 6",
            "Phường 11", "Phường 13", "Phường 25", "Phường 26",
        ],
    },
    "Hà Nội": {
        "Quận Đống Đa": [
            "Phường Cát Linh", "Phường Hàng Bột", "Phường Khâm Thiên",
            "Phường Nam Đồng", "Phường Ô Chợ Dừa", "Phường Quốc Tử Giám",
        ],
        "Quận Hoàn Kiếm": [
            "Phường Hàng Bạc", "Phường Hàng Bồ", "Phường Hàng Đào",
            "Phường Hàng Gai", "Phường Hàng Trống", "Phường Tràng Tiền",
        ],
        "Quận Cầu Giấy": [
            "Phường Dịch Vọng", "Phường Dịch Vọng Hậu", "Phường Mai Dịch",
            "Phường Nghĩa Đô", "Phường Nghĩa Tân", "Phường Quan Hoa",
        ],
    },
    "Đà Nẵng": {
        "Quận Hải Châu": [
            "Phường Bình Hiên", "Phường Bình Thuận", "Phường Hải Châu I",
            "Phường Hải Châu II", "Phường Nam Dương", "Phường Phước Ninh",
        ],
        "Quận Thanh Khê": [
            "Phường An Khê", "Phường Chính Gián", "Phường Hòa Khê",
            "Phường Tam Thuận", "Phường Thanh Khê Đông", "Phường Tân Chính",
        ],
    },
};

// ── Styles ────────────────────────────────────────────────────
const styles: Record<string, React.CSSProperties> = {
    pageWrapper: {
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#ffffff",
        fontFamily: "'Segoe UI', sans-serif",
    },
    main: {
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "60px 20px",
    },
    container: {
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
        gap: "48px",
        maxWidth: "960px",
        width: "100%",
    },
    formSide: {
        flex: 1,
        maxWidth: "420px",
    },
    title: {
        fontSize: "2rem",
        fontWeight: 700,
        color: "#1a1a1a",
        marginBottom: "8px",
    },
    loginHint: {
        fontSize: "0.95rem",
        color: "#555",
        marginBottom: "20px",
    },
    loginLink: {
        color: "#2d8a4e",
        fontWeight: 600,
        textDecoration: "none",
    },
    alertBanner: {
        height: "44px",
        borderRadius: "8px",
        display: "flex",
        alignItems: "center",
        paddingLeft: "14px",
        fontSize: "0.88rem",
        fontWeight: 600,
        marginBottom: "12px",
        transition: "opacity 0.2s",
    },
    sectionLabel: {
        fontSize: "0.8rem",
        fontWeight: 700,
        color: "#2d8a4e",
        textTransform: "uppercase" as const,
        letterSpacing: "0.8px",
        marginTop: "12px",
        marginBottom: "8px",
        borderBottom: "1px solid #e8f5e9",
        paddingBottom: "4px",
    },
    optionalTag: {
        fontSize: "0.72rem",
        fontWeight: 400,
        color: "#999",
        textTransform: "none" as const,
        letterSpacing: 0,
        marginLeft: "6px",
    },
    row: {
        display: "flex",
        gap: "12px",
    },
    fieldWrapper: {
        flex: 1,
        marginBottom: "4px",
    },
    label: {
        display: "block",
        fontSize: "0.85rem",
        fontWeight: 600,
        color: "#444",
        marginBottom: "6px",
    },
    inputGroup: {
        display: "flex",
        alignItems: "center",
        border: "1.5px solid #d0d0d0",
        borderRadius: "8px",
        padding: "10px 14px",
        backgroundColor: "#fafafa",
        transition: "border-color 0.2s",
    },
    inputIcon: {
        marginRight: "10px",
        fontSize: "1.1rem",
        color: "#888",
        flexShrink: 0,
    },
    input: {
        border: "none",
        outline: "none",
        background: "transparent",
        flex: 1,
        fontSize: "0.95rem",
        color: "#1a1a1a",
        width: "100%",
    },
    select: {
        border: "none",
        outline: "none",
        background: "transparent",
        flex: 1,
        fontSize: "0.95rem",
        color: "#1a1a1a",
        width: "100%",
        cursor: "pointer",
        appearance: "none" as const,
    },
    selectDisabled: {
        color: "#aaa",
        cursor: "not-allowed",
    },
    fieldError: {
        height: "18px",
        fontSize: "0.78rem",
        color: "#e53e3e",
        paddingLeft: "4px",
        marginBottom: "4px",
        lineHeight: "18px",
    },
    // Gợi ý mật khẩu — hiện khi đang focus
    passwordHint: {
        height: "18px",
        fontSize: "0.75rem",
        color: "#888",
        paddingLeft: "4px",
        marginBottom: "4px",
        lineHeight: "18px",
    },
    registerBtn: {
        width: "100%",
        padding: "12px",
        backgroundColor: "#2d8a4e",
        color: "#fff",
        border: "none",
        borderRadius: "8px",
        fontSize: "1rem",
        fontWeight: 700,
        cursor: "pointer",
        marginTop: "8px",
        letterSpacing: "0.5px",
        transition: "background-color 0.2s",
    },
    illustrationSide: {
        flex: 1,
        position: "sticky" as const,
        top: "110px",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
    },
    illustrationBox: {
        width: "100%",
        maxWidth: "420px",
        borderRadius: "20px",
        overflow: "hidden",
        boxShadow: "0 8px 32px rgba(0,0,0,0.10)",
    },
    illustrationImg: {
        width: "100%",
        height: "auto",
        display: "block",
        objectFit: "cover",
    },
};

// ── Interfaces ────────────────────────────────────────────────
interface FormState {
    username: string;
    email: string;
    lastName: string;
    firstName: string;
    password: string;
    confirmPassword: string;
    phone: string;
    province: string;
    district: string;
    ward: string;
}

interface FormErrors {
    username: string;
    email: string;
    lastName: string;
    firstName: string;
    password: string;
    confirmPassword: string;
    phone: string;
}

type FormField = keyof FormState;
type ErrorField = keyof FormErrors;

// ── Validate ──────────────────────────────────────────────────
function validateRegister(form: FormState): FormErrors {
    const e: FormErrors = {
        username: "", email: "", lastName: "", firstName: "",
        password: "", confirmPassword: "", phone: "",
    };

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

const hasErrors = (errors: FormErrors) =>
    Object.values(errors).some((v) => v !== "");

// ── Component ─────────────────────────────────────────────────
const RegisterPage: React.FC = () => {
    const emptyForm: FormState = {
        username: "", email: "", lastName: "", firstName: "",
        password: "", confirmPassword: "", phone: "",
        province: "", district: "", ward: "",
    };

    const emptyErrors: FormErrors = {
        username: "", email: "", lastName: "", firstName: "",
        password: "", confirmPassword: "", phone: "",
    };

    const [form, setForm]               = useState<FormState>(emptyForm);
    const [fieldErrors, setFieldErrors] = useState<FormErrors>(emptyErrors);
    const [active, setActive]           = useState<Record<FormField, boolean>>(
        Object.fromEntries(Object.keys(emptyForm).map((k) => [k, false])) as Record<FormField, boolean>
    );
    const [bannerMsg, setBannerMsg]     = useState("");
    const [bannerType, setBannerType]   = useState<"error" | "success">("error");
    const [loading, setLoading]         = useState(false);
    const [touched, setTouched]         = useState<Set<ErrorField>>(new Set());

    const touch = (field: ErrorField) =>
        setTouched((prev) => new Set(prev).add(field));

    const touchAll = () =>
        setTouched(new Set(Object.keys(emptyErrors) as ErrorField[]));

    const showError = (field: ErrorField): string =>
        touched.has(field) ? fieldErrors[field] : "";

    const districts = form.province ? Object.keys(ADDRESS_DATA[form.province] || {}) : [];
    const wards     = form.province && form.district
        ? (ADDRESS_DATA[form.province]?.[form.district] || [])
        : [];

    // ── Handlers ──────────────────────────────────────────────
    const handleChange = (field: FormField) => (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        let newForm = { ...form, [field]: e.target.value };
        if (field === "province") newForm = { ...newForm, district: "", ward: "" };
        if (field === "district") newForm = { ...newForm, ward: "" };
        setForm(newForm);
        if (field in emptyErrors) {
            touch(field as ErrorField);
            setFieldErrors(validateRegister(newForm));
        }
    };

    const handleFocus = (field: FormField) => () =>
        setActive((prev) => ({ ...prev, [field]: true }));

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
            const response = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username:  form.username,
                    email:     form.email,
                    lastName:  form.lastName,
                    firstName: form.firstName,
                    password:  form.password,
                    phone:     form.phone     || null,
                    province:  form.province  || null,
                    district:  form.district  || null,
                    ward:      form.ward      || null,
                }),
            });
            const data = await response.json();
            if (response.ok) {
                setBannerType("success");
                setBannerMsg("Đăng ký thành công! Vui lòng đăng nhập.");
                // TODO: setTimeout(() => navigate("/login"), 2000);
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

    // ── Helpers ───────────────────────────────────────────────
    const inputBorderColor = (field: ErrorField | "province" | "district" | "ward") => {
        const isError = field in fieldErrors && touched.has(field as ErrorField) && (fieldErrors as any)[field];
        return isError ? "#e53e3e" : active[field as FormField] ? "#2d8a4e" : "#d0d0d0";
    };

    const inputStyle = (field: ErrorField): React.CSSProperties => ({
        ...styles.inputGroup,
        borderColor: inputBorderColor(field),
        backgroundColor: active[field as FormField] ? "#fff" : "#fafafa",
    });

    const selectStyle = (field: "province" | "district" | "ward", disabled = false): React.CSSProperties => ({
        ...styles.inputGroup,
        borderColor: active[field] ? "#2d8a4e" : "#d0d0d0",
        backgroundColor: disabled ? "#f0f0f0" : active[field] ? "#fff" : "#fafafa",
        cursor: disabled ? "not-allowed" : "pointer",
    });

    const bannerVisible = bannerMsg !== "";
    const bannerStyle: React.CSSProperties = {
        ...styles.alertBanner,
        visibility: bannerVisible ? "visible" : "hidden",
        backgroundColor: bannerType === "error" ? "#fff5f5" : "#f0fff4",
        border: `1.5px solid ${bannerType === "error" ? "#fc8181" : "#68d391"}`,
        color: bannerType === "error" ? "#c53030" : "#276749",
        height: "20px",
    };

    return (
        <div style={styles.pageWrapper}>
            <main style={styles.main}>
                <div style={styles.container}>

                    {/* ── LEFT: Form ── */}
                    <div style={styles.formSide}>
                        <h1 style={styles.title}>Đăng ký tài khoản</h1>
                        <p style={styles.loginHint}>
                            Bạn đã có tài khoản?{" "}
                            <a href="/login" style={styles.loginLink}>Đăng nhập tại đây.</a>
                        </p>

                        {/* Banner lỗi/thành công — luôn chiếm 44px */}
                        <div style={bannerStyle}>
                            {bannerType === "error" ? "⚠️" : "✅"}&nbsp;&nbsp;{bannerMsg}
                        </div>

                        <form onSubmit={handleSubmit} noValidate>

                            {/* ──────── THÔNG TIN TÀI KHOẢN ──────── */}
                            <div style={styles.sectionLabel}>Thông tin tài khoản</div>

                            {/* Tên người dùng */}
                            <div style={styles.fieldWrapper}>
                                <label style={styles.label}>Tên người dùng :</label>
                                <div style={inputStyle("username")}>
                                    <span style={styles.inputIcon}>👤</span>
                                    <input type="text" placeholder="Nhập tên người dùng..."
                                           value={form.username} onChange={handleChange("username")}
                                           onFocus={handleFocus("username")} onBlur={handleBlur("username")}
                                           style={styles.input} autoComplete="username" />
                                </div>
                                <div style={styles.fieldError}>{showError("username")}</div>
                            </div>

                            {/* Email */}
                            <div style={styles.fieldWrapper}>
                                <label style={styles.label}>Email :</label>
                                <div style={inputStyle("email")}>
                                    <span style={styles.inputIcon}>✉️</span>
                                    <input type="email" placeholder="ten@email.com"
                                           value={form.email} onChange={handleChange("email")}
                                           onFocus={handleFocus("email")} onBlur={handleBlur("email")}
                                           style={styles.input} autoComplete="email" />
                                </div>
                                <div style={styles.fieldError}>{showError("email")}</div>
                            </div>

                            {/* Họ + Tên */}
                            <div style={styles.row}>
                                <div style={styles.fieldWrapper}>
                                    <label style={styles.label}>Họ * :</label>
                                    <div style={inputStyle("lastName")}>
                                        <span style={styles.inputIcon}>👤</span>
                                        <input type="text" placeholder="Họ..."
                                               value={form.lastName} onChange={handleChange("lastName")}
                                               onFocus={handleFocus("lastName")} onBlur={handleBlur("lastName")}
                                               style={styles.input} autoComplete="family-name" />
                                    </div>
                                    <div style={styles.fieldError}>{showError("lastName")}</div>
                                </div>
                                <div style={styles.fieldWrapper}>
                                    <label style={styles.label}>Tên * :</label>
                                    <div style={inputStyle("firstName")}>
                                        <span style={styles.inputIcon}>👤</span>
                                        <input type="text" placeholder="Tên..."
                                               value={form.firstName} onChange={handleChange("firstName")}
                                               onFocus={handleFocus("firstName")} onBlur={handleBlur("firstName")}
                                               style={styles.input} autoComplete="given-name" />
                                    </div>
                                    <div style={styles.fieldError}>{showError("firstName")}</div>
                                </div>
                            </div>

                            {/* Mật khẩu */}
                            <div style={styles.fieldWrapper}>
                                <label style={styles.label}>Mật khẩu :</label>
                                <div style={inputStyle("password")}>
                                    <span style={styles.inputIcon}>🔒</span>
                                    <input type="password" placeholder="Nhập mật khẩu..."
                                           value={form.password} onChange={handleChange("password")}
                                           onFocus={handleFocus("password")} onBlur={handleBlur("password")}
                                           style={styles.input} autoComplete="new-password" />
                                </div>
                                {/* Lỗi mật khẩu realtime — gợi ý khi focus và chưa có lỗi */}
                                <div style={showError("password") ? styles.fieldError : styles.passwordHint}>
                                    {showError("password")
                                        ? showError("password")
                                        : active.password
                                            ? "8–32 ký tự, ít nhất 1 chữ hoa và 1 chữ số"
                                            : ""}
                                </div>
                            </div>

                            {/* Nhập lại mật khẩu */}
                            <div style={styles.fieldWrapper}>
                                <label style={styles.label}>Nhập lại mật khẩu :</label>
                                <div style={inputStyle("confirmPassword")}>
                                    <span style={styles.inputIcon}>🔑</span>
                                    <input type="password" placeholder="Nhập lại mật khẩu..."
                                           value={form.confirmPassword} onChange={handleChange("confirmPassword")}
                                           onFocus={handleFocus("confirmPassword")} onBlur={handleBlur("confirmPassword")}
                                           style={styles.input} autoComplete="new-password" />
                                </div>
                                <div style={styles.fieldError}>{showError("confirmPassword")}</div>
                            </div>

                            {/* ──────── THÔNG TIN LIÊN HỆ (optional) ──────── */}
                            <div style={styles.sectionLabel}>
                                Thông tin liên hệ
                                <span style={styles.optionalTag}>(không bắt buộc)</span>
                            </div>

                            {/* Số điện thoại */}
                            <div style={styles.fieldWrapper}>
                                <label style={styles.label}>Số điện thoại :</label>
                                <div style={inputStyle("phone")}>
                                    <span style={styles.inputIcon}>📱</span>
                                    <input type="tel" placeholder="0912 345 678"
                                           value={form.phone} onChange={handleChange("phone")}
                                           onFocus={handleFocus("phone")} onBlur={handleBlur("phone")}
                                           style={styles.input} autoComplete="tel" />
                                </div>
                                <div style={styles.fieldError}>{showError("phone")}</div>
                            </div>

                            {/* ──────── ĐỊA CHỈ (optional) ──────── */}
                            <div style={styles.sectionLabel}>
                                Địa chỉ
                                <span style={styles.optionalTag}>(không bắt buộc)</span>
                            </div>

                            {/* Tỉnh / Thành phố */}
                            <div style={styles.fieldWrapper}>
                                <label style={styles.label}>Tỉnh / Thành phố :</label>
                                <div style={selectStyle("province")}>
                                    <span style={styles.inputIcon}>📍</span>
                                    <select value={form.province} onChange={handleChange("province")}
                                            onFocus={handleFocus("province")} onBlur={handleBlur("province")}
                                            style={styles.select}>
                                        <option value="">-- Chọn Tỉnh/Thành phố --</option>
                                        {Object.keys(ADDRESS_DATA).map((p) => (
                                            <option key={p} value={p}>{p}</option>
                                        ))}
                                    </select>
                                </div>
                                <div style={styles.fieldError} />
                            </div>

                            {/* Quận / Huyện */}
                            <div style={styles.fieldWrapper}>
                                <label style={{ ...styles.label, color: !form.province ? "#aaa" : "#444" }}>
                                    Quận / Huyện :
                                </label>
                                <div style={selectStyle("district", !form.province)}>
                                    <span style={styles.inputIcon}>🏘️</span>
                                    <select value={form.district} onChange={handleChange("district")}
                                            onFocus={handleFocus("district")} onBlur={handleBlur("district")}
                                            disabled={!form.province}
                                            style={{ ...styles.select, ...(!form.province ? styles.selectDisabled : {}) }}>
                                        <option value="">-- Chọn Quận/Huyện --</option>
                                        {districts.map((d) => (
                                            <option key={d} value={d}>{d}</option>
                                        ))}
                                    </select>
                                </div>
                                <div style={styles.fieldError} />
                            </div>

                            {/* Phường / Xã */}
                            <div style={styles.fieldWrapper}>
                                <label style={{ ...styles.label, color: !form.district ? "#aaa" : "#444" }}>
                                    Phường / Xã :
                                </label>
                                <div style={selectStyle("ward", !form.district)}>
                                    <span style={styles.inputIcon}>🏠</span>
                                    <select value={form.ward} onChange={handleChange("ward")}
                                            onFocus={handleFocus("ward")} onBlur={handleBlur("ward")}
                                            disabled={!form.district}
                                            style={{ ...styles.select, ...(!form.district ? styles.selectDisabled : {}) }}>
                                        <option value="">-- Chọn Phường/Xã --</option>
                                        {wards.map((w) => (
                                            <option key={w} value={w}>{w}</option>
                                        ))}
                                    </select>
                                </div>
                                <div style={styles.fieldError} />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                style={{
                                    ...styles.registerBtn,
                                    ...(loading ? { opacity: 0.7, cursor: "not-allowed" } : {}),
                                }}
                                onMouseEnter={(e) => {
                                    if (!loading) (e.target as HTMLButtonElement).style.backgroundColor = "#246b3e";
                                }}
                                onMouseLeave={(e) => {
                                    if (!loading) (e.target as HTMLButtonElement).style.backgroundColor = "#2d8a4e";
                                }}
                            >
                                {loading ? "Đang đăng ký..." : "Đăng ký"}
                            </button>

                        </form>
                    </div>

                    {/* ── RIGHT: Illustration (sticky) ── */}
                    <div style={styles.illustrationSide}>
                        <div style={styles.illustrationBox}>
                            <img src={LoginImage} alt="PetShop" style={styles.illustrationImg} />
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
};

export default RegisterPage;