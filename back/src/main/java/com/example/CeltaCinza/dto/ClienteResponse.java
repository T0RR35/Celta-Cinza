package com.celtacinza.dto;

import com.celtacinza.model.Cliente;

import java.util.List;

public record ClienteResponse(
        Long id,
        String nome,
        String cpf,
        String rg,
        String endereco,
        String profissao,
        List<RendimentoResponse> rendimentos
) {

    public static ClienteResponse from(Cliente c) {
        return new ClienteResponse(
                c.getId(),
                c.getNome(),
                c.getCpf(),
                c.getRg(),
                c.getEndereco(),
                c.getProfissao(),
                c.getRendimentos().stream().map(RendimentoResponse::from).toList()
        );
    }
}