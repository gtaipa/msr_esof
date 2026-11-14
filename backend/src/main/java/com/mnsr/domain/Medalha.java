package com.mnsr.domain;

public record Medalha(String id, String nome, int obrasNecessarias) {
    public Medalha {
        if (id == null || id.isBlank() || nome == null || nome.isBlank() || obrasNecessarias < 1)
            throw new IllegalArgumentException("Dados da medalha inválidos");
    }
}
