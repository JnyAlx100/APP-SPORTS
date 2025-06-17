package com.appsports.backend.model.dto;

import com.appsports.backend.model.entities.Articulo;
import com.appsports.backend.model.entities.Pedido;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

@Data
public class DetallePedidoDTO {

    private Integer id;
    private Articulo articulo;
    private Integer cantidad;
}
