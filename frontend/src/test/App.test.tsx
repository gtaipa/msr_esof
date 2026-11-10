import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';
import { OBRAS } from '../data/acervo';
import type { ServicoTesouro } from '../services/tesouro';
import { TesouroProvider } from '../services/TesouroContext';
import { criarServicoTesouroProvisorio } from '../services/tesouroProvisorio';

vi.mock('../components/QrScanner', () => ({ default: () => <div>scanner</div> }));

// Cada teste recebe um serviço novo e vazio: os testes do frontend não dependem do IndexedDB do Zé.
let servico: ServicoTesouro;

function abrir(rota: string) {
  return render(
    <MemoryRouter initialEntries={[rota]}>
      <TesouroProvider servico={servico}>
        <App />
      </TesouroProvider>
    </MemoryRouter>,
  );
}

beforeEach(() => {
  servico = criarServicoTesouroProvisorio(new Set(OBRAS.map((o) => o.id)));
  vi.spyOn(console, 'warn').mockImplementation(() => {});
  vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('offline')));
});

describe('Início', () => {
  it('mostra o progresso da missão e a próxima obra', async () => {
    abrir('/');
    expect(await screen.findByText(/0 de 8 obras encontradas/)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'O Desterro' })).toBeInTheDocument();
  });

  it('esconde o próximo ponto quando todas as obras estão validadas', async () => {
    for (const obra of OBRAS) await servico.registarValidacao(obra.id);
    abrir('/');
    expect(await screen.findByText(/8 de 8 obras/)).toBeInTheDocument();
    expect(screen.queryByText('Validar chegada')).not.toBeInTheDocument();
  });
});

describe('Roteiros (Módulo A)', () => {
  it('gera um roteiro offline com o tempo e tema escolhidos', async () => {
    const user = userEvent.setup();
    abrir('/roteiros');
    await user.click(screen.getByLabelText('30 min'));
    await user.click(screen.getByLabelText('Escultura'));
    await user.click(screen.getByRole('button', { name: 'Gerar roteiro' }));

    expect(await screen.findByText(/roteiro gerado no telemóvel/)).toBeInTheDocument();
    expect(screen.getByText('O Desterro')).toBeInTheDocument();
  });

  it('avisa quando nenhuma obra cabe no tempo', async () => {
    const fetchVazio = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ id: 'r', nome: 'Roteiro', tempo: 30, obras: [], minutosTotais: 0 })),
    );
    vi.stubGlobal('fetch', fetchVazio);
    const user = userEvent.setup();
    abrir('/roteiros');
    await user.click(screen.getByRole('button', { name: 'Gerar roteiro' }));
    expect(await screen.findByText(/Não há obras deste tema/)).toBeInTheDocument();
  });
});

describe('Caça ao tesouro (Módulo B)', () => {
  async function validar(codigo: string) {
    const user = userEvent.setup();
    await user.type(await screen.findByLabelText('Ou escreve o código'), codigo);
    await user.click(screen.getByRole('button', { name: 'Validar código' }));
  }

  it('valida uma obra, dá pontos e a primeira medalha', async () => {
    abrir('/tesouro');
    await validar('MNSR:OBRA:o1');
    expect(await screen.findByRole('status')).toHaveTextContent('Encontraste «O Desterro»! +50 pontos. Nova medalha: Primeiro Passo!');
    expect(await screen.findByText(/1 de 8 obras · 50 pontos/)).toBeInTheDocument();
  });

  it('avisa quando a obra já tinha sido encontrada', async () => {
    abrir('/tesouro');
    await validar('MNSR:OBRA:o2');
    await screen.findByText(/1 de 8 obras/);
    await validar('MNSR:OBRA:o2');
    expect(await screen.findByRole('status')).toHaveTextContent('Já tinhas encontrado');
  });

  it('mostra erro para códigos inválidos ou desconhecidos', async () => {
    abrir('/tesouro');
    await validar('ola');
    expect(await screen.findByRole('status')).toHaveTextContent('não é do MNSR');
    await validar('MNSR:OBRA:o99');
    expect(await screen.findByRole('status')).toHaveTextContent('Obra não encontrada');
  });
});

describe('Chat IA', () => {
  it('mostra que o módulo chega em breve', () => {
    abrir('/chat');
    expect(screen.getByText('Em breve')).toBeInTheDocument();
  });
});
