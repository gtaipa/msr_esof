import { ERRO_INDISPONIVEL, ERRO_PERGUNTA, ERRO_SEM_REDE, perguntarIA } from './chat';

const resposta = { resposta: 'É de mármore.', encontrou: true, fontes: ['O Desterro'] };

describe('perguntarIA', () => {
  it('envia a pergunta e a faixa etária e devolve a resposta', async () => {
    const fetcher = vi.fn().mockResolvedValue(new Response(JSON.stringify(resposta)));
    expect(await perguntarIA('De que é feito?', 'crianca', fetcher, true)).toEqual({ ok: true, dados: resposta });
    const [url, opcoes] = fetcher.mock.calls[0];
    expect(url).toBe('/api/ia/chat');
    expect(JSON.parse(opcoes.body)).toEqual({ pergunta: 'De que é feito?', faixaEtaria: 'crianca' });
  });

  it('não faz pedido quando o telemóvel está offline', async () => {
    const fetcher = vi.fn();
    expect(await perguntarIA('Olá', 'adulto', fetcher, false)).toEqual({ ok: false, erro: ERRO_SEM_REDE });
    expect(fetcher).not.toHaveBeenCalled();
  });

  it.each([
    [422, ERRO_PERGUNTA],
    [503, ERRO_INDISPONIVEL],
    [500, ERRO_INDISPONIVEL],
  ])('traduz o erro HTTP %i numa mensagem para o visitante', async (status, mensagem) => {
    const fetcher = vi.fn().mockResolvedValue(new Response('', { status }));
    expect(await perguntarIA('Olá', 'adulto', fetcher, true)).toEqual({ ok: false, erro: mensagem });
  });

  it('trata falhas de rede', async () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    const fetcher = vi.fn().mockRejectedValue(new TypeError('offline'));
    expect(await perguntarIA('Olá', 'adulto', fetcher, true)).toEqual({ ok: false, erro: ERRO_SEM_REDE });
  });

  it('por omissão usa o fetch e o estado de rede do browser', async () => {
    const fetcher = vi.fn().mockResolvedValue(new Response(JSON.stringify(resposta)));
    vi.stubGlobal('fetch', fetcher);
    expect((await perguntarIA('Olá', 'jovem')).ok).toBe(true);
    vi.unstubAllGlobals();
  });
});
