package com.appsports.backend.model.entities;

import jakarta.persistence.*;
import lombok.Data;
import java.util.List;

@Data
@Entity
@Table(name = "pedido")
public class Pedido {

    @Id
    @Column(name = "idpedido")
    private String id;

    private String status;

    @Column(name = "direccion_facturacion")
    private String direccionFacturacion;

    @ManyToOne
    @JoinColumn(name = "usuario_idusuario")
    private Usuario usuario;

    @OneToMany(mappedBy = "pedido", cascade = CascadeType.ALL)
    private List<DetallePedido> detalles;
}