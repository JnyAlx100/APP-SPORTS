package com.appsports.backend.controller;

import com.appsports.backend.model.request.LoginRequest;
import com.appsports.backend.model.request.RegisterRequest;
import com.appsports.backend.model.response.TokenResponse;
import com.appsports.backend.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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

    @PostMapping("/login")
    public ResponseEntity<TokenResponse> login(@RequestBody final LoginRequest loginRequest) {
        final TokenResponse token = authService.login(loginRequest);
        return ResponseEntity.ok(token);
    }

    @PostMapping("/refresh")
    public TokenResponse refreshToken(@RequestHeader(HttpHeaders.AUTHORIZATION) final String authHeader) {
        return authService.refreshToken(authHeader);
    }
}