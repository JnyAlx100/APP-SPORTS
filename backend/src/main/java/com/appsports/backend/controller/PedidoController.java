package com.appsports.backend.controller;

import com.appsports.backend.model.dto.DetallePedidoDTO;
import com.appsports.backend.model.dto.PedidoDTO;
import com.appsports.backend.model.entities.Articulo;
import com.appsports.backend.model.entities.DetallePedido;
import com.appsports.backend.model.entities.Pedido;
import com.appsports.backend.model.entities.Usuario;
import com.appsports.backend.repository.ArticuloRepository;
import com.appsports.backend.repository.DetallePedidoRepository;
import com.appsports.backend.repository.PedidoRepository;
import com.appsports.backend.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/order")
public class PedidoController {

    @Autowired
    private PedidoRepository pedidoRepository;

    @Autowired
    private ArticuloRepository articuloRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

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

    @GetMapping("/{email}")
    public ResponseEntity<List<PedidoDTO>> getPedidoByUserEmail(@PathVariable String email) {
        List<Pedido> pedidos = pedidoRepository.findByUsuario_Email(email);
        List<PedidoDTO> pedidoDTO = pedidos.stream().map(this::convertirAPedidoDTO).collect(Collectors.toList());
        return ResponseEntity.ok(pedidoDTO);
    }

    private PedidoDTO convertirAPedidoDTO(Pedido pedido) {
        PedidoDTO dto = new PedidoDTO();
        dto.setId(pedido.getId());
        dto.setStatus(pedido.getStatus());
        dto.setDireccionFacturacion(pedido.getDireccionFacturacion());
        dto.setTotal(pedido.getTotal());

        List<DetallePedidoDTO> detalles = pedido.getDetalles().stream()
                .map(detalle -> {
                    DetallePedidoDTO detalleDTO = new DetallePedidoDTO();
                    detalleDTO.setId(detalle.getId());
                    detalleDTO.setArticulo(detalle.getArticulo());
                    detalleDTO.setCantidad(detalle.getCantidad());
                    return detalleDTO;
                }).collect(Collectors.toList());

        dto.setDetalles(detalles);
        return dto;
    }
}
