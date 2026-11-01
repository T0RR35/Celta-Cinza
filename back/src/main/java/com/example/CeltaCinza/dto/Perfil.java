package com.celtacinza.dto;

import com.celtacinza.model.Cliente;
import com.celtacinza.model.Usuario;
import org.hibernate.Hibernate;

public enum Perfil {
    CLIENTE,
    AGENTE;

    public static Perfil de(Usuario usuario) {
        return Hibernate.unproxy(usuario) instanceof Cliente ? CLIENTE : AGENTE;
    }
}