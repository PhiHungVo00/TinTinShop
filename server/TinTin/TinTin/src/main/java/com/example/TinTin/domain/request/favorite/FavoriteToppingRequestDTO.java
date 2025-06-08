package com.example.TinTin.domain.request.favorite;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class FavoriteToppingRequestDTO {
    @NotNull(message = "Topping ID cannot be null")
    private Long toppingId;

    @NotNull(message = "User ID cannot be null")
    private Long userId;
}
