package com.example.TinTin.domain.request.cart;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CartItemRequestDTO {
    @NotNull(message = "User ID cannot be null")
    private Long userId;

    @NotNull(message = "Product size ID cannot be null")
    private Long productSizeId;

    @NotNull(message = "Quantity cannot be null")
    @Positive(message = "Quantity must be positive")
    private Integer quantity;

    private List<Long> toppingIds;
}
