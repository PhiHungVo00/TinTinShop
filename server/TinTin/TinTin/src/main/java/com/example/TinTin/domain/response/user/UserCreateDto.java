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
    private Long id;
    private String name;
    private String email;
    private String phone;
    private Integer age;
    private GenderEnum gender;
    private String birthdate;
    private String avatar;
    private Role role;
    private Instant createdAt;
    private String createdBy;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Role{
        private long id;
        private String name;
    }
}

