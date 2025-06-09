package com.example.TinTin.domain.request.rating;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class RatingRequestDTO {
    @NotNull
    private Long productId;
    @NotNull
    private Long userId;
    @NotNull
    private Integer score;
    private String comment;
}
