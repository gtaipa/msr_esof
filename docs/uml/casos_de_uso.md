# Casos de uso — App MNSR Digital

O diagrama representa funcionalidades já identificadas em US-01/US-02 e no ADR-03. US-03–08 estão assinaladas como propostas a validar no backlog e não são apresentadas como implementadas.

```mermaid
flowchart LR
  visitante[Visitante]
  assistente[Fornecedor Gemini opcional]
  subgraph app[App MNSR Digital]
    u1((Pedir roteiro por tempo e tema<br/>US-01 / RF-01–04))
    u2((Consultar obras<br/>US-01))
    u3((Validar QR e receber medalha<br/>US-02 / RF-05–08))
    u4((Perguntar sobre uma obra<br/>RF-09–12 / ADR-03 proposto))
    u5((Gerir perfil<br/>US-03 proposta))
    u6((Consultar mapa<br/>US-04 proposta))
    u7((Sincronizar progresso<br/>US-05 proposta))
    u8((Ouvir conteúdo<br/>US-06 proposta))
    u9((Partilhar resumo<br/>US-07 proposta))
    u10((Enviar feedback<br/>US-08 proposta))
  end
  visitante --> u1
  visitante --> u2
  visitante --> u3
  visitante --> u4
  visitante --> u5
  visitante --> u6
  visitante --> u7
  visitante --> u8
  visitante --> u9
  visitante --> u10
  assistente -. fornecedor configurável .-> u4
```

Nota: o diagrama fonte usa Mermaid. Exportação PNG: `casos_de_uso.png`.
