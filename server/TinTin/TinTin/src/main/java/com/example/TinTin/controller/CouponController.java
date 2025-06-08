package com.example.TinTin.controller;

import com.example.TinTin.domain.Coupon;
import com.example.TinTin.domain.response.coupon.CouponDTO;
import com.example.TinTin.service.CouponService;
import com.turkraft.springfilter.boot.Filter;
import jakarta.validation.Valid;
import org.springframework.data.domain.Pageable;
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
    public ResponseEntity<Coupon> createCoupon(@Valid @RequestBody Coupon coupon) {
        Coupon createdCoupon = couponService.createCoupon(coupon);
        return new ResponseEntity<>(createdCoupon, HttpStatus.CREATED);
    }

    @GetMapping("/coupons/{id}")
    public ResponseEntity<Coupon> getCouponById(@PathVariable Long id) {
        Coupon coupon = couponService.getCouponById(id);
        return ResponseEntity.ok(coupon);
    }

    @GetMapping("/coupons")
    public ResponseEntity<List<Coupon>> getAllCoupons(@Filter Specification<Coupon> spec, Pageable pageable) {
        List<Coupon> coupons = couponService.getAllCoupons(spec, pageable);
        return ResponseEntity.ok(coupons);
    }

    @PutMapping("/coupons")
    public ResponseEntity<Coupon> updateCoupon( @Valid @RequestBody Coupon coupon) {
        Coupon updatedCoupon = couponService.updateCoupon( coupon);
        return ResponseEntity.ok(updatedCoupon);
    }

    @DeleteMapping("/coupons/{id}")
    public ResponseEntity<Coupon> deleteCoupon(@PathVariable Long id) {
        Coupon deletedCoupon = couponService.deleteCoupon(id);
        return ResponseEntity.ok(deletedCoupon);
    }
}