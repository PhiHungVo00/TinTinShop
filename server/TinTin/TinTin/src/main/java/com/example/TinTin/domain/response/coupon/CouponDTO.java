package com.example.TinTin.domain.response.coupon;

import com.example.TinTin.util.constrant.DiscountTypeEnum;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.Instant;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CouponDTO {

    @NotBlank(message = "Coupon code cannot be blank")
    private String code;

    private String description;

    private String image;

    @NotNull(message = "Discount type cannot be null")
    private DiscountTypeEnum discountType;

    @NotNull(message = "Discount value cannot be null")
    @PositiveOrZero(message = "Discount value must be zero or positive")
    private BigDecimal discountValue;

    @PositiveOrZero(message = "Max discount must be zero or positive")
    private BigDecimal maxDiscount;

    @PositiveOrZero(message = "Min order value must be zero or positive")
    private BigDecimal minOrderValue;

    @PositiveOrZero(message = "Quantity must be zero or positive")
    @NotNull(message = "Quantity cannot be null")
    private Integer quantity;

    private Instant startDate;

    private Instant endDate;

    private Boolean isActive;
}