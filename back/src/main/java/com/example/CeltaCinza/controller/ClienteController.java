package com.celtacinza.controller;

import com.celtacinza.dto.ClienteResponse;
import com.celtacinza.dto.ClienteUpdateRequest;
import com.celtacinza.service.ClienteService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/clientes/me")
@RequiredArgsConstructor
public class ClienteController {

    private final ClienteService clienteService;

    @GetMapping
    public ClienteResponse buscar(Principal principal) {
        return clienteService.buscar(principal.getName());
    }

    @PutMapping
    public ClienteResponse atualizar(Principal principal, @Valid @RequestBody ClienteUpdateRequest request) {
        return clienteService.atualizar(principal.getName(), request);
    }

    @DeleteMapping
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void excluir(Principal principal) {
        clienteService.excluir(principal.getName());
    }
}