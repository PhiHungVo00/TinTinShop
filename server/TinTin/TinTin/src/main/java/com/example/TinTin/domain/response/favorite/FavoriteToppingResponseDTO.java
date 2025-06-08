package com.example.TinTin.domain.response.favorite;

import com.example.TinTin.domain.Topping;
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
public class FavoriteToppingResponseDTO {

    private Long id;
    private Long userId;
    private Topping topping;
    private Instant createdAt;
    private Instant updatedAt;
    private String createdBy;
    private String updatedBy;
}
