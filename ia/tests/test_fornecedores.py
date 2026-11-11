"""Adaptadores do Gemini testados com um cliente falso (sem rede nem chave)."""

from types import SimpleNamespace

import numpy as np
import pytest

from app.config import Configuracao
from app.embeddings import EmbeddingsGemini, EmbeddingsLocais
from app.fabrica import criar_assistente, criar_componentes
from app.llm import ErroModelo, ModeloExtrativo, ModeloGemini


class ClienteFalso:
    def __init__(self, erro: Exception | None = None, texto: str | None = " Olá! ") -> None:
        self.pedidos: list[dict] = []
        self.models = self
        self._erro = erro
        self._texto = texto

    def embed_content(self, **kwargs):
        self.pedidos.append(kwargs)
        return SimpleNamespace(embeddings=[SimpleNamespace(values=[3.0, 4.0]) for _ in kwargs["contents"]])

    def generate_content(self, **kwargs):
        self.pedidos.append(kwargs)
        if self._erro:
            raise self._erro
        return SimpleNamespace(text=self._texto)


@pytest.mark.parametrize(("tipo", "tarefa"), [("documento", "RETRIEVAL_DOCUMENT"), ("pergunta", "RETRIEVAL_QUERY")])
def test_embeddings_gemini_pedido_e_normalizacao(tipo, tarefa):
    cliente = ClienteFalso()
    v = EmbeddingsGemini(cliente, "modelo-x").gerar(["a", "b"], tipo)
    assert np.allclose(v, [[0.6, 0.8], [0.6, 0.8]])
    assert cliente.pedidos[0]["model"] == "modelo-x"
    assert cliente.pedidos[0]["config"].task_type == tarefa


def test_modelo_gemini_envia_instrucoes_e_temperatura_baixa():
    cliente = ClienteFalso()
    assert ModeloGemini(cliente, "chat-x").responder("regras", "mensagem") == "Olá!"
    pedido = cliente.pedidos[0]
    assert pedido["contents"] == "mensagem"
    assert pedido["config"].system_instruction == "regras"
    assert pedido["config"].temperature <= 0.3


def test_modelo_gemini_texto_nulo_devolve_vazio():
    assert ModeloGemini(ClienteFalso(texto=None), "x").responder("r", "m") == ""


def test_modelo_gemini_converte_erros():
    with pytest.raises(ErroModelo):
        ModeloGemini(ClienteFalso(erro=TimeoutError("sem rede")), "x").responder("r", "m")


def test_modelo_extrativo_sem_excertos():
    assert ModeloExtrativo().responder("", "sem blocos") == "Segundo os textos do museu: "


def test_fabrica_local():
    e, m = criar_componentes(Configuracao(fornecedor="local"))
    assert isinstance(e, EmbeddingsLocais) and isinstance(m, ModeloExtrativo)


def test_fabrica_gemini_sem_chave_da_erro():
    with pytest.raises(ValueError, match="GEMINI_API_KEY"):
        criar_componentes(Configuracao(fornecedor="gemini"))


def test_fabrica_gemini_com_chave_cria_adaptadores():
    e, m = criar_componentes(Configuracao(fornecedor="gemini", gemini_api_key="chave-de-teste"))
    assert isinstance(e, EmbeddingsGemini) and isinstance(m, ModeloGemini)


def test_fabrica_fornecedor_desconhecido():
    with pytest.raises(ValueError, match="desconhecido"):
        criar_componentes(Configuracao(fornecedor="outro"))


def test_limiar_configurado_tem_prioridade():
    # Com limiar 1.01 nada é relevante, por isso até a pergunta certa dá "não sei".
    a = criar_assistente(Configuracao(fornecedor="local", limiar=1.01))
    assert not a.responder("Quem é o autor de O Desterro?").encontrou


def test_configuracao_do_ambiente():
    c = Configuracao.do_ambiente(
        {
            "IA_FORNECEDOR": " GEMINI ",
            "GEMINI_API_KEY": "k",
            "IA_LIMIAR": "0.7",
            "IA_TOP_K": "5",
            "IA_CORPUS": "corpus-x",
        }
    )
    assert (c.fornecedor, c.gemini_api_key, c.limiar, c.top_k, str(c.pasta_corpus)) == (
        "gemini",
        "k",
        0.7,
        5,
        "corpus-x",
    )
    vazio = Configuracao.do_ambiente({})
    assert vazio.fornecedor == "local" and vazio.limiar is None and vazio.gemini_api_key is None
