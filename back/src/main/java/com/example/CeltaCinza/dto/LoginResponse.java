package com.celtacinza.dto;

public record LoginResponse(String token, UsuarioLogadoResponse usuario) {
}