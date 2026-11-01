package com.celtacinza.dto;

import com.celtacinza.model.Rendimento;

import java.math.BigDecimal;

public record RendimentoResponse(String entidadeEmpregadora, BigDecimal valor) {

    public static RendimentoResponse from(Rendimento r) {
        return new RendimentoResponse(r.getEntidadeEmpregadora(), r.getValor());
    }
}