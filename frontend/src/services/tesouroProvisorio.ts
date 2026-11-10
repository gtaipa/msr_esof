import type { ServicoTesouro, Validacao } from './tesouro';

// ⚠️ PROVISÓRIO — só para o frontend funcionar até o Zé entregar a implementação real.
// Guarda tudo em memória (perde-se ao recarregar a página) e valida de forma mínima.
// Quando a versão do Zé (com IndexedDB) existir, troca-se só a linha em main.tsx.
export function criarServicoTesouroProvisorio(obrasConhecidas: ReadonlySet<string>): ServicoTesouro {
  const validacoes = new Map<string, Validacao>();

  return {
    lerCodigoQr(texto) {
      const [prefixo, tipo, id] = texto.trim().split(':');
      if (prefixo !== 'MNSR' || tipo !== 'OBRA' || !id) return { valido: false, motivo: 'formato' };
      return obrasConhecidas.has(id) ? { valido: true, obraId: id } : { valido: false, motivo: 'desconhecido' };
    },
    async registarValidacao(obraId) {
      if (validacoes.has(obraId)) return false;
      validacoes.set(obraId, { obraId, data: new Date().toISOString() });
      return true;
    },
    async listarValidacoes() {
      return [...validacoes.values()];
    },
  };
}
