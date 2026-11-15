# Diagramas de Classes (Marco M2)

Os diagramas descrevem as classes que existem no código atual. Estão separados por componente para serem legíveis.
Substituem o diagrama anterior (`Diagrama uml.jpg`), que incluía `Visitante` e `DesafioGamificado`, classes que não existem no código (e `Visitante` com nome e localização contraria o RNF-03).

## 1. Domínio e serviços da PWA (`frontend/src/`)

Ficheiros: `types/dominio.ts`, `data/acervo.ts`, `services/` (`api.ts`, `roteiroLocal.ts`, `tesouro.ts`, `tesouroProvisorio.ts`, `medalhas.ts`).
O `ServicoTesouroIndexedDB` ainda não existe: está planeado no ADR-02 (tarefa T-01) e vai substituir o serviço provisório em memória.

![Diagrama de classes: domínio e serviços](diagrama_classes_dominio.png)

```mermaid
classDiagram
    direction LR
    class Sala {
        +string id
        +string nome
    }
    class Obra {
        +string id
        +string titulo
        +string autor
        +number ano
        +Tema tema
        +string salaId
        +number minutos
        +number pontos
    }
    class PedidoRoteiro {
        +DuracaoRoteiro tempo
        +Tema tema
    }
    class Roteiro {
        +string id
        +string nome
        +DuracaoRoteiro tempo
        +number minutosTotais
        +origem api ou local
    }
    class Medalha {
        +string id
        +string nome
        +number obrasNecessarias
    }
    class Validacao {
        +string obraId
        +string data
    }
    class ServicoTesouro {
        <<interface>>
        +lerCodigoQr(texto) ResultadoLeitura
        +registarValidacao(obraId) Promise~boolean~
        +listarValidacoes() Promise~Validacao[]~
    }
    class ServicoTesouroProvisorio {
        guarda em memoria
    }
    class ServicoTesouroIndexedDB {
        planeado - ADR-02
    }
    class ApiRoteiros {
        +pedirRoteiro(pedido) Promise~Roteiro~
    }
    class GeradorRoteiroLocal {
        +gerarRoteiroLocal(pedido, acervo) Roteiro
    }
    class Medalhas {
        +medalhasGanhas(total, medalhas) Medalha[]
    }

    Obra "*" --> "1" Sala : esta em
    Roteiro o-- "*" Obra : inclui
    PedidoRoteiro ..> Roteiro : origina
    ApiRoteiros ..> GeradorRoteiroLocal : alternativa sem rede
    ApiRoteiros ..> Roteiro : devolve
    GeradorRoteiroLocal ..> Roteiro : cria
    Validacao --> Obra : obraId
    ServicoTesouro ..> Validacao : guarda
    ServicoTesouroProvisorio ..|> ServicoTesouro
    ServicoTesouroIndexedDB ..|> ServicoTesouro
    Medalhas ..> Medalha : seleciona
```

## 2. Assistente de IA (`ia/app/`)

Ficheiros: `rag.py`, `vetorial.py`, `embeddings.py`, `llm.py`, `corpus.py`, `config.py`, `fabrica.py`.
Padrões: **Strategy** (`GeradorEmbeddings` e `ModeloLinguagem` com implementações trocáveis) e **Factory Method** (`criar_assistente`). Ver ADR-03.

![Diagrama de classes: assistente de IA](diagrama_classes_assistente.png)

```mermaid
classDiagram
    direction TB
    class Configuracao {
        +string fornecedor
        +string gemini_api_key
        +string modelo_chat
        +string modelo_embeddings
        +float limiar
        +int top_k
        +Path pasta_corpus
        +do_ambiente() Configuracao
    }
    class FabricaAssistente {
        <<Factory Method>>
        +criar_assistente(config) AssistenteRAG
    }
    class AssistenteRAG {
        -float limiar
        -int top_k
        +total_trechos int
        +indexar(trechos)
        +responder(pergunta, faixa) Resposta
    }
    class Resposta {
        +string texto
        +bool encontrou
        +list fontes
    }
    class Trecho {
        +string id
        +string obra
        +string texto
        +string fonte
    }
    class IndiceVetorial {
        +adicionar(trechos, vetores)
        +procurar(vetor, k) list
    }
    class GeradorEmbeddings {
        <<interface>>
        +gerar(textos, tipo) ndarray
    }
    class EmbeddingsGemini
    class EmbeddingsLocais
    class ModeloLinguagem {
        <<interface>>
        +responder(instrucoes, mensagem) string
    }
    class ModeloGemini
    class ModeloExtrativo
    class ErroModelo {
        <<exception>>
    }

    FabricaAssistente ..> Configuracao : le
    FabricaAssistente ..> AssistenteRAG : cria
    AssistenteRAG *-- IndiceVetorial
    AssistenteRAG --> GeradorEmbeddings
    AssistenteRAG --> ModeloLinguagem
    AssistenteRAG ..> Resposta : devolve
    IndiceVetorial o-- "*" Trecho
    EmbeddingsGemini ..|> GeradorEmbeddings
    EmbeddingsLocais ..|> GeradorEmbeddings
    ModeloGemini ..|> ModeloLinguagem
    ModeloExtrativo ..|> ModeloLinguagem
    ModeloGemini ..> ErroModelo : lanca
```
