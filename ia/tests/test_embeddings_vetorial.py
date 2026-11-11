import numpy as np
import pytest

from app.corpus import Trecho
from app.embeddings import EmbeddingsLocais, normalizar, palavras
from app.vetorial import IndiceVetorial


def test_palavras_tira_acentos_e_palavras_vazias():
    assert palavras("Quem esculpiu a Estátua?") == ["esculpiu", "estatua"]


def test_vetores_normalizados_e_texto_vazio_nao_rebenta():
    v = EmbeddingsLocais(dimensao=64).gerar(["pintura a óleo", ""], "documento")
    assert v.shape == (2, 64)
    assert np.isclose(np.linalg.norm(v[0]), 1.0)
    assert np.linalg.norm(v[1]) == 0.0


def test_textos_parecidos_ficam_mais_proximos():
    e = EmbeddingsLocais()
    base, parecido, diferente = e.gerar(
        ["escultura em granito", "granito esculpido escultura", "futebol no estádio"], "documento"
    )
    assert base @ parecido > base @ diferente


def test_normalizar_divide_pela_norma():
    assert np.allclose(normalizar(np.array([[3.0, 4.0]])), [[0.6, 0.8]])


def test_indice_devolve_mais_parecido_primeiro():
    indice = IndiceVetorial()
    trechos = [Trecho("1", "A", "a", "t"), Trecho("2", "B", "b", "t")]
    indice.adicionar(trechos, normalizar(np.array([[1.0, 0.0], [0.0, 1.0]])))
    resultado = indice.procurar(np.array([0.1, 1.0], dtype="float32"), k=5)
    assert [t.obra for t, _ in resultado] == ["B", "A"]
    assert len(indice) == 2


def test_indice_vazio_e_erros():
    indice = IndiceVetorial()
    assert indice.procurar(np.array([1.0]), k=3) == []
    indice.adicionar([], np.zeros((0, 2)))
    assert len(indice) == 0
    with pytest.raises(ValueError):
        indice.adicionar([Trecho("1", "A", "a", "t")], np.zeros((2, 2)))
