package com.appsports.backend.repository;

import com.appsports.backend.model.entities.Articulo;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ArticuloRepository extends JpaRepository<Articulo, Integer> { }