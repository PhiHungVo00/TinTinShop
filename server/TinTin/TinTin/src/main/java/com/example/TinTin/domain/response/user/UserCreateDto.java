package com.example.TinTin.domain.response.user;




import com.example.TinTin.util.constrant.GenderEnum;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserCreateDto {
    private String name;
    private String email;
    private long phone;
    private int age;
    private GenderEnum gender;
    private LocalDate birthdate;
    private String avatar;
    private Instant createdAt;
    private String createdBy;
}

