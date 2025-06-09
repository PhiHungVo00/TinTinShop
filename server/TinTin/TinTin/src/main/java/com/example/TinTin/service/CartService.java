package com.example.TinTin.service;

import com.example.TinTin.domain.*;
import com.example.TinTin.domain.request.cart.CartItemRequestDTO;
import com.example.TinTin.domain.request.cart.CartItemUpdateDTO;
import com.example.TinTin.domain.response.cart.CartItemResponseDTO;
import com.example.TinTin.domain.response.cart.CartResponseDTO;
import com.example.TinTin.repository.*;
import com.example.TinTin.util.error.IdInvalidException;
import com.example.TinTin.util.mapper.CartItemMapper;
import com.example.TinTin.util.mapper.CartMapper;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
public class CartService {
    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final UserRepository userRepository;
    private final ProductSizeRepository productSizeRepository;
    private final ToppingRepository toppingRepository;

    public CartService(CartRepository cartRepository,
                       CartItemRepository cartItemRepository,
                       UserRepository userRepository,
                       ProductSizeRepository productSizeRepository,
                       ToppingRepository toppingRepository) {
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.userRepository = userRepository;
        this.productSizeRepository = productSizeRepository;
        this.toppingRepository = toppingRepository;
    }

    private Cart getOrCreateCart(User user) {
        return cartRepository.findByUser(user)
                .orElseGet(() -> {
                    Cart cart = new Cart();
                    cart.setUser(user);
                    return cartRepository.save(cart);
                });
    }

    public CartResponseDTO getCartByUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IdInvalidException("User not found with id: " + userId));
        Cart cart = getOrCreateCart(user);
        cart.setCartItems(cartItemRepository.findAll().stream()
                .filter(item -> item.getCart().getId().equals(cart.getId()))
                .toList());
        return CartMapper.toCartResponseDTO(cart);
    }

    public CartItemResponseDTO addItem(CartItemRequestDTO dto) {
        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new IdInvalidException("User not found with id: " + dto.getUserId()));
        ProductSize productSize = productSizeRepository.findById(dto.getProductSizeId())
                .orElseThrow(() -> new IdInvalidException("Product size not found with id: " + dto.getProductSizeId()));
        if (!productSize.getProduct().getActive()) {
            throw new IdInvalidException("Product is not active with id: " + productSize.getProduct().getId());
        }
        if (productSize.getStockQuantity() < dto.getQuantity()) {
            throw new IdInvalidException("Insufficient stock. Available: " + productSize.getStockQuantity());
        }
        Cart cart = getOrCreateCart(user);
        BigDecimal price = productSize.getPrice().multiply(BigDecimal.valueOf(dto.getQuantity()));
        List<Topping> toppings = new ArrayList<>();
        if (dto.getToppingIds() != null) {
            for (Long toppingId : dto.getToppingIds()) {
                if (toppingId == null) continue;
                Topping topping = toppingRepository.findById(toppingId)
                        .orElseThrow(() -> new IdInvalidException("Topping not found with id: " + toppingId));
                toppings.add(topping);
                price = price.add(topping.getPrice().multiply(BigDecimal.valueOf(dto.getQuantity())));
            }
        }
        CartItem cartItem = new CartItem();
        cartItem.setCart(cart);
        cartItem.setProductSize(productSize);
        cartItem.setToppings(toppings);
        cartItem.setQuantity(dto.getQuantity());
        cartItem.setPrice(price);
        CartItem saved = cartItemRepository.save(cartItem);
        return CartItemMapper.toCartItemResponseDTO(saved);
    }

    public CartItemResponseDTO updateItem(CartItemUpdateDTO dto) {
        CartItem cartItem = cartItemRepository.findById(dto.getId())
                .orElseThrow(() -> new IdInvalidException("Cart item not found with id: " + dto.getId()));
        cartItem.setQuantity(dto.getQuantity());
        BigDecimal price = cartItem.getProductSize().getPrice().multiply(BigDecimal.valueOf(dto.getQuantity()));
        for (Topping topping : cartItem.getToppings()) {
            price = price.add(topping.getPrice().multiply(BigDecimal.valueOf(dto.getQuantity())));
        }
        cartItem.setPrice(price);
        CartItem saved = cartItemRepository.save(cartItem);
        return CartItemMapper.toCartItemResponseDTO(saved);
    }

    public void deleteItem(Long id) {
        CartItem cartItem = cartItemRepository.findById(id)
                .orElseThrow(() -> new IdInvalidException("Cart item not found with id: " + id));
        cartItemRepository.delete(cartItem);
    }

    public void clearCart(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IdInvalidException("User not found with id: " + userId));
        Cart cart = cartRepository.findByUser(user).orElse(null);
        if (cart == null) return;
        List<CartItem> items = cartItemRepository.findAll().stream()
                .filter(ci -> ci.getCart().getId().equals(cart.getId()))
                .toList();
        cartItemRepository.deleteAll(items);
    }
}
