package com.example.TinTin.repository;

import com.example.TinTin.domain.Size;
import com.example.TinTin.util.constrant.SizeEnum;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface SizeRepository extends JpaRepository<Size, Long>, JpaSpecificationExecutor<Size> {
    boolean existsByName(SizeEnum name);

}
