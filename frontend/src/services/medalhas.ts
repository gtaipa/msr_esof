import type { Medalha } from '../types/dominio';

/** Medalhas ganhas com um certo número de obras encontradas. */
export function medalhasGanhas(totalValidadas: number, medalhas: readonly Medalha[]): Medalha[] {
  return medalhas.filter((m) => totalValidadas >= m.obrasNecessarias);
}
