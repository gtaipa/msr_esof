"""Base vetorial em memória, só com numpy (decisão registada no ADR-03).

Com 10 a 20 textos, comparar a pergunta com todos os trechos é instantâneo,
por isso não é preciso uma biblioteca de base vetorial.
"""

from __future__ import annotations

import numpy as np

from app.corpus import Trecho


class IndiceVetorial:
    def __init__(self) -> None:
        self._vetores: np.ndarray | None = None
        self._trechos: list[Trecho] = []

    def __len__(self) -> int:
        return len(self._trechos)

    def adicionar(self, trechos: list[Trecho], vetores: np.ndarray) -> None:
        if len(trechos) != len(vetores):
            raise ValueError("Tem de haver um vetor por trecho")
        if not trechos:
            return
        vetores = np.asarray(vetores, dtype="float32")
        self._vetores = vetores if self._vetores is None else np.vstack([self._vetores, vetores])
        self._trechos.extend(trechos)

    def procurar(self, vetor: np.ndarray, k: int) -> list[tuple[Trecho, float]]:
        """Devolve os k trechos mais parecidos, do mais para o menos parecido."""
        if self._vetores is None or k <= 0:
            return []
        # Com vetores normalizados, o produto interno é a semelhança do cosseno (-1 a 1).
        pontuacoes = self._vetores @ np.asarray(vetor, dtype="float32")
        melhores = np.argsort(-pontuacoes)[:k]
        return [(self._trechos[i], float(pontuacoes[i])) for i in melhores]
