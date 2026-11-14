package com.mnsr.infrastructure.api;

import com.mnsr.application.ListarObras;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/obras")
public class ObrasController {
    private static final Logger log = LoggerFactory.getLogger(ObrasController.class);
    private final ListarObras listarObras;
    public ObrasController(ListarObras listarObras) { this.listarObras = listarObras; }
    @GetMapping public List<ObraDto> listar() {
        log.info("GET /api/obras");
        return listarObras.executar().stream().map(ObraDto::de).toList();
    }
}
