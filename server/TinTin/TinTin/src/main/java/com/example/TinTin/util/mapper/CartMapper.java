package com.example.TinTin.util.mapper;

import com.example.TinTin.domain.Cart;
import com.example.TinTin.domain.response.cart.CartResponseDTO;

import java.util.stream.Collectors;

public class CartMapper {
    public static CartResponseDTO toCartResponseDTO(Cart cart) {
        if (cart == null) return null;
        CartResponseDTO dto = new CartResponseDTO();
        dto.setId(cart.getId());
        dto.setUserId(cart.getUser().getId());
        dto.setCreatedAt(cart.getCreatedAt());
        dto.setUpdatedAt(cart.getUpdatedAt());
        dto.setItems(cart.getCartItems().stream()
                .map(CartItemMapper::toCartItemResponseDTO)
                .collect(Collectors.toList()));
        return dto;
    }
}
