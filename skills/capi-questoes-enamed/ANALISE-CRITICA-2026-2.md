# Análise crítica da skill de geração de questões — com simulações

**Data:** 2 de agosto de 2026 · **Objeto:** `capi-questoes-enamed` v1.3 ·
**Resultado:** v2.0, neste mesmo diretório

Este relatório responde a três perguntas: a skill funciona? o que muda com os
Manuais Docentes 2026.2? e a saída sai mesmo no padrão ENAMED/NBME?

Nada aqui é impressão. Cada defeito foi **reproduzido em teste** ou **medido por
contagem** sobre material real. Onde não consegui verificar, digo que não consegui.

---

## Sumário: o que a análise encontrou

| # | Achado | Gravidade | Como foi estabelecido |
|---|---|---|---|
| 1 | Banco de OAs desatualizado: 102 das 104 SPs trocaram de título; só 52% dos objetivos sobrevivem | **Alta** | Comparação banco 2026.1 × Manuais 2026.2 |
| 2 | UCs da 4ª fase rotacionadas no banco 2026.1 — OAs arquivados sob a UC errada | **Alta** | Matriz de sobreposição; permutação limpa das 3 UCs |
| 3 | Validador desliga a checagem de UC em silêncio ao atualizar a referência | **Alta** | Teste reproduzido: questão com UC inventada passa "OK", exit 0 |
| 4 | Skill contradiz o próprio schema: seguir a §3/§13 gera JSON que o validador rejeita | **Alta** | Teste reproduzido |
| 5 | Saída 100% interrogativa; o ENAMED real é 60% por completamento | **Alta** | 17/17 itens em 4 simulações × 90 itens do ENAMED 2025 |
| 6 | `saude_coletiva`, área oficial do ENAMED, não existe na taxonomia | Média | Inspeção do enum × Portaria 478/2025 |
| 7 | Ancoragem em OA nunca era verificada — só o formato do slug | Média | Leitura do código + teste |
| 8 | Defeitos de integridade na extração 2026.2 preexistente (slugs duplicados, OA perdido) | Média | Dupla extração independente |
| 9 | Gabarito sempre em A conflita com o banco institucional e cria ponto único de falha | Média | Contagem no banco de 914 itens reais |

---

## 1. Método

**Simulações.** Quatro agentes independentes receberam a instrução de atuar como o
Capi, com acesso integral à SKILL.md v1.3 e às suas referências, e um pedido
realista de coordenador. Nenhum sabia que estava sendo avaliado — evitando que
"caprichassem" em cima dos critérios sob teste.

| Simulação | Cenário | Saída |
|---|---|---|
| SIM-A | 5 questões, fase 1, UC Metabolismo, ancoradas em OA (conteúdo conceitual) | 5 questões |
| SIM-B | 5 questões, fase 6, UC Perda de Sangue, ancoradas em OA (conteúdo clínico) | 5 questões |
| SIM-C | 4 questões **em modo banco (JSON)**, fase 8 | 4 questões + JSON |
| SIM-D | Reformulação de 3 questões legadas defeituosas | 3 questões |

**Padrão de comparação.** Construí um perfil empírico do item ENAMED medindo as
provas oficiais: **ENAMED 2025 Caderno 1 (n=90)** como fonte primária e **Revalida
2023.2 + 2024.1 (n=186)** como apoio. O perfil completo está em
`references/perfil_estilo_enamed.md`; ele passa a ser referência da skill.

**Nota de acesso:** a política de egresso desta sessão bloqueia `download.inep.gov.br`,
`www.gov.br` e `nbme.org` (403 do proxy). O texto das provas e da Portaria 478/2025
veio de material já extraído e versionado na branch
`claude/remote-access-generated-material-8sn1zk` do próprio repositório.

---

## 2. O banco de objetivos está desatualizado — e mais do que parece

Os Manuais Docentes 2026.2 não são uma revisão cosmética.

- **102 das 104** SPs em posição comum **trocaram de título**. Só duas sobreviveram.
- Apenas **51,9%** dos objetivos de 2026.1 aparecem literalmente em 2026.2.
- A 1ª fase foi quase inteiramente reescrita (14–24% de sobrevivência por UC).
- A UC *Fadiga, Perda de Peso e Anemias* (6ª fase) **não existia** no banco 2026.1
  e traz 33 objetivos.

