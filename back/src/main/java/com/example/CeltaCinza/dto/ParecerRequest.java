package com.celtacinza.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record ParecerRequest(
        @NotNull(message = "Informe se o parecer é positivo ou negativo")
        Boolean positivo,

        @Size(max = 500)
        String observacoes
) {
}