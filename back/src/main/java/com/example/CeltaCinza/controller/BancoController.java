package com.celtacinza.controller;

import com.celtacinza.dto.BancoResponse;
import com.celtacinza.service.AgenteService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/bancos")
@RequiredArgsConstructor
public class BancoController {

    private final AgenteService agenteService;

    @GetMapping
    public List<BancoResponse> listar() {
        return agenteService.listarBancos();
    }
}