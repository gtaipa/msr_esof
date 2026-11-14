import { describe, expect, it, vi } from 'vitest';
import { criarServicoTesouroApi, criarServicoTesouroApiPadrao } from './tesouroApi';

function resposta(valido: boolean, novo: boolean): Response {
  return {
    ok: true,
    status: 200,
    json: async () => ({ valido, novo }),
  } as Response;
}

describe('criarServicoTesouroApi', () => {
  it('cria o serviço padrão com as obras locais', () => {
    const servico = criarServicoTesouroApiPadrao(vi.fn());
    expect(servico.lerCodigoQr('MNSR:OBRA:o1')).toEqual({ valido: true, obraId: 'o1' });
  });

  it('valida o QR localmente e regista no endpoint real', async () => {
    const fetcher = vi.fn().mockResolvedValue(resposta(true, true));
    const servico = criarServicoTesouroApi(new Set(['o1']), fetcher);

    expect(servico.lerCodigoQr('MNSR:OBRA:o1')).toEqual({ valido: true, obraId: 'o1' });
    await expect(servico.registarValidacao('o1')).resolves.toBe(true);
    expect(fetcher).toHaveBeenCalledWith('/api/validacoes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ texto: 'MNSR:OBRA:o1' }),
    });
    await expect(servico.listarValidacoes()).resolves.toHaveLength(1);
  });

  it('devolve falso para QR rejeitado pelo backend', async () => {
    const servico = criarServicoTesouroApi(new Set(['o1']), vi.fn().mockResolvedValue(resposta(false, false)));
    await expect(servico.registarValidacao('o1')).resolves.toBe(false);
    await expect(servico.listarValidacoes()).resolves.toEqual([]);
  });

  it('usa armazenamento local quando o pedido falha', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const servico = criarServicoTesouroApi(new Set(['o1']), vi.fn().mockRejectedValue(new Error('offline')));
    await expect(servico.registarValidacao('o1')).resolves.toBe(true);
    await expect(servico.registarValidacao('o1')).resolves.toBe(false);
    await expect(servico.listarValidacoes()).resolves.toHaveLength(1);
    expect(warn).toHaveBeenCalledTimes(2);
    warn.mockRestore();
  });

  it('usa armazenamento local em respostas HTTP de erro', async () => {
    const falhaHttp = { ok: false, status: 503 } as Response;
    const servico = criarServicoTesouroApi(new Set(['o1']), vi.fn().mockResolvedValue(falhaHttp));
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    await expect(servico.registarValidacao('o1')).resolves.toBe(true);
    warn.mockRestore();
  });
});
