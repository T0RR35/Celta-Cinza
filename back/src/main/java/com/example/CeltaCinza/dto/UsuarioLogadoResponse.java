package com.celtacinza.dto;

import com.celtacinza.model.Usuario;

public record UsuarioLogadoResponse(String nome, Perfil perfil) {

    public static UsuarioLogadoResponse from(Usuario usuario) {
        return new UsuarioLogadoResponse(usuario.getNome(), Perfil.de(usuario));
    }
}