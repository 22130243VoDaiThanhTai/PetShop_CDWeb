package org.example.server.repository;

import org.example.server.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    // Lấy 4 sản phẩm đầu tiên để làm "Hàng Hot" trên trang chủ
    List<Product> findTop4ByOrderByIdDesc();
    // Lấy danh sách sản phẩm theo mã Danh mục
    List<Product> findByCategoryId(Integer categoryId);
    // Tìm kiếm sản phẩm theo tên (chứa từ khóa, không phân biệt hoa thường)
    List<Product> findByNameContainingIgnoreCase(String keyword);
}