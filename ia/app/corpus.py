"""Leitura do corpus: os textos oficiais do museu, um ficheiro Markdown por obra.

Formato de cada ficheiro (ver corpus/LEIA-ME.md):
    # Título da obra
    Fonte: <de onde veio o texto>

    Parágrafo 1...

    Parágrafo 2...
Cada parágrafo passa a ser um "trecho" pesquisável.
"""

from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path


@dataclass(frozen=True)
class Trecho:
    id: str
    obra: str
    texto: str
    fonte: str


def ler_ficheiro(caminho: Path) -> list[Trecho]:
    linhas = caminho.read_text(encoding="utf-8").splitlines()
    obra = caminho.stem
    fonte = "desconhecida"
    corpo: list[str] = []
    for linha in linhas:
        if linha.startswith("# ") and obra == caminho.stem:
            obra = linha[2:].strip()
        elif linha.lower().startswith("fonte:"):
            fonte = linha.split(":", 1)[1].strip()
        else:
            corpo.append(linha)

    paragrafos = [p.strip() for p in "\n".join(corpo).split("\n\n")]
    return [
        Trecho(id=f"{caminho.stem}#{i}", obra=obra, texto=" ".join(p.split()), fonte=fonte)
        for i, p in enumerate((p for p in paragrafos if p), start=1)
    ]


def ler_corpus(pasta: Path) -> list[Trecho]:
    """Lê todos os .md da pasta, exceto os ficheiros de instruções (LEIA-ME*)."""
    if not pasta.is_dir():
        raise FileNotFoundError(f"Pasta do corpus não encontrada: {pasta}")
    trechos: list[Trecho] = []
    for caminho in sorted(pasta.glob("*.md")):
        if not caminho.name.upper().startswith("LEIA-ME"):
            trechos.extend(ler_ficheiro(caminho))
    return trechos
