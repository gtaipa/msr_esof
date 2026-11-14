package com.mnsr.domain;

public enum Tema {
    ESCULTURA("escultura"),
    PINTURA("pintura"),
    ARTES_DECORATIVAS("artes-decorativas");

    private final String valor;

    Tema(String valor) { this.valor = valor; }

    public String valor() { return valor; }

    public static Tema de(String valor) {
        for (Tema tema : values()) if (tema.valor.equals(valor)) return tema;
        throw new IllegalArgumentException("Tema inválido: " + valor);
    }
}
