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
public class UserUpdateDto {
    private Long id;
    private String name;
    private String email;
    private Long phone;
    private Integer age;
    private GenderEnum gender;
    private LocalDate birthdate;
    private String avatar;
    private Instant updatedAt;
    private String updatedBy;
    private UserCreateDto.Role role;
}
