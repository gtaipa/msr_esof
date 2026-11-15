# Backlog do Produto (Marco M1)

Este documento centraliza as User Stories (US) da App MNSR Digital, estruturadas pelos "3 Cs" (**Card**, **Conversation**, **Confirmation**) e com critérios de aceitação em BDD (Gherkin: Given / When / Then).

O mesmo backlog está no quadro Kanban do GitHub Projects (link no `README.md`). Prioridade em MoSCoW (Must / Should / Could); estimativa em pontos de história (Fibonacci). A coluna "Estado" indica o ponto da implementação em 15/11/2026.

## Visão geral

| ID | História | Módulo | Prioridade | Pontos | Estado |
| :-- | :-- | :-- | :-- | :-- | :-- |
| US-01 | Roteiro dinâmico por tempo e tema | A | Must | 8 | Parcial (gerador local; falta endpoint na API) |
| US-02 | Caça ao tesouro com QR Codes (offline) | B | Must | 8 | Parcial (validação em memória; falta IndexedDB) |
| US-03 | Medalhas e descontos na loja/cafetaria | B | Should | 5 | Parcial (medalhas feitas; faltam descontos) |
| US-04 | Assistente de IA sobre uma obra (RAG) | C | Must | 8 | Feito (corpus provisório) |
| US-05 | Respostas adaptadas à faixa etária | C | Should | 3 | Feito |
| US-06 | Indicador de afluência por sala | D | Should | 5 | Por fazer |
| US-07 | Notificação de salas alternativas e eventos | D | Could | 5 | Por fazer |
| US-08 | Funcionamento offline e sincronização de progresso | Transversal | Must | 8 | Parcial (cache da app; falta IndexedDB e sincronização) |
| US-09 | Acessibilidade universal (WCAG 2.1 AA) | Transversal | Must | 5 | Parcial (alvos de 48 px e atributos ARIA) |
| US-10 | Privacidade e proteção de menores (RGPD) | Transversal | Must | 3 | Parcial (sem registo; falta o vault de segredos) |

## Rastreabilidade (Requisitos → User Stories → Testes)

| Requisito do enunciado | User Stories | Testes (pasta) |
| :-- | :-- | :-- |
| RF-01 a RF-04 (Módulo A: roteiros) | US-01 | `frontend/src/services/roteiroLocal.test.ts`, `api.test.ts` |
| RF-05 a RF-08 (Módulo B: caça ao tesouro) | US-02, US-03 | `frontend/src/services/medalhas.test.ts`, `TesouroContext.test.tsx` |
| RF-09 a RF-12 (Módulo C: assistente de IA) | US-04, US-05 | `ia/tests/` (incl. `test_anti_alucinacao.py`), `frontend/src/services/chat.test.ts` |
| RF-13 a RF-15 (Módulo D: afluência) | US-06, US-07 | por criar |
| RNF-01 (desempenho) | US-01, US-04 | por criar |
| RNF-02 (offline) | US-02, US-08 | `frontend/src/test/App.test.tsx` (parcial) |
| RNF-03 (RGPD e menores) | US-10 | por criar |
| RNF-04 (acessibilidade) | US-09 | por criar |
| RNF-05 (testes e análise estática) | Definition of Done | CI (`.github/workflows/ci.yml`) |

---

## US-01: Roteiro dinâmico por tempo e tema
**Card:** Como visitante, quero gerar um roteiro personalizado com base no meu tempo disponível e no tema que me interessa, para ter uma visita otimizada.
**Conversation:** O utilizador escolhe o tempo (30, 60 ou 90 min) e um tema (Escultura, Pintura ou Artes Decorativas). A app pede o roteiro à API; se a API ou a rede falharem, gera-o localmente no telemóvel (RNF-02). O roteiro mostra as obras, a sala de cada uma e o tempo estimado por obra. A resposta da API deve demorar menos de 1,5 s (RNF-01).
**Confirmation (BDD):**
* **Cenário 1:** Gerar roteiro com sucesso
  * **Given** que o visitante está no ecrã de novo roteiro
  * **When** escolhe "60 minutos" e o tema "Pintura"
  * **Then** o sistema devolve a lista de obras de pintura por ordem de visita, agrupadas por sala
  * **And** o tempo estimado total não ultrapassa os 60 minutos.
* **Cenário 2:** Roteiro sem ligação à API
  * **Given** que o visitante não tem rede ou a API não responde
  * **When** pede um roteiro de "30 minutos" do tema "Escultura"
  * **Then** a app gera o roteiro localmente
  * **And** indica que o roteiro foi gerado offline.

