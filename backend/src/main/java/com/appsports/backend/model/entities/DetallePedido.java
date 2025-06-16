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
@Table(name = "detalle_pedido")
public class DetallePedido {

    @Id
    @Column(name = "iddetalle_pedido")
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "pedido_idpedido")
    private Pedido pedido;

    @ManyToOne
    @JoinColumn(name = "articulo_idarticulo")
    private Articulo articulo;
}