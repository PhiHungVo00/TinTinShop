package com.example.TinTin.domain.response.cart;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CartItemResponseDTO {
    private Long id;
    private Long productSizeId;
    private Integer quantity;
    private BigDecimal price;
    private List<Long> toppingIds;
}
