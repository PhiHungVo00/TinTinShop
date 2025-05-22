package com.example.TinTin.service;

import com.example.TinTin.domain.Role;
import com.example.TinTin.domain.User;
import com.example.TinTin.domain.response.ResLoginDTO;
import com.example.TinTin.domain.response.ResultPaginationDTO;
import com.example.TinTin.domain.response.user.UserCreateDto;
import com.example.TinTin.domain.response.user.UserResponseDto;
import com.example.TinTin.domain.response.user.UserUpdateDto;
import com.example.TinTin.repository.RoleRepository;
import com.example.TinTin.repository.UserRepository;
import com.example.TinTin.util.SecurityUtil;
import com.example.TinTin.util.error.DuplicateResourceException;
import com.example.TinTin.util.error.NotFoundException;
import com.example.TinTin.util.mapper.UserMapper;
import org.aspectj.apache.bcel.classfile.Module;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final RoleRepository roleRepository;


    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, RoleRepository roleRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.roleRepository = roleRepository;

    }

    public UserCreateDto handleCreateUser(User user){
        if(this.userRepository.existsByEmail(user.getEmail())){
            throw new DuplicateResourceException("User with email " + user.getEmail() + " already exists");
        }
        user.setPassword(this.passwordEncoder.encode(user.getPassword()));
        Optional<Role> role = this.roleRepository.findById(user.getRole().getId());
        if(role.isPresent()){
            user.setRole(role.get());
        }else{
            user.setRole(null);
        }

        return UserMapper.toUserCreateDto(this.userRepository.save(user));
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

    public ResLoginDTO.UserGetAccount getUserLogin() {
        String email = SecurityUtil.getCurrentUserLogin()
                .isPresent()?
                SecurityUtil.getCurrentUserLogin().get()
                :"";

        User user = this.handleGetUserByUserName(email);
        if(user == null){
            throw new NotFoundException("User not found with email: " + email + " !");
        }
        ResLoginDTO.UserLogin userLogin = new ResLoginDTO.UserLogin();
        userLogin.setEmail(email);
        userLogin.setUserName(user.getName());
        userLogin.setId(user.getId());
        userLogin.setRole(user.getRole());

        return new ResLoginDTO.UserGetAccount(userLogin);
    }

    public ResultPaginationDTO<List<UserResponseDto>> fetchAllUser(Specification<User> spec, Pageable pageable) {
        Page<User> users = this.userRepository.findAll(spec, pageable);

        ResultPaginationDTO<List<UserResponseDto>> paginationDTO = new ResultPaginationDTO<>();
        ResultPaginationDTO.Meta meta = new ResultPaginationDTO.Meta();

        meta.setPage(pageable.getPageNumber() + 1);
        meta.setTotal((int) users.getTotalElements());
        meta.setPages(users.getTotalPages());
        meta.setPageSize(users.getSize());

        paginationDTO.setMeta(meta);
        paginationDTO.setResult(
                users.getContent()
                        .stream()
                        .map(u -> UserMapper.toUserResponseDto(u))
                        .collect(Collectors.toList())
        );

        return paginationDTO;
    }

    public UserUpdateDto handleUpdateUser(User user){
        Optional<User> userDB = this.userRepository.findById(user.getId());
        if(!userDB.isPresent()){
            throw new NotFoundException("User not found with id: " + user.getId());
        }
        User currentUser = userDB.get();
        currentUser.setName(user.getName());
        currentUser.setEmail(user.getEmail());
        currentUser.setPhone(user.getPhone());
        currentUser.setAge(user.getAge());
        currentUser.setGender(user.getGender());
        currentUser.setBirthdate(user.getBirthdate());
        currentUser.setAvatar(user.getAvatar());
        Optional<Role> role = this.roleRepository.findById(user.getRole().getId());
        if(role.isPresent()){
            currentUser.setRole(role.get());
        }else{
            currentUser.setRole(null);
        }

        this.userRepository.save(currentUser);
        return UserMapper.toUserUpdateDto(currentUser);

    }

    public void deleteUser(Long id){
        User user = this.userRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("User not found with id: " + id));
        this.userRepository.delete(user);
    }

    public UserResponseDto getUserById(Long id){
        Optional<User> user = this.userRepository.findById(id);
        if(user.isPresent()){
            return UserMapper.toUserResponseDto(user.get());
        }else{
            throw new NotFoundException("User not found with id: " + id);
        }
    }
}
