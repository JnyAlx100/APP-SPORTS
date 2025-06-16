package com.appsports.backend.model.entities;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "articulo")
public class Articulo {

    @Id
    @Column(name = "idarticulo")
    private Integer id;

    private String nombre;

    private Integer precio;

    private String descripcion;

    private Integer stock;

    @Column(name = "url_imagen")
    private String urlImagen;
}