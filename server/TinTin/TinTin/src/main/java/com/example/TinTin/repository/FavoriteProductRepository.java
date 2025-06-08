package com.example.TinTin.repository;

import com.example.TinTin.domain.FavoriteProduct;
import com.example.TinTin.domain.Order;
import com.example.TinTin.domain.Product;
import com.example.TinTin.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FavoriteProductRepository extends JpaRepository<FavoriteProduct, Long>, JpaSpecificationExecutor<FavoriteProduct> {
    boolean existsByUserAndProduct(User user, Product product);
    List<FavoriteProduct> findAllByUser(User user);
}
