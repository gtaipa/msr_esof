# ADR-03: Assistente de IA com RAG num serviço Python (FastAPI + numpy + Gemini)

## Título
Arquitetura do Módulo C — Assistente de IA (RF-09 a RF-12).

## Contexto
O assistente tem de responder a perguntas sobre as obras **apenas** com base nos textos oficiais
do museu, adaptando a linguagem à faixa etária, sem inventar factos (requisito de IA
responsável). O enunciado permite backend em Python ou Java; a API principal está em Java
(Spring Boot). O README da equipa prevê Gemini ou Claude como modelo. O corpus é pequeno
(10 a 20 textos).

## Decisão Considerada
- **Serviço separado em Python (FastAPI)** para o assistente, em `ia/`, exposto em `/api/ia/chat`.
  O ecossistema de IA (SDK do Gemini, numpy) é mais maduro em Python, e isolar a IA permite
  testá-la e evoluí-la sem mexer na API principal.
- **Base vetorial em memória só com numpy** (vetores normalizados; o produto interno é a
  semelhança do cosseno). Com 10 a 20 textos, comparar a pergunta com todos os trechos é
  instantâneo e o índice é reconstruído no arranque. Alternativas consideradas: FAISS e ChromaDB —
  úteis para milhares de documentos, mas mais dependências e mais complexidade sem ganho para
  este tamanho de corpus. Se o corpus crescer muito, trocar a classe `IndiceVetorial` por FAISS
  não obriga a mudar o resto do código.
- **Gemini** para embeddings e geração (configurável), com um **modo local** sem IA generativa
  (devolve o excerto oficial) para testes, CI e demo sem internet.
- Padrões **Strategy** (fornecedores trocáveis) e **Factory Method** (criação conforme a configuração).

Alternativas rejeitadas: RAG dentro do Spring Boot (LangChain4j/Spring AI) — mantinha um só
backend, mas concentrava a IA no serviço principal; modelo local Ollama — gratuito, mas depende
do hardware do PC da demo e é mais lento.

## Consequências
- Positivas: respostas limitadas ao corpus (limiar de relevância + instruções + testes
  anti-alucinação); a chave da API fica fora do código; os testes não precisam de rede.
- Negativas: passam a existir dois serviços de backend (Java e Python), com mais um job no CI e
  mais um processo a arrancar na demo; o modo Gemini depende de internet e da quota da API;
  o limiar de relevância tem de ser calibrado com as perguntas de teste.

## Estado
Proposto (João). A rever pela equipa.
