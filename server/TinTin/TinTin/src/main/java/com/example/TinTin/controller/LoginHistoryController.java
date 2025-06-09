package com.example.TinTin.controller;

import com.example.TinTin.domain.LoginHistory;
import com.example.TinTin.service.LoginHistoryService;
import com.example.TinTin.util.annotation.ApiMessage;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1")
public class LoginHistoryController {
    private final LoginHistoryService loginHistoryService;

    public LoginHistoryController(LoginHistoryService loginHistoryService) {
        this.loginHistoryService = loginHistoryService;
    }

    @GetMapping("/login-histories")
    @ApiMessage("Get login history")
    public ResponseEntity<Page<LoginHistory>> getHistory(Pageable pageable){
        return ResponseEntity.ok(loginHistoryService.getHistory(pageable));
    }
}
