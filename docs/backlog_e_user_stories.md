# Backlog do Produto (Marco M1)

Este documento centraliza as User Stories (US) estruturadas através dos "3 Cs" (Card, Conversation, Confirmation) e com critérios de aceitação em BDD (Gherkin).

## US-01: Roteiro Dinâmico com IA (RAG)
**Card:** Como visitante, quero gerar um roteiro personalizado com base no meu tempo disponível e interesses, para ter uma visita otimizada.
**Conversation:** O utilizador insere o tempo (ex: 45 min) e tema (ex: "Cerâmica"). A IA gera um trajeto lógico sem alucinar, usando a base de dados do museu.
**Confirmation (BDD):**
* **Cenário:** Gerar roteiro com sucesso
  * **Given** que o visitante está no ecrã de novo roteiro
  * **When** insere "60 minutos" e "Pintura Naturalista"
  * **Then** o sistema retorna uma lista de 3 a 5 obras relevantes
  * **And** o tempo estimado total não ultrapassa os 60 minutos.

## US-02: Caça ao Tesouro (QR Code)
**Card:** Como jovem visitante, quero ler QR Codes junto às obras para desbloquear medalhas e curiosidades.
**Conversation:** A app usa a câmara. Ao ler um código válido, o estado local é atualizado (mesmo offline) e o utilizador ganha pontos.
**Confirmation (BDD):**
* **Cenário:** Leitura de QR Code offline
  * **Given** que o visitante não tem ligação à internet (Offline-First)
  * **When** faz scan do QR Code da obra "O Desterrado"
  * **Then** o sistema valida o código usando o cache local (IndexedDB/SQLite)
  * **And** exibe uma mensagem de sucesso com a medalha desbloqueada.

*(Nota: O backlog completo no GitHub Projects inclui as restantes US: US-03 Gestão de Perfil, US-04 Mapa Interativo, US-05 Sincronização de Progresso, US-06 Acessibilidade Áudio, US-07 Partilha nas Redes Sociais, US-08 Feedback de Visita).*