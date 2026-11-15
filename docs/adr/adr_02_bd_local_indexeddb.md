# ADR-02: Base de dados local no telemóvel com IndexedDB (acesso offline)

## Título
Armazenamento local do progresso da caça ao tesouro e dos dados necessários offline (RNF-02).

## Contexto
As paredes espessas do Palácio dos Carrancas bloqueiam a rede móvel e o Wi-Fi em várias salas. A app tem de
continuar a funcionar nessas zonas: ler QR Codes, guardar as obras validadas e mostrar roteiros (RNF-02).
Hoje o progresso é guardado em memória (`frontend/src/services/tesouroProvisorio.ts`) e perde-se ao recarregar a
página. O contrato `ServicoTesouro` (`frontend/src/services/tesouro.ts`) já define o que é preciso guardar:
cada validação tem o `obraId` e a `data` (ISO 8601). O RNF-03 proíbe guardar dados pessoais de menores.

## Decisão Considerada
Usar **IndexedDB** (API nativa do browser, sem bibliotecas extra) como base de dados local da PWA:
- Uma *object store* `validacoes`, com `obraId` como chave. Chave única evita validações duplicadas.
- Só se guardam `obraId` e `data`. Nenhum nome, idade, e-mail ou localização (RNF-03).
- O acervo inicial (`data/acervo.ts`) fica no código da app e o service worker (`vite-plugin-pwa`, já configurado)
  guarda em cache a app e as respostas da API (`NetworkFirst`), por isso roteiros e mapas funcionam offline.
- A `IndexedDB` é acedida só por uma classe que implementa `ServicoTesouro`. Os ecrãs não mudam: troca-se a
  implementação provisória em `main.tsx`.

Alternativas consideradas:
- **LocalStorage:** mais simples, mas é síncrono, só guarda texto e tem pouco espaço. Aceitável para poucos dados, mas
  não escala para progresso, medalhas e conteúdo multimédia em cache.
- **SQLite no browser (WASM):** modelo relacional familiar, mas obriga a dependências pesadas e a mais configuração.
- **Biblioteca sobre IndexedDB (idb, Dexie):** API mais cómoda, mas é uma dependência extra a manter e a explicar.
- **Guardar só no servidor:** não funciona sem rede, o que contraria o RNF-02.

A base de dados do **servidor** (PostgreSQL, prevista no README) fica fora desta decisão: o backend ainda não guarda
dados. Quando existir sincronização (US-08), será registada num ADR próprio.

## Consequências
- Positivas: o progresso sobrevive a recarregar a página e funciona sem rede; sem dependências novas; os dados são
  anónimos por desenho (RNF-03); o contrato `ServicoTesouro` permite testar com uma implementação em memória.
- Negativas: a API do IndexedDB é assíncrona e mais verbosa do que o LocalStorage; o progresso fica só no
  dispositivo (se o visitante trocar de telemóvel ou limpar os dados do browser, perde-o) até haver sincronização;
  testar IndexedDB em Vitest exige um ambiente simulado (ex.: `fake-indexeddb`).

## Estado
Aceite
