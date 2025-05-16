package com.example.TinTin.domain;

import com.example.TinTin.util.SecurityUtil;
import com.example.TinTin.util.constrant.SizeEnum;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;
import java.util.List;

@Entity
@Table(name = "sizes")
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class Size {

    @Id
    @GeneratedValue(strategy =  GenerationType.IDENTITY)
    private long id;

    @Enumerated(EnumType.STRING)
    @NotBlank(message = "Tên size không được để trống")
    private SizeEnum name;

    @Column(columnDefinition = "MEDIUMTEXT")
    private String description;

    private Instant createdAt;
    private Instant updatedAt;
    private String createdBy;
    private String updatedBy;

    @OneToMany(mappedBy = "size", fetch = FetchType.LAZY)
    @JsonIgnore
    private List<ProductSize> productSizes;
    @PrePersist
    public void preCreateSize() {
        this.createdAt = Instant.now();
        this.createdBy = SecurityUtil.getCurrentUserLogin().isPresent() ? SecurityUtil.getCurrentUserLogin().get() : "";
    }

    @PreUpdate
    public void preUpdateSize() {
        this.updatedAt = Instant.now();
        this.updatedBy = SecurityUtil.getCurrentUserLogin().isPresent() ? SecurityUtil.getCurrentUserLogin().get() : "";
    }



}
