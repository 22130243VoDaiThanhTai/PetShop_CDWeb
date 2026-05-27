package org.example.server.controller;

import org.example.server.dto.CartItemResponse;
import org.example.server.entity.Cart;
import org.example.server.entity.CartItem;
import org.example.server.repository.CartItemRepository;
import org.example.server.repository.CartRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = "*")
public class CartController {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private CartItemRepository cartItemRepository;
    @Autowired
    private org.example.server.repository.ProductRepository productRepository;
    @Autowired
    private org.example.server.repository.UserRepository userRepository;

    // 1. LẤY GIỎ HÀNG CỦA USER ĐANG ĐĂNG NHẬP
    @GetMapping
    public ResponseEntity<?> getCart(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(401).body("Chưa đăng nhập ní ơi!");
        }

        // Cắt bỏ chữ "Bearer " để lấy username (token tạm)
        String username = authHeader.substring(7);

        Cart cart = cartRepository.findByUserUsername(username)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy giỏ hàng của user"));

        List<CartItemResponse> response = cart.getItems().stream().map(item -> new CartItemResponse(
                item.getId(),
                item.getProduct().getId(),
                item.getProduct().getName(),
                item.getProduct().getImageUrl(),
                item.getProduct().getPrice(),
                item.getQuantity()
        )).collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

    // 2. CẬP NHẬT SỐ LƯỢNG MỘT ITEM TRONG GIỎ HÀNG
    @PutMapping("/items/{itemId}")
    public ResponseEntity<?> updateQuantity(
            @PathVariable Long itemId,
            @RequestBody Map<String, Integer> body,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(401).build();
        }

        CartItem item = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy vật phẩm này"));

        int delta = body.get("delta"); // Nhận giá trị +1 hoặc -1 từ Frontend gửi lên
        int newQty = Math.max(1, item.getQuantity() + delta);

        // Kiểm tra số lượng tồn kho của sản phẩm
        if (item.getProduct().getStockQuantity() < newQty && delta > 0) {
            return ResponseEntity.badRequest().body("Số lượng vượt quá tồn kho hàng của shop!");
        }

        item.setQuantity(newQty);
        cartItemRepository.save(item);
        return ResponseEntity.ok().build();
    }

    // 3. XÓA 1 ITEM KHỎI GIỎ HÀNG
    @DeleteMapping("/items/{itemId}")
    public ResponseEntity<?> removeItem(
            @PathVariable Long itemId,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(401).build();
        }

        cartItemRepository.deleteById(itemId);
        return ResponseEntity.ok().build();
    }

    // 4. XÓA NHIỀU ITEM ĐƯỢC CHỌN (BẤM XÓA TẤT CẢ PHẦN ĐÃ CHỌN)
    @PostMapping("/items/remove-multiple")
    public ResponseEntity<?> removeMultipleItems(
            @RequestBody List<Long> itemIds,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(401).build();
        }

        if (itemIds != null && !itemIds.isEmpty()) {
            cartItemRepository.deleteAllById(itemIds);
        }
        return ResponseEntity.ok().build();
    }
    // 5. THÊM SẢN PHẨM VÀO GIỎ HÀNG
    @PostMapping("/items")
    public ResponseEntity<?> addToCart(
            @RequestBody Map<String, Integer> body,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(401).body("Vui lòng đăng nhập để thêm vào giỏ hàng!");
        }

        String username = authHeader.substring(7);

        // Lấy giỏ hàng (nếu chưa có thì tự tạo mới như mình vừa làm)
        Cart cart = cartRepository.findByUserUsername(username).orElseGet(() -> {
            org.example.server.entity.User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy user trong hệ thống"));
            Cart newCart = new Cart();
            newCart.setUser(user);
            return cartRepository.save(newCart);
        });

        // Lấy thông tin từ Frontend gửi lên
        Long productId = Long.valueOf(body.get("productId"));
        Integer quantity = body.getOrDefault("quantity", 1);

        org.example.server.entity.Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm"));

        // Kiểm tra xem sản phẩm đã có trong giỏ chưa
        CartItem existingItem = cart.getItems().stream()
                .filter(item -> item.getProduct().getId().equals(productId))
                .findFirst()
                .orElse(null);

        if (existingItem != null) {
            // Có rồi thì cộng dồn số lượng
            int newQty = existingItem.getQuantity() + quantity;
            if (newQty > product.getStockQuantity()) {
                return ResponseEntity.badRequest().body("Số lượng vượt quá tồn kho hàng của shop!");
            }
            existingItem.setQuantity(newQty);
            cartItemRepository.save(existingItem);
        } else {
            // Chưa có thì tạo mới
            if (quantity > product.getStockQuantity()) {
                return ResponseEntity.badRequest().body("Số lượng vượt quá tồn kho hàng của shop!");
            }
            CartItem newItem = new CartItem();
            newItem.setCart(cart);
            newItem.setProduct(product);
            newItem.setQuantity(quantity);
            cartItemRepository.save(newItem);
        }

        return ResponseEntity.ok("Đã thêm vào giỏ hàng!");
    }
}