// Cliente do assistente de IA (POST /api/ia/chat, serviço em ia/).

export type FaixaEtaria = 'crianca' | 'jovem' | 'adulto';

export interface RespostaIA {
  resposta: string;
  encontrou: boolean;
  fontes: string[];
}

export type ResultadoChat = { ok: true; dados: RespostaIA } | { ok: false; erro: string };

const BASE = import.meta.env.VITE_API_URL ?? '';

export const ERRO_SEM_REDE = 'O assistente precisa de internet. Liga-te ao Wi-Fi do museu e tenta outra vez.';
export const ERRO_INDISPONIVEL = 'O assistente está indisponível neste momento. Tenta mais tarde.';
export const ERRO_PERGUNTA = 'Não consegui perceber a pergunta. Escreve-a de outra forma.';

export async function perguntarIA(
  pergunta: string,
  faixaEtaria: FaixaEtaria,
  fetcher: typeof fetch = fetch,
  online: boolean = navigator.onLine,
): Promise<ResultadoChat> {
  // Ao contrário dos roteiros, o chat não tem modo offline: depende do servidor.
  if (!online) return { ok: false, erro: ERRO_SEM_REDE };
  try {
    const resposta = await fetcher(`${BASE}/api/ia/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pergunta, faixaEtaria }),
    });
    if (resposta.status === 422) return { ok: false, erro: ERRO_PERGUNTA };
    if (!resposta.ok) return { ok: false, erro: ERRO_INDISPONIVEL };
    return { ok: true, dados: (await resposta.json()) as RespostaIA };
  } catch (erro) {
    console.warn('[chat] falha de rede:', erro);
    return { ok: false, erro: ERRO_SEM_REDE };
  }
}
