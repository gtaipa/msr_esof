package com.mnsr;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

/**
 * Teste de fumo: confirma que a aplicação Spring arranca.
 * Serve para o CI provar desde já que os testes do backend correm.
 */
@SpringBootTest
class ApplicationTests {

    @Test
    void contextoArranca() {
        // Se o contexto do Spring não arrancar, este teste falha.
    }
}
