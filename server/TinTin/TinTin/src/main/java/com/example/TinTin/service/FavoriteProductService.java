package com.example.TinTin.service;

import com.example.TinTin.domain.FavoriteProduct;
import com.example.TinTin.domain.Product;
import com.example.TinTin.domain.User;
import com.example.TinTin.domain.request.favorite.FavoriteProductRequestDTO;
import com.example.TinTin.domain.response.favorite.FavoriteProductResponseDTO;
import com.example.TinTin.repository.FavoriteProductRepository;
import com.example.TinTin.repository.ProductRepository;
import com.example.TinTin.repository.UserRepository;
import com.example.TinTin.util.error.IdInvalidException;
import com.example.TinTin.util.error.NotFoundException;
import com.example.TinTin.util.mapper.FavoriteProductMapper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FavoriteProductService {

    private final FavoriteProductRepository favoriteProductRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public FavoriteProductService(FavoriteProductRepository favoriteProductRepository, ProductRepository productRepository, UserRepository userRepository) {
        this.favoriteProductRepository = favoriteProductRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }

    public FavoriteProductResponseDTO addFavoriteProduct(FavoriteProductRequestDTO favoriteProductRequestDTO) {

        User user = userRepository.findById(favoriteProductRequestDTO.getUserId()).orElseThrow(()-> new IdInvalidException("User not found with id: " + favoriteProductRequestDTO.getUserId()));
        Product product = productRepository.findById(favoriteProductRequestDTO.getProductId()).orElseThrow(()-> new IdInvalidException("Product not found with id: " + favoriteProductRequestDTO.getProductId()));
        if(product.getActive() == false){
            throw new NotFoundException("Product is not active with id: " + favoriteProductRequestDTO.getProductId());
        }
        if (this.favoriteProductRepository.existsByUserAndProduct(user, product)) {
            throw new IdInvalidException("Product already exists in favorites for user with id: " + favoriteProductRequestDTO.getUserId());
        }
        FavoriteProduct favoriteProduct = new FavoriteProduct();
        favoriteProduct.setUser(user);
        favoriteProduct.setProduct(product);
        return FavoriteProductMapper.toFavoriteProductResponseDTO(this.favoriteProductRepository.save(favoriteProduct));
    }

    public List<FavoriteProductResponseDTO> getFavoriteProducts(Long userId){
        User user = userRepository.findById(userId).orElseThrow(() -> new IdInvalidException("User not found with id: " + userId));
        List<FavoriteProduct> favoriteProducts = favoriteProductRepository.findAllByUser(user);
        return favoriteProducts.stream().map(FavoriteProductMapper::toFavoriteProductResponseDTO).toList();
    }

    public void deleteFavoriteProduct(Long id) {
        if (id == null) {
            throw new IdInvalidException("Favorite product ID cannot be null");
        }
        FavoriteProduct favoriteProduct = favoriteProductRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Favorite product not found with ID: " + id));
        favoriteProductRepository.delete(favoriteProduct);

    }
}
