package com.example.TinTin.domain.request.order;

import com.example.TinTin.util.constrant.OrderStatusEnum;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class OrderRequestDTO {

    @NotNull(message = "User ID cannot be null")
    private Long userId;

    private Long couponId;

    @NotNull(message = "Address ID cannot be null")
    private Long addressId;

    private String note;

    @NotEmpty(message = "Order details cannot be empty")
    private List<OrderDetailDTO> orderDetails;

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class OrderDetailDTO {
        @NotNull(message = "Product size ID cannot be null")
        private Long productSizeId;

        @NotNull(message = "Quantity cannot be null")
        @Positive(message = "Quantity must be positive")
        private Integer quantity;

        private List<Long> toppingIds;


    }


}
