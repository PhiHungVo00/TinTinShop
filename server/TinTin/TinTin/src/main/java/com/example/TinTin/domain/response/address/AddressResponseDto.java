package com.example.TinTin.domain.response.address;

import com.example.TinTin.domain.User;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class AddressResponseDto {

    private Long id;
    private String addressLine;
    private String ward;
    private String district;
    private String province;
    private String receiverName;
    private String receiverPhone;
    private String description;
    private boolean defaultAddress;
    private Instant createdAt;
    private Instant updatedAt;
    private String createdBy;
    private String updatedBy;

}
