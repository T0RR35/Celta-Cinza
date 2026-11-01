package com.celtacinza.repository;

import com.celtacinza.model.Pedido;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PedidoRepository extends JpaRepository<Pedido, Long> {

    List<Pedido> findByClienteIdOrderByIdDesc(Long clienteId);

    Optional<Pedido> findByIdAndClienteId(Long id, Long clienteId);

    boolean existsByClienteId(Long clienteId);

    List<Pedido> findAllByOrderByIdDesc();
}