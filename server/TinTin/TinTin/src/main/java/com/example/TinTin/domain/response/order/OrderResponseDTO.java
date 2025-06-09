package com.example.TinTin.domain.response.order;

import com.example.TinTin.domain.AddressUser;
import com.example.TinTin.domain.response.address.AddressResponseDto;
import com.example.TinTin.domain.response.order_detail.OrderDetailResponseDTO;
import com.example.TinTin.util.constrant.OrderStatusEnum;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class OrderResponseDTO {

    private Long id;
    private Long userId;
    private Long couponId;
    private AddressResponseDto addressUser;
    private String note;
    private BigDecimal totalPrice;
    private BigDecimal finalPrice;
    private OrderStatusEnum status;
    private Instant createdAt;
    private Instant updatedAt;
    private List<OrderDetailResponseDTO> orderDetails;


}
