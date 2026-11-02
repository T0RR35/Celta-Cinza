package com.celtacinza.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public record NovoPedidoRequest(
        @NotNull(message = "Informe os dados do automóvel")
        @Valid
        AutomovelRequest automovel,

        @NotNull(message = "Informe a data de retirada")
        @FutureOrPresent(message = "A data de retirada não pode estar no passado")
        LocalDate dataRetirada,

        @NotNull(message = "Informe a data de devolução")
        @FutureOrPresent(message = "A data de devolução não pode estar no passado")
        LocalDate dataDevolucao,

        Long bancoId
) {
}
