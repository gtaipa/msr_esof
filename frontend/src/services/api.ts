import { OBRAS } from '../data/acervo';
import type { PedidoRoteiro, Roteiro } from '../types/dominio';
import { gerarRoteiroLocal } from './roteiroLocal';

const BASE = import.meta.env.VITE_API_URL ?? '';

// Pede o roteiro ao backend (POST /api/roteiros, ver diagrama de sequência US-01).
// Se a rede ou o backend falharem, gera o roteiro localmente para a app nunca ficar parada.
export async function pedirRoteiro(pedido: PedidoRoteiro, fetcher: typeof fetch = fetch): Promise<Roteiro> {
  try {
    const resposta = await fetcher(`${BASE}/api/roteiros`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pedido),
    });
    if (!resposta.ok) throw new Error(`HTTP ${resposta.status}`);
    const roteiro = (await resposta.json()) as Omit<Roteiro, 'origem'>;
    return { ...roteiro, origem: 'api' };
  } catch (erro) {
    console.warn('[roteiros] API indisponível, a gerar localmente:', erro);
    return gerarRoteiroLocal(pedido, OBRAS);
  }
}
