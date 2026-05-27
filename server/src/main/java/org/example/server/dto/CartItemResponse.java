package org.example.server.dto;

import java.math.BigDecimal;

public class CartItemResponse {
    private Long id;          // Đây là CartItem ID
    private Long productId;   // Product ID để chuyển trang chi tiết
    private String name;
    private String image;
    private BigDecimal price;
    private Integer quantity;

    public CartItemResponse(Long id, Long productId, String name, String image, BigDecimal price, Integer quantity) {
        this.id = id;
        this.productId = productId;
        this.name = name;
        this.image = image;
        this.price = price;
        this.quantity = quantity;
    }

    // Các hàm Getter/Setter công khai
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getImage() { return image; }
    public void setImage(String image) { this.image = image; }
    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }
    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }
}