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
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final ClienteRepository clienteRepository;
    private final AgenteRepository agenteRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    @Transactional(readOnly = true)
    public LoginResponse login(LoginRequest request) {
        Usuario usuario = buscarPorEmail(request.usuario())
                .filter(u -> passwordEncoder.matches(request.senha(), u.getSenha()))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Usuário ou senha inválidos"));

        return new LoginResponse(jwtService.gerarToken(usuario), UsuarioLogadoResponse.from(usuario));
    }

    public void cadastrar(CadastroRequest request) {
        if (buscarPorEmail(request.usuario()).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Esse usuário já está em uso");
        }

        String senhaHash = passwordEncoder.encode(request.senha());

        if (request.tipoConta() == TipoConta.CLIENTE) {
            if (clienteRepository.existsByCpf(request.cpf())) {
                throw new ResponseStatusException(HttpStatus.CONFLICT, "CPF já cadastrado");
            }
            Cliente cliente = new Cliente();
            cliente.setNome(request.nome());
            cliente.setEmail(request.usuario());
            cliente.setSenha(senhaHash);
            cliente.setCpf(request.cpf());
            cliente.setRg(request.rg());
            cliente.setEndereco(request.endereco());
            cliente.setProfissao(request.profissao());
            clienteRepository.save(cliente);
        } else {
            Agente agente = new Agente();
            agente.setNome(request.nome());
            agente.setEmail(request.usuario());
            agente.setSenha(senhaHash);
            agente.setTipo(request.tipoConta() == TipoConta.BANCO ? TipoAgente.BANCO : TipoAgente.EMPRESA);
            agenteRepository.save(agente);
        }
    }

    private Optional<Usuario> buscarPorEmail(String email) {
        return usuarioRepository.findAll().stream()
                .filter(u -> email.equals(u.getEmail()))
                .findFirst();
    }
}