from fastapi.testclient import TestClient

from app.llm import ErroModelo
from app.main import criar_app
from app.prompts import RESPOSTA_DESCONHECIDA


def test_chat_responde_com_fontes(assistente_extrativo):
    with TestClient(criar_app(assistente_extrativo)) as cliente:
        r = cliente.post("/api/ia/chat", json={"pergunta": "Quem esculpiu a Estátua Branca?", "faixaEtaria": "crianca"})
    assert r.status_code == 200
    corpo = r.json()
    assert corpo["encontrou"] is True
    assert corpo["fontes"][0] == "Estátua Branca"
    assert "Rui Costa" in corpo["resposta"]


def test_chat_pergunta_desconhecida(assistente_extrativo):
    with TestClient(criar_app(assistente_extrativo)) as cliente:
        r = cliente.post("/api/ia/chat", json={"pergunta": "Que tempo vai fazer amanhã?"})
    assert r.json() == {"resposta": RESPOSTA_DESCONHECIDA, "encontrou": False, "fontes": []}


def test_chat_valida_o_pedido(assistente_extrativo):
    with TestClient(criar_app(assistente_extrativo)) as cliente:
        assert cliente.post("/api/ia/chat", json={"pergunta": ""}).status_code == 422
        assert cliente.post("/api/ia/chat", json={"pergunta": "x", "faixaEtaria": "bebé"}).status_code == 422
        # Só espaços passa no tamanho mínimo, mas o assistente rejeita-o.
        assert cliente.post("/api/ia/chat", json={"pergunta": "   "}).status_code == 422


class AssistenteAvariado:
    total_trechos = 0

    def responder(self, pergunta, faixa):
        raise ErroModelo("chave inválida")


def test_chat_falha_do_fornecedor_da_503():
    with TestClient(criar_app(AssistenteAvariado())) as cliente:
        r = cliente.post("/api/ia/chat", json={"pergunta": "Olá"})
    assert r.status_code == 503
    assert "indisponível" in r.json()["detail"]


def test_arranque_sem_assistente_cria_a_partir_do_ambiente(monkeypatch):
    monkeypatch.setenv("IA_FORNECEDOR", "local")
    with TestClient(criar_app()) as cliente:
        r = cliente.post("/api/ia/chat", json={"pergunta": "Quem é o autor de O Desterro?"})
    assert r.json()["encontrou"] is True
