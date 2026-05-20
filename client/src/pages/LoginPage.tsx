import React, { useState } from "react";
import { Link } from "react-router-dom";
import LoginImage from "../assets/LoginImage.png";

// Import file CSS riêng biệt để dễ bảo trì
import "../styles/LoginPage.css";

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

    return (
        <div className="login-page-wrapper py-5">
            <div className="container login-container">
                <div className="row align-items-center g-5">

                    {/* ── LEFT: Form Đăng Nhập ── */}
                    <div className="col-12 col-md-6">
                        <h1 className="login-title">Đăng nhập tài khoản</h1>
                        <p className="text-muted mb-4">
                            Bạn chưa có tài khoản?{" "}
                            <Link to="/register" className="register-link">Đăng ký tại đây.</Link>
                        </p>

                        {/* Banner thông báo lỗi / thành công */}
                        <div
                            className={`login-alert-banner ${
                                bannerType === "error" ? "login-alert-error" : "login-alert-success"
                            }`}
                            style={{ visibility: bannerMsg ? "visible" : "hidden" }}
                        >
                            {bannerType === "error" ? "⚠️" : "✅"}&nbsp;&nbsp;{bannerMsg}
                        </div>

                        <form onSubmit={handleSubmit} noValidate>
                            {/* Ô nhập Tên người dùng */}
                            <div className="login-field-wrapper">
                                <label className="login-label">Tên người dùng :</label>
                                <div className={`login-input-group ${usernameActive ? "focused" : ""}`}>
                                    <span className="login-input-icon">👤</span>
                                    <input
                                        type="text"
                                        placeholder="Nhập tên người dùng..."
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        onFocus={() => setUsernameActive(true)}
                                        onBlur={() => setUsernameActive(false)}
                                        className="login-input-field"
                                        autoComplete="username"
                                    />
                                </div>
                            </div>

                            {/* Ô nhập Mật khẩu */}
                            <div className="login-field-wrapper">
                                <label className="login-label">Mật khẩu :</label>
                                <div className={`login-input-group ${passwordActive ? "focused" : ""}`}>
                                    <span className="login-input-icon">🔒</span>
                                    <input
                                        type="password"
                                        placeholder="Nhập mật khẩu..."
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        onFocus={() => setPasswordActive(true)}
                                        onBlur={() => setPasswordActive(false)}
                                        className="login-input-field"
                                        autoComplete="current-password"
                                    />
                                </div>
                            </div>

                            {/* Nút bấm gửi form */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="login-submit-btn"
                                style={loading ? { opacity: 0.7, cursor: "not-allowed" } : {}}
                            >
                                {loading ? "Đang đăng nhập..." : "Đăng nhập"}
                            </button>
                        </form>
                    </div>

                    {/* ── RIGHT: Ảnh Minh Họa ── */}
                    <div className="col-12 col-md-6 d-flex justify-content-center">
                        <div className="login-illustration-box">
                            <img src={LoginImage} alt="PetShop Illustration" className="login-illustration-img" />
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default LoginPage;