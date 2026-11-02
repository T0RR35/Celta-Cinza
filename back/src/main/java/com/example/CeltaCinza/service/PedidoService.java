package com.celtacinza.service;

import com.celtacinza.dto.*;
import com.celtacinza.model.*;
import com.celtacinza.repository.AgenteRepository;
import com.celtacinza.repository.AutomovelRepository;
import com.celtacinza.repository.ClienteRepository;
import com.celtacinza.repository.PedidoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class PedidoService {

    private static final int ANO_MAXIMO = LocalDate.now().getYear() + 1;

    private final PedidoRepository pedidoRepository;
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
        return PedidoResponse.from(obterPedidoAcessivel(id, usuario));
    }

    public PedidoResponse criar(String usuario, NovoPedidoRequest request) {
        Cliente cliente = obterCliente(usuario);
        validarDatas(request, null);

        Pedido pedido = new Pedido();
        pedido.setCliente(cliente);
        preencher(pedido, cliente, request);
        return PedidoResponse.from(pedidoRepository.save(pedido));
    }

    public PedidoResponse modificar(Long id, String usuario, NovoPedidoRequest request) {
        Pedido pedido = obterPedidoAcessivel(id, usuario);
        exigirAlteravel(pedido);
        validarDatas(request, pedido);

        preencher(pedido, pedido.getCliente(), request);
        return PedidoResponse.from(pedido);
    }

    public void cancelar(Long id, String usuario) {
        Pedido pedido = obterPedidoDoCliente(id, usuario);
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
        Agente agente = agenteRepository.findByEmail(usuario)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.FORBIDDEN,
                        "Apenas agentes podem avaliar pedidos."));
        Pedido pedido = pedidoRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Pedido não encontrado."));

        if (pedido.getStatus() != StatusPedido.EM_ANALISE) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "Este pedido já foi avaliado e não aceita um novo parecer.");
        }

        if (request.positivo() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Informe se o parecer é positivo ou negativo.");
        }

        boolean positivo = request.positivo();
        String observacoes = texto(request.observacoes());
        if (!positivo && observacoes.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Explique nas observações o motivo do parecer negativo.");
        }

        Parecer parecer = new Parecer();
        parecer.setPedido(pedido);
        parecer.setAgente(agente);
        parecer.setPositivo(positivo);
        parecer.setObservacoes(observacoes.isEmpty() ? null : observacoes);

        pedido.setParecer(parecer);
        pedido.setStatus(positivo ? StatusPedido.APROVADO : StatusPedido.REPROVADO);
    }

    private void preencher(Pedido pedido, Cliente cliente, NovoPedidoRequest request) {
        pedido.setDataRetirada(request.dataRetirada());
        pedido.setDataDevolucao(request.dataDevolucao());
        pedido.setAutomovel(resolverAutomovel(cliente, request.automovel(), pedido.getAutomovel()));
        pedido.setBancoSolicitado(resolverBanco(request.bancoId()));
    }

    private Automovel resolverAutomovel(Cliente cliente, AutomovelRequest dados, Automovel atual) {
        if (dados == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Informe os dados do automóvel.");
        }
        if (dados.proprietario() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Informe o proprietário do automóvel.");
        }
        if (dados.proprietario() != TipoConta.CLIENTE) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Por enquanto, o pedido só pode ser feito com um automóvel de propriedade do próprio cliente. "
                            + "Selecione 'Cliente' como proprietário.");
        }
        if (dados.ano() == null || dados.ano() > ANO_MAXIMO) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "O ano do automóvel não pode ser superior a " + ANO_MAXIMO + ".");
        }

        String placa = texto(dados.placa()).toUpperCase();
        String matricula = texto(dados.matricula());

        Automovel porPlaca = automovelRepository.findByPlaca(placa).orElse(null);
        Automovel porMatricula = automovelRepository.findByMatricula(matricula).orElse(null);

        if (porPlaca != null && !ehDoCliente(porPlaca, cliente)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "Já existe um automóvel cadastrado com essa placa para outro proprietário.");
        }
        if (porMatricula != null && !ehDoCliente(porMatricula, cliente)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "Já existe um automóvel cadastrado com essa matrícula para outro proprietário.");
        }

        Automovel automovel;
        if (atual != null && ehDoCliente(atual, cliente)) {
            automovel = atual;
            if (porPlaca != null && !porPlaca.getId().equals(automovel.getId())) {
                throw new ResponseStatusException(HttpStatus.CONFLICT,
                        "Já existe outro automóvel cadastrado com essa placa.");
            }
            if (porMatricula != null && !porMatricula.getId().equals(automovel.getId())) {
                throw new ResponseStatusException(HttpStatus.CONFLICT,
                        "Já existe outro automóvel cadastrado com essa matrícula.");
            }
        } else if (porPlaca != null) {
            automovel = porPlaca;
            if (porMatricula != null && !porMatricula.getId().equals(automovel.getId())) {
                throw new ResponseStatusException(HttpStatus.CONFLICT,
                        "A placa e a matrícula informadas pertencem a automóveis diferentes.");
            }
        } else if (porMatricula != null) {
            automovel = porMatricula;
        } else {
            automovel = new Automovel();
            automovel.setProprietario(cliente);
        }

        automovel.setMarca(texto(dados.marca()));
        automovel.setModelo(texto(dados.modelo()));
        automovel.setAno(dados.ano());
        automovel.setPlaca(placa);
        automovel.setMatricula(matricula);
        return automovel.getId() == null ? automovelRepository.save(automovel) : automovel;
    }

    private boolean ehDoCliente(Automovel automovel, Cliente cliente) {
        return automovel.getProprietario() != null
                && automovel.getProprietario().getId().equals(cliente.getId());
    }

    private Agente resolverBanco(Long bancoId) {
        if (bancoId == null) {
            return null;
        }
        return agenteRepository.findByIdAndTipo(bancoId, TipoAgente.BANCO)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "Banco selecionado não encontrado. Atualize a página e escolha um banco válido."));
    }

    private void validarDatas(NovoPedidoRequest request, Pedido pedido) {
        if (request.dataRetirada() == null || request.dataDevolucao() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Informe as datas de retirada e devolução.");
        }
        boolean retiradaInalterada = pedido != null && request.dataRetirada().equals(pedido.getDataRetirada());
        if (request.dataRetirada().isBefore(LocalDate.now()) && !retiradaInalterada) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "A data de retirada não pode estar no passado.");
        }
        if (request.dataDevolucao().isBefore(request.dataRetirada())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "A data de devolução não pode ser anterior à data de retirada.");
        }
        boolean devolucaoInalterada = pedido != null && request.dataDevolucao().equals(pedido.getDataDevolucao());
        if (request.dataDevolucao().isBefore(LocalDate.now()) && !devolucaoInalterada) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "A data de devolução não pode estar no passado.");
        }
    }

    private void exigirAlteravel(Pedido pedido) {
        if (!pedido.permiteAlteracao()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "Só é possível alterar ou cancelar pedidos em análise ou aprovados.");
        }
    }

    private Cliente obterCliente(String usuario) {
        return clienteRepository.findByEmail(usuario)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.FORBIDDEN,
                        "Apenas clientes podem acessar seus pedidos."));
    }

    private Pedido obterPedidoDoCliente(Long id, String usuario) {
        Cliente cliente = obterCliente(usuario);
        return pedidoRepository.findByIdAndClienteId(id, cliente.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Pedido não encontrado."));
    }

    private Pedido obterPedidoAcessivel(Long id, String usuario) {
        return clienteRepository.findByEmail(usuario)
                .map(cliente -> pedidoRepository.findByIdAndClienteId(id, cliente.getId())
                        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                                "Pedido não encontrado.")))
                .orElseGet(() -> {
                    agenteRepository.findByEmail(usuario)
                            .orElseThrow(() -> new ResponseStatusException(HttpStatus.FORBIDDEN,
                                    "Apenas clientes ou agentes podem acessar pedidos."));
                    return pedidoRepository.findById(id)
                            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                                    "Pedido não encontrado."));
                });
    }

    private String texto(String valor) {
        return valor == null ? "" : valor.trim();
    }
}
