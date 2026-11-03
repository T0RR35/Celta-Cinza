package com.celtacinza.dto;

import com.celtacinza.model.Pedido;
import com.celtacinza.model.StatusPedido;

import java.time.LocalDate;

public record PedidoRecebidoResponse(
        Long id,
        ClienteResponse cliente,
        AutomovelResponse automovel,
        boolean comCredito,
        BancoResponse banco,
        LocalDate dataRetirada,
        LocalDate dataDevolucao,
        StatusPedido status,
        ContratoResponse contrato
) {

    public static PedidoRecebidoResponse from(Pedido p) {
        return new PedidoRecebidoResponse(
                p.getId(),
                ClienteResponse.from(p.getCliente()),
                AutomovelResponse.from(p.getAutomovel()),
                p.isComCredito(),
                p.getBancoSolicitado() == null ? null : BancoResponse.from(p.getBancoSolicitado()),
                p.getDataRetirada(),
                p.getDataDevolucao(),
                p.getStatus(),
                ContratoResponse.from(p.getContrato())
        );
    }
}