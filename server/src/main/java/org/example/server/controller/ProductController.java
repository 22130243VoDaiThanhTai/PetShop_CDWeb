package org.example.server.controller;

import org.example.server.entity.Product;
import org.example.server.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "*")
public class ProductController {

    @Autowired
    private ProductRepository productRepository;

    // API lấy 4 sản phẩm nổi bật cho trang chủ (giữ nguyên)
    @GetMapping("/featured")
    public ResponseEntity<List<Product>> getFeaturedProducts() {
        return ResponseEntity.ok(productRepository.findTop4ByOrderByIdDesc());
    }

    // API lấy TẤT CẢ sản phẩm (Dùng cho ID = 4)
    @GetMapping
    public ResponseEntity<List<Product>> getAllProducts() {
        return ResponseEntity.ok(productRepository.findAll());
    }

    // API lấy sản phẩm theo Category ID (Dùng cho ID = 1, 2, 3)
    @GetMapping("/category/{categoryId}")
    public ResponseEntity<List<Product>> getProductsByCategory(@PathVariable Integer categoryId) {
        return ResponseEntity.ok(productRepository.findByCategoryId(categoryId));
    }
    // API lấy chi tiết 1 sản phẩm theo ID
    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        return productRepository.findById(id)
                .map(product -> ResponseEntity.ok(product))
                .orElse(ResponseEntity.notFound().build());
        // Nếu không tìm thấy ID sản phẩm, trả về lỗi 404 Not Found
    }
    // API tìm kiếm sản phẩm
    @GetMapping("/search")
    public ResponseEntity<List<Product>> searchProducts(@RequestParam("keyword") String keyword) {
        List<Product> results = productRepository.findByNameContainingIgnoreCase(keyword);
        return ResponseEntity.ok(results);
    }
}