package com.appsports.backend.controller;

import com.appsports.backend.model.entities.Articulo;
import com.appsports.backend.repository.ArticuloRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/article")
public class ArticuloController {

    @Autowired
    private ArticuloRepository articuloRepository;

    @GetMapping("")
    public ResponseEntity<List<Articulo>> getArticulos() {
        List<Articulo> articlesList = articuloRepository.findAll();
        return new ResponseEntity<>(articlesList, HttpStatus.OK);
    }
}
