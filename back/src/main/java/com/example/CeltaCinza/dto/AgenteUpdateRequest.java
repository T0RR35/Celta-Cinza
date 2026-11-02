package com.celtacinza.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record AgenteUpdateRequest(
        @NotBlank(message = "Informe o nome")
        @Size(max = 120, message = "O nome deve ter no máximo 120 caracteres")
        String nome
) {
}
