package com.appsports.backend.repository;

import com.appsports.backend.model.entities.Pedido;
import com.appsports.backend.model.entities.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PedidoRepository extends JpaRepository<Pedido, String> {
    List<Pedido> findByUsuario_Email(String email);
}