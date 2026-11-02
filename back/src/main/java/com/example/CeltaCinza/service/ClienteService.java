package com.celtacinza.service;

import com.celtacinza.dto.ClienteResponse;
import com.celtacinza.dto.ClienteUpdateRequest;
import com.celtacinza.dto.RendimentoRequest;
import com.celtacinza.model.Cliente;
import com.celtacinza.model.Rendimento;
import com.celtacinza.repository.AutomovelRepository;
import com.celtacinza.repository.ClienteRepository;
import com.celtacinza.repository.PedidoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
@Transactional
public class ClienteService {

    private static final int MAX_RENDIMENTOS = 3;

    private final ClienteRepository clienteRepository;
    private final PedidoRepository pedidoRepository;
    private final AutomovelRepository automovelRepository;

    @Transactional(readOnly = true)
    public ClienteResponse buscar(String usuario) {
        return ClienteResponse.from(obter(usuario));
    }

    public ClienteResponse atualizar(String usuario, ClienteUpdateRequest request) {
        Cliente cliente = obter(usuario);

        if (request.rendimentos() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Informe a lista de rendimentos.");
        }
        if (request.rendimentos().size() > MAX_RENDIMENTOS) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "O cliente pode ter no máximo " + MAX_RENDIMENTOS + " rendimentos.");
        }

        cliente.setNome(texto(request.nome()));
        cliente.setRg(texto(request.rg()));
        cliente.setEndereco(texto(request.endereco()));
        cliente.setProfissao(texto(request.profissao()));

        cliente.getRendimentos().clear();
        for (RendimentoRequest dados : request.rendimentos()) {
            if (dados == null) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "Há um rendimento vazio. Preencha os dados ou remova a linha.");
            }
            Rendimento rendimento = new Rendimento();
            rendimento.setEntidadeEmpregadora(texto(dados.entidadeEmpregadora()));
            rendimento.setValor(dados.valor());
            cliente.adicionarRendimento(rendimento);
        }

        return ClienteResponse.from(cliente);
    }

    public void excluir(String usuario) {
        Cliente cliente = obter(usuario);
        if (pedidoRepository.existsByClienteId(cliente.getId())
                || automovelRepository.existsByProprietarioId(cliente.getId())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "Não é possível excluir uma conta com pedidos ou automóveis vinculados.");
        }
        clienteRepository.delete(cliente);
    }

    private Cliente obter(String email) {
        return clienteRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Cliente não encontrado."));
    }

    private String texto(String valor) {
        return valor == null ? "" : valor.trim();
    }
}
