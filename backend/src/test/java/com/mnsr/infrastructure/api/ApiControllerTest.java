package com.mnsr.infrastructure.api;

import static org.hamcrest.Matchers.both;
import static org.hamcrest.Matchers.greaterThanOrEqualTo;
import static org.hamcrest.Matchers.hasItem;
import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.lessThanOrEqualTo;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import com.mnsr.Application;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest(classes = Application.class)
@AutoConfigureMockMvc
class ApiControllerTest {
    @Autowired MockMvc mvc;

    @Test void listaObrasComTemaDoContrato() throws Exception {
        mvc.perform(get("/api/obras")).andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(8)))
                .andExpect(jsonPath("$[0].tema").value("escultura"));
    }
    @Test void cenarioUs01GeraRoteiroNoTempoPedido() throws Exception {
        mvc.perform(post("/api/roteiros").contentType(MediaType.APPLICATION_JSON)
                        .content("{\"tempo\":60,\"tema\":\"pintura\"}"))
                .andExpect(status().isOk()).andExpect(jsonPath("$.obras", hasSize(both(greaterThanOrEqualTo(3)).and(lessThanOrEqualTo(5)))))
                .andExpect(jsonPath("$.minutosTotais", lessThanOrEqualTo(60)))
                .andExpect(jsonPath("$.origem").doesNotExist());
    }
    @Test void rejeitaPedidoInvalidoComJsonConsistente() throws Exception {
        mvc.perform(post("/api/roteiros").contentType(MediaType.APPLICATION_JSON)
                        .content("{\"tempo\":20,\"tema\":\"pintura\"}"))
                .andExpect(status().isBadRequest()).andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.mensagem").exists());
    }
    @Test void jsonMalformadoTambemTemFormatoDeErroConsistente() throws Exception {
        mvc.perform(post("/api/roteiros").contentType(MediaType.APPLICATION_JSON).content("{"))
                .andExpect(status().isBadRequest()).andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.erro").value("Pedido inválido"));
    }
    @Test void cenarioUs02ValidaQrEDevolveMedalha() throws Exception {
        mvc.perform(post("/api/validacoes").contentType(MediaType.APPLICATION_JSON)
                        .content("{\"texto\":\"MNSR:OBRA:o1\"}"))
                .andExpect(status().isOk()).andExpect(jsonPath("$.valido").value(true))
                .andExpect(jsonPath("$.obraId").value("o1"))
                .andExpect(jsonPath("$.medalhasDesbloqueadas", hasItem("m1")));
    }
    @Test void qrDesconhecidoEFormatoMalformadoSaoRespostasDeDominio() throws Exception {
        mvc.perform(post("/api/validacoes").contentType(MediaType.APPLICATION_JSON).content("{\"texto\":\"MNSR:OBRA:x\"}"))
                .andExpect(status().isOk()).andExpect(jsonPath("$.motivo").value("desconhecido"));
        mvc.perform(post("/api/validacoes").contentType(MediaType.APPLICATION_JSON).content("{\"texto\":\"x\"}"))
                .andExpect(status().isOk()).andExpect(jsonPath("$.motivo").value("formato"));
    }
}
