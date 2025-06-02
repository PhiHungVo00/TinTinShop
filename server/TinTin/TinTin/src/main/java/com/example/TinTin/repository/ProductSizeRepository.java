package com.example.TinTin.repository;

import com.example.TinTin.domain.Product;
import com.example.TinTin.domain.ProductSize;
import com.example.TinTin.domain.Size;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductSizeRepository extends JpaRepository<ProductSize, Long>, JpaSpecificationExecutor<ProductSize> {
    ProductSize findByProductAndSize(Product product, Size size);
    boolean existsByProductAndSize(Product product, Size size);
    List<ProductSize> findAllByProduct(Product product);
}
