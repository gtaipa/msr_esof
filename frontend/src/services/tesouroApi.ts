import { OBRAS } from '../data/acervo';
import type { ServicoTesouro, Validacao } from './tesouro';
import { criarServicoTesouroProvisorio } from './tesouroProvisorio';

const BASE = import.meta.env.VITE_API_URL ?? '';

interface RespostaValidacaoApi {
  valido: boolean;
  novo: boolean;
}

/** Usa a API para registar progresso e conserva o serviço local se a rede falhar. */
export function criarServicoTesouroApi(
  obrasConhecidas: ReadonlySet<string>,
  fetcher: typeof fetch = fetch,
): ServicoTesouro {
  const offline = criarServicoTesouroProvisorio(obrasConhecidas);

  return {
    lerCodigoQr(texto) {
      // A leitura continua local para funcionar sem rede e para preservar o contrato síncrono.
      return offline.lerCodigoQr(texto);
    },
    async registarValidacao(obraId) {
      try {
        const resposta = await fetcher(`${BASE}/api/validacoes`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ texto: `MNSR:OBRA:${obraId}` }),
        });
        if (!resposta.ok) throw new Error(`HTTP ${resposta.status}`);

        const resultado = (await resposta.json()) as RespostaValidacaoApi;
        if (!resultado.valido) return false;

        // Mantém uma cópia neste dispositivo para listar progresso sem endpoint de leitura.
        await offline.registarValidacao(obraId);
        return resultado.novo;
      } catch (erro) {
        console.warn('[tesouro] API indisponível, a guardar localmente:', erro);
        return offline.registarValidacao(obraId);
      }
    },
    async listarValidacoes(): Promise<Validacao[]> {
      return offline.listarValidacoes();
    },
  };
}

export function criarServicoTesouroApiPadrao(fetcher?: typeof fetch): ServicoTesouro {
  return criarServicoTesouroApi(new Set(OBRAS.map((obra) => obra.id)), fetcher);
}
