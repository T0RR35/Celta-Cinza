package com.celtacinza.repository;

import com.celtacinza.model.Automovel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AutomovelRepository extends JpaRepository<Automovel, Long> {

    Optional<Automovel> findByPlaca(String placa);

    boolean existsByProprietarioId(Long proprietarioId);
}