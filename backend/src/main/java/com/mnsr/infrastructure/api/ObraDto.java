package com.mnsr.infrastructure.api;

import com.mnsr.domain.Obra;

public record ObraDto(String id, String titulo, String autor, Integer ano, String tema,
                      String salaId, int minutos, int pontos) {
    public static ObraDto de(Obra obra) {
        return new ObraDto(obra.id(), obra.titulo(), obra.autor(), obra.ano(), obra.tema().valor(),
                obra.salaId(), obra.minutos(), obra.pontos());
    }
}
