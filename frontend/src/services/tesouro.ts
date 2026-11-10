// CONTRATO entre o frontend (João) e a lógica da caça ao tesouro (Zé).
// O Zé implementa esta interface com a validação dos QR Codes e o IndexedDB.
// Os ecrãs só conhecem esta interface, por isso não mudam quando a implementação mudar.

export type ResultadoLeitura =
  | { valido: true; obraId: string }
  | { valido: false; motivo: 'formato' | 'desconhecido' };

export interface Validacao {
  obraId: string;
  data: string; // ISO 8601
}

export interface ServicoTesouro {
  /** Lê o texto de um QR Code (formato combinado: "MNSR:OBRA:<id>"). */
  lerCodigoQr(texto: string): ResultadoLeitura;
  /** Guarda uma obra validada. Devolve false se já tinha sido validada antes. */
  registarValidacao(obraId: string): Promise<boolean>;
  /** Lista as obras já validadas neste telemóvel. */
  listarValidacoes(): Promise<Validacao[]>;
}
