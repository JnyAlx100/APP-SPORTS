package com.appsports.backend.repository;

import com.appsports.backend.model.entities.Token;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TokenRepository extends JpaRepository<Token, Integer> { }