package org.example.server.controller;

import org.example.server.dto.AuthDtos.ApiResponse;
import org.example.server.dto.AuthDtos.LoginRequest;
import org.example.server.dto.AuthDtos.RegisterRequest;
import org.example.server.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*") // Mở CORS để React (chạy port 3000/5173) có thể call API không bị lỗi
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<ApiResponse> login(@RequestBody LoginRequest req) {
        try {
            String result = authService.login(req);
            return ResponseEntity.ok(new ApiResponse(result));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ApiResponse(e.getMessage()));
        }
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse> register(@RequestBody RegisterRequest req) {
        try {
            String result = authService.register(req);
            return ResponseEntity.ok(new ApiResponse(result));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ApiResponse(e.getMessage()));
        }
    }
    @PostMapping("/logout")
    public ResponseEntity<?> logoutUser(HttpServletRequest request) {
        // Lấy token từ header để xử lý (nếu cần)
        String authHeader = request.getHeader("Authorization");

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
        }

        // Trả về thông báo thành công cho Frontend
        Map<String, String> response = new HashMap<>();
        response.put("message", "Đăng xuất thành công!");

        return ResponseEntity.ok(response);
    }
}