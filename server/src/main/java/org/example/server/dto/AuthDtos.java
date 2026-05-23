package org.example.server.dto;

public class AuthDtos {

    // DTO cho lúc Đăng nhập
    public static class LoginRequest {
        public String username;
        public String password;
    }

    // DTO cho lúc Đăng ký
    public static class RegisterRequest {
        public String username;
        public String email;
        public String lastName;
        public String firstName;
        public String password;
        public String phone;
        public String province;
        public String district;
        public String ward;
    }

    // DTO trả về chung
    public static class ApiResponse {
        public String message;

        public ApiResponse(String message) {
            this.message = message;
        }
    }
}