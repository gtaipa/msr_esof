# App Móvel Gamificada MNSR (Museu Nacional Soares dos Reis)

## Visão do Produto
A App Móvel Gamificada do MNSR tem como objetivo transformar a visita ao museu numa experiência imersiva, educativa e interativa. Através de roteiros dinâmicos (Módulo A) e um assistente inteligente, a aplicação visa atrair novos públicos e fidelizar os visitantes atuais, promovendo a descoberta autónoma e o engajamento com o acervo através de mecânicas de gamificação. A aplicação é construída com foco na robustez (funcionamento offline via IndexedDB), arquitetura limpa e integração de IA generativa (RAG).

## Stack Tecnológica
* **Backend:** Java + Spring Boot
* **Testes & Cobertura:** JUnit + JaCoCo
* **Base de Dados:** SQLite/PostgreSQL (Servidor) + IndexedDB (Cliente/Offline)
* **IA:** Integração planeada com Ollama (local) ou API externa (OpenAI/Gemini)

## Carta de IA da Equipa
Enquanto equipa de desenvolvimento, comprometemo-nos a utilizar ferramentas de Inteligência Artificial de forma ética, transparente e responsável:
1. **Transparência:** Todo o código, arquitetura ou texto gerado por IA será devidamente registado.
2. **Auditoria:** O ficheiro `docs/AI_LOG.md` será mantido atualizado com todos os prompts e respostas relevantes.
3. **Validação Humana:** Nenhuma sugestão da IA será integrada sem revisão crítica e testes por parte de um membro da equipa.
4. **Segurança:** Nenhuma credencial, chave de API, ou dado sensível (PII) será partilhado com modelos de IA externos.

*Assinado: Equipa de Desenvolvimento MNSR, 22 de Outubro de 2026*