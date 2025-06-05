package com.example.TinTin.domain.response.order_detail;

import java.math.BigDecimal;
import java.util.List;

public class OrderDetailResponseDTO {

    private Long id;
    private Long productSizeId;
    private Integer quantity;
    private BigDecimal price;
    private List<Long> toppingIds;

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getProductSizeId() { return productSizeId; }
    public void setProductSizeId(Long productSizeId) { this.productSizeId = productSizeId; }
    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }
    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }
    public List<Long> getToppingIds() { return toppingIds; }
    public void setToppingIds(List<Long> toppingIds) { this.toppingIds = toppingIds; }
}