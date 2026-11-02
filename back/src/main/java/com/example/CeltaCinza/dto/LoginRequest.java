package com.celtacinza.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record LoginRequest(
        @NotBlank(message = "Informe o usuário")
        @Size(max = 60, message = "O usuário deve ter no máximo 60 caracteres")
        String usuario,

        @NotBlank(message = "Informe a senha")
        @Size(max = 72, message = "A senha deve ter no máximo 72 caracteres")
        String senha) {
}
