import React from 'react';
import { Link } from 'react-router-dom';
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

export default function Footer() {
    return (
        <footer className="petshop-footer py-5 mt-5">
            <div className="container">
                <div className="row g-4">

                    {/* Cột 1: Thông tin liên hệ trực quan có kèm Icon */}
                    <div className="col-lg-4 col-md-6 text-start">
                        <div className="footer-info-item fs-5 py-1">
                            {React.createElement(FaMapMarkerAlt as any, { className: "text-dark" })}
                            <span><strong>Địa chỉ:</strong> Yên Lãng, Hà Nội</span>
                        </div>
                        <div className="footer-info-item fs-5 py-1">
                            {React.createElement(FaPhoneAlt as any, { className: "text-dark" })}
                            <span>
                                <strong>Số điện thoại:</strong>{' '}
                                <a href="tel:0822221982" className="text-dark text-decoration-none">0822221982</a>
                            </span>
                        </div>
                        <div className="footer-info-item fs-5 py-1">
                            {React.createElement(FaEnvelope as any, { className: "text-dark" })}
                            <span>
                                <strong>Email:</strong>{' '}
                                <a href="mailto:MixiShop@gmail.com" className="text-dark text-decoration-none">MixiShop@gmail.com</a>
                            </span>
                        </div>
                    </div>

                    {/* Cột 2: Các liên kết Chính sách */}
                    <div className="col-lg-4 col-md-6 text-center">
                        <h3 className="footer-title">CHÍNH SÁCH</h3>
                        <ul className="list-unstyled">
                            <li><Link to="/" className="footer-link fs-5 text-dark">Trang chủ</Link></li>
                            <li><Link to="/introduce" className="footer-link fs-5 text-dark">Giới thiệu</Link></li>
                            <li><Link to="/contact" className="footer-link fs-5 text-dark">Liên hệ</Link></li>
                            <li><Link to="/orders" className="footer-link fs-5 text-dark">Kiểm tra đơn hàng</Link></li>
                        </ul>
                    </div>

                    {/* Cột 3: Hỗ trợ khách hàng */}
                    <div className="col-lg-4 col-md-6 text-center">
                        <h3 className="footer-title">HỖ TRỢ KHÁCH HÀNG</h3>
                        <ul className="list-unstyled">
                            <li><Link to="/privacy" className="footer-link fs-5 text-dark">Chính sách bảo mật</Link></li>
                            <li><Link to="/terms" className="footer-link fs-5 text-dark">Điều khoản dịch vụ</Link></li>
                        </ul>
                    </div>

                </div>
            </div>
        </footer>
    );
}