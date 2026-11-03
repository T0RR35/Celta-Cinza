package com.celtacinza.dto;

import com.celtacinza.model.ContratoCredito;

import java.math.BigDecimal;

public record ContratoCreditoResponse(
        Long id,
        BigDecimal valor,
        Integer prazoMeses,
        Long bancoId,
        String bancoNome
) {

    public static ContratoCreditoResponse from(ContratoCredito credito) {
        return new ContratoCreditoResponse(
                credito.getId(),
                credito.getValor(),
                credito.getPrazoMeses(),
                credito.getBanco().getId(),
                credito.getBanco().getNome()
        );
    }
}
