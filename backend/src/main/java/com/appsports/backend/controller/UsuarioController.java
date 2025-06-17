package com.appsports.backend.controller;

import com.appsports.backend.model.entities.Usuario;
import com.appsports.backend.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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

    @PatchMapping("")
    public ResponseEntity<Usuario> updateUsuario(@RequestBody Usuario usuario) {
        Usuario usuarioAntiguo = usuarioRepository.findByEmail(usuario.getEmail()).get();
        usuario.setPassword(usuarioAntiguo.getPassword());
        usuario.setFechaNacimiento(usuarioAntiguo.getFechaNacimiento());
        Usuario usuarioActualizado = usuarioRepository.save(usuario);
        usuarioActualizado.setTokens(new ArrayList<>());
        usuarioActualizado.setPedidos(new ArrayList<>());
        return new ResponseEntity<>(usuarioActualizado, HttpStatus.OK);
    }
}
