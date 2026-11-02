package com.celtacinza.dto;

import com.celtacinza.model.Agente;
import com.celtacinza.model.TipoAgente;

public record AgenteResponse(String nome, String usuario, TipoAgente tipo) {

    public static AgenteResponse from(Agente agente) {
        return new AgenteResponse(agente.getNome(), agente.getEmail(), agente.getTipo());
    }
}