## US-02: Caça ao tesouro com QR Codes (offline)
**Card:** Como jovem visitante, quero ler QR Codes junto às obras para desbloquear pontos, medalhas e curiosidades.
**Conversation:** A app usa a câmara. O QR Code tem o formato `MNSR:OBRA:<id>`. Ao ler um código válido, a validação é guardada no telemóvel (IndexedDB, ver ADR-02), mesmo sem rede (RNF-02). Códigos inválidos ou repetidos não alteram o progresso.
**Confirmation (BDD):**
* **Cenário 1:** Leitura de QR Code válido offline
  * **Given** que o visitante não tem ligação à internet
  * **When** faz scan do QR Code da obra "O Desterro" (`MNSR:OBRA:o1`)
  * **Then** o sistema valida o código com os dados guardados no telemóvel
  * **And** regista a obra no progresso e mostra uma mensagem de sucesso.
* **Cenário 2:** QR Code inválido ou desconhecido
  * **Given** que o visitante está na caça ao tesouro
  * **When** faz scan de um código com formato errado ou de uma obra que não existe
  * **Then** o sistema rejeita a leitura com uma mensagem clara
  * **And** o progresso não é alterado.
* **Cenário 3:** Obra já validada
  * **Given** que o visitante já validou "O Desterro"
  * **When** volta a fazer scan do mesmo QR Code
  * **Then** o sistema informa que a obra já foi encontrada
  * **And** os pontos não são contados duas vezes.

## US-03: Medalhas e descontos na loja/cafetaria
**Card:** Como visitante, quero receber medalhas e descontos ao encontrar obras, para me sentir recompensado e ter motivo para voltar.
**Conversation:** As medalhas dependem do número de obras validadas: "Primeiro Passo" (1), "Explorador" (3) e "Mestre do Museu" (5). Ao conquistar uma medalha, a app pode gerar um código de desconto para a loja/cafetaria. Cada medalha só é atribuída uma vez.
**Confirmation (BDD):**
* **Cenário 1:** Atribuir medalha ao atingir o número de obras
  * **Given** que o visitante já validou 2 obras
  * **When** valida a terceira obra
  * **Then** a medalha "Explorador" aparece no seu progresso.
* **Cenário 2:** Desconto ao conquistar uma medalha
  * **Given** que o visitante acabou de conquistar uma medalha com desconto associado
  * **When** abre o ecrã de recompensas
  * **Then** vê um código de desconto para a loja/cafetaria
  * **And** o código só pode ser usado uma vez.

## US-04: Assistente de IA sobre uma obra (RAG)
**Card:** Como visitante, quero fazer perguntas em linguagem natural sobre uma obra, para compreender o seu contexto histórico e artístico.
**Conversation:** O visitante escreve uma pergunta (até 500 caracteres) sobre uma obra, por exemplo "O Desterro". O assistente procura nos textos oficiais do museu (RAG) e responde só com base neles. Se a informação não existir, diz que não sabe e sugere falar com um mediador. O assistente precisa de internet (a app avisa quando não há rede). O streaming deve começar em menos de 2,5 s com 200 utilizadores simultâneos (RNF-01).
**Confirmation (BDD):**
* **Cenário 1:** Pergunta com resposta nos textos do museu
  * **Given** que o corpus contém o texto oficial de "O Desterro"
  * **When** o visitante pergunta "Quem foi o autor de O Desterro?"
  * **Then** o assistente responde com base nesse texto e indica a obra como fonte.
* **Cenário 2:** Pergunta sem informação disponível (anti-alucinação)
  * **Given** que o corpus não tem informação sobre o assunto perguntado
  * **When** o visitante faz a pergunta
  * **Then** o assistente responde que não encontrou a informação
  * **And** não inventa factos.
* **Cenário 3:** Sem ligação à internet
  * **Given** que o visitante não tem rede
  * **When** envia uma pergunta
  * **Then** a app informa que o assistente precisa de internet.

## US-05: Respostas adaptadas à faixa etária
**Card:** Como visitante, quero escolher o nível das explicações (criança, jovem ou adulto), para receber respostas que consiga compreender.
**Conversation:** Antes de perguntar, o utilizador escolhe a faixa etária. Não é pedida idade nem outros dados pessoais (RNF-03). O assistente ajusta a linguagem mantendo os mesmos factos: frases curtas para crianças, tom descontraído para jovens e informativo para adultos.
**Confirmation (BDD):**
* **Cenário:** Resposta adaptada a crianças
  * **Given** que o visitante escolheu a faixa "criança"
  * **When** pergunta sobre uma obra que está no corpus
  * **Then** a resposta usa frases curtas e palavras simples
  * **And** só contém factos presentes nos textos oficiais.

