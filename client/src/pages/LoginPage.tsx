import React, { useState } from "react";
import LoginImage from "../assets/LoginImage.png";

// ============================================================
// LoginPage.tsx
// Đặt file này tại: client/src/pages/LoginPage.tsx
// Route: <Route path="/login" element={<LoginPage />} />
// ============================================================

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
        alignItems: "center",
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
    registerHint: {
        fontSize: "0.95rem",
        color: "#555",
        marginBottom: "20px",
    },
    registerLink: {
        color: "#2d8a4e",
        fontWeight: 600,
        textDecoration: "none",
    },
    // Banner thông báo — luôn chiếm 44px, dùng visibility để không shift layout
    alertBanner: {
        height: "44px",
        borderRadius: "8px",
        display: "flex",
        alignItems: "center",
        paddingLeft: "14px",
        fontSize: "0.88rem",
        fontWeight: 600,
        marginBottom: "16px",
        transition: "opacity 0.2s",
    },
    fieldWrapper: {
        marginBottom: "16px",
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
    loginBtn: {
        width: "100%",
        padding: "12px",
        backgroundColor: "#2d8a4e",
        color: "#fff",
        border: "none",
        borderRadius: "8px",
        fontSize: "1rem",
        fontWeight: 700,
        cursor: "pointer",
        marginTop: "4px",
        letterSpacing: "0.5px",
        transition: "background-color 0.2s",
    },
    illustrationSide: {
        flex: 1,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
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

const LoginPage: React.FC = () => {
    const [username, setUsername]             = useState("");
    const [password, setPassword]             = useState("");
    const [usernameActive, setUsernameActive] = useState(false);
    const [passwordActive, setPasswordActive] = useState(false);
    const [bannerMsg, setBannerMsg]           = useState("");
    const [bannerType, setBannerType]         = useState<"error" | "success">("error");
    const [loading, setLoading]               = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // ── AJAX: gọi API đăng nhập ──────────────────────────────
        setLoading(true);
        setBannerMsg("");
        try {
            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });
            const data = await response.json();

            if (response.ok) {
                setBannerType("success");
                setBannerMsg("Đăng nhập thành công! Đang chuyển hướng...");
                // TODO: lưu token, redirect
                // localStorage.setItem("token", data.token);
                // navigate("/");
            } else {
                setBannerType("error");
                setBannerMsg(data.message || "Tên đăng nhập hoặc mật khẩu không đúng.");
            }
        } catch {
            setBannerType("error");
            setBannerMsg("Không thể kết nối đến máy chủ. Vui lòng thử lại.");
        } finally {
            setLoading(false);
        }
    };

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
                        <h1 style={styles.title}>Đăng nhập tài khoản</h1>
                        <p style={styles.registerHint}>
                            Bạn chưa có tài khoản?{" "}
                            <a href="/register" style={styles.registerLink}>Đăng ký tại đây.</a>
                        </p>

                        {/* Banner — luôn chiếm 44px dù có hay không có thông báo */}
                        <div style={bannerStyle}>
                            {bannerType === "error" ? "⚠️" : "✅"}&nbsp;&nbsp;{bannerMsg}
                        </div>

                        <form onSubmit={handleSubmit} noValidate>

                            {/* Username */}
                            <div style={styles.fieldWrapper}>
                                <label style={styles.label}>Tên người dùng :</label>
                                <div style={{
                                    ...styles.inputGroup,
                                    borderColor: usernameActive ? "#2d8a4e" : "#d0d0d0",
                                    backgroundColor: usernameActive ? "#fff" : "#fafafa",
                                }}>
                                    <span style={styles.inputIcon}>👤</span>
                                    <input
                                        type="text"
                                        placeholder="Nhập tên người dùng..."
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        onFocus={() => setUsernameActive(true)}
                                        onBlur={() => setUsernameActive(false)}
                                        style={styles.input}
                                        autoComplete="username"
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div style={styles.fieldWrapper}>
                                <label style={styles.label}>Mật khẩu :</label>
                                <div style={{
                                    ...styles.inputGroup,
                                    borderColor: passwordActive ? "#2d8a4e" : "#d0d0d0",
                                    backgroundColor: passwordActive ? "#fff" : "#fafafa",
                                }}>
                                    <span style={styles.inputIcon}>🔒</span>
                                    <input
                                        type="password"
                                        placeholder="Nhập mật khẩu..."
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        onFocus={() => setPasswordActive(true)}
                                        onBlur={() => setPasswordActive(false)}
                                        style={styles.input}
                                        autoComplete="current-password"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                style={{
                                    ...styles.loginBtn,
                                    ...(loading ? { opacity: 0.7, cursor: "not-allowed" } : {}),
                                }}
                                onMouseEnter={(e) => {
                                    if (!loading) (e.target as HTMLButtonElement).style.backgroundColor = "#246b3e";
                                }}
                                onMouseLeave={(e) => {
                                    if (!loading) (e.target as HTMLButtonElement).style.backgroundColor = "#2d8a4e";
                                }}
                            >
                                {loading ? "Đang đăng nhập..." : "Đăng nhập"}
                            </button>

                        </form>
                    </div>

                    {/* ── RIGHT: Illustration ── */}
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

export default LoginPage;