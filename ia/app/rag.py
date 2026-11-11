"""O assistente RAG: pergunta → procura excertos → prompt → LLM → resposta."""

from __future__ import annotations

from dataclasses import dataclass, field

from app.corpus import Trecho
from app.embeddings import GeradorEmbeddings
from app.llm import ModeloLinguagem
from app.prompts import RESPOSTA_DESCONHECIDA, FaixaEtaria, instrucoes_sistema, mensagem_utilizador
from app.vetorial import IndiceVetorial

TAMANHO_MAXIMO_PERGUNTA = 500


@dataclass(frozen=True)
class Resposta:
    texto: str
    encontrou: bool
    fontes: list[str] = field(default_factory=list)


class AssistenteRAG:
    def __init__(
        self,
        embeddings: GeradorEmbeddings,
        modelo: ModeloLinguagem,
        limiar: float,
        top_k: int = 3,
    ) -> None:
        self._embeddings = embeddings
        self._modelo = modelo
        self._limiar = limiar
        self._top_k = top_k
        self._indice = IndiceVetorial()

    @property
    def total_trechos(self) -> int:
        return len(self._indice)

    def indexar(self, trechos: list[Trecho]) -> None:
        if trechos:
            # O título da obra entra em cada trecho: um parágrafo que diz "a obra" sem a nomear
            # continua a ser encontrado quando o visitante pergunta pelo nome.
            textos = [f"{t.obra}. {t.texto}" for t in trechos]
            self._indice.adicionar(trechos, self._embeddings.gerar(textos, "documento"))

    def responder(self, pergunta: str, faixa: FaixaEtaria = "adulto") -> Resposta:
        pergunta = " ".join(pergunta.split())
        if not pergunta:
            raise ValueError("A pergunta não pode estar vazia")
        if len(pergunta) > TAMANHO_MAXIMO_PERGUNTA:
            raise ValueError(f"A pergunta tem de ter no máximo {TAMANHO_MAXIMO_PERGUNTA} caracteres")

        vetor = self._embeddings.gerar([pergunta], "pergunta")[0]
        relevantes = [t for t, p in self._indice.procurar(vetor, self._top_k) if p >= self._limiar]

        # 1.ª defesa contra alucinações: sem excertos relevantes, nem se chama o modelo.
        if not relevantes:
            return Resposta(RESPOSTA_DESCONHECIDA, encontrou=False)

        texto = self._modelo.responder(instrucoes_sistema(faixa), mensagem_utilizador(pergunta, relevantes))

        # 2.ª defesa: o próprio modelo foi instruído a dizer que não sabe.
        if not texto or RESPOSTA_DESCONHECIDA in texto:
            return Resposta(RESPOSTA_DESCONHECIDA, encontrou=False)

        fontes = list(dict.fromkeys(t.obra for t in relevantes))
        return Resposta(texto, encontrou=True, fontes=fontes)
