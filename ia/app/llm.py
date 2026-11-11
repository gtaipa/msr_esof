"""Modelos de linguagem (LLM). Padrão Strategy, como nos embeddings."""

from __future__ import annotations

import re
from typing import Any, Protocol


class ModeloLinguagem(Protocol):
    def responder(self, instrucoes: str, mensagem: str) -> str: ...


class ErroModelo(RuntimeError):
    """O fornecedor de IA falhou (rede, chave inválida, limite de pedidos...)."""


class ModeloGemini:
    def __init__(self, cliente: Any, modelo: str) -> None:
        self._cliente = cliente
        self._modelo = modelo

    def responder(self, instrucoes: str, mensagem: str) -> str:
        from google.genai import types

        try:
            resposta = self._cliente.models.generate_content(
                model=self._modelo,
                contents=mensagem,
                config=types.GenerateContentConfig(
                    system_instruction=instrucoes,
                    temperature=0.2,  # baixo = menos criatividade = menos invenção
                    max_output_tokens=400,
                ),
            )
        except Exception as erro:  # o SDK lança vários tipos de erro
            raise ErroModelo(str(erro)) from erro
        return (resposta.text or "").strip()


class ModeloExtrativo:
    """Modo sem IA generativa: devolve o excerto mais relevante tal como está.

    Não inventa nada por definição. Serve para testes e para a demo sem internet/chave.
    """

    def responder(self, instrucoes: str, mensagem: str) -> str:
        bloco = re.search(r"<excertos>\n(.*?)\n</excertos>", mensagem, re.S)
        primeiro = bloco.group(1).splitlines()[0] if bloco else ""
        texto = re.sub(r"^\[[^\]]*\]\s*", "", primeiro)
        return f"Segundo os textos do museu: {texto}"
