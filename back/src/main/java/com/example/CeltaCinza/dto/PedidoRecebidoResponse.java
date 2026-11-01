package com.celtacinza.dto;

import com.celtacinza.model.Pedido;
import com.celtacinza.model.StatusPedido;

import java.time.LocalDate;

public record PedidoRecebidoResponse(
        Long id,
        ClienteResponse cliente,
        AutomovelResponse automovel,
        boolean comCredito,
        LocalDate dataRetirada,
        LocalDate dataDevolucao,
        StatusPedido status
) {

    public static PedidoRecebidoResponse from(Pedido p) {
        return new PedidoRecebidoResponse(
                p.getId(),
                ClienteResponse.from(p.getCliente()),
                AutomovelResponse.from(p.getAutomovel()),
                p.isComCredito(),
                p.getDataRetirada(),
                p.getDataDevolucao(),
                p.getStatus()
        );
    }
}