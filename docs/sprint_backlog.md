# Sprint Backlog (Marco M1)

## Sprint 1 (9 a 15 de novembro de 2026): concluído

Objetivo: arrancar a PWA, o CI e o assistente de IA.

* Frontend PWA (React + TypeScript): roteiro offline, caça ao tesouro com contrato `ServicoTesouro`, medalhas e chat (32 testes, 99% de cobertura).
* Pipeline CI/CD (`.github/workflows/ci.yml`) com backend, frontend, assistente de IA e gitleaks.
* Assistente de IA com RAG (`ia/`, 45 testes, 100% de cobertura) e ADR-03.
* Documentação de arranque: README, Carta de IA, `AI_LOG.md`, visão do produto, DoD e ADR-01.

## Sprint 2 (16 a 29 de novembro de 2026): planeado

**Objetivo:** fechar os Módulos A e B de ponta a ponta (backend + offline real), concluir os documentos do M1/M2 e preparar o M4.
*(Datas e responsáveis são uma sugestão; a equipa deve ajustá-los.)*

### Histórias no sprint

| História | Pontos |
| :-- | :-- |
| US-01 Roteiro dinâmico (endpoint na API) | 8 |
| US-02 Caça ao tesouro com QR Codes (IndexedDB) | 8 |
| US-08 Funcionamento offline (progresso persistente) | 8 |

### Tarefas

| ID | Tarefa | História | Responsável | Estado |
| :-- | :-- | :-- | :-- | :-- |
| T-01 | Implementar `ServicoTesouro` com IndexedDB (substitui `tesouroProvisorio.ts`) | US-02 / US-08 | José Martins | To Do |
| T-02 | Testes do `ServicoTesouro` (cenários BDD da US-02) | US-02 | José Martins | To Do |
| T-03 | Recolher os textos oficiais de 10 a 20 obras para `ia/corpus/` | US-04 | José Martins | To Do |
| T-04 | Entidades `Obra`, `Sala`, `Roteiro` e serviço de roteiros em Java | US-01 | Guilherme Taipa | To Do |
| T-05 | Endpoint `POST /api/roteiros` (controller REST) | US-01 | Guilherme Taipa | To Do |
| T-06 | Testes JUnit do serviço e do controller; retirar a exclusão de `Application` do JaCoCo se for caso disso | US-01 | Guilherme Taipa | To Do |
| T-07 | Substituir os dados de exemplo de `acervo.ts` por obras oficiais do MNSR | US-01 | João Reis | To Do |
| T-08 | Logging estruturado em JSON no assistente de IA e no backend (M4) | Transversal | João Reis | To Do |
| T-09 | Rever e aprovar ADR-02 e ADR-03; atualizar README ("Como correr" e link do Kanban) | Transversal | Toda a equipa | To Do |
| T-10 | Adicionar `LICENSE` (MIT), `.env.example` na raiz e `docs/DIVIDA_TECNICA.md` | Transversal | Toda a equipa | To Do |
| T-11 | Registar no `AI_LOG.md` todas as utilizações de IA (formato do template) | Transversal | Toda a equipa | To Do |

### Regras do sprint

* Uma tarefa só passa a **Done** quando cumpre a Definition of Done (`docs/definition_of_done.md`).
* Todo o código entra por Pull Request revisto por outro membro da equipa; o CI tem de passar.
* Cada utilização de IA fica registada em `docs/AI_LOG.md`.

### Quadro Kanban (GitHub Projects)

Colunas: **Backlog → Sprint Backlog → In Progress → In Review → Done**.
Cada card é uma User Story (US-01 a US-10) ou uma tarefa do sprint (T-01 a T-11), com a etiqueta do módulo (A, B, C, D, Transversal).
