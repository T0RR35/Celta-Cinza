package com.celtacinza.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record AutomovelRequest(
        @NotBlank(message = "Informe a marca")
        @Size(max = 60, message = "A marca deve ter no máximo 60 caracteres")
        String marca,

        @NotBlank(message = "Informe o modelo")
        @Size(max = 60, message = "O modelo deve ter no máximo 60 caracteres")
        String modelo,

        @NotNull(message = "Informe o ano")
        @Min(value = 1900, message = "O ano deve ser igual ou superior a 1900")
        @Max(value = 2100, message = "O ano informado é inválido")
        Integer ano,

        @NotBlank(message = "Informe a placa")
        @Size(max = 8, message = "A placa deve ter no máximo 8 caracteres")
        @Pattern(regexp = "(?i)[A-Z]{3}[0-9][A-Z0-9][0-9]{2}",
                message = "Placa inválida. Use o formato ABC1234 ou ABC1D23")
        String placa,

        @NotBlank(message = "Informe a matrícula")
        @Size(max = 30, message = "A matrícula deve ter no máximo 30 caracteres")
        String matricula,

        @NotNull(message = "Informe o proprietário")
        TipoConta proprietario
) {
}
