package com.example.TinTin.domain;

import com.example.TinTin.util.SecurityUtil;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;

@Entity
@Table(name = "address_user")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AddressUser {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Tên đường không được để trống")
    private String addressLine;

    @NotBlank(message = "Tên phường không được để trống")
    private String ward;

    @NotBlank(message = "Tên quận không được để trống")
    private String district;

    @NotBlank(message = "Tên tỉnh không được để trống")
    private String province;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    private String receiverName;
    private String receiverPhone;

    @Column(columnDefinition = "MEDIUMTEXT")
    private String description;

    private boolean defaultAddress;

    private Instant createdAt;
    private Instant updatedAt;
    private String createdBy;
    private String updatedBy;
    @PrePersist
    public void preCreateAddressUser() {
        this.createdAt = Instant.now();
        this.createdBy = SecurityUtil.getCurrentUserLogin().isPresent() ? SecurityUtil.getCurrentUserLogin().get() : "";
    }

    @PreUpdate
    public void preUpdateAddressUser() {
        this.updatedAt = Instant.now();
        this.updatedBy = SecurityUtil.getCurrentUserLogin().isPresent() ? SecurityUtil.getCurrentUserLogin().get() : "";
    }
}
