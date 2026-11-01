package com.celtacinza.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.List;

public record ClienteUpdateRequest(
        @NotBlank(message = "Informe o nome")
        @Size(max = 120)
        String nome,

        @NotBlank(message = "Informe o RG")
        @Size(max = 20)
        String rg,

        @NotBlank(message = "Informe o endereço")
        String endereco,

        @NotBlank(message = "Informe a profissão")
        @Size(max = 100)
        String profissao,

        @NotNull
        @Size(max = 3, message = "O cliente pode ter no máximo 3 rendimentos")
        @Valid
        List<RendimentoRequest> rendimentos
) {
}