package com.appsports.backend.service;

import com.appsports.backend.model.entities.Token;
import com.appsports.backend.model.entities.Usuario;
import com.appsports.backend.model.entities.UsuarioAdmin;
import com.appsports.backend.model.request.LoginRequest;
import com.appsports.backend.model.request.RegisterRequest;
import com.appsports.backend.model.request.ResetPasswordRequest;
import com.appsports.backend.model.response.TokenResponse;
import com.appsports.backend.repository.TokenRepository;
import com.appsports.backend.repository.UsuarioAdminRepository;
import com.appsports.backend.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.apache.catalina.User;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
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
    private final UsuarioAdminRepository usuarioAdminRepository;

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

    public TokenResponse refreshToken(final String authHeader) {
        if (authHeader != null && !authHeader.startsWith("Bearer ")) {
            throw new IllegalArgumentException("Invalid JWT Bearer token");
        }

        final String refreshToken = authHeader.substring(7);
        final String userEmail = jwtService.extractUsername(refreshToken);

        if (userEmail == null) {
            throw new IllegalArgumentException("Invalid JWT Refresh token");
        }

        final Usuario usuario = usuarioRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UsernameNotFoundException(userEmail));

        if (!jwtService.isTokenValid(refreshToken, usuario)) {
            throw new IllegalArgumentException("Invalid JWT Refresh token");
        }

        final String accessToken = jwtService.generateToken(usuario);
        revokeAllUserTokens(usuario);
        saveUserToken(usuario, accessToken);
        return new TokenResponse(accessToken, refreshToken);
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

    public ResponseEntity<String> resetPassword(final ResetPasswordRequest resetPasswordRequest) {
        UsuarioAdmin usuarioAdmin = usuarioAdminRepository.findById(resetPasswordRequest.getAdminUser()).get();
        if (usuarioAdmin.getPassword().equals(resetPasswordRequest.getAdminPassword())) {
            //actualizar contrasena
            Usuario usuario = usuarioRepository.findByEmail(resetPasswordRequest.getAccountEmail()).get();
            usuario.setPassword((new BCryptPasswordEncoder()).encode(resetPasswordRequest.getAccountNewPassword()));
            usuarioRepository.save(usuario);
            return ResponseEntity.ok("Password reset successful");
        }
        return ResponseEntity.badRequest().body("Account not found or invalid admin account");
    }
}
