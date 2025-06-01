package com.example.TinTin.util.mapper;

import com.example.TinTin.domain.Product;
import com.example.TinTin.domain.ProductSize;
import com.example.TinTin.domain.Size;
import com.example.TinTin.domain.request.product_size.ProductSizeRequestDTO;
import com.example.TinTin.domain.response.productSize.ProductSizeResponseDTO;

public class ProductSizeMapper {

    public static ProductSizeResponseDTO toResponseDTO(ProductSize productSize) {
        if (productSize == null) return null;

        return new ProductSizeResponseDTO(
                productSize.getId(),
                productSize.getProduct().getId(),
                productSize.getSize().getId(),
                productSize.getSize().getName(),
                productSize.getPrice(),
                productSize.getStockQuantity(),
                productSize.getStatus(),
                productSize.getCreatedAt(),
                productSize.getUpdatedAt()
        );
    }

    public static void updateEntityFromRequestDTO(ProductSizeRequestDTO dto, ProductSize entity, Product product, Size size) {
        entity.setProduct(product);
        entity.setSize(size);
        entity.setPrice(dto.getPrice());
        entity.setStockQuantity(dto.getStockQuantity());
        entity.setStatus(dto.getStatus());
    }
}
