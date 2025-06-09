package com.example.TinTin.config;

import com.example.TinTin.domain.Permission;
import com.example.TinTin.service.UserService;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;


@Component("userDetailsService")
public class UserDetailCustom implements UserDetailsService {
    private final UserService userService;
    public UserDetailCustom(UserService userService) {
        this.userService = userService;
    }
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        com.example.TinTin.domain.User user = this.userService.handleGetUserByUserName(username);
        if(user == null){
            throw new UsernameNotFoundException("Username/password không hợp lệ");
        }
        List<SimpleGrantedAuthority> authorities = new ArrayList<>();
        if (user.getRole() != null) {
            authorities.add(new SimpleGrantedAuthority(user.getRole().getName()));
            if (user.getRole().getPermissions() != null) {
                for (Permission permission : user.getRole().getPermissions()) {
                    authorities.add(new SimpleGrantedAuthority(permission.getName()));
                }
            }
        }
        return new User(
                user.getEmail(),
                user.getPassword(),
                authorities
        );
    }
}