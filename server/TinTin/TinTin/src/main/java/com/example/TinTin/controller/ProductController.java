package com.example.TinTin.controller;

import com.example.TinTin.domain.Product;
import com.example.TinTin.domain.response.product.ProductResponseDto;
import com.example.TinTin.service.ProductService;
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
public class ProductController {

    private final ProductService productService;
    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @PostMapping("/products")
    @ApiMessage("Create a new product")
    public ResponseEntity<ProductResponseDto> createProduct(@Valid @RequestBody Product product) {
        return ResponseEntity.status(HttpStatus.CREATED).body(this.productService.createProduct(product));
    }

    @GetMapping("/products/{id}")
    @ApiMessage("Get product by ID")
    public ResponseEntity<ProductResponseDto> getProductById(@PathVariable Long id) {
        return ResponseEntity.ok(this.productService.getProductById(id));
    }

    @PutMapping("/products")
    @ApiMessage("Update a product")
    public ResponseEntity<ProductResponseDto> updateProduct(@Valid @RequestBody Product product) {
        return ResponseEntity.ok(this.productService.updateProduct(product));
    }

    @DeleteMapping("/products/{id}")
    @ApiMessage("Delete a product by ID")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        this.productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/products")
    @ApiMessage("Get all products")
    public ResponseEntity<List<ProductResponseDto>> getAllProducts(@Filter Specification<Product> spec) {
        return ResponseEntity.ok(this.productService.getAllProducts(spec));
    }
}
