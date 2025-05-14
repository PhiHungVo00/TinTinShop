package com.example.TinTin.domain;

import com.example.TinTin.util.SecurityUtil;
import com.example.TinTin.util.constrant.GenderEnum;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;
import java.time.LocalDate;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @NotBlank(message = "Tên không được để trống.")
    private String name;

    @NotBlank(message = "Email không được để trống.")
    private String email;

    @NotBlank(message = "Password không được để trống")
    private String password;

    private long phone;
    private int age;
    @Enumerated(EnumType.STRING)
    private GenderEnum gender;
    private LocalDate birthdate;
    private String avatar;

    @Column(columnDefinition = "MEDIUMTEXT")
    private String refreshToken;
    private Instant createdAt;
    private Instant updatedAt;
    private String createdBy;
    private String updatedBy;

    @PrePersist
    public void preCreateUser(){
        this.createdAt = Instant.now();
        this.createdBy = SecurityUtil.getCurrentUserLogin().isPresent()?SecurityUtil.getCurrentUserLogin().get():"";
    }

    @PreUpdate
    public void preUpdateUser(){
        this.updatedAt = Instant.now();
        this.updatedBy = SecurityUtil.getCurrentUserLogin().isPresent()?SecurityUtil.getCurrentUserLogin().get():"";
    }







    

}
