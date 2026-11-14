package com.mnsr.infrastructure.api;

import com.mnsr.domain.Roteiro;
import java.util.List;

public record RoteiroDto(String id, String nome, int tempo, List<ObraDto> obras, int minutosTotais) {
    public static RoteiroDto de(Roteiro roteiro) {
        return new RoteiroDto(roteiro.id(), roteiro.nome(), roteiro.tempo(),
                roteiro.obras().stream().map(ObraDto::de).toList(), roteiro.minutosTotais());
    }
}
