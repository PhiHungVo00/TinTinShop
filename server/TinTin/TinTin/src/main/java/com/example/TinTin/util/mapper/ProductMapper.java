package com.example.TinTin.util.mapper;

import com.example.TinTin.domain.Product;
import com.example.TinTin.domain.response.product.ProductResponseDto;

import java.time.Instant;

public class ProductMapper {

    public static ProductResponseDto toProductResponseDto(Product product) {
        if (product == null) {
            return null;
        }

        ProductResponseDto responseDto = new ProductResponseDto();
        responseDto.setId(product.getId());
        responseDto.setName(product.getName());
        responseDto.setDescription(product.getDescription());
        responseDto.setActive(product.getActive());
        responseDto.setImage(product.getImage());
        responseDto.setCreatedAt(product.getCreatedAt());
        responseDto.setUpdatedAt(product.getUpdatedAt());
        responseDto.setCreatedBy(product.getCreatedBy());
        responseDto.setUpdatedBy(product.getUpdatedBy());
        if (product.getCategory() != null) {
            ProductResponseDto.CategoryDto categoryDto = new ProductResponseDto.CategoryDto();
            categoryDto.setId(product.getCategory().getId());
            categoryDto.setName(product.getCategory().getName());
            categoryDto.setActive(product.getCategory().getActive());
            responseDto.setCategory(categoryDto);
        }

        return responseDto;
    }
}
