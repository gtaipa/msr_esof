import { useState, type FormEvent } from 'react';
import { NOMES_TEMA, nomeSala } from '../data/acervo';
import { pedirRoteiro } from '../services/api';
import type { DuracaoRoteiro, Roteiro, Tema } from '../types/dominio';

// Módulo A — Roteiros temáticos (RF-01 a RF-04).
const DURACOES: DuracaoRoteiro[] = [30, 60, 90];
const TEMAS = Object.keys(NOMES_TEMA) as Tema[];

export default function Roteiros() {
  const [tempo, setTempo] = useState<DuracaoRoteiro>(60);
  const [tema, setTema] = useState<Tema>('escultura');
  const [roteiro, setRoteiro] = useState<Roteiro | null>(null);
  const [aCarregar, setACarregar] = useState(false);

  async function submeter(evento: FormEvent) {
    evento.preventDefault();
    setACarregar(true);
    setRoteiro(await pedirRoteiro({ tempo, tema }));
    setACarregar(false);
  }

  return (
    <main>
      <form className="cartao cartao--neon" onSubmit={submeter} style={{ display: 'grid', gap: '1.25rem' }}>
        <fieldset className="grupo">
          <legend className="rotulo">Quanto tempo tens?</legend>
          <div className="opcoes">
            {DURACOES.map((d) => (
              <label key={d} className="opcao">
                <input type="radio" name="tempo" checked={tempo === d} onChange={() => setTempo(d)} />
                <span>{d} min</span>
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset className="grupo">
          <legend className="rotulo">O que te interessa?</legend>
          <div className="opcoes">
            {TEMAS.map((t) => (
              <label key={t} className="opcao">
                <input type="radio" name="tema" checked={tema === t} onChange={() => setTema(t)} />
                <span>{NOMES_TEMA[t]}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <button className="botao" type="submit" disabled={aCarregar}>
          {aCarregar ? 'A gerar…' : 'Gerar roteiro'}
        </button>
      </form>

      {roteiro && (
        <section aria-live="polite" aria-labelledby="resultado">
          <h2 id="resultado" className="rotulo">
            {roteiro.nome} · {roteiro.minutosTotais} min
          </h2>
          {roteiro.origem === 'local' && (
            <p className="aviso">Sem ligação ao servidor: roteiro gerado no telemóvel.</p>
          )}
          {roteiro.obras.length === 0 ? (
            <p className="suave">Não há obras deste tema que caibam nesse tempo.</p>
          ) : (
            <ol className="lista">
              {roteiro.obras.map((o) => (
                <li key={o.id}>
                  <strong>{o.titulo}</strong>
                  <p className="suave">
                    {o.autor} · {nomeSala(o.salaId)} · {o.minutos} min
                  </p>
                </li>
              ))}
            </ol>
          )}
        </section>
      )}
    </main>
  );
}
