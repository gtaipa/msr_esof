import { pedirRoteiro } from './api';

describe('pedirRoteiro', () => {
  const pedido = { tempo: 60, tema: 'escultura' } as const;

  it('usa a resposta da API quando o backend responde', async () => {
    const fetcher = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ id: 'r1', nome: 'API', tempo: 60, obras: [], minutosTotais: 0 }), { status: 200 }),
    );
    const r = await pedirRoteiro(pedido, fetcher);
    expect(r.origem).toBe('api');
    expect(fetcher).toHaveBeenCalledWith('/api/roteiros', expect.objectContaining({ method: 'POST' }));
  });

  it('gera localmente quando a API devolve erro', async () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    const r = await pedirRoteiro(pedido, vi.fn().mockResolvedValue(new Response('', { status: 500 })));
    expect(r.origem).toBe('local');
  });

  it('gera localmente quando não há rede', async () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    const r = await pedirRoteiro(pedido, vi.fn().mockRejectedValue(new TypeError('offline')));
    expect(r.origem).toBe('local');
    expect(r.obras.length).toBeGreaterThan(0);
  });
});
