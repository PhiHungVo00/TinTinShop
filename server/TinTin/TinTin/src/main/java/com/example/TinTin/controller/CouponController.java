package com.example.TinTin.controller;

import com.example.TinTin.domain.Coupon;
import com.example.TinTin.domain.response.coupon.CouponDTO;
import com.example.TinTin.service.CouponService;
import com.turkraft.springfilter.boot.Filter;
import jakarta.validation.Valid;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
public class CouponController {

    private final CouponService couponService;

    public CouponController(CouponService couponService) {
        this.couponService = couponService;
    }

    @PostMapping("/coupons")
    public ResponseEntity<Coupon> createCoupon(@Valid @RequestBody CouponDTO couponDTO) {
        Coupon coupon = new Coupon();
        coupon.setCode(couponDTO.getCode());
        coupon.setDescription(couponDTO.getDescription());
        coupon.setImage(couponDTO.getImage());
        coupon.setDiscountType(couponDTO.getDiscountType());
        coupon.setDiscountValue(couponDTO.getDiscountValue());
        coupon.setMaxDiscount(couponDTO.getMaxDiscount());
        coupon.setMinOrderValue(couponDTO.getMinOrderValue());
        coupon.setQuantity(couponDTO.getQuantity()==null?0:couponDTO.getQuantity());
        coupon.setStartDate(couponDTO.getStartDate());
        coupon.setEndDate(couponDTO.getEndDate());
        coupon.setIsActive(couponDTO.getIsActive() != null ? couponDTO.getIsActive() : true);
        Coupon createdCoupon = couponService.createCoupon(coupon);
        return new ResponseEntity<>(createdCoupon, HttpStatus.CREATED);
    }

    @GetMapping("/coupons/{id}")
    public ResponseEntity<Coupon> getCouponById(@PathVariable Long id) {
        Coupon coupon = couponService.getCouponById(id);
        return ResponseEntity.ok(coupon);
    }

    @GetMapping("/coupons")
    public ResponseEntity<List<Coupon>> getAllCoupons(@Filter Specification<Coupon> spec) {
        List<Coupon> coupons = couponService.getAllCoupons(spec);
        return ResponseEntity.ok(coupons);
    }

    @PutMapping("/coupons/{id}")
    public ResponseEntity<Coupon> updateCoupon(@PathVariable Long id, @Valid @RequestBody CouponDTO couponDTO) {
        Coupon coupon = new Coupon();
        coupon.setCode(couponDTO.getCode());
        coupon.setDescription(couponDTO.getDescription());
        coupon.setImage(couponDTO.getImage());
        coupon.setDiscountType(couponDTO.getDiscountType());
        coupon.setDiscountValue(couponDTO.getDiscountValue());
        coupon.setMaxDiscount(couponDTO.getMaxDiscount());
        coupon.setMinOrderValue(couponDTO.getMinOrderValue());
        coupon.setQuantity(couponDTO.getQuantity());
        coupon.setStartDate(couponDTO.getStartDate());
        coupon.setEndDate(couponDTO.getEndDate());
        coupon.setIsActive(couponDTO.getIsActive());
        Coupon updatedCoupon = couponService.updateCoupon(id, coupon);
        return ResponseEntity.ok(updatedCoupon);
    }

    @DeleteMapping("/coupons/{id}")
    public ResponseEntity<Coupon> deleteCoupon(@PathVariable Long id) {
        Coupon deletedCoupon = couponService.deleteCoupon(id);
        return ResponseEntity.ok(deletedCoupon);
    }
}