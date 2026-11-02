package com.celtacinza.repository;

import com.celtacinza.model.Agente;
import com.celtacinza.model.TipoAgente;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AgenteRepository extends JpaRepository<Agente, Long> {

    Optional<Agente> findByEmail(String email);

    List<Agente> findByTipo(TipoAgente tipo);

    Optional<Agente> findByIdAndTipo(Long id, TipoAgente tipo);
}