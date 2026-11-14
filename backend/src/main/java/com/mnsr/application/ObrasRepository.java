package com.mnsr.application;

import com.mnsr.domain.Obra;
import java.util.List;
import java.util.Optional;

public interface ObrasRepository {
    List<Obra> listar();
    Optional<Obra> encontrar(String id);
}
