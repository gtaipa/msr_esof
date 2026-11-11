"""Configuração lida das variáveis de ambiente (nunca de ficheiros no Git)."""

from __future__ import annotations

import os
from dataclasses import dataclass
from pathlib import Path

PASTA_CORPUS_PADRAO = Path(__file__).resolve().parent.parent / "corpus"


@dataclass(frozen=True)
class Configuracao:
    fornecedor: str = "local"  # "gemini" ou "local"
    gemini_api_key: str | None = None
    modelo_chat: str = "gemini-2.5-flash"
    modelo_embeddings: str = "gemini-embedding-001"
    limiar: float | None = None  # None = valor por omissão do fornecedor
    top_k: int = 3
    pasta_corpus: Path = PASTA_CORPUS_PADRAO

    @staticmethod
    def do_ambiente(env: dict[str, str] | None = None) -> Configuracao:
        env = dict(os.environ) if env is None else env
        limiar = env.get("IA_LIMIAR")
        return Configuracao(
            fornecedor=env.get("IA_FORNECEDOR", "local").strip().lower(),
            gemini_api_key=env.get("GEMINI_API_KEY") or None,
            modelo_chat=env.get("IA_MODELO_CHAT", Configuracao.modelo_chat),
            modelo_embeddings=env.get("IA_MODELO_EMBEDDINGS", Configuracao.modelo_embeddings),
            limiar=float(limiar) if limiar else None,
            top_k=int(env.get("IA_TOP_K", "3")),
            pasta_corpus=Path(env.get("IA_CORPUS", str(PASTA_CORPUS_PADRAO))),
        )