O efeito prático apareceu nas simulações. A SIM-C ancorou suas questões na SP01 da
UC Desordens Nutricionais, *"Insulina e exercício físico fazem parte de sua vida!"*
— que em 2026.2 se chama *"Infância feliz"*. A SIM-B ancorou em *"Uma grande
batalha!"*, hoje *"Se beber…"*. As questões foram entregues com slug válido, sem
nenhum alerta: **toda questão com âncora em SP gerada hoje aponta para uma
situação-problema que não existe mais.**

### 2.1 A 4ª fase estava arquivada na UC errada

Investigando por que a 4ª fase mostrava 0% de sobreposição, encontrei uma
permutação limpa:

| Banco 2026.1 (nome da UC) | Conteúdo que de fato guarda | Sobreposição com 2026.2 |
|---|---|---|
| uc01 — Proliferação Celular | intoxicações, meio ambiente | 59% com uc03 |
| uc02 — Saúde da Mulher | proliferação celular, câncer | 40% com uc01 |
| uc03 — Doenças por Agressão do Meio Ambiente | saúde da mulher | 41% com uc02 |

As três UCs estão rotacionadas uma posição. **Nenhuma checagem formal pega isso**:
o slug é válido, a UC existe na taxonomia, a fase é coerente. Uma questão pedida
para "Proliferação Celular" da 4ª fase vinha ancorada em objetivos de intoxicação
por chumbo — e passava em todos os filtros.

É o exemplo mais claro do ponto cego da skill v1.3: **ela valida forma, nunca
conteúdo.** A v2.0 acrescenta ao Passo 1 a exigência explícita de conferir o
conteúdo do OA contra a ementa da UC, porque essa é uma checagem que máquina
nenhuma faz por você.

---

## 3. O validador desligava sozinho, em silêncio

Este é o defeito mais grave, e o mais irônico: ele seria disparado **pelo próprio
ato de atualizar a skill**.

O script procurava as referências pelo nome literal, com o semestre embutido
(`taxonomia_med_unidavi_2026_1.json`). Ao renomear para `2026_2` — que é
exatamente o que a migração exige — a busca falhava, `uc_to_fase` ficava `None`, e
a checagem simplesmente não rodava. Sem mensagem de erro. Sem aviso.

Teste reproduzido, com uma questão cujo `uc_slug` é uma unidade curricular
inventada mas bem-formada:

```
### Com a taxonomia no nome que o script esperava:
✗ 1 ERRO — [UC_INEXISTENTE] uc_slug '..._uc04_unidade_totalmente_inventada'
  não existe na taxonomia.

### Depois de renomear a mesma taxonomia para 2026_2:
✓ OK (sem erros, sem avisos)          EXIT CODE = 0
```

Uma questão inteiramente fabricada passa como válida. **Correção na v2.0:**
resolução por padrão glob, referência efetivamente usada impressa no cabeçalho do
relatório, e referência ausente vira erro com exit 2 — para rodar sem ela é preciso
pedir `--sem-referencias` de forma consciente.

---

## 4. A skill contradizia o próprio schema

Descoberto pela SIM-D e confirmado por teste.

A §3 (Passo 3) manda preencher `origem` em **toda** questão. A §13 exige
`questao_original_referencia` nas reformulações. O CHANGELOG registra que a v1.2
adicionou esses campos. Mas o schema é `additionalProperties: false` e **não tinha
nenhum dos dois** — nem `oa_referencia`:

```
✗ ERRO [SCHEMA] Additional properties are not allowed
  ('origem', 'questao_original_referencia' were unexpected)
```

Ou seja: obedecer a skill produzia JSON que o validador da própria skill rejeitava.
A SIM-C só passou porque **desobedeceu** silenciosamente ao Passo 3, omitindo
`origem`. Um agente cumprindo a regra teria falhado.

Corrigido: os três campos foram acrescentados ao schema, junto de `area_enamed` e
`tipo_comando`.

---

## 5. A saída não estava no padrão ENAMED

Este era o requisito explícito, e é onde a distância era maior.

**Medição no ENAMED 2025 (n=90):** 54 itens (**60%**) usam enunciado por
**completamento** — a frase termina truncada e a alternativa a completa. Só 40%
são pergunta interrogativa.

> ...O fármaco introduzido no tratamento da paciente **foi**
> (A) espironolactona.  (B) clortalidona.  (C) hidralazina.  (D) clonidina.

