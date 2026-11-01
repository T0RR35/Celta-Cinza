package com.celtacinza.dto;

import java.util.List;

public record ErroResponse(int status, String mensagem, List<String> detalhes) {

    public ErroResponse(int status, String mensagem) {
        this(status, mensagem, List.of());
    }
}