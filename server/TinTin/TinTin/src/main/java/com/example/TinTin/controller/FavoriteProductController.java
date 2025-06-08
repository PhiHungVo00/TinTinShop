package com.example.TinTin.controller;

import com.example.TinTin.domain.FavoriteProduct;
import com.example.TinTin.domain.request.favorite.FavoriteProductRequestDTO;
import com.example.TinTin.domain.response.favorite.FavoriteProductResponseDTO;
import com.example.TinTin.service.FavoriteProductService;
import com.example.TinTin.util.annotation.ApiMessage;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
public class FavoriteProductController {

    private final FavoriteProductService favoriteProductService;
    public FavoriteProductController(FavoriteProductService favoriteProductService) {
        this.favoriteProductService = favoriteProductService;
    }

    @PostMapping("/favorite/products")
    @ApiMessage("Add favorite product")
    public ResponseEntity<FavoriteProductResponseDTO> addFavoriteProduct(@Valid @RequestBody FavoriteProductRequestDTO favoriteProductRequestDTO) {

        return ResponseEntity.status(201).body(this.favoriteProductService.addFavoriteProduct(favoriteProductRequestDTO));
    }

    @GetMapping("/favorite/products/{id}")
    @ApiMessage("Get list favorite products")
    public ResponseEntity<List<FavoriteProductResponseDTO>> getFavoriteProducts(@PathVariable("id") Long id) {
        return ResponseEntity.ok(this.favoriteProductService.getFavoriteProducts(id));
    }

    @DeleteMapping("/favorite/products/{id}")
    @ApiMessage("Delete favorite product")
    public ResponseEntity<Void> deleteFavoriteProduct(@PathVariable("id") Long id) {
        favoriteProductService.deleteFavoriteProduct(id);
        return ResponseEntity.ok().body(null);
    }
}
