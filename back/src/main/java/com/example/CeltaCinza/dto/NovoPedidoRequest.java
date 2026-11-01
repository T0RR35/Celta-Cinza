package com.celtacinza.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public record NovoPedidoRequest(
        @NotNull @Valid
        AutomovelRequest automovel,

        @NotNull(message = "Informe a data de retirada")
        @FutureOrPresent(message = "A retirada não pode ser no passado")
        LocalDate dataRetirada,

        @NotNull(message = "Informe a data de devolução")
        LocalDate dataDevolucao,

        Long bancoId
) {
}