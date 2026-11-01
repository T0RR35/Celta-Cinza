package com.celtacinza.dto;

import com.celtacinza.model.Automovel;

public record AutomovelResponse(
        String marca,
        String modelo,
        Integer ano,
        String placa,
        String matricula,
        TipoConta proprietario
) {

    public static AutomovelResponse from(Automovel a) {
        return new AutomovelResponse(
                a.getMarca(),
                a.getModelo(),
                a.getAno(),
                a.getPlaca(),
                a.getMatricula(),
                TipoConta.de(a.getProprietario())
        );
    }
}