## US-06: Indicador de afluência por sala
**Card:** Como visitante, quero ver quão cheia está cada sala, para escolher onde ir sem multidões.
**Conversation:** O sistema estima a ocupação de cada sala através da contagem de ligações Wi-Fi/Beacons e mostra um nível (baixa, média ou alta). O objetivo é aplanar o pico das 11h às 15h (máximo de 45% no pico).
**Confirmation (BDD):**
* **Cenário:** Mostrar a afluência atual
  * **Given** que existem dados de ocupação das salas
  * **When** o visitante abre o mapa de salas
  * **Then** cada sala mostra o nível de afluência (baixa, média ou alta)
  * **And** os dados têm no máximo 1 minuto de atraso.

## US-07: Notificação de salas alternativas e eventos
**Card:** Como visitante, quero receber avisos discretos de salas menos cheias e de eventos iminentes, para aproveitar melhor a visita.
**Conversation:** Quando a sala onde o visitante está ultrapassa o limite de ocupação, a app sugere uma sala alternativa. Avisa também de eventos próximos (ex.: "Visita comentada na Sala de Ourivesaria em 5 minutos"). As notificações podem ser desativadas.
**Confirmation (BDD):**
* **Cenário 1:** Sugerir sala alternativa
  * **Given** que o visitante está numa sala com afluência alta
  * **When** a ocupação ultrapassa o limite definido
  * **Then** a app envia uma notificação com uma sala alternativa de afluência baixa.
* **Cenário 2:** Notificações desativadas
  * **Given** que o visitante desativou as notificações
  * **When** existe um evento iminente
  * **Then** nenhuma notificação é enviada.

## US-08: Funcionamento offline e sincronização de progresso
**Card:** Como visitante, quero que a app funcione nas salas sem rede e guarde o meu progresso, para não perder pontos nem roteiros.
**Conversation:** Roteiros, mapas e leitura de QR Codes ficam disponíveis offline (service worker e IndexedDB, ver ADR-02), por causa das paredes espessas do Palácio dos Carrancas (RNF-02). Quando a ligação regressa, o progresso é sincronizado com o servidor sem duplicar dados.
**Confirmation (BDD):**
* **Cenário 1:** Usar a app sem ligação
  * **Given** que o visitante já abriu a app com rede
  * **When** perde a ligação à internet numa sala
  * **Then** consegue abrir a app, gerar um roteiro e ler QR Codes.
* **Cenário 2:** Progresso mantido ao recarregar
  * **Given** que o visitante validou obras offline
  * **When** fecha e volta a abrir a app
  * **Then** o progresso continua guardado.
* **Cenário 3:** Sincronizar ao recuperar a ligação
  * **Given** que o visitante acumulou progresso offline
  * **When** a ligação é restabelecida
  * **Then** o progresso é enviado ao servidor
  * **And** não há pontos nem medalhas duplicados.

## US-09: Acessibilidade universal (WCAG 2.1 AA)
**Card:** Como visitante sénior ou com necessidades especiais, quero uma interface acessível, para usar a app com autonomia.
**Conversation:** A app suporta leitores de ecrã, modo de alto contraste e áreas de toque de pelo menos 48x48 px (RNF-04).
**Confirmation (BDD):**
* **Cenário 1:** Alto contraste
  * **Given** que o visitante ativou o modo de alto contraste
  * **When** navega pela app
  * **Then** textos e controlos cumprem o contraste mínimo do WCAG 2.1 AA.
* **Cenário 2:** Áreas de toque e leitor de ecrã
  * **Given** que o visitante usa um leitor de ecrã
  * **When** percorre os botões e ligações principais
  * **Then** todos têm descrição acessível
  * **And** a área de toque é de pelo menos 48x48 px.

## US-10: Privacidade e proteção de menores (RGPD)
**Card:** Como encarregado de educação, quero que a app não guarde dados pessoais do meu filho, para o proteger.
**Conversation:** A app funciona sem registo e não guarda dados pessoais identificáveis de menores (RNF-03). A chave da API do assistente fica no servidor (variáveis de ambiente / vault) e nunca no cliente.
**Confirmation (BDD):**
* **Cenário 1:** Utilização sem dados pessoais
  * **Given** que uma criança usa a caça ao tesouro
  * **When** a app guarda o progresso
  * **Then** só guarda o identificador da obra e a data
  * **And** não guarda nome, idade, e-mail nem localização.
* **Cenário 2:** Segredos fora do cliente
  * **Given** que a PWA está em execução
  * **When** se inspeciona o código e o tráfego do cliente
  * **Then** não existem chaves de API nem credenciais expostas.
