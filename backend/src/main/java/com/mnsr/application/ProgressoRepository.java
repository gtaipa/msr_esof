package com.mnsr.application;

import java.time.Instant;
import java.util.Map;

public interface ProgressoRepository {
    boolean registar(String obraId, Instant data);
    Map<String, Instant> listar();
}
