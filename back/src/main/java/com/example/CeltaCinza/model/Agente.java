package com.celtacinza.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "agentes")
@Getter
@Setter
@NoArgsConstructor
public class Agente extends Usuario {

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private TipoAgente tipo;

    @OneToMany(mappedBy = "agente")
    private List<Parecer> pareceres = new ArrayList<>();

    @OneToMany(mappedBy = "banco")
    private List<ContratoCredito> contratosCredito = new ArrayList<>();

    public boolean isBanco() {
        return tipo == TipoAgente.BANCO;
    }
}