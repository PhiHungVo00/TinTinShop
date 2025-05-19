package com.example.TinTin.repository;

import com.example.TinTin.domain.Permission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;

public interface PermissionRepository extends JpaRepository<Permission, Long>, JpaSpecificationExecutor<Permission> {
    boolean existsByApiPathAndMethodAndModule(String apiPath, String method, String module);
    boolean existsByApiPathAndMethodAndModuleAndIdNot(String apiPath, String method, String module, Long id);
    List<Permission> findAllByIdIn(List<Long> ids);
}
