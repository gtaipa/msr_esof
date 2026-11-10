import type { Medalha, Obra, Sala } from '../types/dominio';

// DADOS DE EXEMPLO para desenvolvimento e para funcionar offline.
// ⚠️ Confirmar títulos, datas e salas com o acervo oficial do MNSR antes da demo.
// Quando o backend existir, isto passa a ser só a cache inicial.

export const SALAS: Sala[] = [
  { id: 's1', nome: 'Sala 1' },
  { id: 's2', nome: 'Sala 2' },
  { id: 's3', nome: 'Sala 3' },
  { id: 's4', nome: 'Sala 4' },
];

export const OBRAS: Obra[] = [
  { id: 'o1', titulo: 'O Desterro', autor: 'António Soares dos Reis', ano: 1872, tema: 'escultura', salaId: 's3', minutos: 12, pontos: 50 },
  { id: 'o2', titulo: 'Flor Agreste', autor: 'António Soares dos Reis', tema: 'escultura', salaId: 's3', minutos: 8, pontos: 30 },
  { id: 'o3', titulo: 'Escultura (exemplo A)', autor: 'Autor a confirmar', tema: 'escultura', salaId: 's4', minutos: 10, pontos: 20 },
  { id: 'o4', titulo: 'Pintura (exemplo A)', autor: 'Autor a confirmar', tema: 'pintura', salaId: 's1', minutos: 10, pontos: 20 },
  { id: 'o5', titulo: 'Pintura (exemplo B)', autor: 'Autor a confirmar', tema: 'pintura', salaId: 's1', minutos: 15, pontos: 30 },
  { id: 'o6', titulo: 'Pintura (exemplo C)', autor: 'Autor a confirmar', tema: 'pintura', salaId: 's2', minutos: 20, pontos: 40 },
  { id: 'o7', titulo: 'Cerâmica (exemplo A)', autor: 'Autor a confirmar', tema: 'artes-decorativas', salaId: 's2', minutos: 8, pontos: 20 },
  { id: 'o8', titulo: 'Ourivesaria (exemplo A)', autor: 'Autor a confirmar', tema: 'artes-decorativas', salaId: 's4', minutos: 10, pontos: 20 },
];

export const MEDALHAS: Medalha[] = [
  { id: 'm1', nome: 'Primeiro Passo', obrasNecessarias: 1 },
  { id: 'm2', nome: 'Explorador', obrasNecessarias: 3 },
  { id: 'm3', nome: 'Mestre do Museu', obrasNecessarias: 5 },
];

export const NOMES_TEMA: Record<Obra['tema'], string> = {
  escultura: 'Escultura',
  pintura: 'Pintura',
  'artes-decorativas': 'Artes Decorativas',
};

export function obraPorId(id: string): Obra | undefined {
  return OBRAS.find((o) => o.id === id);
}

export function nomeSala(salaId: string): string {
  return SALAS.find((s) => s.id === salaId)?.nome ?? 'Sala desconhecida';
}
