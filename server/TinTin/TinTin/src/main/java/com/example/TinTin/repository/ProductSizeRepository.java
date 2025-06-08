package com.example.TinTin.repository;

import com.example.TinTin.domain.Product;
import com.example.TinTin.domain.ProductSize;
import com.example.TinTin.domain.Size;
import jakarta.persistence.LockModeType;
import jakarta.persistence.QueryHint;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductSizeRepository extends JpaRepository<ProductSize, Long>, JpaSpecificationExecutor<ProductSize> {
    ProductSize findByProductAndSize(Product product, Size size);
    boolean existsByProductAndSize(Product product, Size size);
    List<ProductSize> findAllByProduct(Product product);
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @QueryHints({@QueryHint(name = "javax.persistence.lock.timeout", value = "3000")})
    @Query("SELECT ps FROM ProductSize ps WHERE ps.id = :id")
    Optional<ProductSize> findByIdWithLock(@Param("id") Long id);
}
