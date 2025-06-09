package com.example.TinTin.service;

import com.example.TinTin.domain.User;
import com.example.TinTin.repository.RoleRepository;
import com.example.TinTin.repository.UserRepository;
import com.example.TinTin.util.error.DuplicateResourceException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class UserServiceTest {
    private UserRepository userRepository;
    private PasswordEncoder passwordEncoder;
    private RoleRepository roleRepository;
    private UserService userService;

    @BeforeEach
    void setup() {
        userRepository = mock(UserRepository.class);
        passwordEncoder = mock(PasswordEncoder.class);
        roleRepository = mock(RoleRepository.class);
        userService = new UserService(userRepository, passwordEncoder, roleRepository);
    }

    @Test
    void handleCreateUser_success() {
        User user = new User();
        user.setEmail("test@example.com");
        user.setPassword("pass");
        when(userRepository.existsByEmail("test@example.com")).thenReturn(false);
        when(passwordEncoder.encode("pass")).thenReturn("encoded");
        when(userRepository.save(any(User.class))).thenAnswer(inv -> {
            User u = inv.getArgument(0);
            u.setId(1L);
            return u;
        });

        var result = userService.handleCreateUser(user);

        assertEquals(1L, result.getId());
        assertEquals("test@example.com", result.getEmail());
        verify(userRepository).save(any(User.class));
    }

    @Test
    void handleCreateUser_duplicateEmail() {
        User user = new User();
        user.setEmail("test@example.com");
        when(userRepository.existsByEmail("test@example.com")).thenReturn(true);

        assertThrows(DuplicateResourceException.class, () -> userService.handleCreateUser(user));
        verify(userRepository, never()).save(any());
    }
}
