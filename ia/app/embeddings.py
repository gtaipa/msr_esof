"""Geração de embeddings (vetores que representam o significado de um texto).

Padrão Strategy: o assistente usa a interface GeradorEmbeddings e não sabe
qual é a implementação concreta (Gemini em produção, local nos testes).
"""

from __future__ import annotations

import hashlib
import re
import unicodedata
from typing import Any, Literal, Protocol

import numpy as np

TipoTexto = Literal["documento", "pergunta"]


class GeradorEmbeddings(Protocol):
    def gerar(self, textos: list[str], tipo: TipoTexto) -> np.ndarray:
        """Devolve uma matriz (len(textos) x dimensão), com linhas normalizadas."""
        ...


def normalizar(vetores: np.ndarray) -> np.ndarray:
    vetores = np.asarray(vetores, dtype="float32")
    normas = np.linalg.norm(vetores, axis=1, keepdims=True)
    normas[normas == 0] = 1.0
    return vetores / normas


class EmbeddingsGemini:
    """Embeddings da API do Gemini (precisa de GEMINI_API_KEY)."""

    def __init__(self, cliente: Any, modelo: str) -> None:
        self._cliente = cliente
        self._modelo = modelo

    def gerar(self, textos: list[str], tipo: TipoTexto) -> np.ndarray:
        from google.genai import types

        tarefa = "RETRIEVAL_DOCUMENT" if tipo == "documento" else "RETRIEVAL_QUERY"
        resposta = self._cliente.models.embed_content(
            model=self._modelo,
            contents=textos,
            config=types.EmbedContentConfig(task_type=tarefa),
        )
        return normalizar(np.array([e.values for e in resposta.embeddings]))


# Palavras muito comuns que não ajudam a distinguir textos.
PALAVRAS_VAZIAS = frozenset(
    """a o as os um uma uns umas de do da dos das em no na nos nas por para com sem
    e ou que qual quais quem como onde quando porque se ao aos à às é foi era sao são
    ser este esta isto esse essa isso aquele aquela me te lhe nos vos eu tu ele ela
    eles elas meu minha seu sua mais muito pelo pela pelos pelas sobre entre ja já""".split()
)


def palavras(texto: str) -> list[str]:
    sem_acentos = unicodedata.normalize("NFKD", texto.lower())
    sem_acentos = "".join(c for c in sem_acentos if not unicodedata.combining(c))
    return [p for p in re.findall(r"[a-z0-9]+", sem_acentos) if p not in PALAVRAS_VAZIAS and len(p) > 1]


class EmbeddingsLocais:
    """Embeddings simples sem rede nem chave (para testes e para correr sem internet).

    Cada palavra vai para uma posição do vetor através de um hash. Textos com
    palavras em comum ficam próximos. Não percebe sinónimos, por isso a versão
    Gemini é melhor para a demo — mas esta é determinística e ótima para testes.
    """

    def __init__(self, dimensao: int = 4096) -> None:
        self._dimensao = dimensao

    def gerar(self, textos: list[str], tipo: TipoTexto) -> np.ndarray:
        matriz = np.zeros((len(textos), self._dimensao), dtype="float32")
        for i, texto in enumerate(textos):
            for palavra in palavras(texto):
                indice = (
                    int.from_bytes(hashlib.blake2b(palavra.encode(), digest_size=8).digest(), "big") % self._dimensao
                )
                matriz[i, indice] += 1.0
        return normalizar(matriz)
