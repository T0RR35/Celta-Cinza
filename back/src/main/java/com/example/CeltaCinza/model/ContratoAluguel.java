package com.celtacinza.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name = "contratos_aluguel")
@Getter
@Setter
@NoArgsConstructor
public class ContratoAluguel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "data_assinatura", nullable = false)
    private LocalDate dataAssinatura;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "pedido_id", nullable = false, unique = true)
    private PedidoAluguel pedido;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "contrato_credito_id", unique = true)
    private ContratoCredito contratoCredito;
}