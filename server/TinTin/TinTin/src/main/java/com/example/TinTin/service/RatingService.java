package com.example.TinTin.service;

import com.example.TinTin.domain.Product;
import com.example.TinTin.domain.Rating;
import com.example.TinTin.domain.User;
import com.example.TinTin.domain.request.rating.RatingRequestDTO;
import com.example.TinTin.domain.response.rating.RatingResponseDTO;
import com.example.TinTin.repository.ProductRepository;
import com.example.TinTin.repository.RatingRepository;
import com.example.TinTin.repository.UserRepository;
import com.example.TinTin.util.error.IdInvalidException;
import com.example.TinTin.util.mapper.RatingMapper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RatingService {

    private final RatingRepository ratingRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    public RatingService(RatingRepository ratingRepository, UserRepository userRepository, ProductRepository productRepository) {
        this.ratingRepository = ratingRepository;
        this.userRepository = userRepository;
        this.productRepository = productRepository;
    }

    public RatingResponseDTO createRating(RatingRequestDTO dto) {
        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new IdInvalidException("User not found with id: " + dto.getUserId()));
        Product product = productRepository.findById(dto.getProductId())
                .orElseThrow(() -> new IdInvalidException("Product not found with id: " + dto.getProductId()));
        Rating rating = new Rating();
        rating.setUser(user);
        rating.setProduct(product);
        rating.setScore(dto.getScore());
        rating.setComment(dto.getComment());
        return RatingMapper.toRatingResponseDTO(ratingRepository.save(rating));
    }

    public RatingResponseDTO getRatingById(Long id) {
        Rating rating = ratingRepository.findById(id)
                .orElseThrow(() -> new IdInvalidException("Rating not found with id: " + id));
        return RatingMapper.toRatingResponseDTO(rating);
    }

    public List<RatingResponseDTO> getRatingsByProduct(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new IdInvalidException("Product not found with id: " + productId));
        List<Rating> ratings = ratingRepository.findAllByProduct(product);
        return ratings.stream().map(RatingMapper::toRatingResponseDTO).toList();
    }

    public RatingResponseDTO updateRating(Long id, RatingRequestDTO dto) {
        Rating rating = ratingRepository.findById(id)
                .orElseThrow(() -> new IdInvalidException("Rating not found with id: " + id));
        rating.setScore(dto.getScore());
        rating.setComment(dto.getComment());
        return RatingMapper.toRatingResponseDTO(ratingRepository.save(rating));
    }

    public void deleteRating(Long id) {
        Rating rating = ratingRepository.findById(id)
                .orElseThrow(() -> new IdInvalidException("Rating not found with id: " + id));
        ratingRepository.delete(rating);
    }
}
