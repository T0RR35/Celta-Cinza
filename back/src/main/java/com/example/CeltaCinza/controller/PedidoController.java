package com.celtacinza.controller;

import com.celtacinza.dto.NovoPedidoRequest;
import com.celtacinza.dto.ParecerRequest;
import com.celtacinza.dto.PedidoRecebidoResponse;
import com.celtacinza.dto.PedidoResponse;
import com.celtacinza.service.PedidoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/pedidos")
@RequiredArgsConstructor
public class PedidoController {

    private final PedidoService pedidoService;

    @GetMapping
    public List<PedidoResponse> listar(Principal principal) {
        return pedidoService.listar(principal.getName());
    }

    @GetMapping("/{id}")
    public PedidoResponse buscar(@PathVariable Long id, Principal principal) {
        return pedidoService.buscar(id, principal.getName());
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public PedidoResponse criar(Principal principal, @Valid @RequestBody NovoPedidoRequest request) {
        return pedidoService.criar(principal.getName(), request);
    }

    @PutMapping("/{id}")
    public PedidoResponse modificar(@PathVariable Long id, Principal principal,
            @Valid @RequestBody NovoPedidoRequest request) {
        return pedidoService.modificar(id, principal.getName(), request);
    }

    @PatchMapping("/{id}/cancelar")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void cancelar(@PathVariable Long id, Principal principal) {
        pedidoService.cancelar(id, principal.getName());
    }

    @GetMapping("/recebidos")
    public List<PedidoRecebidoResponse> listarRecebidos() {
        return pedidoService.listarRecebidos();
    }

    @PostMapping("/{id}/parecer")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void registrarParecer(@PathVariable Long id, Principal principal,
            @Valid @RequestBody ParecerRequest request) {
        pedidoService.registrarParecer(id, principal.getName(), request);
    }
}