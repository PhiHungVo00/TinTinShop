package com.example.TinTin.service;

import com.example.TinTin.domain.Coupon;
import com.example.TinTin.repository.AddressUserRepository;
import com.example.TinTin.repository.CouponRepository;
import com.example.TinTin.repository.OrderRepository;
import com.example.TinTin.repository.UserRepository;
import com.example.TinTin.util.constrant.DiscountTypeEnum;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.mock;

class OrderServiceTest {
    private OrderService orderService;

    @BeforeEach
    void setup() {
        orderService = new OrderService(
                mock(OrderRepository.class),
                mock(UserRepository.class),
                mock(CouponRepository.class),
                mock(OrderDetailService.class),
                mock(AddressUserRepository.class)
        );
    }

    @Test
    void calculateFinalPrice_amount() {
        Coupon coupon = new Coupon();
        coupon.setId(1L);
        coupon.setDiscountType(DiscountTypeEnum.AMOUNT);
        coupon.setDiscountValue(BigDecimal.valueOf(10));

        BigDecimal result = orderService.calculateFinalPrice(coupon, BigDecimal.valueOf(100));
        assertEquals(BigDecimal.valueOf(90), result);
    }

    @Test
    void calculateFinalPrice_percentWithMax() {
        Coupon coupon = new Coupon();
        coupon.setId(1L);
        coupon.setDiscountType(DiscountTypeEnum.PERCENT);
        coupon.setDiscountValue(BigDecimal.valueOf(50));
        coupon.setMaxDiscount(BigDecimal.valueOf(30));

        BigDecimal result = orderService.calculateFinalPrice(coupon, BigDecimal.valueOf(100));
        assertEquals(BigDecimal.valueOf(70), result);
    }
}
