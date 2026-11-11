# Frontend — App MNSR Digital (PWA)

React + TypeScript + Vite, instalável no telemóvel e com funcionamento offline.

## Requisitos

- Node.js **22.22 ou superior** (as bibliotecas de testes não funcionam com versões anteriores). Confirmar com `node -v`.

## Como correr

```bash
cd frontend
npm install
npm run dev        # http://localhost:5173 (escrever http://, não https://) (os pedidos /api vão para o backend em :8080)
npm test           # testes (Vitest)
npm run coverage   # testes + cobertura (mínimo 80%)
npm run lint       # análise estática (ESLint)
npm run build      # versão de produção em dist/
```

## Estrutura

| Pasta | O que tem |
| --- | --- |
| `src/types/` | Tipos alinhados com o diagrama de classes (Obra, Sala, Roteiro, Medalha) |
| `src/data/` | Acervo de exemplo usado offline (**confirmar dados com o museu**) |
| `src/services/` | Roteiro local, cliente da API, medalhas e o contrato da caça ao tesouro |
| `src/pages/` | Ecrãs: Início, Roteiros (Módulo A), Caça ao tesouro (Módulo B), Chat IA (Módulo C) |
| `src/components/` | Barra de navegação e leitor de QR |

## Contrato com o backend (a combinar)

- `POST /api/ia/chat` (assistente de IA, pasta `ia/`, porta 8000 — ver `ia/README.md`).

- `POST /api/roteiros` com `{ "tempo": 30|60|90, "tema": "escultura"|"pintura"|"artes-decorativas" }`
  devolve `{ id, nome, tempo, obras: Obra[], minutosTotais }`.
- QR Codes no formato `MNSR:OBRA:<id>`.

Se a API não responder, a app gera o roteiro no próprio telemóvel (RNF-02).

## Caça ao tesouro: contrato com o Zé

A validação dos QR Codes e o armazenamento em IndexedDB são do Zé. O frontend só usa a
interface `ServicoTesouro` em `src/services/tesouro.ts`:

- `lerCodigoQr(texto)` → `{ valido: true, obraId }` ou `{ valido: false, motivo: 'formato' | 'desconhecido' }`
- `registarValidacao(obraId)` → `Promise<boolean>` (false se a obra já tinha sido validada)
- `listarValidacoes()` → `Promise<{ obraId, data }[]>`

Até essa implementação existir, `src/services/tesouroProvisorio.ts` guarda tudo em memória.
Para ligar a versão do Zé, basta trocar a linha marcada em `src/main.tsx`.
Nenhum dado pessoal deve ser guardado (RNF-03).
