package com.celtacinza.service;

import com.celtacinza.dto.BancoResponse;
import com.celtacinza.model.TipoAgente;
import com.celtacinza.repository.AgenteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
}