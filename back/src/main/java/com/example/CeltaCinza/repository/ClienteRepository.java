package com.celtacinza.repository;

import com.celtacinza.model.Cliente;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ClienteRepository extends JpaRepository<Cliente, Long> {

    Optional<Cliente> findByUsuario(String usuario);

    boolean existsByCpf(String cpf);
}