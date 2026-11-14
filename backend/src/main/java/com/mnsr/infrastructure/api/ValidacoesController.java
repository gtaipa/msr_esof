package com.mnsr.infrastructure.api;

import com.mnsr.application.ValidarQrCode;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/validacoes")
public class ValidacoesController {
    private static final Logger log = LoggerFactory.getLogger(ValidacoesController.class);
    private final ValidarQrCode validarQrCode;
    public ValidacoesController(ValidarQrCode validarQrCode) { this.validarQrCode = validarQrCode; }
    @PostMapping public ValidacaoDto validar(@RequestBody(required = false) QrPedido pedido) {
        log.info("POST /api/validacoes");
        if (pedido == null || pedido.texto() == null)
            throw new IllegalArgumentException("O campo texto é obrigatório");
        var resultado = validarQrCode.executar(pedido.texto());
        return new ValidacaoDto(resultado.valido(), resultado.motivo(), resultado.obraId(),
                resultado.novo(), resultado.medalhasDesbloqueadas());
    }
    public record ValidacaoDto(boolean valido, String motivo, String obraId, boolean novo,
                               List<String> medalhasDesbloqueadas) {}
}
