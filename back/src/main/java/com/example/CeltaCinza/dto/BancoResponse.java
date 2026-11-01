package com.celtacinza.dto;

import com.celtacinza.model.Agente;

public record BancoResponse(Long id, String nome) {

    public static BancoResponse from(Agente banco) {
        return new BancoResponse(banco.getId(), banco.getNome());
    }
}