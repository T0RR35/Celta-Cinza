package com.celtacinza.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public record NovoPedidoRequest(
        @NotNull(message = "Informe os dados do automóvel")
        @Valid
        AutomovelRequest automovel,

        @NotNull(message = "Informe a data de retirada")
        LocalDate dataRetirada,

        @NotNull(message = "Informe a data de devolução")
        LocalDate dataDevolucao,

        Long bancoId
) {
}
