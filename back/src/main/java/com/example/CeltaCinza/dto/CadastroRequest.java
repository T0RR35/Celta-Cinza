package com.celtacinza.dto;

import com.celtacinza.validation.CpfValido;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record CadastroRequest(
        @NotNull(message = "Informe o tipo de conta")
        TipoConta tipoConta,

        @NotBlank(message = "Informe o nome")
        @Size(max = 120, message = "O nome deve ter no máximo 120 caracteres")
        String nome,

        @NotBlank(message = "Informe o usuário")
        @Size(min = 3, max = 60, message = "O usuário deve ter entre 3 e 60 caracteres")
        @Pattern(regexp = "\\S+", message = "O usuário não pode conter espaços")
        String usuario,

        @NotBlank(message = "Informe a senha")
        @Size(min = 6, max = 72, message = "A senha deve ter entre 6 e 72 caracteres")
        String senha,

        @CpfValido(message = "CPF inválido. Confira os 11 dígitos informados")
        String cpf,

        @Size(max = 20, message = "O RG deve ter no máximo 20 caracteres")
        String rg,

        @Size(max = 255, message = "O endereço deve ter no máximo 255 caracteres")
        String endereco,

        @Size(max = 100, message = "A profissão deve ter no máximo 100 caracteres")
        String profissao
) {
}
