package com.mnsr.domain;

public record Obra(String id, String titulo, String autor, Integer ano, Tema tema,
                   String salaId, int minutos, int pontos) {
    public Obra {
        if (id == null || id.isBlank() || titulo == null || titulo.isBlank()
                || autor == null || autor.isBlank() || tema == null
                || salaId == null || salaId.isBlank() || minutos <= 0 || pontos < 0) {
            throw new IllegalArgumentException("Dados da obra inválidos");
        }
    }
}
