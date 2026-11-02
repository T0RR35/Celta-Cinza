package com.celtacinza.controller;

import com.celtacinza.dto.AgenteResponse;
import com.celtacinza.dto.AgenteUpdateRequest;
import com.celtacinza.service.AgenteService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/agentes/me")
@RequiredArgsConstructor
public class AgentePerfilController {

    private final AgenteService agenteService;

    @GetMapping
    public AgenteResponse buscar(Principal principal) {
        return agenteService.buscar(principal.getName());
    }

    @PutMapping
    public AgenteResponse atualizar(Principal principal, @Valid @RequestBody AgenteUpdateRequest request) {
        return agenteService.atualizar(principal.getName(), request);
    }
}