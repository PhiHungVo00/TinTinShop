package com.example.TinTin.repository;

import com.example.TinTin.domain.Order;
import com.example.TinTin.domain.OrderDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderDetailRepository extends JpaRepository<OrderDetail, Long>, JpaSpecificationExecutor<OrderDetail> {

    List<OrderDetail> findAllByOrder(Order order);
}
