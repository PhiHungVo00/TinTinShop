package com.example.TinTin.controller;

import com.example.TinTin.domain.ProductSize;
import com.example.TinTin.domain.request.product_size.ProductSizeRequestDTO;
import com.example.TinTin.domain.response.productSize.ProductSizeResponseDTO;
import com.example.TinTin.service.ProductSizeService;
import com.example.TinTin.util.annotation.ApiMessage;
import com.turkraft.springfilter.boot.Filter;
import jakarta.validation.Valid;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

    @GetMapping("/products/{id}/variants")
    @ApiMessage("Get product size variants by product ID")
    public ResponseEntity<List<ProductSizeResponseDTO>> getProductSizeVariantById(@PathVariable("id") Long id) {

        return ResponseEntity.ok(this.productSizeService.getProductSizeVariantById(id));
    }

    @PutMapping("/variants/{id}")
    @ApiMessage("Update a product size variant")
    public ResponseEntity<ProductSizeResponseDTO> updateProductSizeVariant(
            @PathVariable("id") Long id,
            @Valid @RequestBody ProductSizeRequestDTO productSizeRequestDTO) {
        ProductSizeResponseDTO response = productSizeService.updateProductSizeVariant(id, productSizeRequestDTO);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/variants/{id}")
    @ApiMessage("Delete a product size variant by ID")
    public ResponseEntity<Void> deleteProductSizeVariant(@PathVariable("id") Long id) {
        productSizeService.deleteProductSizeVariant(id);
        return ResponseEntity.ok().body(null);
    }

    @GetMapping("/variants/{id}")
    @ApiMessage("Get product size variant by ID")
    public ResponseEntity<ProductSizeResponseDTO> getProductSizeVariant(@PathVariable("id") Long id) {
        ProductSizeResponseDTO response = productSizeService.getProductSizeVariant(id);
        return ResponseEntity.ok(response);
    }



}
