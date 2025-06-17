package com.appsports.backend.controller;

import com.appsports.backend.model.entities.Usuario;
import com.appsports.backend.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/user")
public class UsuarioController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @GetMapping("")
    public ResponseEntity<List<Usuario>> getUsuarios() {
        List<Usuario> usuarios = usuarioRepository.findAll();
        return new ResponseEntity<>(usuarios, HttpStatus.OK);
    }

    @GetMapping("/{email}")
    public ResponseEntity<Usuario> getUsuarios(@PathVariable String email) {
        Usuario usuario = usuarioRepository.findByEmail(email).get();
        usuario.setTokens(new ArrayList<>());
        usuario.setPedidos(new ArrayList<>());
        return new ResponseEntity<>(usuario, HttpStatus.OK);
    }
}
