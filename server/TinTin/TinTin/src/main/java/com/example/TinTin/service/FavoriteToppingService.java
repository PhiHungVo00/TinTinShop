package com.example.TinTin.service;

import com.example.TinTin.domain.FavoriteTopping;
import com.example.TinTin.domain.Topping;
import com.example.TinTin.domain.User;
import com.example.TinTin.domain.request.favorite.FavoriteToppingRequestDTO;
import com.example.TinTin.domain.response.favorite.FavoriteToppingResponseDTO;
import com.example.TinTin.repository.FavoriteToppingRepository;
import com.example.TinTin.repository.ToppingRepository;
import com.example.TinTin.repository.UserRepository;
import com.example.TinTin.util.constrant.ToppingStatusEnum;
import com.example.TinTin.util.error.IdInvalidException;
import com.example.TinTin.util.mapper.FavoriteToppingMapper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FavoriteToppingService {

    private final FavoriteToppingRepository favoriteToppingRepository;
    private final UserRepository userRepository;
    private final ToppingRepository toppingRepository;

    public FavoriteToppingService(FavoriteToppingRepository favoriteToppingRepository, UserRepository userRepository, ToppingRepository toppingRepository) {
        this.favoriteToppingRepository = favoriteToppingRepository;
        this.userRepository = userRepository;
        this.toppingRepository = toppingRepository;
    }

    public FavoriteToppingResponseDTO addFavoriteTopping(FavoriteToppingRequestDTO favoriteToppingRequestDTO){
        User user = userRepository.findById(favoriteToppingRequestDTO.getUserId()).orElseThrow(()-> new IdInvalidException("User not found with id: " + favoriteToppingRequestDTO.getUserId()));
        Topping topping = toppingRepository.findById(favoriteToppingRequestDTO.getToppingId()).orElseThrow(()-> new IdInvalidException("Topping not found with id: " + favoriteToppingRequestDTO.getToppingId()));
        if(!topping.getStatus().equals(ToppingStatusEnum.ACTIVE)){
            throw new IdInvalidException("Topping is not active with id: " + favoriteToppingRequestDTO.getToppingId());
        }
        if(this.favoriteToppingRepository.existsByUserAndTopping(user, topping)) {
            throw new IdInvalidException("Topping already exists in favorites for user with id: " + favoriteToppingRequestDTO.getUserId());
        }
        FavoriteTopping favoriteTopping = new FavoriteTopping();
        favoriteTopping.setUser(user);
        favoriteTopping.setTopping(topping);
        return FavoriteToppingMapper.toFavoriteToppingResponseDTO(this.favoriteToppingRepository.save(favoriteTopping));
    }

    public List<FavoriteToppingResponseDTO> getFavoriteToppings(Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new IdInvalidException("User not found with id: " + userId));
        List<FavoriteTopping> favoriteToppings = favoriteToppingRepository.findAllByUser(user);
        return favoriteToppings.stream().map(FavoriteToppingMapper::toFavoriteToppingResponseDTO).toList();
    }

    public void deleteFavoriteTopping(Long id) {
        if (id == null) {
            throw new IdInvalidException("Favorite topping ID cannot be null");
        }
        FavoriteTopping favoriteTopping = favoriteToppingRepository.findById(id)
                .orElseThrow(() -> new IdInvalidException("Favorite topping not found with ID: " + id));
        favoriteToppingRepository.delete(favoriteTopping);
    }


}
