package com.appsports.backend.model.dto;

import lombok.Data;

import java.util.List;

@Data
public class PedidoDTO {

    private String id;
    private String status;
    private String direccionFacturacion;
    private Integer total;
    private List<DetallePedidoDTO> detalles;
}
