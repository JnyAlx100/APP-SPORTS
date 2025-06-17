package com.appsports.backend.controller;

import com.appsports.backend.model.entities.Articulo;
import com.appsports.backend.model.entities.DetallePedido;
import com.appsports.backend.model.entities.Pedido;
import com.appsports.backend.repository.ArticuloRepository;
import com.appsports.backend.repository.PedidoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/order")
public class PedidoController {

    @Autowired
    private PedidoRepository pedidoRepository;

    @Autowired
    private ArticuloRepository articuloRepository;

    @PostMapping("")
    public ResponseEntity<Pedido> createOrder(@RequestBody Pedido pedido) {
        Pedido createdOrder = pedidoRepository.save(pedido);

        //descontar stock
        for (DetallePedido detallePedido: pedido.getDetalles()) {
            Articulo articulo = articuloRepository.findById(detallePedido.getArticulo().getId()).get();
            Integer updatedStock = articulo.getStock() - detallePedido.getCantidad();
            articulo.setStock(updatedStock);
            articuloRepository.save(articulo);
        }

        createdOrder.setUsuario(null);
        return ResponseEntity.ok(createdOrder);
    }
}
