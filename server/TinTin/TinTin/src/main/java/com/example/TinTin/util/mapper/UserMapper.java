package com.example.TinTin.util.mapper;

import com.example.TinTin.domain.User;
import com.example.TinTin.domain.response.user.UserCreateDto;

public class UserMapper {

    public static UserCreateDto toUserCreateDto(User user) {
        if (user == null) return null;

        return UserCreateDto.builder()
                .name(user.getName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .age(user.getAge())
                .gender(user.getGender())
                .birthdate(user.getBirthdate())
                .avatar(user.getAvatar())
                .createdAt(user.getCreatedAt())
                .createdBy(user.getCreatedBy())
                .build();
    }
}
