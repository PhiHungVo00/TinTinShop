package com.example.TinTin.controller;

import com.example.TinTin.domain.request.rating.RatingRequestDTO;
import com.example.TinTin.domain.response.rating.RatingResponseDTO;
import com.example.TinTin.service.RatingService;
import com.example.TinTin.util.annotation.ApiMessage;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
public class RatingController {

    private final RatingService ratingService;

    public RatingController(RatingService ratingService) {
        this.ratingService = ratingService;
    }

    @PostMapping("/ratings")
    @ApiMessage("Create rating")
    public ResponseEntity<RatingResponseDTO> createRating(@Valid @RequestBody RatingRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ratingService.createRating(dto));
    }

    @GetMapping("/ratings/{id}")
    @ApiMessage("Get rating by id")
    public ResponseEntity<RatingResponseDTO> getRatingById(@PathVariable Long id) {
        return ResponseEntity.ok(ratingService.getRatingById(id));
    }

    @GetMapping("/ratings/products/{productId}")
    @ApiMessage("Get ratings by product id")
    public ResponseEntity<List<RatingResponseDTO>> getRatingsByProduct(@PathVariable Long productId) {
        return ResponseEntity.ok(ratingService.getRatingsByProduct(productId));
    }

    @PutMapping("/ratings/{id}")
    @ApiMessage("Update rating")
    public ResponseEntity<RatingResponseDTO> updateRating(@PathVariable Long id, @Valid @RequestBody RatingRequestDTO dto) {
        return ResponseEntity.ok(ratingService.updateRating(id, dto));
    }

    @DeleteMapping("/ratings/{id}")
    @ApiMessage("Delete rating")
    public ResponseEntity<Void> deleteRating(@PathVariable Long id) {
        ratingService.deleteRating(id);
        return ResponseEntity.ok(null);
    }
}
