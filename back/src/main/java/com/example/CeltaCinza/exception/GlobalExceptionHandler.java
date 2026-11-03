package com.celtacinza.exception;

import com.celtacinza.dto.ErroResponse;
import jakarta.validation.ConstraintViolationException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.validation.FieldError;
import org.springframework.validation.ObjectError;
import org.springframework.web.HttpMediaTypeNotSupportedException;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.servlet.resource.NoResourceFoundException;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * Centraliza a tradução de erros do back-end em uma resposta JSON padronizada:
 * { "status": 400, "mensagem": "...", "detalhes": ["Campo: motivo", ...] }
 */
@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Map<String, String> ROTULOS_CAMPOS = Map.ofEntries(
            Map.entry("tipoConta", "Tipo de conta"),
            Map.entry("nome", "Nome"),
            Map.entry("usuario", "Usuário"),
            Map.entry("senha", "Senha"),
            Map.entry("cpf", "CPF"),
            Map.entry("rg", "RG"),
            Map.entry("endereco", "Endereço"),
            Map.entry("profissao", "Profissão"),
            Map.entry("automovel", "Automóvel"),
            Map.entry("marca", "Marca"),
            Map.entry("modelo", "Modelo"),
            Map.entry("ano", "Ano"),
            Map.entry("placa", "Placa"),
            Map.entry("matricula", "Matrícula"),
            Map.entry("proprietario", "Proprietário"),
            Map.entry("dataRetirada", "Data de retirada"),
            Map.entry("dataDevolucao", "Data de devolução"),
            Map.entry("bancoId", "Banco"),
            Map.entry("positivo", "Parecer"),
            Map.entry("observacoes", "Observações"),
            Map.entry("prazoMeses", "Prazo em meses"),
            Map.entry("entidadeEmpregadora", "Entidade empregadora"),
            Map.entry("valor", "Valor"),
            Map.entry("rendimentos", "Rendimentos"),
            Map.entry("id", "Identificador")
    );

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErroResponse> tratarDadosInvalidos(MethodArgumentNotValidException ex) {
        List<String> detalhes = new ArrayList<>();

        for (FieldError erro : ex.getBindingResult().getFieldErrors()) {
            detalhes.add(rotulo(erro.getField()) + ": " + mensagemOuPadrao(erro));
        }
        for (ObjectError erro : ex.getBindingResult().getGlobalErrors()) {
            detalhes.add(mensagemOuPadrao(erro));
        }

        return responder(HttpStatus.BAD_REQUEST,
                "Dados inválidos. Verifique os campos informados.", detalhes);
    }

    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<ErroResponse> tratarViolacaoDeConstraint(ConstraintViolationException ex) {
        List<String> detalhes = ex.getConstraintViolations().stream()
                .map(v -> {
                    String campo = v.getPropertyPath() == null ? "" : v.getPropertyPath().toString();
                    String nome = campo.contains(".") ? campo.substring(campo.lastIndexOf('.') + 1) : campo;
                    return nome.isBlank() ? v.getMessage() : rotulo(nome) + ": " + v.getMessage();
                })
                .distinct()
                .toList();

        return responder(HttpStatus.BAD_REQUEST,
                "Dados inválidos. Verifique os campos informados.", detalhes);
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ErroResponse> tratarCorpoIlegivel(HttpMessageNotReadableException ex) {
        log.debug("Corpo da requisição inválido: {}", ex.getMessage());
        return responder(HttpStatus.BAD_REQUEST,
                "Dados com formato inválido. Verifique datas, números e opções enviadas.",
                List.of("O corpo da requisição não pôde ser lido. Confira se todos os campos estão no formato correto."));
    }

    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<ErroResponse> tratarParametroInvalido(MethodArgumentTypeMismatchException ex) {
        String nome = ex.getName() == null ? "parâmetro" : ex.getName();
        return responder(HttpStatus.BAD_REQUEST,
                "Parâmetro inválido na requisição.",
                List.of(rotulo(nome) + ": o valor informado não é válido."));
    }

    @ExceptionHandler(MissingServletRequestParameterException.class)
    public ResponseEntity<ErroResponse> tratarParametroAusente(MissingServletRequestParameterException ex) {
        return responder(HttpStatus.BAD_REQUEST,
                "Parâmetro obrigatório não informado.",
                List.of(rotulo(ex.getParameterName()) + ": é obrigatório."));
    }

    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<ErroResponse> tratarErroDeNegocio(ResponseStatusException ex) {
        HttpStatusCode status = ex.getStatusCode();
        String mensagem = ex.getReason() != null && !ex.getReason().isBlank()
                ? ex.getReason()
                : "Não foi possível concluir a solicitação.";
        return responder(status, mensagem, List.of());
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ErroResponse> tratarConflitoDeDados(DataIntegrityViolationException ex) {
        log.warn("Violação de integridade no banco de dados: {}", ex.getMostSpecificCause().getMessage());
        return responder(HttpStatus.CONFLICT,
                "Não foi possível salvar os dados porque eles conflitam com um registro existente.",
                List.of("Verifique se o usuário, CPF, placa ou matrícula informados já estão cadastrados."));
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ErroResponse> tratarAcessoNegado(AccessDeniedException ex) {
        return responder(HttpStatus.FORBIDDEN,
                "Você não tem permissão para realizar esta ação.", List.of());
    }

    @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
    public ResponseEntity<ErroResponse> tratarMetodoNaoSuportado(HttpRequestMethodNotSupportedException ex) {
        return responder(HttpStatus.METHOD_NOT_ALLOWED,
                "Método HTTP não permitido para este recurso.", List.of());
    }

    @ExceptionHandler(HttpMediaTypeNotSupportedException.class)
    public ResponseEntity<ErroResponse> tratarTipoDeConteudoNaoSuportado(HttpMediaTypeNotSupportedException ex) {
        return responder(HttpStatus.UNSUPPORTED_MEDIA_TYPE,
                "Formato de conteúdo não suportado. Envie os dados como application/json.", List.of());
    }

    @ExceptionHandler(NoResourceFoundException.class)
    public ResponseEntity<ErroResponse> tratarRecursoNaoEncontrado(NoResourceFoundException ex) {
        return responder(HttpStatus.NOT_FOUND, "Recurso não encontrado.", List.of());
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErroResponse> tratarErroInesperado(Exception ex) {
        log.error("Erro inesperado ao processar a requisição", ex);
        return responder(HttpStatus.INTERNAL_SERVER_ERROR,
                "Ocorreu um erro inesperado no servidor. Tente novamente em instantes.", List.of());
    }

    private ResponseEntity<ErroResponse> responder(HttpStatusCode status, String mensagem, List<String> detalhes) {
        return ResponseEntity.status(status)
                .body(new ErroResponse(status.value(), mensagem, detalhes));
    }

    private String rotulo(String campo) {
        if (campo == null || campo.isBlank()) {
            return "Campo";
        }
        String nome = campo.contains(".") ? campo.substring(campo.lastIndexOf('.') + 1) : campo;
        return ROTULOS_CAMPOS.getOrDefault(nome, nome);
    }

    private String mensagemOuPadrao(ObjectError erro) {
        String mensagem = erro.getDefaultMessage();
        return mensagem == null || mensagem.isBlank() ? "valor inválido." : mensagem;
    }
}
