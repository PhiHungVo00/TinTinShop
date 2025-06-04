package com.example.TinTin.repository;

import com.example.TinTin.domain.Topping;
import com.example.TinTin.util.constrant.ToppingStatusEnum;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface ToppingRepository extends JpaRepository<Topping, Long>, JpaSpecificationExecutor<Topping> {

    Topping findByNameAndStatus(String name, ToppingStatusEnum status);
    boolean existsByNameAndStatus(String name, ToppingStatusEnum status);

}
