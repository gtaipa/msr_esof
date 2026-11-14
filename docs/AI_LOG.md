# Registo de Proveniência de IA (AI_LOG.md)

| Data / Hora | Ferramenta Usada | Prompt Submetido | Resultado Gerado pela IA | Ação Humana / Validação Efetuada |
| :--- | :--- | :--- | :--- | :--- |
| 2026-11-09 | Claude | Gerar a estrutura do frontend PWA (React + TS), roteiro offline, contrato da caça ao tesouro, testes e CI | Projeto `frontend/` com 22 testes e pipeline GitHub Actions | ACEITE COM ALTERAÇÕES: código revisto e testado localmente (22 testes a passar); acervo de exemplo a confirmar com o museu |
| 2026-11-10 | Claude | Pipeline de CI único (backend + frontend), JaCoCo com quality gate, ESLint, npm audit e gitleaks | `ci.yml` com 3 jobs, JaCoCo no `pom.xml`, configuração ESLint e correção de 2 problemas apontados pelo ESLint | ACEITE COM ALTERAÇÕES: validado com o CI a correr no Pull Request; TypeScript fixado na 5.9 por compatibilidade com o ESLint |
| 2026-11-11 | Claude | Assistente de IA com RAG (FastAPI, numpy, Gemini), testes anti-alucinação, ecrã do Chat, job de CI e ADR-03 | Serviço `ia/` com 45 testes (99% de cobertura), ecrã Chat IA (frontend passa de 22 para 32 testes), ADR-03 | ACEITE COM ALTERAÇÕES: testes corridos localmente; corpus de O Desterro provisório até o Zé entregar os textos oficiais; limiar do Gemini por calibrar; FAISS proposto pela IA e substituído por numpy para simplificar |

## Registos no formato obrigatório

Os registos anteriores foram mantidos como escritos na altura; não indicavam sempre versão do modelo nem a validação por campo. A partir desta sessão, cada tarefa usa as colunas completas abaixo.

| Data | Ferramenta e versão do modelo | Tarefa | Prompt resumido | Resultado gerado | Decisão do estudante | Validações feitas | Limitações ou erros encontrados |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 2026-11-14 | Codex, modelo GPT-6; versão exata não exposta nesta sessão | Bloco A: API Spring Boot em `feature/backend-api` | Ler contrato do frontend e ADR-01; criar domínio, casos de uso, portas, armazenamento em memória, endpoints REST, erros e testes | API para listar obras, gerar roteiros e validar QR/desbloquear medalhas; testes unitários e MockMvc; exclusão de classes JDK externas no JaCoCo | Pendente de validação do estudante; não foi registada rejeição de código nesta tarefa | `mvn -B clean verify`: 11 testes passaram; cobertura de linhas 85,83% | Acervo de demonstração por confirmar. Teste backend de base falhava no gate de cobertura (0%); frontend e IA não tinham dependências instaladas na primeira tentativa |
