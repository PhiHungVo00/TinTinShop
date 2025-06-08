package com.example.TinTin.service;

import com.example.TinTin.domain.*;
import com.example.TinTin.domain.request.order.OrderRequestDTO;
import com.example.TinTin.domain.request.order.OrderUpdateDTO;
import com.example.TinTin.domain.response.order.OrderResponseDTO;
import com.example.TinTin.repository.AddressUserRepository;
import com.example.TinTin.repository.CouponRepository;
import com.example.TinTin.repository.OrderRepository;
import com.example.TinTin.repository.UserRepository;
import com.example.TinTin.util.constrant.DiscountTypeEnum;
import com.example.TinTin.util.constrant.OrderStatusEnum;
import com.example.TinTin.util.error.IdInvalidException;
import com.example.TinTin.util.mapper.OrderMapper;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
public class OrderService {
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final CouponRepository couponRepository;
    private final OrderDetailService orderDetailService;
    private final AddressUserRepository addressUserRepository;

    public OrderService(OrderRepository orderRepository, UserRepository userRepository,
                        CouponRepository couponRepository,
                        OrderDetailService orderDetailService,
                        AddressUserRepository addressUserRepository) {
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
        this.couponRepository = couponRepository;
        this.orderDetailService = orderDetailService;
        this.addressUserRepository = addressUserRepository;
    }

    public BigDecimal calculateFinalPrice(Coupon coupon, BigDecimal totalPrice) {
        if (coupon == null || coupon.getId() == null) {
            return totalPrice;
        }

        if (coupon.getDiscountType() == DiscountTypeEnum.AMOUNT) {
            BigDecimal discount = coupon.getDiscountValue();
            return totalPrice.subtract(discount).max(BigDecimal.ZERO);
        } else if (coupon.getDiscountType() == DiscountTypeEnum.PERCENT) {
            BigDecimal discount = totalPrice.multiply(
                    coupon.getDiscountValue().divide(BigDecimal.valueOf(100))
            );

            if (coupon.getMaxDiscount() != null &&
                    discount.compareTo(coupon.getMaxDiscount()) > 0) {
                discount = coupon.getMaxDiscount();
            }

            return totalPrice.subtract(discount);
        }

        throw new IdInvalidException("Invalid discount type");
    }

    public OrderResponseDTO createOrder(OrderRequestDTO orderRequestDTO) {
        User user = userRepository.findById(orderRequestDTO.getUserId())
                .orElseThrow(() -> new IdInvalidException("User not found with id: " + orderRequestDTO.getUserId()));
        Coupon coupon = new Coupon();
        if(orderRequestDTO.getCouponId() != null){
             coupon = couponRepository.findById(orderRequestDTO.getCouponId())
                    .orElseThrow(() -> new IdInvalidException("Coupon not found with id: " + orderRequestDTO.getCouponId()));
            if (!coupon.getIsActive() || coupon.getEndDate().isBefore(Instant.now())) {
                throw new IdInvalidException("Coupon is not active with id: " + orderRequestDTO.getCouponId());
            }

        }
        AddressUser addressUser = this.addressUserRepository.findById(orderRequestDTO.getAddressId()).orElseThrow(()->{
            return new IdInvalidException("Address not found with id: " + orderRequestDTO.getAddressId());
        });
        List<OrderDetail> orderDetails = Optional.ofNullable(orderRequestDTO.getOrderDetails())
                .orElse(Collections.emptyList())
                .stream()
                .map(orderDetailDTO -> this.orderDetailService.createOrderDetail(orderDetailDTO))
                .toList();
        BigDecimal totalPrice = orderDetails.stream()
                .map(OrderDetail::getPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        if(coupon.getMinOrderValue().compareTo(totalPrice) > 0){
            throw new IdInvalidException("Total order value must be greater than or equal to the minimum order value for the coupon.");
        }

        BigDecimal finalPrice = calculateFinalPrice(coupon, totalPrice);

        Order order = new Order();
        order.setUser(user);
        order.setOrderDetails(orderDetails);
        order.setTotalPrice(totalPrice);
        order.setFinalPrice(finalPrice);
        order.setCoupon(coupon);
        order.setAddressUser(addressUser);
        order.setNote(orderRequestDTO.getNote());
        order.setStatus(OrderStatusEnum.PENDING);

        //update coupon usage count
        coupon.setQuantity(coupon.getQuantity() - 1);
        this.couponRepository.save(coupon);
        Order savedOrder = this.orderRepository.save(order);
        // Update order details with the saved order
        orderDetails.forEach(orderDetail -> orderDetail.setOrder(savedOrder));
        this.orderDetailService.saveAll(orderDetails);

        return OrderMapper.toOrderResponseDTO(savedOrder);

    }

    public OrderResponseDTO getOrderById(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new IdInvalidException("Order not found with id: " + id));
        return OrderMapper.toOrderResponseDTO(order);
    }

    public List<OrderResponseDTO> getAllOrders(Specification<Order> spec) {
        List<Order> orders = orderRepository.findAll(spec);
        return orders.stream()
                .map(OrderMapper::toOrderResponseDTO)
                .toList();
    }

    public OrderResponseDTO updateOrder(OrderUpdateDTO orderUpdateDTO) {
        if (orderUpdateDTO.getId() == null) {
            throw new IdInvalidException("Order ID cannot be null for update operation");
        }

        Order order = orderRepository.findById(orderUpdateDTO.getId())
                .orElseThrow(() -> new IdInvalidException("Order not found with id: " + orderUpdateDTO.getId()));

        if (orderUpdateDTO.getStatus() != null) {
            order.setStatus(orderUpdateDTO.getStatus());
        }
        return OrderMapper.toOrderResponseDTO(orderRepository.save(order));
    }

    public OrderResponseDTO deleteOrder(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new IdInvalidException("Order not found with id: " + id));
        order.setStatus(OrderStatusEnum.CANCELLED);
        //update coupon usage count
        if (order.getCoupon() != null && order.getCoupon().getId() != null) {
            Coupon coupon = couponRepository.findById(order.getCoupon().getId())
                    .orElseThrow(() -> new IdInvalidException("Coupon not found with id: " + order.getCoupon().getId()));
            coupon.setQuantity(coupon.getQuantity() + 1);
            couponRepository.save(coupon);
        }
        //update stockQuantity productSize
        order.getOrderDetails().forEach(orderDetail -> this.orderDetailService.returnStockQuantity(orderDetail));
        Order updatedOrder = orderRepository.save(order);
        return OrderMapper.toOrderResponseDTO(updatedOrder);
    }
}
