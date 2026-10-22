# Definition of Done (DoD) - MNSR Digital

Para que uma User Story (US) ou Tarefa seja considerada **"Concluída" (Done)** no nosso Kanban, deve cumprir rigorosamente os seguintes critérios:

## 1. Código e Arquitetura
- [ ] O código segue as regras da *Clean Architecture* e os princípios SOLID.
- [ ] Não existem code smells ou dívida técnica (avaliado via SonarQube/Linter).
- [ ] O código está formatado segundo as normas da equipa.

## 2. Testes (TDD)
- [ ] A cobertura de testes unitários (JUnit/JaCoCo) é igual ou superior a 80%.
- [ ] Todos os testes unitários e de integração passam no pipeline de CI.
- [ ] Os critérios de aceitação BDD (Given/When/Then) estão cobertos por testes.

## 3. Auditoria e IA
- [ ] Toda a utilização de IA para gerar código ou ideias está registada no `docs/AI_LOG.md`.
- [ ] Nenhuma credencial ou chave de API foi "hardcoded" ou exposta à IA.

## 4. Funcionalidade
- [ ] A funcionalidade cumpre todos os Critérios de Aceitação descritos na US.
- [ ] O requisito não-funcional de persistência offline (quando aplicável) foi validado.

## 5. Review
- [ ] O código passou por Code Review (Pull Request aprovado por outro membro).
- [ ] A documentação (ADRs, Diagramas, README) foi atualizada se necessário.