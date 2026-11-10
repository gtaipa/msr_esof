import { useCallback, useEffect, useState } from 'react';
import type { Validacao } from './tesouro';
import { useServicoTesouro } from './TesouroContext';

/** Hook React que lê o progresso e permite registar novas validações. */
export function useProgresso() {
  const servico = useServicoTesouro();
  const [validacoes, setValidacoes] = useState<Validacao[]>([]);

  const recarregar = useCallback(async () => {
    setValidacoes(await servico.listarValidacoes());
  }, [servico]);

  useEffect(() => {
    void recarregar();
  }, [recarregar]);

  const registar = useCallback(
    async (obraId: string) => {
      const nova = await servico.registarValidacao(obraId);
      await recarregar();
      return nova;
    },
    [servico, recarregar],
  );

  return { validacoes, registar };
}
