package com.example.TinTin.controller;

import com.example.TinTin.domain.User;
import com.example.TinTin.domain.LoginHistory;
import com.example.TinTin.domain.request.ReqLoginDTO;
import com.example.TinTin.domain.response.ResLoginDTO;
import com.example.TinTin.domain.response.user.UserCreateDto;
import com.example.TinTin.service.UserService;
import com.example.TinTin.service.LoginHistoryService;
import com.example.TinTin.util.SecurityUtil;
import com.example.TinTin.util.annotation.ApiMessage;
import com.example.TinTin.util.error.IdInvalidException;
import com.example.TinTin.util.error.NotFoundException;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1")
public class AuthController {

    private final AuthenticationManagerBuilder authenticationManagerBuilder;
    private final UserService userService;
    private final SecurityUtil securityUtil;
    private final LoginHistoryService loginHistoryService;

    public AuthController(AuthenticationManagerBuilder authenticationManagerBuilder, UserService userService, SecurityUtil securityUtil, LoginHistoryService loginHistoryService) {
        this.authenticationManagerBuilder = authenticationManagerBuilder;
        this.userService = userService;
        this.securityUtil = securityUtil;
        this.loginHistoryService = loginHistoryService;
    }

    @Value("${jwt.refresh-token.expiration}")
    private int refreshTokenExpiration;

    @PostMapping("/auth/login")
    @ApiMessage("Login account")
    public ResponseEntity<ResLoginDTO> login(@Valid @RequestBody ReqLoginDTO reqLoginDTO, jakarta.servlet.http.HttpServletRequest request) {
        String ip = request.getRemoteAddr();
        User currentUserLogin = this.userService.handleGetUserByUserName(reqLoginDTO.getUsername());
        if(currentUserLogin != null && Boolean.TRUE.equals(currentUserLogin.getAccountLocked())){
            throw new IllegalStateException("Account is locked");
        }

        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
                reqLoginDTO.getUsername(),
                reqLoginDTO.getPassword()
        );
        try {
            Authentication authentication = this.authenticationManagerBuilder.getObject().authenticate(authenticationToken);
            SecurityContextHolder.getContext().setAuthentication(authentication);

            ResLoginDTO resLoginDTO = new ResLoginDTO();
            ResLoginDTO.UserLogin userLogin = new ResLoginDTO.UserLogin();
            if(currentUserLogin != null) {
                userLogin.setId(currentUserLogin.getId());
                userLogin.setUserName(currentUserLogin.getName());
                userLogin.setEmail(currentUserLogin.getEmail());
                userLogin.setRole(currentUserLogin.getRole());
                resLoginDTO.setUser(userLogin);
            }

            String accessToken = this.securityUtil.createAccessToken(authentication.getName(), resLoginDTO);
            resLoginDTO.setAccessToken(accessToken);
            String refreshToken = this.securityUtil.createRefreshToken(reqLoginDTO.getUsername(), resLoginDTO);
            this.userService.updateRefreshToken(refreshToken, reqLoginDTO.getUsername());
            this.userService.recordLoginSuccess(currentUserLogin);

            ResponseCookie springCookie = ResponseCookie.from("refresh_token", refreshToken)
                    .httpOnly(true)
                    .path("/")
                    .maxAge(refreshTokenExpiration)
                    .build();

            LoginHistory history = new LoginHistory();
            history.setIp(ip);
            history.setSuccess(true);
            history.setEmail(reqLoginDTO.getUsername());
            history.setUser(currentUserLogin);
            loginHistoryService.save(history);

            return ResponseEntity.ok()
                    .header(HttpHeaders.SET_COOKIE, springCookie.toString())
                    .body(resLoginDTO);
        }catch(Exception ex){
            this.userService.recordLoginFailure(reqLoginDTO.getUsername());
            LoginHistory history = new LoginHistory();
            history.setIp(ip);
            history.setSuccess(false);
            history.setEmail(reqLoginDTO.getUsername());
            history.setUser(currentUserLogin);
            loginHistoryService.save(history);
            throw ex;
        }
    }

    @GetMapping("/auth/refresh")
    @ApiMessage("Get user by refresh token")
    public ResponseEntity<ResLoginDTO> getRefreshToken(@CookieValue(name = "refresh_token", required = false) String refreshToken
    ) {

        //check cookie has refresh token
        if (refreshToken == null || refreshToken.isBlank()) {
            throw new NotFoundException("Bạn không có refresh token ở trong cookie");
        }

        //check valid
        Jwt decodeToken = this.securityUtil.checkValidRefreshToken(refreshToken);
        String email = decodeToken.getSubject();

        //check user by token + email
        User user = this.userService.getUserByRefreshTokenAndEmail(refreshToken, email);
        if(user == null){
            throw new NotFoundException("Refresh token không hợp lệ ");
        }

        //create response DTO and create new access_token and refresh_token
        ResLoginDTO resLoginDTO = new ResLoginDTO();

        ResLoginDTO.UserLogin userLogin = new ResLoginDTO.UserLogin();
        User currentUserLogin = this.userService.handleGetUserByUserName(email);
        if(currentUserLogin != null) {
            userLogin.setId(currentUserLogin.getId());
            userLogin.setUserName(currentUserLogin.getName());
            userLogin.setEmail(currentUserLogin.getEmail());
            userLogin.setRole(currentUserLogin.getRole());
            resLoginDTO.setUser(userLogin);
        }
        //Create token
        String accessToken = this.securityUtil.createAccessToken(email, resLoginDTO);
        resLoginDTO.setAccessToken(accessToken);

        //Create refresh token
        String newRefreshToken = this.securityUtil.createRefreshToken(email, resLoginDTO);

        //Update user refresh token
        this.userService.updateRefreshToken(newRefreshToken, email);

        //send cookie
        ResponseCookie springCookie = ResponseCookie.from("refresh_token", newRefreshToken)
                .httpOnly(true)
                .path("/")
                .maxAge(refreshTokenExpiration)
                .build();
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, springCookie.toString())
                .body(resLoginDTO);

    }

    @PostMapping("/auth/logout")
    @ApiMessage("Logout account")
    public ResponseEntity<Void> logout() {
        String email = SecurityUtil.getCurrentUserLogin()
                .orElseThrow(() -> new IdInvalidException("Token truyền lên không hợp lệ"));

        this.userService.handleLogout(email);

        ResponseCookie cookie = ResponseCookie.from("refresh_token", "")
                .httpOnly(true)
                .secure(true)
                .sameSite("Strict")
                .path("/")
                .maxAge(0)
                .build();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(null);

    }
    @PostMapping("/auth/register")
    @ApiMessage("Register account")
    public ResponseEntity<UserCreateDto> register(@Valid @RequestBody User user){
        return ResponseEntity.status(201).body(this.userService.handleCreateUser(user));
    }

    @GetMapping("/auth/account")
    @ApiMessage("Fetch account")
    public ResponseEntity<ResLoginDTO.UserGetAccount> getAccount() {
        ResLoginDTO.UserGetAccount userLogin = this.userService.getUserLogin();
        return ResponseEntity.ok().body(userLogin);
    }
}
