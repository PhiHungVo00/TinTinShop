package com.example.TinTin.util.mapper;

import com.example.TinTin.domain.CartItem;
import com.example.TinTin.domain.response.cart.CartItemResponseDTO;

import java.util.List;

public class CartItemMapper {
    public static CartItemResponseDTO toCartItemResponseDTO(CartItem cartItem) {
        if (cartItem == null) return null;
        CartItemResponseDTO dto = new CartItemResponseDTO();
        dto.setId(cartItem.getId());
        dto.setProductSizeId(cartItem.getProductSize().getId());
        dto.setQuantity(cartItem.getQuantity());
        dto.setPrice(cartItem.getPrice());
        List<Long> toppingIds = cartItem.getToppings().stream()
                .map(t -> t.getId())
                .toList();
        dto.setToppingIds(toppingIds);
        return dto;
    }
}
