import pytest

from app.prompts import RESPOSTA_DESCONHECIDA
from tests.conftest import ModeloEspiao


def test_pergunta_conhecida_envia_excerto_certo_ao_modelo(assistente_espiao, espiao):
    r = assistente_espiao.responder("Quem pintou a Obra Azul?")
    assert r.encontrou and r.texto == "Resposta do modelo."
    assert r.fontes[0] == "Obra Azul"
    _, mensagem = espiao.chamadas[0]
    assert "Ana Lopes" in mensagem and "<pergunta>\nQuem pintou a Obra Azul?\n</pergunta>" in mensagem


def test_pergunta_fora_do_corpus_nao_chama_o_modelo(assistente_espiao, espiao):
    r = assistente_espiao.responder("Qual é o resultado do jogo de futebol de ontem?")
    assert not r.encontrou and r.texto == RESPOSTA_DESCONHECIDA and r.fontes == []
    assert espiao.chamadas == []


def test_modelo_que_diz_nao_saber_conta_como_nao_encontrado(assistente_espiao, espiao):
    espiao.resposta = RESPOSTA_DESCONHECIDA
    r = assistente_espiao.responder("Em que ano a Obra Azul foi pintada?")
    assert not r.encontrou and r.fontes == []


def test_resposta_vazia_do_modelo_conta_como_nao_encontrado(assistente_espiao, espiao):
    espiao.resposta = ""
    assert not assistente_espiao.responder("Quem pintou a Obra Azul?").encontrou


@pytest.mark.parametrize(
    ("faixa", "esperado"),
    [("crianca", "criança de 6 a 12"), ("jovem", "jovem de 13 a 25"), ("adulto", "adulto")],
)
def test_instrucoes_adaptam_se_a_faixa_etaria(assistente_espiao, espiao, faixa, esperado):
    assistente_espiao.responder("Quem pintou a Obra Azul?", faixa)
    instrucoes, _ = espiao.chamadas[0]
    assert esperado in instrucoes and "APENAS com base nos excertos" in instrucoes


@pytest.mark.parametrize("pergunta", ["", "   ", "x" * 501])
def test_perguntas_invalidas(assistente_espiao, pergunta):
    with pytest.raises(ValueError):
        assistente_espiao.responder(pergunta)


def test_indexar_lista_vazia_nao_faz_nada():
    from app.embeddings import EmbeddingsLocais
    from app.rag import AssistenteRAG

    a = AssistenteRAG(EmbeddingsLocais(), ModeloEspiao(), limiar=0.2)
    a.indexar([])
    assert a.total_trechos == 0
    assert not a.responder("Quem pintou a Obra Azul?").encontrou
