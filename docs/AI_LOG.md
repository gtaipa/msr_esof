# Registo de Proveniência de IA (AI_LOG.md)

| Data / Hora | Ferramenta Usada | Prompt Submetido | Resultado Gerado pela IA | Ação Humana / Validação Efetuada |
| :--- | :--- | :--- | :--- | :--- |
| 2026-11-09 | Claude | Gerar a estrutura do frontend PWA (React + TS), roteiro offline, contrato da caça ao tesouro, testes e CI | Projeto `frontend/` com 22 testes e pipeline GitHub Actions | ACEITE COM ALTERAÇÕES: código revisto e testado localmente (22 testes a passar); acervo de exemplo a confirmar com o museu |
| 2026-11-10 | Claude | Pipeline de CI único (backend + frontend), JaCoCo com quality gate, ESLint, npm audit e gitleaks | `ci.yml` com 3 jobs, JaCoCo no `pom.xml`, configuração ESLint e correção de 2 problemas apontados pelo ESLint | ACEITE COM ALTERAÇÕES: validado com o CI a correr no Pull Request; TypeScript fixado na 5.9 por compatibilidade com o ESLint |
