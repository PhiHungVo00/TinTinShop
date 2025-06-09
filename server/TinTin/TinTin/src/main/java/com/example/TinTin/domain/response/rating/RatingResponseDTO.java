package com.example.TinTin.domain.response.rating;

import com.example.TinTin.domain.response.product.ProductResponseDto;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class RatingResponseDTO {
    private Long id;
    private Long userId;
    private ProductResponseDto product;
    private Integer score;
    private String comment;
    private Instant createdAt;
    private Instant updatedAt;
    private String createdBy;
    private String updatedBy;
}
