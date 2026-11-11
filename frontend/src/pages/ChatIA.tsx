import { useState, type FormEvent } from 'react';
import { perguntarIA, type FaixaEtaria } from '../services/chat';

// Módulo C — Assistente de IA (RF-09 a RF-12).
// As respostas vêm só dos textos oficiais do museu (RAG, serviço em ia/).

const FAIXAS: { valor: FaixaEtaria; nome: string }[] = [
  { valor: 'crianca', nome: 'Criança' },
  { valor: 'jovem', nome: 'Jovem' },
  { valor: 'adulto', nome: 'Adulto' },
];

const MAXIMO = 500;

interface Mensagem {
  id: number;
  autor: 'visitante' | 'guia';
  texto: string;
  fontes?: string[];
  erro?: boolean;
}

export default function ChatIA() {
  const [faixa, setFaixa] = useState<FaixaEtaria>('adulto');
  const [pergunta, setPergunta] = useState('');
  const [mensagens, setMensagens] = useState<Mensagem[]>([]);
  const [aEsperar, setAEsperar] = useState(false);

  async function enviar(evento: FormEvent) {
    evento.preventDefault();
    const texto = pergunta.trim();
    if (!texto || aEsperar) return;

    const id = Date.now();
    setMensagens((m) => [...m, { id, autor: 'visitante', texto }]);
    setPergunta('');
    setAEsperar(true);

    const resultado = await perguntarIA(texto, faixa);
    const resposta: Mensagem = resultado.ok
      ? { id: id + 1, autor: 'guia', texto: resultado.dados.resposta, fontes: resultado.dados.fontes }
      : { id: id + 1, autor: 'guia', texto: resultado.erro, erro: true };
    setMensagens((m) => [...m, resposta]);
    setAEsperar(false);
  }

  return (
    <main>
      <section className="cartao cartao--magenta">
        <p className="rotulo">Guia de bolso IA</p>
        <h2>Pergunta sobre as obras</h2>
        <p className="suave">As respostas vêm dos textos oficiais do museu. Se não souber, o guia diz-te.</p>
      </section>

      <fieldset className="grupo">
        <legend className="rotulo">Quem está a perguntar?</legend>
        <div className="opcoes">
          {FAIXAS.map((f) => (
            <label key={f.valor} className="opcao">
              <input type="radio" name="faixa" checked={faixa === f.valor} onChange={() => setFaixa(f.valor)} />
              <span>{f.nome}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <ol className="lista" aria-live="polite" aria-label="Conversa">
        {mensagens.map((m) => (
          <li
            key={m.id}
            className={m.erro ? 'erro' : undefined}
            style={m.autor === 'visitante' ? { borderLeftColor: 'var(--gold)' } : undefined}
          >
            <p className="rotulo">{m.autor === 'visitante' ? 'Tu' : 'Guia'}</p>
            <p style={{ margin: '0.25rem 0 0' }}>{m.texto}</p>
            {m.fontes && m.fontes.length > 0 && <p className="suave">Fonte: {m.fontes.join(', ')}</p>}
          </li>
        ))}
        {aEsperar && (
          <li>
            <p className="suave">O guia está a pensar…</p>
          </li>
        )}
      </ol>

      <form className="grupo" onSubmit={enviar}>
        <label htmlFor="pergunta" className="rotulo">
          A tua pergunta
        </label>
        <input
          id="pergunta"
          className="campo"
          value={pergunta}
          maxLength={MAXIMO}
          onChange={(e) => setPergunta(e.target.value)}
          placeholder="Ex.: Quem fez O Desterro?"
          autoComplete="off"
        />
        <button className="botao" type="submit" disabled={!pergunta.trim() || aEsperar}>
          Perguntar
        </button>
      </form>
    </main>
  );
}
