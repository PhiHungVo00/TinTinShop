package com.example.TinTin.util.mapper;

import com.example.TinTin.domain.FavoriteProduct;
import com.example.TinTin.domain.response.favorite.FavoriteProductResponseDTO;
import com.example.TinTin.domain.response.product.ProductResponseDto;

public class FavoriteProductMapper {

    public static FavoriteProductResponseDTO toFavoriteProductResponseDTO(FavoriteProduct favoriteProduct) {
        if (favoriteProduct == null) return null;

        FavoriteProductResponseDTO favoriteProductResponseDTO = new FavoriteProductResponseDTO();
        favoriteProductResponseDTO.setId(favoriteProduct.getId());
        favoriteProductResponseDTO.setUserId(favoriteProduct.getUser().getId());
        ProductResponseDto productResponseDto = ProductMapper.toProductResponseDto(favoriteProduct.getProduct());
        favoriteProductResponseDTO.setProduct(productResponseDto);
        favoriteProductResponseDTO.setCreatedAt(favoriteProduct.getCreatedAt());
        favoriteProductResponseDTO.setUpdatedAt(favoriteProduct.getUpdatedAt());
        favoriteProductResponseDTO.setCreatedBy(favoriteProduct.getCreatedBy());
        favoriteProductResponseDTO.setUpdatedBy(favoriteProduct.getUpdatedBy());
        return favoriteProductResponseDTO;

    }
}
