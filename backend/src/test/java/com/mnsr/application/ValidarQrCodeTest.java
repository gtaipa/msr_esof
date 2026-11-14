package com.mnsr.application;

import static org.junit.jupiter.api.Assertions.*;
import com.mnsr.domain.Obra;
import com.mnsr.domain.Tema;
import java.time.Instant;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import org.junit.jupiter.api.Test;

class ValidarQrCodeTest {
    private final Obra obra = new Obra("o1", "Obra", "Autor", null, Tema.PINTURA, "s1", 10, 20);
    private final Map<String, Instant> guardadas = new HashMap<>();
    private final ProgressoRepository progresso = new ProgressoRepository() {
        public boolean registar(String id, Instant data) { return guardadas.putIfAbsent(id, data) == null; }
        public Map<String, Instant> listar() { return Map.copyOf(guardadas); }
    };
    private final ObrasRepository obras = new ObrasRepository() {
        public List<Obra> listar() { return List.of(obra); }
        public Optional<Obra> encontrar(String id) { return id.equals("o1") ? Optional.of(obra) : Optional.empty(); }
    };

    @Test void validaCodigoEImpedeRepeticao() {
        var useCase = new ValidarQrCode(obras, progresso);
        assertTrue(useCase.executar("MNSR:OBRA:o1").novo());
        assertFalse(useCase.executar("MNSR:OBRA:o1").novo());
        assertEquals(List.of("m1"), useCase.executar("MNSR:OBRA:o1").medalhasDesbloqueadas());
    }
    @Test void distingueFormatoEObraDesconhecida() {
        var useCase = new ValidarQrCode(obras, progresso);
        assertEquals("formato", useCase.executar("inválido").motivo());
        assertEquals("desconhecido", useCase.executar("MNSR:OBRA:outro").motivo());
        assertThrows(IllegalArgumentException.class, () -> useCase.executar(" "));
    }
}
