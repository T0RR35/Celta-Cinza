package com.celtacinza.dto;

import com.celtacinza.model.Pedido;
import com.celtacinza.model.StatusPedido;

import java.time.LocalDate;

public record PedidoResponse(
        Long id,
        AutomovelResponse automovel,
        LocalDate dataRetirada,
        LocalDate dataDevolucao,
        StatusPedido status,
        boolean comCredito
) {

    public static PedidoResponse from(Pedido p) {
        return new PedidoResponse(
                p.getId(),
                AutomovelResponse.from(p.getAutomovel()),
                p.getDataRetirada(),
                p.getDataDevolucao(),
                p.getStatus(),
                p.isComCredito()
        );
    }
}