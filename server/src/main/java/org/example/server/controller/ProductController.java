package org.example.server.controller;

import org.example.server.entity.Product;
import org.example.server.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "*") // Cho phép React gọi API
public class ProductController {

    @Autowired
    private ProductRepository productRepository;

    // API lấy 4 sản phẩm nổi bật cho trang chủ
    @GetMapping("/featured")
    public ResponseEntity<List<Product>> getFeaturedProducts() {
        List<Product> featured = productRepository.findTop4ByOrderByIdDesc();
        return ResponseEntity.ok(featured);
    }
}