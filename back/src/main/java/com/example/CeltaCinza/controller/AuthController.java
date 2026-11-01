package com.celtacinza.controller;

import com.celtacinza.dto.CadastroRequest;
import com.celtacinza.dto.LoginRequest;
import com.celtacinza.dto.LoginResponse;
import com.celtacinza.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public LoginResponse login(@Valid @RequestBody LoginRequest request) {
        return authService.login(request);
    }

    @PostMapping("/cadastro")
    @ResponseStatus(HttpStatus.CREATED)
    public void cadastrar(@Valid @RequestBody CadastroRequest request) {
        authService.cadastrar(request);
    }
}