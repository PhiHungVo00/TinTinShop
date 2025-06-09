package com.example.TinTin.util.mapper;

import com.example.TinTin.domain.Rating;
import com.example.TinTin.domain.response.rating.RatingResponseDTO;

public class RatingMapper {
    public static RatingResponseDTO toRatingResponseDTO(Rating rating) {
        if (rating == null) return null;
        RatingResponseDTO dto = new RatingResponseDTO();
        dto.setId(rating.getId());
        dto.setUserId(rating.getUser().getId());
        dto.setProduct(ProductMapper.toProductResponseDto(rating.getProduct()));
        dto.setScore(rating.getScore());
        dto.setComment(rating.getComment());
        dto.setCreatedAt(rating.getCreatedAt());
        dto.setUpdatedAt(rating.getUpdatedAt());
        dto.setCreatedBy(rating.getCreatedBy());
        dto.setUpdatedBy(rating.getUpdatedBy());
        return dto;
    }
}
