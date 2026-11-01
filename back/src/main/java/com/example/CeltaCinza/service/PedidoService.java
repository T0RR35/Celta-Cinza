package com.celtacinza.service;

import com.celtacinza.dto.*;
import com.celtacinza.model.*;
import com.celtacinza.repository.AgenteRepository;
import com.celtacinza.repository.AutomovelRepository;
import com.celtacinza.repository.ClienteRepository;
import com.celtacinza.repository.PedidoAluguelRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class PedidoService {

    private final PedidoAluguelRepository pedidoRepository;
    private final ClienteRepository clienteRepository;
    private final AgenteRepository agenteRepository;
    private final AutomovelRepository automovelRepository;

    @Transactional(readOnly = true)
    public List<PedidoResponse> listar(String usuario) {
        Cliente cliente = obterCliente(usuario);
        return pedidoRepository.findByClienteIdOrderByIdDesc(cliente.getId()).stream()
                .map(PedidoResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public PedidoResponse buscar(Long id, String usuario) {
        return PedidoResponse.from(obterPedidoDoCliente(id, usuario));
    }

    public PedidoResponse criar(String usuario, NovoPedidoRequest request) {
        Cliente cliente = obterCliente(usuario);
        validarDatas(request);

        PedidoAluguel pedido = new PedidoAluguel();
        pedido.setCliente(cliente);
        preencher(pedido, cliente, request);
        return PedidoResponse.from(pedidoRepository.save(pedido));
    }

    public PedidoResponse modificar(Long id, String usuario, NovoPedidoRequest request) {
        PedidoAluguel pedido = obterPedidoDoCliente(id, usuario);
        exigirAlteravel(pedido);
        validarDatas(request);

        preencher(pedido, pedido.getCliente(), request);
        return PedidoResponse.from(pedido);
    }

    public void cancelar(Long id, String usuario) {
        PedidoAluguel pedido = obterPedidoDoCliente(id, usuario);
        exigirAlteravel(pedido);
        pedido.setStatus(StatusPedido.CANCELADO);
    }

    @Transactional(readOnly = true)
    public List<PedidoRecebidoResponse> listarRecebidos() {
        return pedidoRepository.findAllByOrderByIdDesc().stream()
                .map(PedidoRecebidoResponse::from)
                .toList();
    }

    public void registrarParecer(Long id, String usuario, ParecerRequest request) {
        Agente agente = agenteRepository.findByUsuario(usuario)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.FORBIDDEN, "Apenas agentes podem avaliar pedidos"));
        PedidoAluguel pedido = pedidoRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Pedido não encontrado"));

        if (pedido.getStatus() != StatusPedido.EM_ANALISE) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Este pedido já foi avaliado");
        }
        boolean positivo = request.positivo();
        if (!positivo && (request.observacoes() == null || request.observacoes().isBlank())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Explique o motivo do parecer negativo");
        }

        ParecerFinanceiro parecer = new ParecerFinanceiro();
        parecer.setPedido(pedido);
        parecer.setAgente(agente);
        parecer.setPositivo(positivo);
        parecer.setObservacoes(request.observacoes());

        pedido.setParecer(parecer); 
        pedido.setStatus(positivo ? StatusPedido.APROVADO : StatusPedido.REPROVADO);
    }

    private void preencher(PedidoAluguel pedido, Cliente cliente, NovoPedidoRequest request) {
        pedido.setDataRetirada(request.dataRetirada());
        pedido.setDataDevolucao(request.dataDevolucao());
        pedido.setAutomovel(resolverAutomovel(cliente, request.automovel()));
        pedido.setBancoSolicitado(resolverBanco(request.bancoId()));
    }

    private Automovel resolverAutomovel(Cliente cliente, AutomovelRequest dados) {
        if (dados.proprietario() != TipoConta.CLIENTE) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Por enquanto só é possível alugar automóveis do próprio cliente");
        }
        return automovelRepository.findByPlaca(dados.placa()).orElseGet(() -> {
            Automovel automovel = new Automovel();
            automovel.setMarca(dados.marca());
            automovel.setModelo(dados.modelo());
            automovel.setAno(dados.ano());
            automovel.setPlaca(dados.placa());
            automovel.setMatricula(dados.matricula());
            automovel.setProprietario(cliente);
            return automovelRepository.save(automovel);
        });
    }

    private Agente resolverBanco(Long bancoId) {
        if (bancoId == null) {
            return null;
        }
        return agenteRepository.findByIdAndTipo(bancoId, TipoAgente.BANCO)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Banco inválido"));
    }

    private void validarDatas(NovoPedidoRequest request) {
        if (request.dataDevolucao().isBefore(request.dataRetirada())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "A devolução não pode ser antes da retirada");
        }
    }

    private void exigirAlteravel(PedidoAluguel pedido) {
        if (!pedido.permiteAlteracao()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "Só é possível alterar pedidos em análise ou aprovados");
        }
    }

    private Cliente obterCliente(String usuario) {
        return clienteRepository.findByUsuario(usuario)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.FORBIDDEN, "Apenas clientes podem acessar seus pedidos"));
    }

    private PedidoAluguel obterPedidoDoCliente(Long id, String usuario) {
        Cliente cliente = obterCliente(usuario);
        return pedidoRepository.findByIdAndClienteId(id, cliente.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Pedido não encontrado"));
    }
}