package com.mnsr.infrastructure.config;

import com.mnsr.application.GerarRoteiro;
import com.mnsr.application.ListarObras;
import com.mnsr.application.ObrasRepository;
import com.mnsr.application.ProgressoRepository;
import com.mnsr.application.ValidarQrCode;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class CasosDeUsoConfig {
    @Bean ListarObras listarObras(ObrasRepository obras) { return new ListarObras(obras); }
    @Bean GerarRoteiro gerarRoteiro(ObrasRepository obras) { return new GerarRoteiro(obras); }
    @Bean ValidarQrCode validarQrCode(ObrasRepository obras, ProgressoRepository progresso) {
        return new ValidarQrCode(obras, progresso);
    }
}
