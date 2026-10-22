# ADR 01: Adoção de Arquitetura Limpa em 3 Camadas com API RESTful

**Data:** 22 de Outubro de 2026
**Status:** Aceite

## 1. Contexto
A App MNSR Digital terá de gerir lógicas de negócio progressivamente mais complexas, incluindo a validação de pontos de gamificação (Caça ao Tesouro via QR Codes) e a integração com serviços de IA para os roteiros dinâmicos (RAG). 
A utilização de uma arquitetura acoplada diretamente à framework (como um MVC tradicional fortemente ligado ao Spring Boot) dificultaria a testabilidade isolada do domínio e futuras migrações. Além disso, a aplicação móvel (cliente) necessita de comunicar de forma padronizada com o backend.

## 2. Decisão
Decidimos implementar o backend utilizando uma abordagem de **Arquitetura Limpa (Clean Architecture) dividida em 3 camadas principais**, e expor os serviços através de uma **API RESTful**.

A organização das camadas será a seguinte:
*   **Domínio (Domain):** Onde residem as entidades core (Ex: `Roteiro`, `Obra`, `Visitante`, `DesafioGamificado`). Não tem qualquer dependência externa, garantindo a aplicação estrita das regras de negócio.
*   **Aplicação (Application):** Onde residem os Casos de Uso (Use Cases / Services) que orquestram a lógica. Define as interfaces (Ports) para acesso aos dados.
*   **Infraestrutura (Infrastructure):** Onde residem os Controllers REST, os Repositórios de acesso à Base de Dados (PostgreSQL/SQLite) e as configurações do Spring Boot.

## 3. Consequências
*   **Positivas:** 
    *   **Alta Testabilidade:** A lógica de negócio core pode ser testada com JUnit (TDD) sem carregar o contexto pesado do Spring, garantindo rapidez e facilidade em atingir a meta de >80% de cobertura.
    *   **Desacoplamento:** Facilita a substituição de componentes de infraestrutura (ex: mudar o LLM Provider ou a base de dados) sem afetar o core da aplicação.
    *   **Comunicação Standard:** A API RESTful permite que a aplicação móvel comunique de forma universal e eficiente com o backend.
*   **Negativas:**
    *   Maior verbosidade do código, exigindo a criação de DTOs (Data Transfer Objects) e Mappers para transportar dados entre as camadas sem "contaminar" o Domínio.
    *   Curva de aprendizagem inicial ligeiramente superior para manter a separação rigorosa de responsabilidades (SRP).