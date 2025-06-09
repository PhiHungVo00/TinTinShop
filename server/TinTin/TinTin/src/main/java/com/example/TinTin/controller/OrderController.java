package com.example.TinTin.controller;

import com.example.TinTin.domain.Order;
import com.example.TinTin.domain.request.order.OrderRequestDTO;
import com.example.TinTin.domain.request.order.OrderUpdateDTO;
import com.example.TinTin.domain.response.order.OrderResponseDTO;
import com.example.TinTin.service.OrderService;
import com.example.TinTin.util.annotation.ApiMessage;
import com.turkraft.springfilter.boot.Filter;
import jakarta.validation.Valid;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
public class OrderController {

    private final OrderService orderService;
    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping("/orders")
    @ApiMessage("Create new order")
    public ResponseEntity<OrderResponseDTO> createOrder(@Valid @RequestBody OrderRequestDTO orderRequestDTO) {
        OrderResponseDTO orderResponseDTO = this.orderService.createOrder(orderRequestDTO);
        return ResponseEntity.status(201).body(orderResponseDTO);

    }

    @GetMapping("/orders/{id}")
    @ApiMessage("Get order by ID")
    public ResponseEntity<OrderResponseDTO> getOrderById(@PathVariable Long id) {
        OrderResponseDTO orderResponseDTO = this.orderService.getOrderById(id);
        return ResponseEntity.ok(orderResponseDTO);
    }

    @GetMapping("/orders")
    @ApiMessage("Get all orders")
    public ResponseEntity<List<OrderResponseDTO>> getAllOrders(@Filter Specification<Order> spec) {
        List<OrderResponseDTO> orderResponseDTOs = this.orderService.getAllOrders(spec);
        return ResponseEntity.ok(orderResponseDTOs);
    }

    @PutMapping("/orders")
    @ApiMessage("Update order")
    public ResponseEntity<OrderResponseDTO> updateOrder(@Valid @RequestBody OrderUpdateDTO orderUpdateDTO) {
        OrderResponseDTO orderResponseDTO = this.orderService.updateOrder(orderUpdateDTO);
        return ResponseEntity.ok(orderResponseDTO);
    }

    @DeleteMapping("/orders/{id}")
    @ApiMessage("Delete order by ID")
    public ResponseEntity<OrderResponseDTO> deleteOrder(@PathVariable Long id) {
        OrderResponseDTO orderResponseDTO = this.orderService.deleteOrder(id);
        return ResponseEntity.ok(orderResponseDTO);
    }


}
