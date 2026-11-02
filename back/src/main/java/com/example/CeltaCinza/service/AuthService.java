package com.celtacinza.service;

import com.celtacinza.dto.*;
import com.celtacinza.model.Agente;
import com.celtacinza.model.Cliente;
import com.celtacinza.model.TipoAgente;
import com.celtacinza.model.Usuario;
import com.celtacinza.repository.AgenteRepository;
import com.celtacinza.repository.ClienteRepository;
import com.celtacinza.repository.UsuarioRepository;
import com.celtacinza.security.JwtService;
import com.celtacinza.validation.CpfValidator;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final ClienteRepository clienteRepository;
    private final AgenteRepository agenteRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final CpfValidator cpfValidator = new CpfValidator();

    @Transactional(readOnly = true)
    public LoginResponse login(LoginRequest request) {
        String usuario = texto(request.usuario());
        Usuario usuarioEncontrado = usuarioRepository.findByEmail(usuario)
                .filter(u -> passwordEncoder.matches(request.senha(), u.getSenha()))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED,
                        "Usuário ou senha inválidos"));

        return new LoginResponse(jwtService.gerarToken(usuarioEncontrado), UsuarioLogadoResponse.from(usuarioEncontrado));
    }

    public void cadastrar(CadastroRequest request) {
        if (request.tipoConta() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Informe o tipo de conta");
        }

        String nome = texto(request.nome());
        String usuario = texto(request.usuario());
        String cpf = apenasDigitos(request.cpf());
        String rg = texto(request.rg());
        String endereco = texto(request.endereco());
        String profissao = texto(request.profissao());

        if (usuario.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Informe o usuário");
        }
        if (usuarioRepository.existsByEmail(usuario)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "Esse usuário já está em uso. Escolha outro.");
        }

        String senhaHash = passwordEncoder.encode(request.senha());

        if (request.tipoConta() == TipoConta.CLIENTE) {
            validarDadosDoCliente(cpf, rg, endereco, profissao);

            if (clienteRepository.existsByCpf(cpf)) {
                throw new ResponseStatusException(HttpStatus.CONFLICT, "Já existe uma conta cadastrada com esse CPF.");
            }

            Cliente cliente = new Cliente();
            cliente.setNome(nome);
            cliente.setEmail(usuario);
            cliente.setSenha(senhaHash);
            cliente.setCpf(cpf);
            cliente.setRg(rg);
            cliente.setEndereco(endereco);
            cliente.setProfissao(profissao);
            clienteRepository.save(cliente);
        } else {
            Agente agente = new Agente();
            agente.setNome(nome);
            agente.setEmail(usuario);
            agente.setSenha(senhaHash);
            agente.setTipo(request.tipoConta() == TipoConta.BANCO ? TipoAgente.BANCO : TipoAgente.EMPRESA);
            agenteRepository.save(agente);
        }
    }

    private void validarDadosDoCliente(String cpf, String rg, String endereco, String profissao) {
        List<String> faltando = new ArrayList<>();
        if (cpf.isEmpty()) faltando.add("CPF");
        if (rg.isEmpty()) faltando.add("RG");
        if (endereco.isEmpty()) faltando.add("endereço");
        if (profissao.isEmpty()) faltando.add("profissão");

        if (!faltando.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Para criar uma conta de cliente, informe também: " + String.join(", ", faltando) + ".");
        }
        if (!cpfValidator.isValid(cpf, null)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "CPF inválido. Confira os 11 dígitos informados.");
        }
    }

    private String texto(String valor) {
        return valor == null ? "" : valor.trim();
    }

    private String apenasDigitos(String valor) {
        return valor == null ? "" : valor.replaceAll("\\D", "");
    }
}
