package com.example.TinTin.repository;

import com.example.TinTin.domain.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FavoriteToppingRepository extends JpaRepository<FavoriteTopping, Long>, JpaSpecificationExecutor<FavoriteTopping> {
    boolean existsByUserAndTopping(User user, Topping topping);
    List<FavoriteTopping> findAllByUser(User user);
}
