package com.example.TinTin.domain;

import com.example.TinTin.util.SecurityUtil;
import com.example.TinTin.util.constrant.GenderEnum;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Tên không được để trống.")
    private String name;

    @NotBlank(message = "Email không được để trống.")
    private String email;


    private String password;

    private String phone;
    private Integer age;
    @Enumerated(EnumType.STRING)
    private GenderEnum gender;
    private String birthdate;
    private String avatar;

    @Column(columnDefinition = "MEDIUMTEXT")
    private String refreshToken;

    private Integer failedLoginAttempts;
    private Boolean accountLocked;
    private Instant createdAt;
    private Instant updatedAt;
    private String createdBy;
    private String updatedBy;

    @ManyToOne
    @JoinColumn(name = "role_id")
    private Role role;

    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
    @JsonIgnore
    private List<AddressUser> addressUsers;

    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Order> orders;

    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
    @JsonIgnore
    private List<FavoriteProduct> favoriteProducts;

    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
    @JsonIgnore
    private List<FavoriteTopping> favoriteToppings;

    @PrePersist
    public void preCreateUser(){
        this.createdAt = Instant.now();
        this.createdBy = SecurityUtil.getCurrentUserLogin().isPresent()?SecurityUtil.getCurrentUserLogin().get():"";
        if(this.failedLoginAttempts == null) this.failedLoginAttempts = 0;
        if(this.accountLocked == null) this.accountLocked = false;
    }

    @PreUpdate
    public void preUpdateUser(){
        this.updatedAt = Instant.now();
        this.updatedBy = SecurityUtil.getCurrentUserLogin().isPresent()?SecurityUtil.getCurrentUserLogin().get():"";
        if(this.failedLoginAttempts == null) this.failedLoginAttempts = 0;
        if(this.accountLocked == null) this.accountLocked = false;
    }
}
