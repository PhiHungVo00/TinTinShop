package com.example.TinTin.repository;
import com.example.TinTin.domain.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long>, JpaSpecificationExecutor<Category> {

    Category findByName(String name);
    Category findByNameAndActive(String name, boolean active);
    boolean existsByName(String name);
}
