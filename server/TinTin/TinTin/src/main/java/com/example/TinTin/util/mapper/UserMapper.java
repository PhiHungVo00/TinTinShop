package com.example.TinTin.util.mapper;

import com.example.TinTin.domain.User;
import com.example.TinTin.domain.response.user.UserCreateDto;
import com.example.TinTin.domain.response.user.UserResponseDto;
import com.example.TinTin.domain.response.user.UserUpdateDto;


public class UserMapper {

    public static UserCreateDto toUserCreateDto(User user) {
        if (user == null) return null;

        return UserCreateDto.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .age(user.getAge())
                .gender(user.getGender())
                .birthdate(user.getBirthdate())
                .avatar(user.getAvatar())
                .createdAt(user.getCreatedAt())
                .createdBy(user.getCreatedBy())
                .role(user.getRole() != null ? new UserCreateDto.Role(user.getRole().getId(), user.getRole().getName()) : null)
                .build();
    }

    public static UserResponseDto toUserResponseDto(User user) {
        UserResponseDto userResponseDto = new UserResponseDto();
        userResponseDto.setId(user.getId());
        userResponseDto.setName(user.getName());
        userResponseDto.setAge(user.getAge());
        userResponseDto.setEmail(user.getEmail());
        userResponseDto.setGender(user.getGender());
        userResponseDto.setPhone(user.getPhone());
        userResponseDto.setBirthdate(user.getBirthdate());
        userResponseDto.setAvatar(user.getAvatar());
        userResponseDto.setUpdatedAt(user.getUpdatedAt());
        userResponseDto.setCreatedAt(user.getCreatedAt());
        if(user.getRole() != null) {
            userResponseDto.setRole(new UserCreateDto.Role(user.getRole().getId(), user.getRole().getName()));
        }
        else{
            userResponseDto.setRole(null);
        }
        return userResponseDto;
    }

    public static UserUpdateDto toUserUpdateDto(User user) {
        UserUpdateDto userUpdateDto = new UserUpdateDto();
        userUpdateDto.setId(user.getId());
        userUpdateDto.setName(user.getName());
        userUpdateDto.setAge(user.getAge());
        userUpdateDto.setEmail(user.getEmail());
        userUpdateDto.setGender(user.getGender());
        userUpdateDto.setPhone(user.getPhone());
        userUpdateDto.setBirthdate(user.getBirthdate());
        userUpdateDto.setAvatar(user.getAvatar());
        userUpdateDto.setUpdatedAt(user.getUpdatedAt());
        userUpdateDto.setUpdatedBy(user.getUpdatedBy());

        if(user.getRole() != null) {
            userUpdateDto.setRole(new UserCreateDto.Role(user.getRole().getId(), user.getRole().getName()));

        }else{
            userUpdateDto.setRole(null);
        }
        return userUpdateDto;
    }
}
