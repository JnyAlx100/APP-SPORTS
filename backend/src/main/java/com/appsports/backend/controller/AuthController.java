package com.appsports.backend.controller;

import com.appsports.backend.model.request.RegisterRequest;
import com.appsports.backend.model.response.TokenResponse;
import com.appsports.backend.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<TokenResponse> register(@RequestBody final RegisterRequest registerRequest) {
        final TokenResponse token = authService.register(registerRequest);
        return ResponseEntity.ok(token);
    }
}
