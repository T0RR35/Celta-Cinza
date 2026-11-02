package com.celtacinza.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

public record RendimentoRequest(
        @NotBlank(message = "Informe a entidade empregadora")
        @Size(max = 120, message = "A entidade empregadora deve ter no máximo 120 caracteres")
        String entidadeEmpregadora,

        @NotNull(message = "Informe o rendimento mensal")
        @DecimalMin(value = "0.0", message = "O rendimento não pode ser negativo")
        @Digits(integer = 10, fraction = 2, message = "O rendimento deve ter no máximo 2 casas decimais")
        BigDecimal valor
) {
}
