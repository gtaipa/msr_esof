import type { Obra, PedidoRoteiro, Roteiro } from '../types/dominio';

/** Minutos reservados para andar entre salas diferentes. */
export const MINUTOS_ENTRE_SALAS = 3;

// Gera um roteiro no próprio telemóvel, sem rede (RNF-02).
// Usado quando a API não responde. É simples de propósito: escolhe as obras do tema,
// mais pontuadas primeiro, e para quando o tempo não chega para a próxima.
// A versão "inteligente" (RAG) fica no backend.
export function gerarRoteiroLocal(pedido: PedidoRoteiro, acervo: readonly Obra[]): Roteiro {
  const candidatas = acervo
    .filter((o) => o.tema === pedido.tema)
    .sort((a, b) => b.pontos - a.pontos || a.minutos - b.minutos);

  const escolhidas: Obra[] = [];
  let minutos = 0;

  for (const obra of candidatas) {
    const muda = escolhidas.length > 0 && !escolhidas.some((e) => e.salaId === obra.salaId);
    const custo = obra.minutos + (muda ? MINUTOS_ENTRE_SALAS : 0);
    if (minutos + custo <= pedido.tempo) {
      escolhidas.push(obra);
      minutos += custo;
    }
  }

  // Agrupar por sala para o visitante não andar para trás e para a frente.
  escolhidas.sort((a, b) => a.salaId.localeCompare(b.salaId));

  return {
    id: `local-${pedido.tema}-${pedido.tempo}`,
    nome: `Roteiro de ${pedido.tempo} minutos`,
    tempo: pedido.tempo,
    obras: escolhidas,
    minutosTotais: minutos,
    origem: 'local',
  };
}
