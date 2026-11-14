# App MNSR Digital

[![CI](https://github.com/gtaipa/msr_esof/actions/workflows/ci.yml/badge.svg)](https://github.com/gtaipa/msr_esof/actions/workflows/ci.yml)

## 1. Contexto e Problema
O Museu Nacional Soares dos Reis (MNSR), localizado no Palácio dos Carrancas no Porto, enfrenta um défice estrutural de captação de público, retendo apenas 7,1% do fluxo turístico de referência da cidade (cerca de 85.000 visitantes/ano). Atualmente, o público é maioritariamente envelhecido (62% seniores integrados em excursões), as visitas são superficiais (média de 42 minutos) e existe uma forte sobrelotação das salas no horário das 11h às 15h. A App MNSR Digital é uma solução móvel desenhada para mitigar estes problemas, transformando a visita numa experiência interativa e gamificada.

## 2. Objetivos de Negócio e KPIs
O impacto desta aplicação será medido pelas seguintes metas institucionais:
* **Demografia:** Aumentar a proporção de jovens (<25 anos) e famílias de 27% para, no mínimo, 45%.
* **Tempo de Visita:** Elevar o tempo médio de permanência nas galerias de 42 para 65 minutos.
* **Fidelização:** Aumentar a taxa de retorno anual de residentes locais do Porto de < 5% para 18%.
* **Gestão de Fluxos:** Aplanar a curva de visitantes, reduzindo a concentração no pico das 11h-15h (atualmente de 70%) para um máximo de 45%.

## 3. Equipa e Papéis
* **Guilherme Taipa** — papel por confirmar pela equipa.
* **João Reis** — papel por confirmar pela equipa.
* **José Martins** — papel por confirmar pela equipa.

## 4. Stack Tecnológica
* **Frontend Móvel:** TypeScript + React (Progressive Web App)
* **Backend API:** Java + Spring Boot
* **Testes e Qualidade:** JUnit + JaCoCo (Cobertura >= 80%), Checkstyle e OWASP Dependency-Check (CVSS 7)
* **Bases de Dados:** PostgreSQL (Servidor) + IndexedDB (Offline Mobile)
* **Assistente de IA:** Gemini / Claude

A CI executa a action oficial OWASP Dependency-Check sobre o projeto Maven e usa uma base de vulnerabilidades atualizada diariamente; não requer `NVD_API_KEY`.

## 5. Governação de IA (Marco M0)
A nossa equipa adota a filosofia *scaffold first, automate second* e compromete-se a manter total transparência no uso de IA Generativa.
* 📄 Ler a **[Carta de Uso Responsável de IA](docs/CARTA_IA.md)**
* 🔎 Consultar o **[Registo de Proveniência de IA (AI_LOG)](docs/AI_LOG.md)**

## 6. Como correr

Pré-requisitos: JDK compatível com o `pom.xml`, Maven, Node.js/npm e Python. Inicie cada serviço num terminal separado a partir da raiz do repositório.

### API Java (porta 8080)

```powershell
cd backend
mvn spring-boot:run
```

### Frontend (porta 5173)

```powershell
cd frontend
npm ci
npm run dev
```

### Assistente Python (porta 8000)

```powershell
cd ia
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements-dev.txt
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000
```

O modo local do assistente não requer chave externa. Para usar Gemini, configure `IA_FORNECEDOR=gemini` e a chave indicada no `ia/README.md` no ambiente do processo. Nunca adicione a chave ao Git.

Para iniciar o frontend e os três serviços em conjunto, mantenha os três terminais abertos; não existe atualmente um orquestrador único no repositório. Os caminhos de integração/API e a disponibilidade dos endpoints dependem do respetivo serviço estar iniciado.

## 7. Estado dos incrementos

| Incremento | Estado documentado nesta revisão |
|---|---|
| M0 — Governação de IA | Carta e AI_LOG presentes; novos registos documentam as tarefas desta entrega |
| M1 — Visão e backlog | Visão existente; histórias US-03–08 detalhadas como propostas a validar |
| M2 — Arquitetura e qualidade | ADR-01/ADR-03 e CI presentes nos respetivos branches; ADR-02 aguarda decisão real da equipa |
| M3 — Produto e integração | API Java e assistente Python implementados; integração frontend/API está em branch próprio; mapa, perfil, sincronização duradoura, áudio, partilha e feedback são propostas, não funcionalidades concluídas |
| Revisão da equipa | PRs e aprovações de colegas ainda não registados; não se atribuem aprovações ou papéis sem confirmação |

Ver também [backlog e histórias](docs/backlog_e_user_stories.md), [stakeholders e requisitos](docs/stakeholders_e_requisitos.md), [diagrama de casos de uso](docs/uml/casos_de_uso.md) e [ADR-03](docs/adr/adr_03_assistente_ia_rag.md).
