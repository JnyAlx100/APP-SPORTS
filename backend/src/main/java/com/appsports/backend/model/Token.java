package com.appsports.backend.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "token")
public class Token {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String token;

    @Column(name = "token_type")
    private String tokenType;

    private Boolean revoked;
    private Boolean expired;

    @ManyToOne
    @JoinColumn(name = "usuario_idusuario")
    private Usuario usuario;
}