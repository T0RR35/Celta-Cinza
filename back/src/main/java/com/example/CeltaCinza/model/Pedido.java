package com.celtacinza.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name = "pedidos")
@Getter
@Setter
@NoArgsConstructor
public class Pedido {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "data_retirada", nullable = false)
    private LocalDate dataRetirada;

    @Column(name = "data_devolucao", nullable = false)
    private LocalDate dataDevolucao;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private StatusPedido status = StatusPedido.EM_ANALISE;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "cliente_id", nullable = false)
    private Cliente cliente;

    @ManyToOne(fetch = FetchType.LAZY, optional = false, cascade = CascadeType.PERSIST)
    @JoinColumn(name = "automovel_id", nullable = false)
    private Automovel automovel;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "banco_solicitado_id")
    private Agente bancoSolicitado;

    @OneToOne(mappedBy = "pedido", cascade = CascadeType.ALL)
    private Parecer parecer;

    @OneToOne(mappedBy = "pedido", cascade = CascadeType.ALL)
    private ContratoAluguel contrato;

    public boolean isComCredito() {
        return bancoSolicitado != null;
    }

    public boolean permiteAlteracao() {
        return status == StatusPedido.EM_ANALISE || status == StatusPedido.APROVADO;
    }
}