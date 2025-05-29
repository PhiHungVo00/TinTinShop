package com.example.TinTin.repository;

import com.example.TinTin.domain.AddressUser;
import com.example.TinTin.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AddressUserRepository extends JpaRepository<AddressUser, Long>, JpaSpecificationExecutor<AddressUser> {



    List<AddressUser> findAllByUser(User user);
}

