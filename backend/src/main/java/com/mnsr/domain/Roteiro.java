package com.mnsr.domain;

import java.util.List;

public record Roteiro(String id, String nome, int tempo, List<Obra> obras, int minutosTotais) {
    public Roteiro {
        obras = List.copyOf(obras);
        if (id == null || id.isBlank() || nome == null || nome.isBlank()
                || tempo <= 0 || obras.size() < 3 || obras.size() > 5
                || minutosTotais > tempo || minutosTotais != obras.stream().mapToInt(Obra::minutos).sum()) {
            throw new IllegalArgumentException("Roteiro inválido");
        }
    }
}
