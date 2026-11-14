package com.mnsr.domain;

public record Sala(String id, String nome) {
    public Sala {
        if (id == null || id.isBlank() || nome == null || nome.isBlank())
            throw new IllegalArgumentException("Dados da sala inválidos");
    }
}
