package com.example.TinTin.controller;

import com.example.TinTin.domain.request.cart.CartItemRequestDTO;
import com.example.TinTin.domain.request.cart.CartItemUpdateDTO;
import com.example.TinTin.domain.response.cart.CartItemResponseDTO;
import com.example.TinTin.domain.response.cart.CartResponseDTO;
import com.example.TinTin.service.CartService;
import com.example.TinTin.util.annotation.ApiMessage;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @GetMapping("/carts/users/{id}")
    @ApiMessage("Get cart by user")
    public ResponseEntity<CartResponseDTO> getCartByUser(@PathVariable("id") Long id) {
        return ResponseEntity.ok(cartService.getCartByUser(id));
    }

    @PostMapping("/carts/items")
    @ApiMessage("Add item to cart")
    public ResponseEntity<CartItemResponseDTO> addItem(@Valid @RequestBody CartItemRequestDTO dto) {
        CartItemResponseDTO res = cartService.addItem(dto);
        return ResponseEntity.status(201).body(res);
    }

    @PutMapping("/carts/items")
    @ApiMessage("Update cart item")
    public ResponseEntity<CartItemResponseDTO> updateItem(@Valid @RequestBody CartItemUpdateDTO dto) {
        CartItemResponseDTO res = cartService.updateItem(dto);
        return ResponseEntity.ok(res);
    }

    @DeleteMapping("/carts/items/{id}")
    @ApiMessage("Delete cart item")
    public ResponseEntity<Void> deleteItem(@PathVariable("id") Long id) {
        cartService.deleteItem(id);
        return ResponseEntity.ok().body(null);
    }

    @DeleteMapping("/carts/users/{id}")
    @ApiMessage("Clear cart of user")
    public ResponseEntity<Void> clearCart(@PathVariable("id") Long id) {
        cartService.clearCart(id);
        return ResponseEntity.ok().body(null);
    }
}
