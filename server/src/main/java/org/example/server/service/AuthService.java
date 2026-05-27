package org.example.server.service;

import org.example.server.dto.AuthDtos.LoginRequest;
import org.example.server.dto.AuthDtos.RegisterRequest;
import org.example.server.entity.User;
import org.example.server.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    // Dùng BCrypt để băm mật khẩu cho an toàn
    private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public String register(RegisterRequest req) throws Exception {
        if (userRepository.existsByUsername(req.username)) {
            throw new Exception("Tên đăng nhập đã tồn tại.");
        }
        if (userRepository.existsByEmail(req.email)) {
            throw new Exception("Email đã được sử dụng.");
        }

        User user = new User();
        user.setUsername(req.username);
        user.setEmail(req.email);
        user.setPassword(passwordEncoder.encode(req.password)); // Mã hóa mật khẩu
        user.setPhone(req.phone);

        // Gộp Họ và Tên
        String fullName = (req.lastName != null ? req.lastName : "") + " " +
                (req.firstName != null ? req.firstName : "");
        user.setFullName(fullName.trim());

        // Gộp Địa chỉ: ward, district, province
        List<String> addressParts = new ArrayList<>();
        if (req.ward != null && !req.ward.isEmpty()) addressParts.add(req.ward);
        if (req.district != null && !req.district.isEmpty()) addressParts.add(req.district);
        if (req.province != null && !req.province.isEmpty()) addressParts.add(req.province);

        if (!addressParts.isEmpty()) {
            user.setAddress(String.join(", ", addressParts));
        }

        userRepository.save(user);
        return "Đăng ký thành công!";
    }

    public String login(LoginRequest req) throws Exception {
        Optional<User> userOpt = userRepository.findByUsername(req.username);

        if (userOpt.isEmpty()) {
            throw new Exception("Tên đăng nhập hoặc mật khẩu không đúng.");
        }

        User user = userOpt.get();
        // So sánh mật khẩu user nhập với mật khẩu đã mã hóa trong DB
        if (!passwordEncoder.matches(req.password, user.getPassword())) {
            throw new Exception("Tên đăng nhập hoặc mật khẩu không đúng.");
        }

        // Tạm thời trả về String
        return user.getUsername();
    }
}