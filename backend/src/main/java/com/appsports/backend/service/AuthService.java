package com.appsports.backend.service;

import com.appsports.backend.model.entities.Token;
import com.appsports.backend.model.entities.Usuario;
import com.appsports.backend.model.request.LoginRequest;
import com.appsports.backend.model.request.RegisterRequest;
import com.appsports.backend.model.response.TokenResponse;
import com.appsports.backend.repository.TokenRepository;
import com.appsports.backend.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.apache.catalina.User;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UsuarioRepository usuarioRepository;
    private final TokenRepository tokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

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

    public TokenResponse login(LoginRequest loginRequest) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getEmail(),
                        loginRequest.getPassword()
                )
        );
        var user = usuarioRepository.findByEmail(loginRequest.getEmail()).orElseThrow();
        var jwtToken = jwtService.generateToken(user);
        var refreshToken = jwtService.generateRefreshToken(user);
        revokeAllUserTokens(user);
        saveUserToken(user, jwtToken);
        return new TokenResponse(jwtToken, refreshToken);
    }

    private void revokeAllUserTokens(final Usuario usuario) {
        final List<Token> validUserTokens = tokenRepository
                .findAllValidTokenByUser(usuario.getId());
        if (!validUserTokens.isEmpty()) {
            for (final Token token : validUserTokens) {
                token.setExpired(true);
                token.setRevoked(true);
            }
            tokenRepository.saveAll(validUserTokens);
        }
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
