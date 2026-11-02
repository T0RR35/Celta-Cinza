package com.celtacinza.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record CadastroRequest(
        @NotNull(message = "Informe o tipo de conta")
        TipoConta tipoConta,

        @NotBlank(message = "Informe o nome")
        @Size(max = 120)
        String nome,

        @NotBlank(message = "Informe o usuário")
        @Size(min = 3, max = 60)
        String usuario,

        @NotBlank(message = "Informe a senha")
        @Size(min = 6, max = 72, message = "A senha deve ter entre 6 e 72 caracteres")
        String senha,

        @Pattern(regexp = "\\d{11}", message = "O CPF deve ter 11 dígitos")
        String cpf,

        @Size(max = 20)
        String rg,

        String endereco,

        @Size(max = 100)
        String profissao
) {
}