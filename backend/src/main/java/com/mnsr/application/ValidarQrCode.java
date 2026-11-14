package com.mnsr.application;

import com.mnsr.domain.Obra;
import java.time.Instant;
import java.util.List;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class ValidarQrCode {
    private static final Logger log = LoggerFactory.getLogger(ValidarQrCode.class);
    private final ObrasRepository obras;
    private final ProgressoRepository progresso;
    public ValidarQrCode(ObrasRepository obras, ProgressoRepository progresso) {
        this.obras = obras; this.progresso = progresso;
    }
    public Resultado executar(String texto) {
        if (texto == null || texto.isBlank()) throw new IllegalArgumentException("O texto do QR code é obrigatório");
        String[] partes = texto.trim().split(":", -1);
        if (partes.length != 3 || !partes[0].equals("MNSR") || !partes[1].equals("OBRA") || partes[2].isBlank())
            return new Resultado(false, "formato", null, false, List.of());
        Obra obra = obras.encontrar(partes[2]).orElse(null);
        if (obra == null) return new Resultado(false, "desconhecido", null, false, List.of());
        boolean novo = progresso.registar(obra.id(), Instant.now());
        Map<String, Instant> validacoes = progresso.listar();
        List<String> medalhas = validacoes.size() >= 5 ? List.of("m1", "m2", "m3")
                : validacoes.size() >= 3 ? List.of("m1", "m2") : List.of("m1");
        log.info("QR validado: obra={} novo={}", obra.id(), novo);
        return new Resultado(true, null, obra.id(), novo, medalhas);
    }
    public record Resultado(boolean valido, String motivo, String obraId, boolean novo, List<String> medalhasDesbloqueadas) {}
}
