# ADR-01: Arquitetura Limpa em 3 camadas com API RESTful

**Data:** 22 de outubro de 2026 (revisto em 15 de novembro de 2026)

## Título
Organização do backend em 3 camadas (Domínio, Aplicação, Infraestrutura) e comunicação por API RESTful.

## Contexto
A App MNSR Digital terá de gerir lógicas de negócio progressivamente mais complexas, incluindo os roteiros dinâmicos (Módulo A) e a validação de pontos da Caça ao Tesouro com QR Codes (Módulo B). O sistema tem três componentes: a PWA (React, em `frontend/`), a API principal em Spring Boot (`backend/`) e o assistente de IA em Python (`ia/`, ver ADR-03).
Uma arquitetura acoplada diretamente à framework (como um MVC tradicional fortemente ligado ao Spring Boot) dificultaria a testabilidade isolada do domínio e futuras migrações. Além disso, a aplicação móvel (cliente) necessita de comunicar de forma padronizada com o backend.

## Decisão Considerada
Implementar o backend com uma abordagem de **Arquitetura Limpa (Clean Architecture) dividida em 3 camadas** e expor os serviços através de uma **API RESTful**.

* **Domínio (Domain):** entidades core (`Obra`, `Sala`, `Roteiro`) e regras de negócio, como o cálculo do roteiro dentro do tempo escolhido. Não tem dependências externas. Não existe uma entidade `Visitante` com dados pessoais (RNF-03): o progresso do visitante é anónimo e fica no telemóvel (ADR-02).
* **Aplicação (Application):** casos de uso (ex.: "Gerar Roteiro") que orquestram o domínio. Define as interfaces (Ports) para acesso aos dados.
* **Infraestrutura (Infrastructure):** controllers REST (ex.: `POST /api/roteiros`), repositórios de acesso a dados e configuração do Spring Boot.

O serviço de IA (`ia/`) segue a mesma ideia de separação em módulos pequenos (configuração, leitura do corpus, índice vetorial, assistente RAG e API HTTP) e o frontend isola a lógica de negócio dos ecrãs em `services/`.

Alternativa rejeitada: MVC tradicional do Spring Boot, mais rápido de começar, mas com o domínio misturado com a framework.

## Consequências
* **Positivas:**
  * **Alta testabilidade:** a lógica de negócio pode ser testada com JUnit (TDD) sem carregar o contexto do Spring, o que ajuda a atingir a meta de cobertura de pelo menos 80% definida na Definition of Done.
  * **Desacoplamento:** facilita a substituição de componentes de infraestrutura (ex.: a base de dados) sem afetar o core da aplicação.
  * **Comunicação standard:** a API RESTful permite que a aplicação móvel comunique de forma universal com o backend.
* **Negativas:**
  * Maior verbosidade do código, com DTOs (Data Transfer Objects) e Mappers para transportar dados entre camadas sem "contaminar" o Domínio.
  * Curva de aprendizagem inicial superior para manter a separação rigorosa de responsabilidades.
  * A API Java ainda só tem a classe de arranque; os endpoints do Módulo A serão implementados no Sprint 2.

## Estado
Aceite
