package com.example.TinTin.service;

import com.example.TinTin.domain.Coupon;
import com.example.TinTin.repository.CouponRepository;
import com.example.TinTin.util.error.DuplicateResourceException;
import com.example.TinTin.util.error.IdInvalidException;
import com.example.TinTin.util.error.NotFoundException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CouponService {

    private final CouponRepository couponRepository;

    public CouponService(CouponRepository couponRepository) {
        this.couponRepository = couponRepository;
    }

    public Coupon createCoupon(Coupon coupon) {
        if (coupon == null) {
            throw new IllegalArgumentException("Coupon cannot be null");
        }
        if (couponRepository.existsByCode(coupon.getCode())) {
            throw new DuplicateResourceException("Coupon with code '" + coupon.getCode() + "' already exists");
        }

        return couponRepository.save(coupon);
    }

    public Coupon getCouponById(Long id) {
        if (id == null) {
            throw new IdInvalidException("Coupon ID cannot be null");
        }

        return couponRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Coupon not found with ID: " + id));
    }

    public List<Coupon> getAllCoupons(Specification<Coupon> spec, Pageable pageable) {
        Page<Coupon> couponPage = couponRepository.findAll(spec, pageable);
        if (couponPage.hasContent()) {
            return couponPage.getContent();
        } else {
            throw new NotFoundException("No coupons found matching the criteria");
        }

    }

    public Coupon updateCoupon(Coupon coupon) {
        if (coupon.getId() == null) {
            throw new IdInvalidException("Coupon ID cannot be null for update operation");
        }
        Coupon existingCoupon = couponRepository.findById(coupon.getId())
                .orElseThrow(() -> new NotFoundException("Coupon not found with ID: " + coupon.getId()));
        if (couponRepository.findByCode(coupon.getCode()).isPresent() &&
                !existingCoupon.getCode().equals(coupon.getCode())) {
            throw new DuplicateResourceException("Coupon with code '" + coupon.getCode() + "' already exists");
        }
        existingCoupon.setCode(coupon.getCode());
        existingCoupon.setDescription(coupon.getDescription());
        existingCoupon.setImage(coupon.getImage());
        existingCoupon.setDiscountType(coupon.getDiscountType());
        existingCoupon.setDiscountValue(coupon.getDiscountValue());
        existingCoupon.setMaxDiscount(coupon.getMaxDiscount());
        existingCoupon.setMinOrderValue(coupon.getMinOrderValue());
        existingCoupon.setQuantity(coupon.getQuantity());
        existingCoupon.setStartDate(coupon.getStartDate());
        existingCoupon.setEndDate(coupon.getEndDate());
        existingCoupon.setIsActive(coupon.getIsActive());

        return couponRepository.save(existingCoupon);
    }

    public Coupon deleteCoupon(Long id) {
        if (id == null) {
            throw new IdInvalidException("Coupon ID cannot be null for delete operation");
        }
        Coupon coupon = couponRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Coupon not found with ID: " + id));
        coupon.setIsActive(false);

        return couponRepository.save(coupon);
    }
}
