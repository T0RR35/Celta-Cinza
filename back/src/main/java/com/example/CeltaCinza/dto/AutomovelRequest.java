package com.celtacinza.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record AutomovelRequest(
        @NotBlank(message = "Informe a marca") @Size(max = 60) String marca,
        @NotBlank(message = "Informe o modelo") @Size(max = 60) String modelo,
        @NotNull(message = "Informe o ano") @Min(value = 1900, message = "Ano inválido") Integer ano,
        @NotBlank(message = "Informe a placa") @Size(max = 8) String placa,
        @NotBlank(message = "Informe a matrícula") @Size(max = 30) String matricula,
        @NotNull(message = "Informe o proprietário") TipoConta proprietario
) {
}