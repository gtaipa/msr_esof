import { Link } from 'react-router-dom';
import { MEDALHAS, OBRAS, nomeSala } from '../data/acervo';
import { medalhasGanhas } from '../services/medalhas';
import { useProgresso } from '../services/useProgresso';

export default function Inicio() {
  const { validacoes } = useProgresso();
  const total = OBRAS.length;
  const feitas = validacoes.length;
  const validadas = new Set(validacoes.map((v) => v.obraId));
  const proxima = OBRAS.find((o) => !validadas.has(o.id));
  const medalhas = medalhasGanhas(feitas, MEDALHAS);

  return (
    <main>
      <section className="cartao cartao--ouro" aria-labelledby="missao">
        <p className="rotulo">Missão</p>
        <h2 id="missao">Obras-Primas do MNSR</h2>
        <div className="barra" role="progressbar" aria-label="Progresso da missão" aria-valuemin={0} aria-valuemax={total} aria-valuenow={feitas}>
          <div style={{ width: `${(feitas / total) * 100}%` }} />
        </div>
        <p className="suave">
          {feitas} de {total} obras encontradas · {medalhas.length} medalha(s)
        </p>
      </section>

      {proxima && (
        <section className="cartao" aria-labelledby="proximo">
          <p className="rotulo">Próximo ponto · {nomeSala(proxima.salaId)}</p>
          <h3 id="proximo">{proxima.titulo}</h3>
          <p className="suave">
            {proxima.autor}
            {proxima.ano ? ` · ${proxima.ano}` : ''}
          </p>
          <Link to="/tesouro" className="botao" style={{ marginTop: '1rem', textDecoration: 'none' }}>
            Validar chegada
          </Link>
        </section>
      )}

      <section className="cartao cartao--neon">
        <p className="rotulo">Pouco tempo?</p>
        <h3>Cria um roteiro à tua medida</h3>
        <Link to="/roteiros" className="botao botao--contorno" style={{ marginTop: '1rem', textDecoration: 'none' }}>
          Escolher roteiro
        </Link>
      </section>
    </main>
  );
}
