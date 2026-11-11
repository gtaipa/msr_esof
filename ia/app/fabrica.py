"""Padrão Factory Method: cria o assistente certo conforme a configuração.

O resto do código pede "um assistente" e não precisa de saber se é Gemini ou local.
"""

from __future__ import annotations

from app.config import Configuracao
from app.corpus import ler_corpus
from app.embeddings import EmbeddingsGemini, EmbeddingsLocais, GeradorEmbeddings
from app.llm import ModeloExtrativo, ModeloGemini, ModeloLinguagem
from app.rag import AssistenteRAG

# A semelhança considerada "relevante" depende de como os vetores são gerados.
# ⚠️ Os valores do Gemini são um ponto de partida: calibrar com as perguntas de teste do Zé.
LIMIAR_POR_FORNECEDOR = {"gemini": 0.65, "local": 0.2}


def criar_componentes(config: Configuracao) -> tuple[GeradorEmbeddings, ModeloLinguagem]:
    if config.fornecedor == "local":
        return EmbeddingsLocais(), ModeloExtrativo()
    if config.fornecedor == "gemini":
        if not config.gemini_api_key:
            raise ValueError("IA_FORNECEDOR=gemini exige a variável GEMINI_API_KEY")
        from google import genai

        cliente = genai.Client(api_key=config.gemini_api_key)
        return EmbeddingsGemini(cliente, config.modelo_embeddings), ModeloGemini(cliente, config.modelo_chat)
    raise ValueError(f"Fornecedor de IA desconhecido: {config.fornecedor!r} (usar 'gemini' ou 'local')")


def criar_assistente(config: Configuracao) -> AssistenteRAG:
    embeddings, modelo = criar_componentes(config)
    limiar = config.limiar if config.limiar is not None else LIMIAR_POR_FORNECEDOR[config.fornecedor]
    assistente = AssistenteRAG(embeddings, modelo, limiar=limiar, top_k=config.top_k)
    assistente.indexar(ler_corpus(config.pasta_corpus))
    return assistente
