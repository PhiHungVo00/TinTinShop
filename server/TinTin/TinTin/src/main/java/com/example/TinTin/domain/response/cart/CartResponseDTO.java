package com.example.TinTin.domain.response.cart;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CartResponseDTO {
    private Long id;
    private Long userId;
    private Instant createdAt;
    private Instant updatedAt;
    private List<CartItemResponseDTO> items;
}
