package com.mnsr.application;

import com.mnsr.domain.Obra;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class ListarObras {
    private static final Logger log = LoggerFactory.getLogger(ListarObras.class);
    private final ObrasRepository obras;
    public ListarObras(ObrasRepository obras) { this.obras = obras; }
    public List<Obra> executar() {
        log.info("A listar obras do acervo");
        return obras.listar();
    }
}
