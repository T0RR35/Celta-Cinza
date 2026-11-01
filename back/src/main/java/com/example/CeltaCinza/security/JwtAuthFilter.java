package com.celtacinza.security;

import com.celtacinza.dto.Perfil;
import com.celtacinza.model.Usuario;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Slf4j
@Component
@RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtService jwtService;

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain chain
    ) throws ServletException, IOException {

        if (SecurityContextHolder.getContext().getAuthentication() == null) {
            autenticar(request);
        }

        chain.doFilter(request, response);
    }

    private void autenticar(HttpServletRequest request) {
        String header = request.getHeader("Authorization");

        if (header == null || !header.startsWith("Bearer ")) {
            return;
        }

        String token = header.substring(7);

        if (!jwtService.valido(token)) {
            log.debug("Token JWT inválido em {} {}", request.getMethod(), request.getRequestURI());
            return;
        }

        String email = jwtService.extrairEmail(token);
        Usuario usuario = buscarPorEmail(email);

        if (usuario == null) {
            log.debug("Usuário do token não encontrado: {}", email);
            return;
        }

        UserDetails principal = User.withUsername(usuario.getEmail())
                .password(usuario.getSenha())
                .authorities("ROLE_" + Perfil.de(usuario).name())
                .build();

        var authentication = new UsernamePasswordAuthenticationToken(
                principal,
                null,
                principal.getAuthorities()
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
    }

    private Usuario buscarPorEmail(String email) {
        return entityManager
                .createQuery("select u from Usuario u where u.email = :email", Usuario.class)
                .setParameter("email", email)
                .getResultStream()
                .findFirst()
                .orElse(null);
    }
}
