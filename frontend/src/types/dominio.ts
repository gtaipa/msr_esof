// Tipos do frontend alinhados com o diagrama de classes (docs/uml/Diagrama uml.jpg).
// Quando o backend do Gui tiver os DTOs, estes nomes devem bater certo com o JSON da API.

export type Tema = 'escultura' | 'pintura' | 'artes-decorativas';

export interface Sala {
  id: string;
  nome: string;
}

export interface Obra {
  id: string;
  titulo: string;
  autor: string;
  ano?: number;
  tema: Tema;
  salaId: string;
  /** Minutos sugeridos para ver a obra (usado no cálculo do roteiro). */
  minutos: number;
  /** Pontos ganhos ao validar a obra na caça ao tesouro. */
  pontos: number;
}

export type DuracaoRoteiro = 30 | 60 | 90;

export interface PedidoRoteiro {
  tempo: DuracaoRoteiro;
  tema: Tema;
}

export interface Roteiro {
  id: string;
  nome: string;
  tempo: DuracaoRoteiro;
  obras: Obra[];
  minutosTotais: number;
  /** 'api' quando veio do backend; 'local' quando foi gerado offline no telemóvel. */
  origem: 'api' | 'local';
}

export interface Medalha {
  id: string;
  nome: string;
  /** Número de obras que é preciso validar para ganhar a medalha. */
  obrasNecessarias: number;
}
