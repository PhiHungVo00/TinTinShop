package com.example.TinTin.domain.request.order;

import com.example.TinTin.util.constrant.OrderStatusEnum;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class OrderUpdateDTO {

    @NotNull(message = "Order ID cannot be null")
    private Long id;


    private Long userId;

    private Long couponId;


    private Long addressId;

    private String note;

    @NotNull(message = "Status cannot be blank")
    @Enumerated(EnumType.STRING)
    private OrderStatusEnum status;


    private List<OrderRequestDTO.OrderDetailDTO> orderDetails;
}
