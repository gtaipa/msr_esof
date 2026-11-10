import type { Obra } from '../types/dominio';
import { MINUTOS_ENTRE_SALAS, gerarRoteiroLocal } from './roteiroLocal';

const obra = (id: string, salaId: string, minutos: number, pontos: number, tema: Obra['tema'] = 'pintura'): Obra => ({
  id, titulo: id, autor: 'x', tema, salaId, minutos, pontos,
});

describe('gerarRoteiroLocal', () => {
  const acervo = [
    obra('a', 's1', 10, 10),
    obra('b', 's1', 15, 50),
    obra('c', 's2', 20, 40),
    obra('d', 's2', 5, 5, 'escultura'),
  ];

  // Cenário BDD da US-01: o tempo total não ultrapassa o tempo escolhido.
  it.each([30, 60, 90] as const)('nunca ultrapassa %i minutos', (tempo) => {
    const r = gerarRoteiroLocal({ tempo, tema: 'pintura' }, acervo);
    expect(r.minutosTotais).toBeLessThanOrEqual(tempo);
  });

  it('só inclui obras do tema pedido', () => {
    const r = gerarRoteiroLocal({ tempo: 90, tema: 'pintura' }, acervo);
    expect(r.obras.every((o) => o.tema === 'pintura')).toBe(true);
    expect(r.obras).toHaveLength(3);
  });

  it('dá prioridade às obras com mais pontos e conta a mudança de sala', () => {
    const r = gerarRoteiroLocal({ tempo: 30, tema: 'pintura' }, acervo);
    // b (15) e depois a (10), mesma sala: 25 min. c já não cabe.
    expect(r.obras.map((o) => o.id)).toEqual(['b', 'a']);
    expect(r.minutosTotais).toBe(25);

    const r2 = gerarRoteiroLocal({ tempo: 60, tema: 'pintura' }, acervo);
    expect(r2.minutosTotais).toBe(15 + 20 + MINUTOS_ENTRE_SALAS + 10);
  });

  it('devolve lista vazia se não houver obras do tema', () => {
    const r = gerarRoteiroLocal({ tempo: 30, tema: 'artes-decorativas' }, acervo);
    expect(r.obras).toEqual([]);
    expect(r.origem).toBe('local');
  });
});
