package com.example.TinTin.controller;

import com.example.TinTin.domain.response.order_detail.OrderDetailResponseDTO;
import com.example.TinTin.service.OrderDetailService;
import com.example.TinTin.util.annotation.ApiMessage;
import lombok.Getter;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
public class OrderDetailController {

    private final OrderDetailService orderDetailService;
    public OrderDetailController(OrderDetailService orderDetailService) {
        this.orderDetailService = orderDetailService;
    }

    @GetMapping("/orders/{id}/details")
    @ApiMessage("Get order details by order ID")
    public ResponseEntity<List<OrderDetailResponseDTO>> getOrderDetailsByOrderId(@PathVariable Long id) {
        List<OrderDetailResponseDTO> orderDetailResponseDTOs = this.orderDetailService.getOrderDetailsByOrderId(id);
        return ResponseEntity.ok(orderDetailResponseDTOs);
    }
}
