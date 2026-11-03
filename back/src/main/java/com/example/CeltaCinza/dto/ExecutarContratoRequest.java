package com.celtacinza.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;

import java.math.BigDecimal;

/**
 * Dados do contrato de crédito. São obrigatórios apenas quando o pedido
 * foi criado com associação a um banco.
 */
public record ExecutarContratoRequest(
        @DecimalMin(value = "0.01", message = "O valor do crédito deve ser maior que zero")
        @Digits(integer = 10, fraction = 2, message = "O valor do crédito deve ter no máximo 2 casas decimais")
        BigDecimal valor,

        @Min(value = 1, message = "O prazo deve ser de pelo menos 1 mês")
        @Max(value = 600, message = "O prazo deve ser de no máximo 600 meses")
        Integer prazoMeses
) {
}
