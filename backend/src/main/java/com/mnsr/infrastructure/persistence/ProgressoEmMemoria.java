package com.mnsr.infrastructure.persistence;

import com.mnsr.application.ProgressoRepository;
import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.stereotype.Repository;

@Repository
public class ProgressoEmMemoria implements ProgressoRepository {
    private final Map<String, Instant> validacoes = new ConcurrentHashMap<>();
    @Override public boolean registar(String obraId, Instant data) {
        return validacoes.putIfAbsent(obraId, data) == null;
    }
    @Override public Map<String, Instant> listar() { return Map.copyOf(validacoes); }
}
