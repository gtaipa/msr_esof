import { useCallback, useEffect, useState } from 'react';
import type { Validacao } from './tesouro';
import { useServicoTesouro } from './TesouroContext';

/** Hook React que lê o progresso e permite registar novas validações. */
export function useProgresso() {
  const servico = useServicoTesouro();
  const [validacoes, setValidacoes] = useState<Validacao[]>([]);

  // Carregamento inicial. O estado só é atualizado quando a promessa resolve,
  // e é ignorado se o componente já tiver desaparecido (evita avisos do React).
  useEffect(() => {
    let ativo = true;
    void servico.listarValidacoes().then((lista) => {
      if (ativo) setValidacoes(lista);
    });
    return () => {
      ativo = false;
    };
  }, [servico]);

  const registar = useCallback(
    async (obraId: string) => {
      const nova = await servico.registarValidacao(obraId);
      setValidacoes(await servico.listarValidacoes());
      return nova;
    },
    [servico],
  );

  return { validacoes, registar };
}
