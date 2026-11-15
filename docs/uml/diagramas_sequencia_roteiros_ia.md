# Diagramas de Sequência: Roteiros, Assistente de IA e Caça ao Tesouro (Marco M2)

Estes diagramas descrevem o comportamento real do código atual:
`frontend/src/services/api.ts` e `roteiroLocal.ts` (Roteiros) e `ia/app/` (Assistente de IA).
Substituem os diagramas anteriores (`Diagrama de Sequencia.jpg` e o `Diagrama uml.jpg`), que mostravam uma arquitetura (API Gateway, base de dados, base vetorial, `ValidadorQR`) que não existe no código.

## 1. Gerar roteiro (US-01, RF-01 a RF-04)

O frontend pede o roteiro à API. Se a API não responder (sem rede ou erro), gera-o localmente no telemóvel (RNF-02).

![Sequência: gerar roteiro](sequencia_roteiro.png)

```mermaid
sequenceDiagram
    actor V as Visitante
    participant App as App (PWA)
    participant API as API Spring Boot
    participant Svc as Serviço de Roteiros
    participant Loc as Gerador local (offline)

    V->>App: escolhe tempo (30/60/90) e tema
    App->>API: POST /api/roteiros {tempo, tema}
    alt API disponível
        API->>Svc: gerarRoteiro(pedido)
        Svc-->>API: Roteiro (obras, minutos totais)
        API-->>App: 200 Roteiro
        App-->>V: mostra roteiro (origem: api)
    else sem rede ou erro da API
        App->>Loc: gerarRoteiroLocal(pedido, acervo)
        Loc-->>App: Roteiro (origem: local)
        App-->>V: mostra roteiro e aviso de modo offline
    end
```

## 2. Perguntar ao assistente de IA (US-04 e US-05, RF-09 a RF-12)

O assistente só responde com os excertos oficiais do museu. Sem excertos relevantes, não chega a chamar o modelo (defesa contra alucinações).

![Sequência: assistente de IA](sequencia_assistente_ia.png)

```mermaid
sequenceDiagram
    actor V as Visitante
    participant App as App (PWA)
    participant API as API FastAPI /api/ia/chat
    participant RAG as AssistenteRAG
    participant Idx as IndiceVetorial
    participant LLM as Modelo (Gemini)

    V->>App: pergunta sobre uma obra + faixa etária
    App->>API: POST /api/ia/chat {pergunta, faixaEtaria}
    API->>RAG: responder(pergunta, faixa)
    RAG->>RAG: valida pergunta (vazia ou mais de 500 caracteres)
    RAG->>Idx: procurar(vetor da pergunta, top_k)
    Idx-->>RAG: trechos com semelhança
    alt nenhum trecho acima do limiar
        RAG-->>API: Resposta "não encontrei" (encontrou=false)
    else existem trechos relevantes
        RAG->>LLM: instrucoes + excertos + pergunta
        LLM-->>RAG: texto da resposta
        RAG-->>API: Resposta (texto, fontes, encontrou=true)
    end
    API-->>App: 200 {resposta, encontrou, fontes}
    App-->>V: mostra a resposta e as fontes
```

## 3. Validar um QR Code na caça ao tesouro (US-02 e US-03, RF-05 a RF-08)

A validação acontece no telemóvel (`ServicoTesouro`), por isso funciona sem rede (RNF-02).

![Sequência: validar QR Code](sequencia_qr.png)

```mermaid
sequenceDiagram
    actor V as Visitante
    participant Ecra as Ecrã Caça ao Tesouro
    participant S as ServicoTesouro
    participant M as Medalhas

    V->>Ecra: lê QR Code (ou escreve o código)
    Ecra->>S: lerCodigoQr(texto)
    alt formato inválido ou obra desconhecida
        S-->>Ecra: inválido (formato ou desconhecido)
        Ecra-->>V: erro "Este código não é do MNSR" ou "Obra não encontrada"
    else código válido (MNSR:OBRA:id)
        S-->>Ecra: válido (obraId)
        Ecra->>S: registarValidacao(obraId)
        alt obra já validada
            S-->>Ecra: false
            Ecra-->>V: aviso "Já tinhas encontrado a obra"
        else primeira validação
            S-->>Ecra: true (guardado, funciona offline)
            Ecra->>M: medalhasGanhas(total de obras)
            M-->>Ecra: medalhas atingidas
            Ecra-->>V: sucesso com pontos e eventual nova medalha
        end
    end
```

## Notas

* `POST /api/roteiros` ainda não existe no backend Spring Boot: enquanto não for implementado, o ramo "sem rede ou erro da API" é o único que corre. Atualizar o diagrama quando o endpoint existir.
* O assistente de IA corre num serviço Python separado (ver `docs/adr/adr_03_assistente_ia_rag.md`).
