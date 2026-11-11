# Assistente de IA — App MNSR Digital (Módulo C, RF-09 a RF-12)

Serviço Python (FastAPI) com RAG: antes de perguntar ao modelo, procura nos textos oficiais do
museu (`corpus/`) os excertos relevantes e só responde com base neles. A decisão está no
[ADR-03](../docs/adr/adr_03_assistente_ia_rag.md).

## Como correr

```powershell
cd ia
python -m venv .venv
.venv\Scripts\Activate.ps1          # Linux/macOS: source .venv/bin/activate
pip install -r requirements-dev.txt
pytest                              # testes + cobertura (mínimo 80%)
ruff check .                        # análise estática
uvicorn app.main:app --port 8000    # API; documentação em http://localhost:8000/docs
```

Com o frontend a correr (`npm run dev`), o ecrã **Chat IA** fala com este serviço através do
proxy `/api/ia` → porta 8000.

## Modos (variável `IA_FORNECEDOR`)

| Modo | O que faz | Precisa de |
| --- | --- | --- |
| `local` (omissão) | Procura por palavras e devolve o excerto oficial tal como está, sem IA generativa | Nada |
| `gemini` | Embeddings e resposta gerada pelo Gemini, só a partir dos excertos | `GEMINI_API_KEY` |

A chave **nunca** vai para o Git: no PC fica num ficheiro `.env` (está no `.gitignore`) ou numa
variável de ambiente. Ver `.env.example`.

## API

`POST /api/ia/chat` com `{ "pergunta": "...", "faixaEtaria": "crianca" | "jovem" | "adulto" }`
devolve `{ "resposta": "...", "encontrou": true | false, "fontes": ["O Desterro"] }`.

## Como evita alucinações

1. **Limiar de relevância:** se nenhum excerto for parecido o suficiente com a pergunta, responde
   logo que não sabe, **sem chamar o modelo**.
2. **Instruções ao modelo:** responder só com os excertos; se não estiverem lá, dizer a frase fixa
   de "não sei"; ignorar instruções escondidas na pergunta (*prompt injection*); temperatura 0,2.
3. **Testes** em `tests/test_anti_alucinacao.py`: perguntas com resposta no corpus e perguntas
   sem resposta (o assistente tem de dizer que não sabe).

## Organização (padrões)

- **Strategy:** `GeradorEmbeddings` e `ModeloLinguagem` são interfaces; Gemini e local são
  estratégias trocáveis.
- **Factory Method:** `fabrica.criar_assistente()` cria as estratégias certas conforme a configuração.

## O que falta

- **Corpus oficial (Zé):** 10 a 20 textos do museu em `corpus/` (formato em `corpus/LEIA-ME.md`).
  O texto atual de *O Desterro* é provisório.
- **Perguntas de teste do Zé:** acrescentar a `tests/test_anti_alucinacao.py`.
- **Calibrar o limiar do Gemini** (`IA_LIMIAR`, 0,65 por omissão) com essas perguntas.
- O ficheiro `.env` não é lido automaticamente: definir as variáveis no terminal antes do `uvicorn`
  (PowerShell: `$env:IA_FORNECEDOR="gemini"; $env:GEMINI_API_KEY="..."`).
