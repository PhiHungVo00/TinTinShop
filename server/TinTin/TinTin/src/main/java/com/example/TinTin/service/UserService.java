package com.example.TinTin.service;

import com.example.TinTin.domain.User;
import com.example.TinTin.repository.UserRepository;
import com.example.TinTin.util.error.DuplicateResourceException;
import com.example.TinTin.util.error.NotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public User handleCreateUser(User user){
        if(this.userRepository.existsByEmail(user.getEmail())){
            throw new DuplicateResourceException("User with email " + user.getEmail() + " already exists");
        }
        user.setPassword(this.passwordEncoder.encode(user.getPassword()));

        return this.userRepository.save(user);
    }

    public User handleGetUserByUserName(String email){
        return this.userRepository.findByEmail(email);
    }

    public void updateRefreshToken(String refreshToken, String email) {
        User currentUser = this.handleGetUserByUserName(email);
        if(currentUser != null){
            currentUser.setRefreshToken(refreshToken);
            this.userRepository.save(currentUser);
        }
    }

    public User getUserByRefreshTokenAndEmail(String refreshToken, String email) {
        User user = this.userRepository.findByRefreshTokenAndEmail(refreshToken, email);
        return user;
    }

    public void handleLogout(String email) {
        User user = userRepository.findByEmail(email);
        if(user == null){
            throw new NotFoundException("User with email " + email + " not found");
        }

        // Xoá refresh token
        user.setRefreshToken(null);
        userRepository.save(user);
    }
}
