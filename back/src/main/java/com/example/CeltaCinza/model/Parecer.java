package com.celtacinza.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "pareceres")
@Getter
@Setter
@NoArgsConstructor
public class Parecer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private boolean positivo;

    @Column(length = 500)
    private String observacoes;

    @Column(nullable = false)
    private LocalDateTime data;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "pedido_id", nullable = false, unique = true)
    private PedidoAluguel pedido;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "agente_id", nullable = false)
    private Agente agente;

    @PrePersist
    void definirData() {
        if (data == null) {
            data = LocalDateTime.now();
        }
    }
}