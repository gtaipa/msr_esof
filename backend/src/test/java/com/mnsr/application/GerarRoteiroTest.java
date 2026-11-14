package com.mnsr.application;

import static org.junit.jupiter.api.Assertions.*;
import com.mnsr.domain.Obra;
import com.mnsr.domain.Tema;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.Test;

class GerarRoteiroTest {
    private final ObrasRepository repository = new ObrasRepository() {
        private final List<Obra> items = List.of(
                new Obra("1", "A", "Autor", null, Tema.PINTURA, "s1", 10, 10),
                new Obra("2", "B", "Autor", null, Tema.PINTURA, "s1", 15, 10),
                new Obra("3", "C", "Autor", null, Tema.PINTURA, "s2", 20, 10),
                new Obra("4", "D", "Autor", null, Tema.ESCULTURA, "s2", 5, 10));
        public List<Obra> listar() { return items; }
        public Optional<Obra> encontrar(String id) { return items.stream().filter(o -> o.id().equals(id)).findFirst(); }
    };

    @Test void criaRoteiroNoLimiteDeTempo() {
        var roteiro = new GerarRoteiro(repository).executar(60, "pintura");
        assertEquals(3, roteiro.obras().size());
        assertEquals(45, roteiro.minutosTotais());
    }
    @Test void rejeitaTempoTemaESelecaoInsuficiente() {
        var useCase = new GerarRoteiro(repository);
        assertThrows(IllegalArgumentException.class, () -> useCase.executar(20, "pintura"));
        assertThrows(IllegalArgumentException.class, () -> useCase.executar(30, "inexistente"));
        assertThrows(IllegalArgumentException.class, () -> useCase.executar(30, "escultura"));
    }
}
