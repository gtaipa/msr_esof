from pathlib import Path

import pytest

from app.config import PASTA_CORPUS_PADRAO
from app.corpus import ler_corpus, ler_ficheiro


def test_le_titulo_fonte_e_paragrafos(tmp_path: Path):
    f = tmp_path / "obra.md"
    f.write_text(
        "# Minha Obra\nFonte: catálogo\n\nPrimeiro   parágrafo\ncom duas linhas.\n\nSegundo.\n", encoding="utf-8"
    )
    trechos = ler_ficheiro(f)
    assert [t.texto for t in trechos] == ["Primeiro parágrafo com duas linhas.", "Segundo."]
    assert {t.obra for t in trechos} == {"Minha Obra"}
    assert trechos[0].fonte == "catálogo"
    assert trechos[1].id == "obra#2"


def test_sem_titulo_usa_nome_do_ficheiro(tmp_path: Path):
    f = tmp_path / "sem-titulo.md"
    f.write_text("Só texto.", encoding="utf-8")
    assert ler_ficheiro(f)[0].obra == "sem-titulo"


def test_ignora_leia_me(tmp_path: Path):
    (tmp_path / "LEIA-ME.md").write_text("# Instruções\n\nNão indexar.", encoding="utf-8")
    (tmp_path / "x.md").write_text("# X\n\nTexto.", encoding="utf-8")
    assert [t.obra for t in ler_corpus(tmp_path)] == ["X"]


def test_pasta_inexistente_da_erro(tmp_path: Path):
    with pytest.raises(FileNotFoundError):
        ler_corpus(tmp_path / "nao-existe")


def test_corpus_do_repositorio_tem_o_desterro():
    assert "O Desterro" in {t.obra for t in ler_corpus(PASTA_CORPUS_PADRAO)}
