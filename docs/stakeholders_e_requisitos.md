# Stakeholders e requisitos

> Estado: documento de trabalho. RF-01–08 abaixo consolidam o código e o backlog existente; RF-09–12 resumem o âmbito descrito no ADR-03. Prioridades e requisitos assinalados **[Proposta a validar]** não são decisões aprovadas pela equipa.

## Stakeholders

| Stakeholder | Necessidade / interesse | Estado |
|---|---|---|
| Visitantes, com foco em jovens, estudantes e famílias | Descobrir obras com uma visita interativa, personalizada e utilizável em zonas sem rede | Identificado na visão do produto |
| Equipa de desenvolvimento: Guilherme Taipa, João Reis e José Martins | Entregar, testar e manter a aplicação | Nomes constam do README; papéis individuais por confirmar |
| MNSR / equipa curatorial | Validar textos, metadados, planta e códigos associados às obras | **[Proposta a validar]**: interlocutor e processo de aprovação não identificados nos documentos consultados |
| Docente / avaliador da unidade curricular | Avaliar entregáveis e evidência de engenharia | **[Proposta a validar]**: confirmar stakeholder e critérios específicos |

## Requisitos funcionais

| ID | Requisito | Prioridade MoSCoW | História / evidência | Estado |
|---|---|---|---|---|
| RF-01 | Permitir pedir um roteiro indicando tempo disponível e tema | Must | US-01; `POST /api/roteiros` | Implementado; API aceita 30, 60 ou 90 minutos |
| RF-02 | Devolver um roteiro de 3 a 5 obras dentro do tempo indicado | Must | US-01; `GerarRoteiro` | Implementado com acervo em memória de demonstração |
| RF-03 | Apresentar informação/listagem de obras para a visita | Must | US-01; `GET /api/obras` | Implementado com dados de demonstração |
| RF-04 | Permitir consultar a informação da obra selecionada no roteiro | Should **[Proposta a validar]** | US-01; UI e contrato final por confirmar | Confirmar fluxo e campos com a equipa |
| RF-05 | Permitir validar um código QR de obra | Must | US-02; `POST /api/validacoes` | API implementada; leitura local descrita no backlog |
| RF-06 | Atribuir medalha/conquista ao validar QR reconhecido | Must | US-02; resposta de validação | Implementado no caso de uso/API |
| RF-07 | Permitir consulta local do progresso da caça ao tesouro | Should **[Proposta a validar]** | US-02 | Frontend mantém lista provisória local; sem persistência após reinício confirmada |
| RF-08 | Comunicar o estado de validação e a limitação quando offline | Must **[Proposta a validar]** | US-02; serviço frontend usa fallback local | Confirmar texto e regras finais com a equipa |
| RF-09 | Responder a perguntas sobre obras usando o corpus oficial do museu | Must, conforme ADR-03 proposto | US-01/assistente; `ia/` | ADR-03 proposto, a rever; confirmar corpus oficial |
| RF-10 | Adaptar linguagem à faixa etária selecionada | Should, conforme ADR-03 proposto | Assistente | Definido no contexto do ADR-03; interface/faixas por validar |
| RF-11 | Usar recuperação de contexto e apresentar resposta baseada nos textos recuperados | Must, conforme ADR-03 proposto | Assistente RAG | Decisão arquitetural proposta no ADR-03; verificar comportamento e fontes na interface |
| RF-12 | Recusar ou limitar respostas sem suporte suficiente no corpus | Must, conforme ADR-03 proposto | Assistente; testes anti-alucinação indicados no AI_LOG | ADR-03 proposto; limiar Gemini por calibrar |

## Requisitos não funcionais

| ID | Requisito | Prioridade MoSCoW | Critério / estado |
|---|---|---|---|
| RNF-01 — Offline | Roteiros/conteúdo previamente carregado e progresso de QR devem ter comportamento útil sem rede | Must **[Proposta a validar]** | A visão declara Offline-First; endpoints atuais exigem serviço disponível. Definir exatamente o que fica em cache e a sincronização |
| RNF-02 — Desempenho | **[Proposta a validar]**: respostas da API p95 ≤ 2 s em ambiente de demonstração; excluir latência de fornecedores externos de IA | Should | Proposta mensurável para teste; equipa deve aprovar carga e ambiente |
| RNF-03 — Acessibilidade | **[Proposta a validar]**: operação por teclado, foco visível, nomes acessíveis e contraste legível; conteúdo áudio com alternativa textual | Should | Não foi encontrada norma/nível de conformidade aprovado; validar critérios e testes |
| RNF-04 — Privacidade | **[Proposta a validar]**: não exigir conta nem recolher identificadores para roteiro/QR; pedir consentimento antes de qualquer dado opcional | Must | Confirmar com a equipa; perfil, sincronização, partilha e feedback ainda não têm política definida |
| RNF-05 — Segurança | Manter chaves de fornecedores fora do repositório e validar entradas da API | Must | ADR-03 exige chave fora do código; endpoints backend validam pedidos |
| RNF-06 — Qualidade | Cobertura backend mínima de 80%, Checkstyle e auditoria de dependências no CI | Must | Gate JaCoCo 0,80 e Checkstyle configurados no branch `ci/qualidade-backend`; auditoria CI ainda sem execução confirmada |

## Rastreabilidade resumida

| Requisito | História(s) | Componente / documento |
|---|---|---|
| RF-01–04 | US-01 | Frontend roteiros, API Java; ADR-01 |
| RF-05–08 | US-02 | Frontend caça ao tesouro, API Java |
| RF-09–12 | US-01 / assistente | Serviço `ia/`, `docs/adr/adr_03_assistente_ia_rag.md` |
| RNF-01 | US-01, US-02, US-05 | Visão do produto; sincronização ainda proposta |
| RNF-02–06 | US-01–08 | Critérios propostos e qualidade definida em CI/DoD |

