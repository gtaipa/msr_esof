import { createContext, useContext, type ReactNode } from 'react';
import type { ServicoTesouro } from './tesouro';

// Injeção de dependências com React Context: a app recebe o ServicoTesouro "de fora".
// Em produção é o do Zé; nos testes é um falso controlado pelo teste.
const TesouroContext = createContext<ServicoTesouro | null>(null);

export function TesouroProvider({ servico, children }: { servico: ServicoTesouro; children: ReactNode }) {
  return <TesouroContext.Provider value={servico}>{children}</TesouroContext.Provider>;
}

export function useServicoTesouro(): ServicoTesouro {
  const servico = useContext(TesouroContext);
  if (!servico) throw new Error('useServicoTesouro tem de estar dentro de <TesouroProvider>');
  return servico;
}