**Medição nas simulações: 17 de 17 questões (100%) foram interrogativas.** Nenhuma
por completamento. E quase todas com a mesma abertura ("Qual mecanismo...", "Qual
achado...", "Qual é o tipo...").

Isso não foi acidente — foi a skill funcionando como escrita. A §7 da v1.3 dizia
que o enunciado é "idealmente uma frase interrogativa direta, terminando em '?'", e
o validador emitia o aviso `SEM_INTERROGACAO` para quem não terminasse com "?".
**A skill penalizava ativamente o formato majoritário da prova que ela existe para
preparar.**

Outras divergências medidas:

| Dimensão | ENAMED 2025 real | Skill v1.3 | Veredito |
|---|---|---|---|
| 4 alternativas | 100% (90/90) | 4 (ABDC) | ✅ confere |
| `EXCETO` / `incorreto` | 0% | proibido | ✅ confere |
| Comando por completamento | 60% | desaconselhado, avisado | ❌ invertido |
| Posição do gabarito | uniforme (A21/B24/C23/D22) | sempre A | ⚠ ver §7 |
| Razão extensão correta/distratores | mediana 1,00; **21% fora** da faixa ±30% | faixa ±30% como aviso | ✅ aviso é o nível certo |
| Extensão do item | mediana 86 palavras (p10 51, p90 133) | faixas por ciclo | ✅ compatível |
| `assinale` | 6% dos itens | proibido | ⚠ divergência deliberada |

Sobre `assinale`: o ENAMED usa. A skill proíbe porque "assinale a alternativa
correta" viola a *cover-the-options rule* do NBME. A proibição é defensável — mas a
v1.3 a apresentava como se fosse conformidade ENAMED, o que não é verdade. A v2.0
declara isso abertamente como o único ponto em que a skill escolhe o NBME contra a
prática observada do exame.

**Correções na v2.0:** nova §4a ensina o completamento com seus fechos reais;
o aviso `SEM_INTERROGACAO` foi removido; entrou a checagem `CONCORDANCIA`, que trata
do risco novo que o completamento cria em português — se as quatro alternativas não
concordam em gênero e número com o fecho do enunciado, a concordância entrega a
resposta (falha *grammatical cue* do NBME, inexistente em enunciado interrogativo).

---

## 6. O que o validador não via porque olhava uma questão por vez

As quatro questões da SIM-C passaram no validador v1.3 com **zero erros e zero
avisos**. As mesmas quatro, no validador v2.0:

```
— Checagens de lote —
aviso [GABARITO_CONCENTRADO] Todas as 4 questões têm a correta na letra A...
aviso [MONOCULTURA_FORMATO] Nenhuma das 4 questões usa enunciado por completamento,
       que é o formato de 60% dos itens do ENAMED 2025 (54/90)...
```

Nenhuma questão individual é defeituosa. O **lote** é. Concentração de gabarito,
monocultura de formato e duplicidade são propriedades do conjunto, invisíveis a um
validador que processa item a item.

---

## 7. A questão em aberto: posição do gabarito

A skill grava a correta sempre em A e delega a randomização ao backend. Encontrei
três problemas nisso:

1. O banco institucional de provas reais já adequadas (914 itens) armazena a posição
   **já randomizada** (A 224 · B 234 · C 226 · D 230). Duas convenções convivem no
   mesmo ecossistema.
2. "Sempre A" torna a randomização da emissão um **ponto único de falha**: se ela
   não rodar, o lote inteiro sai com gabarito A.
3. Na curadoria em Markdown o docente sempre lê a correta na primeira posição, o
   que enviesa o julgamento da plausibilidade dos distratores.

**Não mudei a convenção.** A mudança tem alcance fora da skill — telas de curadoria,
app, relatórios — e é uma decisão sua, não minha. O que fiz foi tornar o risco
visível (`GABARITO_CONCENTRADO`) e registrar a recomendação em `limitacoes.md`.

---

## 8. O banco 2026.2, e por que não usei o que já existia

Já havia uma extração 2026.2 na branch `remote-access-generated-material-8sn1zk`
(868 OAs). Rodei uma **segunda extração independente** dos mesmos 8 manuais para
verificá-la. As duas concordaram em **106 das 109 SPs** e em **843 dos 868 OAs**,
ao pé da letra — o que dá boa confiança no material. As três divergências foram
adjudicadas por leitura direta do Manual, e todas as três eram defeito da extração
anterior:

- **f04/uc03/sp02** — um objetivo inteiro perdido na quebra de página 107→108.
  A extração anterior se declarava íntegra ("nenhuma seção ficou ilegível ou
  cortada"); localizei o texto no Manual e ele está lá.
- **f02/uc01/sp01** — um objetivo com subitens `a.`/`b.` fragmentado em três
  objetivos, todos numerados "7".
- **f01/uc03/sp05** — hifenização de quebra de linha preservada
  ("insulino- independentes").

Encontrei ainda **4 slugs de OA colididos** e 3 SPs com numeração corrompida, porque
o slug derivava do número impresso e alguns Manuais repetem ou saltam números. Na
v2.0 o slug deriva da **posição ordinal**, garantindo unicidade; o número impresso
fica preservado em `numero_impresso`, para não perder fidelidade à fonte.

Banco final: **109 SPs, 867 OAs, zero slugs duplicados, zero malformados.**

---

## 9. Matriz de Referência do ENAMED: a camada que faltava

A Portaria Inep nº 478/2025 institui a Matriz de Referência Comum, com **7 áreas**
(Clínica Médica, Cirurgia Geral, Ginecologia e Obstetrícia, Pediatria, Medicina da
Família e Comunidade, Saúde Mental, **Saúde Coletiva**), 15 competências, 6 cenários
de prática e 21 conteúdos. É o que o exame efetivamente sorteia.

A skill v1.3 não a mencionava. Ancorava-se apenas nas 27 competências da DCN 2025 —
que são a referência *curricular*, não o *blueprint da prova*. Pior: o enum
`area_clinica` da taxonomia **não tinha `saude_coletiva`**, uma área inteira do
exame sem representação possível no banco. Com a meta institucional de Conceito 5,
isso significa que não havia como mapear o banco contra a prova.

A v2.0 acrescenta a matriz como referência, inclui `saude_coletiva` no enum, cria o
campo `area_enamed` (esperado da fase 8 em diante) e separa explicitamente as duas
camadas na §2.

---

## 10. O que a skill faz bem

Para não desequilibrar o retrato: as simulações mostraram bastante coisa
funcionando.

- **A estrutura ABDC é sólida.** Todos os 17 itens saíram com 4 alternativas, uma
  correta, justificativa por alternativa, `status_curadoria: pendente`.
- **O equilíbrio de extensão está bom** — razão correta/distratores com mediana
  1,02–1,06 nas simulações, contra 1,00 do ENAMED real.
- **A detecção de erro conceitual funciona, e bem.** Na SIM-D plantei uma questão
  cujo gabarito afirmava que o primeiro evento da puberdade masculina é a pubarca.
  A skill não só corrigiu como foi além do que eu esperava: conferiu as cinco
  alternativas, concluiu que **nenhuma era verdadeira**, classificou a questão como
  anulável e sinalizou impacto retroativo caso já tivesse sido aplicada.
- **A disciplina de recusa se sustenta.** A SIM-C, sem material-fonte anexado,
  registrou a ressalva de que cumpriu o Passo 0 contra os objetivos do Manual e não
  contra slides de conferência, em vez de fingir ancoragem.
- **A distinção vinheta × enunciado direto está madura** e foi bem aplicada.

Os defeitos encontrados são, quase todos, de **infraestrutura e verificação** — não
de julgamento pedagógico. O miolo da skill é bom; o que falhava era o entorno que
deveria protegê-la.

---

## 11. Verificação da própria v2.0

O validador v2.0 foi testado nos quatro cenários:

| Cenário | Exit esperado | Obtido |
|---|---|---|
| Referências ausentes | 2 (falhar ruidosamente) | 2 ✅ |
| UC inventada, referências presentes | 1 | 1 ✅ |
| Campo `origem` da §13 | 0 (schema corrigido) | 0 ✅ |
| Lote SIM-C (avisos, sem erro) | 0 | 0 ✅ |

O banco 2026.2 foi verificado programaticamente: 109 SPs, 867 OAs, 867 slugs
únicos, 0 duplicados, 0 fora do padrão canônico.

---

## 12. Recomendações que dependem de decisão sua

1. **Posição do gabarito** (§7) — unificar a convenção do ecossistema. Recomendo
   randomizar na geração, alinhando com o banco de 914 itens e com a prova real;
   não fiz porque afeta backend e telas de curadoria.
2. **Levar os erros de numeração dos Manuais ao NDE** — três SPs repetem ou saltam
   números de objetivo, e uma SP da 4ª fase repete literalmente os itens 1–7 nos
   itens 8–14. São erros de digitação dos Manuais 2026.2.
3. **Confirmar o OA recuperado** `med_unidavi_f04_uc03_sp02_oa08`, que estava
   perdido numa quebra de página.
4. **Reavaliar as questões da 4ª fase já existentes no banco**, geradas enquanto as
   UCs estavam rotacionadas — elas podem estar arquivadas sob a UC errada.
5. **Fases 9–12 seguem sem banco de objetivos.** Se o internato vai entrar no
   Meu Treino, é a próxima lacuna a fechar.
