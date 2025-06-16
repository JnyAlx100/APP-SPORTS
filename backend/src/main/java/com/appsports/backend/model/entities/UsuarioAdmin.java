package com.appsports.backend.model.entities;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "usuario_admin")
public class UsuarioAdmin {

    @Id
    @Column(name = "idusuario_admin")
    private String id;

    private String password;
}