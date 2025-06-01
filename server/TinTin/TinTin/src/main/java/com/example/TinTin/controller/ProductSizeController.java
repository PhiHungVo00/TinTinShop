package com.example.TinTin.controller;

import com.example.TinTin.domain.request.product_size.ProductSizeRequestDTO;
import com.example.TinTin.domain.response.productSize.ProductSizeResponseDTO;
import com.example.TinTin.service.ProductSizeService;
import com.example.TinTin.util.annotation.ApiMessage;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1")
public class ProductSizeController {

    private final ProductSizeService productSizeService;
    public ProductSizeController(ProductSizeService productSizeService) {
        this.productSizeService = productSizeService;
    }

    @PostMapping("/products/{id}/variants")
    @ApiMessage("Create a new product size variant")
    public ResponseEntity<ProductSizeResponseDTO> createProductSizeVariant(
            @PathVariable("id") Long productId,
            @Valid @RequestBody ProductSizeRequestDTO productSizeRequestDTO) {
        ProductSizeResponseDTO response = productSizeService.createProductSizeVariant(productId, productSizeRequestDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);

    }
}
