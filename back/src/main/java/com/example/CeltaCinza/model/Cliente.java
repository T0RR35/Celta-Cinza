package com.celtacinza.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "clientes")
@Getter
@Setter
@NoArgsConstructor
public class Cliente extends Usuario {

    @Column(nullable = false, length = 20)
    private String rg;

    @Column(nullable = false, unique = true, length = 11)
    private String cpf;

    @Column(nullable = false)
    private String endereco;

    @Column(nullable = false, length = 100)
    private String profissao;

    @OneToMany(mappedBy = "cliente", cascade = CascadeType.ALL, orphanRemoval = true)
    @Size(max = 3, message = "O cliente pode ter no max 3 rendimentos")
    private List<Rendimento> rendimentos = new ArrayList<>();

    @OneToMany(mappedBy = "cliente")
    private List<Pedido> pedidos = new ArrayList<>();

    public void adicionarRendimento(Rendimento rendimento) {
        if (rendimentos.size() >= 3) {
            throw new IllegalStateException("O cliente pode ter no máximo 3 rendimentos");
        }
        rendimento.setCliente(this);
        rendimentos.add(rendimento);
    }

    public void removerRendimento(Rendimento rendimento) {
        rendimentos.remove(rendimento);
        rendimento.setCliente(null);
    }
}