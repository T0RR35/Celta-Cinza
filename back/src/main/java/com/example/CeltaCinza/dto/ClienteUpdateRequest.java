package com.celtacinza.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.List;

public record ClienteUpdateRequest(
        @NotBlank(message = "Informe o nome")
        @Size(max = 120, message = "O nome deve ter no máximo 120 caracteres")
        String nome,

        @NotBlank(message = "Informe o RG")
        @Size(max = 20, message = "O RG deve ter no máximo 20 caracteres")
        String rg,

        @NotBlank(message = "Informe o endereço")
        @Size(max = 255, message = "O endereço deve ter no máximo 255 caracteres")
        String endereco,

        @NotBlank(message = "Informe a profissão")
        @Size(max = 100, message = "A profissão deve ter no máximo 100 caracteres")
        String profissao,

        @NotNull(message = "Informe a lista de rendimentos")
        @Size(max = 3, message = "O cliente pode ter no máximo 3 rendimentos")
        @Valid
        List<RendimentoRequest> rendimentos
) {
}
