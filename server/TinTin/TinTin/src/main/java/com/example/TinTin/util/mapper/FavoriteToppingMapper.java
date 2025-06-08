package com.example.TinTin.util.mapper;

import com.example.TinTin.domain.FavoriteTopping;
import com.example.TinTin.domain.response.favorite.FavoriteToppingResponseDTO;

public class FavoriteToppingMapper {

    public static FavoriteToppingResponseDTO toFavoriteToppingResponseDTO(FavoriteTopping favoriteTopping) {
        if (favoriteTopping == null) return null;

        FavoriteToppingResponseDTO responseDTO = new FavoriteToppingResponseDTO();
        responseDTO.setId(favoriteTopping.getId());
        responseDTO.setUserId(favoriteTopping.getUser().getId());
        responseDTO.setTopping(favoriteTopping.getTopping());
        responseDTO.setCreatedAt(favoriteTopping.getCreatedAt());
        responseDTO.setUpdatedAt(favoriteTopping.getUpdatedAt());
        responseDTO.setCreatedBy(favoriteTopping.getCreatedBy());
        responseDTO.setUpdatedBy(favoriteTopping.getUpdatedBy());

        return responseDTO;
    }
}
