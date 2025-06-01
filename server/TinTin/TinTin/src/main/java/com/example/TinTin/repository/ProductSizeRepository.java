package com.example.TinTin.repository;

import com.example.TinTin.domain.Product;
import com.example.TinTin.domain.ProductSize;
import com.example.TinTin.domain.Size;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductSizeRepository extends JpaRepository<ProductSize, Long>, JpaSpecificationExecutor<ProductSize> {
    ProductSize findByProductAndSize(Product product, Size size);
    boolean existsByProductAndSize(Product product, Size size);
}
