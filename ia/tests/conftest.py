import pytest

from app.corpus import Trecho
from app.embeddings import EmbeddingsLocais
from app.llm import ModeloExtrativo
from app.rag import AssistenteRAG

# Textos INVENTADOS só para testar o mecanismo (não são factos sobre o museu).
TRECHOS_TESTE = [
    Trecho("a#1", "Obra Azul", "A Obra Azul é uma pintura a óleo feita pela pintora Ana Lopes em Lisboa.", "teste"),
    Trecho(
        "b#1", "Vaso Verde", "O Vaso Verde é uma peça de cerâmica vidrada encontrada numa escavação em Braga.", "teste"
    ),
    Trecho("c#1", "Estátua Branca", "A Estátua Branca foi esculpida em granito pelo escultor Rui Costa.", "teste"),
]


class ModeloEspiao:
    """Modelo falso que regista as chamadas e devolve uma resposta fixa."""

    def __init__(self, resposta: str = "Resposta do modelo.") -> None:
        self.resposta = resposta
        self.chamadas: list[tuple[str, str]] = []

    def responder(self, instrucoes: str, mensagem: str) -> str:
        self.chamadas.append((instrucoes, mensagem))
        return self.resposta


@pytest.fixture
def espiao() -> ModeloEspiao:
    return ModeloEspiao()


@pytest.fixture
def assistente_espiao(espiao: ModeloEspiao) -> AssistenteRAG:
    a = AssistenteRAG(EmbeddingsLocais(), espiao, limiar=0.2)
    a.indexar(TRECHOS_TESTE)
    return a


@pytest.fixture
def assistente_extrativo() -> AssistenteRAG:
    a = AssistenteRAG(EmbeddingsLocais(), ModeloExtrativo(), limiar=0.2)
    a.indexar(TRECHOS_TESTE)
    return a
