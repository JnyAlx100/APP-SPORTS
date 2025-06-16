package com.appsports.backend.service;

import com.appsports.backend.model.entities.Token;
import com.appsports.backend.model.entities.Usuario;
import com.appsports.backend.model.request.RegisterRequest;
import com.appsports.backend.model.response.TokenResponse;
import com.appsports.backend.repository.TokenRepository;
import com.appsports.backend.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UsuarioRepository usuarioRepository;
    private final TokenRepository tokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public TokenResponse register(RegisterRequest registerRequest) {
        var user = Usuario.builder()
                .direccionFacturacion(registerRequest.getDireccionFacturacion())
                .password(passwordEncoder.encode(registerRequest.getPassword()))
                .nit(registerRequest.getNit())
                .nombres(registerRequest.getNombres())
                .apellidos(registerRequest.getApellidos())
                .email(registerRequest.getEmail())
                .fechaNacimiento(registerRequest.getFechaNacimiento())
                .build();
        var savedUser = usuarioRepository.save(user);
        var jwtToken = jwtService.generateToken(user);
        var refreshToken = jwtService.generateRefreshToken(user);
        saveUserToken(savedUser, jwtToken);
        return new TokenResponse(jwtToken, refreshToken);
    }

    private void saveUserToken(Usuario user, String jwtToken) {
        var token = Token.builder()
                .usuario(user)
                .token(jwtToken)
                .tokenType("BEARER")
                .expired(false)
                .revoked(false)
                .build();
        tokenRepository.save(token);
    }
}
