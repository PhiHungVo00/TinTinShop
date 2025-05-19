package com.example.TinTin.controller;

import com.example.TinTin.domain.User;
import com.example.TinTin.domain.response.ResultPaginationDTO;
import com.example.TinTin.domain.response.user.UserCreateDto;
import com.example.TinTin.domain.response.user.UserResponseDto;
import com.example.TinTin.service.UserService;
import com.example.TinTin.util.annotation.ApiMessage;
import com.turkraft.springfilter.boot.Filter;
import jakarta.validation.Valid;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/users")
    @ApiMessage("Creat a new user")
    public ResponseEntity<UserCreateDto> createUser(@Valid @RequestBody User user){

        return ResponseEntity.status(HttpStatus.CREATED).body(this.userService.handleCreateUser(user));
    }

    @GetMapping("/users")
    @ApiMessage("Fetch all users")
    public ResponseEntity<ResultPaginationDTO<List<UserResponseDto>>> getUsers(
            @Filter Specification<User> spec,
            Pageable pageable
            ){
        return ResponseEntity.status(HttpStatus.OK).body(this.userService.fetchAllUser(
                spec,
                pageable));

    }


}
