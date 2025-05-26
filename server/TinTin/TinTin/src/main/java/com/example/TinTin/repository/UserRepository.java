package com.example.TinTin.repository;

import com.example.TinTin.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long>, JpaSpecificationExecutor<User> {

    boolean existsByEmail(String email);
    User findByEmail(String email);
    Optional<User> findById(Long id);
    User findByRefreshTokenAndEmail(String refreshToken, String email);
    boolean existsById(Long id);
}
