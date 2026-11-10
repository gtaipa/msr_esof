import { useState } from 'react';
import QrScanner from '../components/QrScanner';
import { MEDALHAS, OBRAS, obraPorId } from '../data/acervo';
import { medalhasGanhas } from '../services/medalhas';
import { useServicoTesouro } from '../services/TesouroContext';
import { useProgresso } from '../services/useProgresso';

// Módulo B — Caça ao tesouro (RF-05 a RF-08): ecrã e mensagens.
// A validação dos QR e o armazenamento são do ServicoTesouro (implementação do Zé).

type Mensagem = { tipo: 'sucesso' | 'erro' | 'aviso'; texto: string };

export default function CacaTesouro() {
  const servico = useServicoTesouro();
  const { validacoes, registar } = useProgresso();
  const [codigoManual, setCodigoManual] = useState('');
  const [mensagem, setMensagem] = useState<Mensagem | null>(null);

  async function processar(texto: string) {
    const leitura = servico.lerCodigoQr(texto);
    if (!leitura.valido) {
      setMensagem({
        tipo: 'erro',
        texto: leitura.motivo === 'formato' ? 'Este código não é do MNSR.' : 'Obra não encontrada.',
      });
      return;
    }

    const antes = medalhasGanhas(validacoes.length, MEDALHAS).length;
    const nova = await registar(leitura.obraId);
    const obra = obraPorId(leitura.obraId)!;

    if (!nova) {
      setMensagem({ tipo: 'aviso', texto: `Já tinhas encontrado «${obra.titulo}».` });
      return;
    }
    const ganhas = medalhasGanhas(validacoes.length + 1, MEDALHAS);
    const medalhaNova = ganhas.length > antes ? ganhas[ganhas.length - 1] : null;
    setMensagem({
      tipo: 'sucesso',
      texto: `Encontraste «${obra.titulo}»! +${obra.pontos} pontos.${medalhaNova ? ` Nova medalha: ${medalhaNova.nome}!` : ''}`,
    });
  }

  const pontos = validacoes.reduce((soma, v) => soma + (obraPorId(v.obraId)?.pontos ?? 0), 0);

  return (
    <main>
      <section className="cartao cartao--ouro">
        <p className="rotulo">Caça ao tesouro</p>
        <h2>
          {validacoes.length} de {OBRAS.length} obras · {pontos} pontos
        </h2>
      </section>

      <QrScanner onLeitura={processar} />

      {/* Alternativa sem câmara: também serve para simular um beacon na demo. */}
      <form
        className="grupo"
        onSubmit={(e) => {
          e.preventDefault();
          void processar(codigoManual);
          setCodigoManual('');
        }}
      >
        <label htmlFor="codigo" className="rotulo">
          Ou escreve o código
        </label>
        <input
          id="codigo"
          className="campo"
          value={codigoManual}
          onChange={(e) => setCodigoManual(e.target.value)}
          placeholder="MNSR:OBRA:o1"
          autoComplete="off"
        />
        <button className="botao botao--contorno" type="submit" disabled={!codigoManual.trim()}>
          Validar código
        </button>
      </form>

      {mensagem && (
        <p role="status" className={mensagem.tipo}>
          {mensagem.texto}
        </p>
      )}

      <section aria-labelledby="medalhas">
        <h2 id="medalhas" className="rotulo">
          Medalhas
        </h2>
        <ul className="lista">
          {MEDALHAS.map((m) => {
            const ganha = validacoes.length >= m.obrasNecessarias;
            return (
              <li key={m.id} style={{ opacity: ganha ? 1 : 0.5 }}>
                <strong>{m.nome}</strong>
                <p className="suave">{ganha ? 'Ganha!' : `Encontra ${m.obrasNecessarias} obra(s)`}</p>
              </li>
            );
          })}
        </ul>
      </section>
    </main>
  );
}
