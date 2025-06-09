package com.example.TinTin.service;

import com.example.TinTin.domain.LoginHistory;
import com.example.TinTin.repository.LoginHistoryRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class LoginHistoryService {
    private final LoginHistoryRepository loginHistoryRepository;

    public LoginHistoryService(LoginHistoryRepository loginHistoryRepository) {
        this.loginHistoryRepository = loginHistoryRepository;
    }

    public LoginHistory save(LoginHistory history){
        return loginHistoryRepository.save(history);
    }

    public Page<LoginHistory> getHistory(Pageable pageable){
        return loginHistoryRepository.findAll(pageable);
    }
}
