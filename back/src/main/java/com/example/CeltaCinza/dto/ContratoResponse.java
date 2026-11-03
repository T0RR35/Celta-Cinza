package com.celtacinza.dto;

import com.celtacinza.model.ContratoAluguel;

import java.time.LocalDate;

public record ContratoResponse(
        Long id,
        LocalDate dataAssinatura,
        ContratoCreditoResponse contratoCredito
) {

    public static ContratoResponse from(ContratoAluguel contrato) {
        if (contrato == null) {
            return null;
        }
        return new ContratoResponse(
                contrato.getId(),
                contrato.getDataAssinatura(),
                contrato.getContratoCredito() == null
                        ? null
                        : ContratoCreditoResponse.from(contrato.getContratoCredito())
        );
    }
}
