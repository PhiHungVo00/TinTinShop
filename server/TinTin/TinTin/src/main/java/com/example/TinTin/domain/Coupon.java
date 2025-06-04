package com.example.TinTin.domain;

import com.example.TinTin.util.SecurityUtil;
import com.example.TinTin.util.constrant.DiscountTypeEnum;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "coupons")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Coupon {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Mã coupon không được để trống.")
    private String code;

    @Column(columnDefinition = "MEDIUMTEXT")
    private String description;

    private String image;

    @Enumerated(EnumType.STRING)
    @Column(name = "discount_type")
    private DiscountTypeEnum discountType;  // ENUM('PERCENT', 'AMOUNT')

    @Column(name = "discount_value", precision = 10, scale = 2)
    @DecimalMin("0.0")
    private BigDecimal discountValue;

    @Column(name = "max_discount", precision = 10, scale = 2)
    private BigDecimal maxDiscount;

    @Column(name = "min_order_value", precision = 10, scale = 2)
    private BigDecimal minOrderValue;

    private int quantity;

    private Instant startDate;
    private Instant endDate;

    private Boolean isActive;

    private Instant createdAt;
    private Instant updatedAt;

    private String createdBy;
    private String updatedBy;

    @OneToMany(mappedBy = "coupon", fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Order> orders;

    @PrePersist
    public void preCreateCoupon() {
        this.createdAt = Instant.now();
        this.createdBy = SecurityUtil.getCurrentUserLogin().isPresent() ? SecurityUtil.getCurrentUserLogin().get() : "";
    }

    @PreUpdate
    public void preUpdateCoupon() {
        this.updatedAt = Instant.now();
        this.updatedBy = SecurityUtil.getCurrentUserLogin().isPresent() ? SecurityUtil.getCurrentUserLogin().get() : "";
    }
}