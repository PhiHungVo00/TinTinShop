package com.example.TinTin.controller;

import com.example.TinTin.domain.request.favorite.FavoriteToppingRequestDTO;
import com.example.TinTin.domain.response.favorite.FavoriteToppingResponseDTO;
import com.example.TinTin.service.FavoriteToppingService;
import com.example.TinTin.util.annotation.ApiMessage;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
public class FavoriteToppingController {

    private final FavoriteToppingService favoriteToppingService;
    public FavoriteToppingController(FavoriteToppingService favoriteToppingService) {
        this.favoriteToppingService = favoriteToppingService;
    }

    @PostMapping("/favorite/toppings")
    @ApiMessage("Add favorite Topping")
    public ResponseEntity<FavoriteToppingResponseDTO> addFavoriteTopping(@Valid @RequestBody FavoriteToppingRequestDTO favoriteToppingRequestDTO) {

        return ResponseEntity.status(201).body(this.favoriteToppingService.addFavoriteTopping(favoriteToppingRequestDTO));
    }

    @GetMapping("/favorite/toppings/{id}")
    @ApiMessage("Get list favorite Toppings")
    public ResponseEntity<List<FavoriteToppingResponseDTO>> getFavoriteToppings(@PathVariable("id") Long id) {
        return ResponseEntity.ok(this.favoriteToppingService.getFavoriteToppings(id));
    }

    @DeleteMapping("/favorite/toppings/{id}")
    @ApiMessage("Delete favorite Topping")
    public ResponseEntity<Void> deleteFavoriteTopping(@PathVariable("id") Long id) {
        favoriteToppingService.deleteFavoriteTopping(id);
        return ResponseEntity.ok(null);
    }
}