package com.example.TinTin.domain.response.user;

import com.example.TinTin.util.constrant.GenderEnum;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserResponseDto {
    private Long id;
    private String name;
    private String email;
    private String phone;
    private Integer age;
    private GenderEnum gender;
    private String birthdate;
    private String avatar;
    private Instant createdAt;
    private Instant updatedAt;
    private UserCreateDto.Role role;
}
