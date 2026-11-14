package com.mnsr.application;

import com.mnsr.domain.Obra;
import com.mnsr.domain.Roteiro;
import com.mnsr.domain.Tema;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class GerarRoteiro {
    private static final Logger log = LoggerFactory.getLogger(GerarRoteiro.class);
    private final ObrasRepository obras;
    public GerarRoteiro(ObrasRepository obras) { this.obras = obras; }

    public Roteiro executar(int tempo, String temaRecebido) {
        if (tempo != 30 && tempo != 60 && tempo != 90)
            throw new IllegalArgumentException("O tempo deve ser 30, 60 ou 90 minutos");
        Tema tema = Tema.de(temaRecebido);
        log.info("A gerar roteiro: tempo={} tema={}", tempo, temaRecebido);
        List<Obra> selecionadas = obras.listar().stream()
                .filter(obra -> obra.tema() == tema)
                .filter(obra -> obra.minutos() <= tempo)
                .sorted((a, b) -> Integer.compare(a.minutos(), b.minutos()))
                .limit(5)
                .collect(Collectors.toList());
        // Seleção gulosa simples; evita ultrapassar o tempo e limita o roteiro a cinco obras.
        while (selecionadas.stream().mapToInt(Obra::minutos).sum() > tempo) {
            selecionadas = selecionadas.subList(0, selecionadas.size() - 1);
        }
        if (selecionadas.size() < 3)
            throw new IllegalArgumentException("Não existem pelo menos 3 obras deste tema para o tempo pedido");
        int total = selecionadas.stream().mapToInt(Obra::minutos).sum();
        return new Roteiro(UUID.randomUUID().toString(), "Roteiro de " + temaRecebido,
                tempo, selecionadas, total);
    }
}
