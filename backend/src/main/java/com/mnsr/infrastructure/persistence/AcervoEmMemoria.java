package com.mnsr.infrastructure.persistence;

import com.mnsr.application.ObrasRepository;
import com.mnsr.domain.Obra;
import com.mnsr.domain.Tema;
import java.util.List;
import java.util.Optional;
import org.springframework.stereotype.Repository;

@Repository
public class AcervoEmMemoria implements ObrasRepository {
    private final List<Obra> obras = List.of(
            new Obra("o1", "O Desterro", "António Soares dos Reis", 1872, Tema.ESCULTURA, "s3", 12, 50),
            new Obra("o2", "Flor Agreste", "António Soares dos Reis", null, Tema.ESCULTURA, "s3", 8, 30),
            new Obra("o3", "Escultura (exemplo A)", "Autor a confirmar", null, Tema.ESCULTURA, "s4", 10, 20),
            new Obra("o4", "Pintura (exemplo A)", "Autor a confirmar", null, Tema.PINTURA, "s1", 10, 20),
            new Obra("o5", "Pintura (exemplo B)", "Autor a confirmar", null, Tema.PINTURA, "s1", 15, 30),
            new Obra("o6", "Pintura (exemplo C)", "Autor a confirmar", null, Tema.PINTURA, "s2", 20, 40),
            new Obra("o7", "Cerâmica (exemplo A)", "Autor a confirmar", null, Tema.ARTES_DECORATIVAS, "s2", 8, 20),
            new Obra("o8", "Ourivesaria (exemplo A)", "Autor a confirmar", null, Tema.ARTES_DECORATIVAS, "s4", 10, 20));
    @Override public List<Obra> listar() { return obras; }
    @Override public Optional<Obra> encontrar(String id) {
        return obras.stream().filter(obra -> obra.id().equals(id)).findFirst();
    }
}
