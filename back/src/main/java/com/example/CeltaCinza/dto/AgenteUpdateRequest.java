package com.celtacinza.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record AgenteUpdateRequest(
        @NotBlank(message = "Informe o nome")
        @Size(max = 120)
        String nome
) {
}