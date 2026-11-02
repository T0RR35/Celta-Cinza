package com.celtacinza.service;

import com.celtacinza.dto.AgenteResponse;
import com.celtacinza.dto.AgenteUpdateRequest;
import com.celtacinza.dto.BancoResponse;
import com.celtacinza.model.Agente;
import com.celtacinza.model.TipoAgente;
import com.celtacinza.repository.AgenteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AgenteService {

    private final AgenteRepository agenteRepository;

    public List<BancoResponse> listarBancos() {
        return agenteRepository.findByTipo(TipoAgente.BANCO).stream()
                .map(BancoResponse::from)
                .toList();
    }

    public AgenteResponse buscar(String usuario) {
        return AgenteResponse.from(obter(usuario));
    }

    @Transactional
    public AgenteResponse atualizar(String usuario, AgenteUpdateRequest request) {
        Agente agente = obter(usuario);
        agente.setNome(request.nome().trim());
        return AgenteResponse.from(agente);
    }

    private Agente obter(String email) {
        return agenteRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Agente não encontrado."));
    }
}
