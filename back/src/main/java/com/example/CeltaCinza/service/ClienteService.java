package com.celtacinza.service;

import com.celtacinza.dto.ClienteResponse;
import com.celtacinza.dto.ClienteUpdateRequest;
import com.celtacinza.model.Cliente;
import com.celtacinza.model.Rendimento;
import com.celtacinza.repository.AutomovelRepository;
import com.celtacinza.repository.ClienteRepository;
import com.celtacinza.repository.PedidoAluguelRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
@Transactional
public class ClienteService {

    private final ClienteRepository clienteRepository;
    private final PedidoAluguelRepository pedidoRepository;
    private final AutomovelRepository automovelRepository;

    @Transactional(readOnly = true)
    public ClienteResponse buscar(String usuario) {
        return ClienteResponse.from(obter(usuario));
    }

    public ClienteResponse atualizar(String usuario, ClienteUpdateRequest request) {
        Cliente cliente = obter(usuario);
        cliente.setNome(request.nome());
        cliente.setRg(request.rg());
        cliente.setEndereco(request.endereco());
        cliente.setProfissao(request.profissao());

        cliente.getRendimentos().clear();
        request.rendimentos().forEach(r -> {
            Rendimento rendimento = new Rendimento();
            rendimento.setEntidadeEmpregadora(r.entidadeEmpregadora());
            rendimento.setValor(r.valor());
            cliente.adicionarRendimento(rendimento);
        });

        return ClienteResponse.from(cliente);
    }

    public void excluir(String usuario) {
        Cliente cliente = obter(usuario);
        if (pedidoRepository.existsByClienteId(cliente.getId())
                || automovelRepository.existsByProprietarioId(cliente.getId())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "Não é possível excluir uma conta com pedidos ou automóveis vinculados");
        }
        clienteRepository.delete(cliente);
    }

    private Cliente obter(String usuario) {
        return clienteRepository.findByUsuario(usuario)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Cliente não encontrado"));
    }
}