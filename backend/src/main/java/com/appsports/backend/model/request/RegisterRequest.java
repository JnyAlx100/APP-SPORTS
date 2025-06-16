package com.appsports.backend.model.request;

import lombok.Data;

import java.util.Date;

@Data
public class RegisterRequest {
    String direccionFacturacion;
    String password;
    String nit;
    String nombres;
    String apellidos;
    String email;
    Date fechaNacimiento;
}
