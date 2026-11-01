package com.celtacinza.dto;

import com.celtacinza.model.Agente;
import com.celtacinza.model.Cliente;
import com.celtacinza.model.Usuario;
import org.hibernate.Hibernate;

public enum TipoConta {
    CLIENTE,
    EMPRESA,
    BANCO;

    public static TipoConta de(Usuario usuario) {
        Object real = Hibernate.unproxy(usuario);
        if (real instanceof Cliente) {
            return CLIENTE;
        }
        return ((Agente) real).isBanco() ? BANCO : EMPRESA;
    }
}