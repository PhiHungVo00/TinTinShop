package com.example.TinTin.repository;

import com.example.TinTin.domain.Product;
import com.example.TinTin.domain.Rating;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RatingRepository extends JpaRepository<Rating, Long> {
    List<Rating> findAllByProduct(Product product);

    @Query("SELECT AVG(r.score) FROM Rating r WHERE r.product.id = :productId")
    Double findAverageScoreByProductId(@Param("productId") Long productId);
}
