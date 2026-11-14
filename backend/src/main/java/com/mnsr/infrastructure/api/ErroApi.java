package com.mnsr.infrastructure.api;

import java.time.Instant;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class ErroApi {
    private static final Logger log = LoggerFactory.getLogger(ErroApi.class);

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, Object>> pedidoInvalido(IllegalArgumentException erro) {
        log.warn("Pedido inválido: {}", erro.getMessage());
        return erroPedido(erro.getMessage());
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<Map<String, Object>> jsonMalformado(HttpMessageNotReadableException erro) {
        log.warn("JSON de pedido malformado");
        return erroPedido("O corpo do pedido não contém JSON válido");
    }

    private ResponseEntity<Map<String, Object>> erroPedido(String mensagem) {
        return ResponseEntity.badRequest().body(Map.of("timestamp", Instant.now().toString(),
                "status", 400, "erro", "Pedido inválido", "mensagem", mensagem));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> erroInterno(Exception erro) {
        log.error("Erro interno na API", erro);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                "timestamp", Instant.now().toString(), "status", 500,
                "erro", "Erro interno", "mensagem", "Não foi possível concluir o pedido"));
    }
}
