package com.appsports.backend.model.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "usuario_admin")
public class UsuarioAdmin {

    @Id
    @Column(name = "idusuario_admin")
    private String id;

    private String password;
}