package com.celtacinza.dto;

import com.celtacinza.model.Pedido;
import com.celtacinza.model.StatusPedido;

import java.time.LocalDate;

public record PedidoResponse(
        Long id,
        String clienteNome,
        AutomovelResponse automovel,
        LocalDate dataRetirada,
        LocalDate dataDevolucao,
        StatusPedido status,
        boolean comCredito,
        Long bancoId,
        ContratoResponse contrato
) {

    public static PedidoResponse from(Pedido p) {
        return new PedidoResponse(
                p.getId(),
                p.getCliente().getNome(),
                AutomovelResponse.from(p.getAutomovel()),
                p.getDataRetirada(),
                p.getDataDevolucao(),
                p.getStatus(),
                p.isComCredito(),
                p.getBancoSolicitado() == null ? null : p.getBancoSolicitado().getId(),
                ContratoResponse.from(p.getContrato())
        );
    }
}