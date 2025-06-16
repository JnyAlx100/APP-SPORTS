package com.appsports.backend.service;

import org.springframework.stereotype.Service;

@Service
public class HelloWorldService {

    public String obtenerMensaje() {
        return "Hola Mundo";
    }

}
