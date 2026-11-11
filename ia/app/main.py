"""API HTTP do assistente (FastAPI). Arrancar com: uvicorn app.main:app --port 8000"""

from __future__ import annotations

import logging
from collections.abc import AsyncIterator
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException, Request
from pydantic import BaseModel, Field

from app.config import Configuracao
from app.fabrica import criar_assistente
from app.llm import ErroModelo
from app.prompts import FaixaEtaria
from app.rag import TAMANHO_MAXIMO_PERGUNTA, AssistenteRAG

registo = logging.getLogger("mnsr.ia")


class PedidoChat(BaseModel):
    pergunta: str = Field(min_length=1, max_length=TAMANHO_MAXIMO_PERGUNTA)
    faixaEtaria: FaixaEtaria = "adulto"


class RespostaChat(BaseModel):
    resposta: str
    encontrou: bool
    fontes: list[str]


def criar_app(assistente: AssistenteRAG | None = None) -> FastAPI:
    @asynccontextmanager
    async def ciclo_de_vida(app: FastAPI) -> AsyncIterator[None]:
        if getattr(app.state, "assistente", None) is None:
            app.state.assistente = criar_assistente(Configuracao.do_ambiente())
        registo.info("assistente pronto", extra={"trechos": app.state.assistente.total_trechos})
        yield

    app = FastAPI(title="MNSR Digital — Assistente de IA", lifespan=ciclo_de_vida)
    app.state.assistente = assistente

    @app.post("/api/ia/chat", response_model=RespostaChat)
    def conversar(pedido: PedidoChat, request: Request) -> RespostaChat:
        ia: AssistenteRAG = request.app.state.assistente
        try:
            resposta = ia.responder(pedido.pergunta, pedido.faixaEtaria)
        except ValueError as erro:
            raise HTTPException(status_code=422, detail=str(erro)) from erro
        except ErroModelo as erro:
            # RNF-03: não se regista o texto da pergunta (pode ter dados pessoais).
            registo.error("falha do fornecedor de IA: %s", erro)
            raise HTTPException(status_code=503, detail="O assistente está indisponível. Tenta mais tarde.") from erro
        registo.info("pergunta respondida", extra={"encontrou": resposta.encontrou, "tamanho": len(pedido.pergunta)})
        return RespostaChat(resposta=resposta.texto, encontrou=resposta.encontrou, fontes=resposta.fontes)

    return app


app = criar_app()
