package com.mnsr.infrastructure.api;

import com.mnsr.application.GerarRoteiro;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/roteiros")
public class RoteirosController {
    private static final Logger log = LoggerFactory.getLogger(RoteirosController.class);
    private final GerarRoteiro gerarRoteiro;
    public RoteirosController(GerarRoteiro gerarRoteiro) { this.gerarRoteiro = gerarRoteiro; }
    @PostMapping public RoteiroDto gerar(@RequestBody(required = false) RoteiroPedido pedido) {
        log.info("POST /api/roteiros");
        if (pedido == null || pedido.tempo() == null || pedido.tema() == null)
            throw new IllegalArgumentException("Os campos tempo e tema são obrigatórios");
        return RoteiroDto.de(gerarRoteiro.executar(pedido.tempo(), pedido.tema()));
    }
}
