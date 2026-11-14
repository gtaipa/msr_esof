# Backlog do Produto (M1)

As histórias seguem os 3 Cs (Card, Conversation, Confirmation). US-01 e US-02 mantêm os objetivos registados no backlog original; pormenores técnicos que não constam das decisões da equipa ficam assinalados como propostas a validar.

## US-01 — Roteiro personalizado
**Card:** Como visitante, quero gerar um roteiro conforme o tempo disponível e os meus interesses, para aproveitar melhor a visita.

**Conversation:** A API atual aceita 30, 60 ou 90 minutos e um tema, e devolve 3–5 obras dentro do tempo. A descrição original falava em IA/RAG, mas a implementação atual seleciona obras através da API Java; confirmar com a equipa se o título deve continuar a prometer IA.

**Confirmation (BDD):**
```gherkin
Cenário: Gerar roteiro dentro do tempo escolhido
  Given que o visitante escolheu 60 minutos e um tema disponível
  When pede um roteiro
  Then recebe entre 3 e 5 obras
  And o tempo estimado não excede 60 minutos
```

## US-02 — Caça ao tesouro por QR
**Card:** Como visitante, quero validar códigos QR junto das obras e acompanhar as medalhas obtidas, para tornar a visita mais interativa.

**Conversation:** A leitura e o progresso provisório funcionam localmente. O registo online usa `POST /api/validacoes`; não existe endpoint GET para sincronizar ou obter a lista do servidor. A persistência atual da API é em memória.

**Confirmation (BDD):**
```gherkin
Cenário: Validar um QR reconhecido
  Given que o visitante está no ecrã da caça ao tesouro
  When submete um código QR reconhecido
  Then vê a validação e a medalha atribuída pela API

Cenário: Continuar sem rede
  Given que o visitante está sem ligação
  When lê um QR
  Then o progresso provisório fica disponível na sessão local
  And a aplicação informa que o registo no servidor não foi confirmado
```

## US-03 — Gestão de perfil *(proposta; validar com a equipa)*
**Card:** Como visitante, quero definir preferências básicas de visita, para receber uma experiência adequada aos meus interesses.

**Conversation:** Não há requisito ou implementação de perfil confirmado. Privacidade, necessidade de conta, dados guardados e possibilidade de perfil anónimo têm de ser decididos antes do desenvolvimento. Proposta inicial: permitir preferências locais sem conta nem dados identificativos.

**Confirmation (BDD):**
```gherkin
Cenário: Guardar preferências localmente
  Given que o visitante abriu as preferências
  When escolhe temas de interesse e idioma
  Then as preferências ficam guardadas neste dispositivo
  And podem ser removidas pelo visitante
```

## US-04 — Mapa interativo *(proposta; validar com a equipa e com o museu)*
**Card:** Como visitante, quero localizar salas e obras num mapa, para orientar a visita.

**Conversation:** Não foi encontrado mapa, planta oficial ou requisito de navegação. A proposta depende de uma planta autorizada e de dados de localização fornecidos pelo museu; não pressupõe localização GPS interior.

**Confirmation (BDD):**
```gherkin
Cenário: Consultar a localização de uma obra
  Given que existe uma planta aprovada disponível no dispositivo
  When o visitante seleciona uma obra
  Then o mapa destaca a sala correspondente
  And apresenta uma alternativa textual para a localização
```

## US-05 — Sincronização de progresso *(proposta; validar arquitetura e política de dados)*
**Card:** Como visitante, quero recuperar o progresso da caça ao tesouro noutro momento, para não perder as minhas conquistas.

**Conversation:** A API atual não oferece leitura nem persistência duradoura do progresso. Proposta sujeita a decisão sobre conta/identificador, conflito entre dispositivos e retenção; não implica sincronização automática no estado atual.

**Confirmation (BDD):**
```gherkin
Cenário: Sincronizar progresso quando há ligação
  Given que existe progresso local por sincronizar e o serviço está disponível
  When a aplicação sincroniza
  Then o serviço confirma os registos aceites
  And a aplicação mantém localmente os registos ainda não confirmados
```

## US-06 — Acessibilidade áudio *(proposta; validar âmbito e conteúdo)*
**Card:** Como visitante com preferência por conteúdo áudio, quero ouvir a informação de uma obra, para aceder ao conteúdo sem depender da leitura no ecrã.

**Conversation:** Não há gravações, licença, narração ou comportamento de leitor de ecrã confirmados. A proposta exige conteúdo autorizado, controlos acessíveis e alternativa textual.

**Confirmation (BDD):**
```gherkin
Cenário: Ouvir a descrição de uma obra
  Given que existe áudio autorizado para a obra
  When o visitante ativa reproduzir
  Then o áudio é reproduzido com controlos acessíveis
  And a mesma informação está disponível em texto
```

## US-07 — Partilha de visita *(proposta; validar privacidade)*
**Card:** Como visitante, quero partilhar um resumo da minha visita, para recomendar obras a outras pessoas.

**Conversation:** Não há integração social, formato ou dados de partilha definidos. Proposta: pré-visualizar um resumo sem incluir identificadores ou localização; o visitante inicia a partilha através das opções do dispositivo.

**Confirmation (BDD):**
```gherkin
Cenário: Partilhar resumo escolhido
  Given que o visitante selecionou obras para incluir no resumo
  When confirma a partilha
  Then a aplicação abre as opções de partilha do dispositivo
  And o resumo não inclui dados pessoais sem consentimento explícito
```

## US-08 — Feedback de visita *(proposta; validar destinatário e retenção)*
**Card:** Como visitante, quero enviar feedback sobre a experiência, para ajudar a melhorar a aplicação e a visita.

**Conversation:** Não há destinatário, endpoint, moderação ou prazo de retenção definidos. Proposta: recolher avaliação opcional e comentário opcional, informar como serão usados e evitar pedir dados pessoais.

**Confirmation (BDD):**
```gherkin
Cenário: Enviar avaliação opcional
  Given que o visitante terminou a visita e abriu o formulário de feedback
  When submete uma avaliação válida
  Then recebe confirmação de envio
  And pode deixar o comentário em branco
```
