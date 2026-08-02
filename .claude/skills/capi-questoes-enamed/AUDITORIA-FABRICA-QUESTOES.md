# Auditoria da fábrica de questões

**Data:** 2 de agosto de 2026
**Objeto:** o pipeline `adequacao-enamed` e o banco de 914 questões que ele produz
**Pergunta:** a fábrica ficou grande demais, e é por isso que ela falha?

---

## Resposta curta

**A fábrica é grande demais — mas não é o tamanho que gera as falhas.** E o
problema maior nem está dentro dela: **existem três fábricas**, em branches
diferentes, com **3.892 questões brutas** e **sobreposição zero** entre si. Nenhuma
sabe da existência das outras, e os dois validadores do ecossistema têm **sinais
invertidos** — o que um bloqueia, o outro usa como prova de qualidade.

Dentro da fábrica principal, são três causas distintas, e só uma tem a ver com
tamanho:

1. **Deriva de contrato.** O pipeline evoluiu uma camada de classificação que o
   schema nunca absorveu. Resultado: **100% das 914 questões eram formalmente
   inválidas** por causa de **uma única propriedade** — apesar de o conteúdo dela
   ser justamente o que faltava para mapear o banco contra a matriz do ENAMED.
   Uma linha de contrato derrubou a taxa de erro de **100% para 17,6%**.
2. **Ausência de porteiro na entrada.** A fábrica importa 12 fontes com fidelidade
   e as rotula todas como padrão ENAMED. A taxa de defeito varia de **3% a 31%
   conforme a fonte**, e nada nesse desenho diferencia uma da outra.
3. **Classificação que não classifica.** `fase_alvo` é uma tabela de conversão de
   `area_clinica`, não um julgamento. Consequência: **cinco das doze fases não têm
   uma única questão**, e nunca terão, porque nenhuma área mapeia para elas.

Diminuir a fábrica resolve o custo de manutenção. **Não resolve nenhuma das três.**

E há um encaixe feliz: as fases 4 e 5, que aparecem como vazio estrutural no banco
principal, **já têm 560 questões prontas no acervo do app de sessões** — 97,5% delas
passam no validador canônico assim que trocam de envelope. O buraco de cobertura e
o acervo órfão são o mesmo problema visto de dois lados.

---

## 1. O tamanho, medido

| Dimensão | Número |
|---|---|
| Scripts Python | 23 (~4.750 linhas) |
| Pastas de estágio intermediário | 20 |
| Arquivos intermediários | 200 (7,3 MB) |
| Fontes distintas processadas | 12 |
| Questões no banco final | 914 |

O desenho tem **um caminho paralelo por fonte** em vez de um caminho único com
adaptadores de entrada: existem `extrair_enamed.py`, `extrair_revalida.py`,
`extrair_simulados.py`, `extrair_simulados_nacionais.py`, `extrair_tp2022.py` e
`extrair_docx.py`; e, na saída, `montar_canonico.py`,
`montar_canonico_adaptado.py`, `montar_canonico_generico.py` e
`montar_canonico_simulados.py`. As pastas `intermediario/` repetem o mesmo par
`lotes_*` + `enriquecimento_*` para cada fonte.

Isso é o que dá a sensação de excesso, e a sensação está certa: é o mesmo pipeline
instanciado N vezes. Mas o efeito disso é **custo de manutenção e divergência de
convenção** — não os defeitos de conteúdo. A prova está nas seções seguintes.

### Quanto disso é eliminável, provado por reprodução

Não por estimativa: rodando `montar_canonico_generico.py` sobre as entradas dos
outros montadores,

- **Simulados: 84 de 84 questões idênticas** nos 24 campos do schema, exceto o
  sufixo `" do simulado"` numa string. São **182 linhas** de script dedicado para
  produzir essa diferença.
- **ENAMED: 90 de 90 idênticas** com um adaptador de **6 linhas** (`num` →
  `id_origem`). As 6 divergências que sobraram são **defeito do caminho dedicado**,
  não do genérico.
- A função `montar()` de `_simulados` × `_generico` é **65% literalmente idêntica**
  (72% com variáveis renomeadas). O envelope canônico está escrito 4 vezes
  (114 linhas); o bloco de jsonschema, 5 vezes (61 linhas).

**Duplicação evitável medida: 517 de 4.748 linhas (10,9%)**; clones exatos de 4+
linhas somam 316 das 3.460 linhas significativas. `corrigir_quebras` é 88% idêntica
entre dois extratores; `norm()` aparece 6 vezes; `parse_alternativas`, 3 vezes.

Detalhe que complica a limpeza: `_generico` **importa** dos dois montadores
específicos — não dá para apagá-los sem antes mover o código comum.

**Desenho enxuto viável: 23 scripts → 11 arquivos, ~20 → 8 estágios**
(extrair → validar → deduplicar → montar → classificar → imagens → consolidar →
relatar), com um `comum.py` compartilhado, **um** montador dirigido por perfil de
fonte, os 3 aplicadores de classificação fundidos em 1, e um
`validar_intermediario.py` novo. Mesmas 914 questões — com 4 defeitos corrigidos
de brinde.

---

## 2. A deriva de contrato — o defeito mais caro, e o mais barato de consertar

O pipeline produz um bloco `classificacao_fina` em cada questão:

```json
"classificacao_fina": {
  "especialidade": "urgencia_pediatrica",
  "sistema_organico": "endocrino_metabolico",
  "contexto_atencao": "urgencia_emergencia",
  "objeto_conhecimento": "Interpretação do distúrbio ácido-base ...",
  "matriz_enamed_478_2025": {
    "area": "enamed_area_04",
    "competencias": ["enamed_comp_03", "enamed_comp_05"],
    "conteudos": ["enamed_cont_09", "enamed_cont_01"],
    "cenario": "enamed_cenario_02",
    "justificativa": "Emergência não traumática atendida na rede de urgência..."
  }
}
```

O `schema_questao_med_unidavi.json` é `additionalProperties: false` e não conhecia
esse campo. Auditoria com o validador:

```
ERROS DE SCHEMA agrupados:
   914  [(raiz)] Additional properties are not allowed ('classificacao_fina' was unexpected)
```

**As 914 questões falhavam por uma propriedade só.** E o conteúdo dessa propriedade
é bom: é exatamente o mapeamento para a Matriz de Referência do ENAMED (Portaria
Inep nº 478/2025) que a skill de geração não tinha. A fábrica construiu a coisa
certa; o contrato é que não acompanhou.

**Correção aplicada:** o campo foi tipado no schema (com validação de padrão nos
IDs de área, competência, conteúdo e cenário). Taxa de erro: **100% → 17,6%**.

### E a raiz é pior do que "o schema não acompanhou"

Investigando por que ninguém percebeu, encontrei o fundo do problema: **o schema não
é um contrato — é uma saída do pipeline.** Dois estágios o reescrevem em disco:

```
aplicar_especialidade.py:77:  json.dump(sch, open(SCHEMA, "w"), ...)
aplicar_matriz.py:53:         json.dump(sch, open(SCHEMA, "w"), ...)
```

Contra o schema **original**, as 914 questões são 914/914 inválidas. O banco só
"valida" porque duas etapas ampliam a régua antes da medição. Um validador cuja
régua é escrita pelo próprio medido não valida nada.

E os dois escrevem **o mesmo campo com tipos incompatíveis**:

| Script | `classificacao_fina.matriz_enamed_478_2025` |
|---|---|
| `aplicar_especialidade.py` | `{"type": ["string", "null"]}` — um código único |
| `aplicar_matriz.py` | `{"type": ["object", "null"]}` — área + competências + conteúdos + cenário |

`aplicar_matriz.py` tem guarda de idempotência; `aplicar_especialidade.py` **não
tem**. Rodá-lo depois do outro rebaixa a definição de volta para `string` — e as
**770 de 914 questões** que carregam a forma de objeto viram inválidas. Não há
ordem declarada em lugar nenhum do README, e `consolidar_banco.py` imprime
`770/914 OK` e **sai com código 0** nesse cenário. Foi testado.

Há hoje **três cópias do schema** no repositório (`adequacao-enamed/referencia/`,
`sessao-questoes/docs/anexos/schema-institucional/`, e a da skill), e elas já
divergiram: a da skill tem 32 propriedades, a da fábrica 27.

Lição de desenho, corrigida: não basta alterar o schema no mesmo commit do estágio.
**O schema precisa ser read-only para o pipeline**, com uma única cópia canônica —
caso contrário "o banco valida" é uma afirmação vazia.

### Outros modos de falha silenciosa, todos testados

- **Uma questão sumiu sem aviso.** `clm_napisul2_2026_q074` tinha gabarito "E" sem
  alternativa E; um `except Exception` a descartou e o script saiu com código 0.
- **Re-rodar `extrair_simulados.py` apaga as 16 marcas de deduplicação** — as 16
  questões repetidas do Revalida voltariam ao banco sem aviso.
- **22 dos 23 scripts nunca retornam código de erro.** Numa automação, falha e
  sucesso são indistinguíveis.
- **`requer_imagem` tem 6 detectores diferentes, com 15% de discordância** (139 de
  914). O mais liberal marca 16× mais que o mais restritivo: a mesma questão é
  classificada de forma diferente conforme o caminho que percorreu.

---

## 3. A qualidade depende da fonte, e não há porteiro

Taxa de erro por origem, depois da correção de contrato:

| Fonte | Itens | Com erro | Taxa |
|---|---|---|---|
| Simulados MED/ENAMED 2026 | 84 | 26 | **31%** |
| TPMed 2025 (comentado) | 120 | 33 | **28%** |
| Teste de Progresso MED 2022 | 115 | 29 | **25%** |
| Bancos institucionais `.docx` | 175 | 32 | 18% |
| Revalida 2023.2 + 2024.1 | 186 | 31 | 17% |
| **ENAMED 2025 Caderno 01** | 90 | 5 | **6%** |
| **Item adaptado (reescrito pela fábrica)** | 144 | 5 | **3%** |

Duas leituras importam aqui.

**Primeira: os defeitos são importados, não fabricados.** Quanto mais longe da prova
oficial, pior o material de entrada. Os simulados que os alunos fazem têm taxa de
defeito cinco vezes maior que o ENAMED real. A fábrica não inventa esses defeitos —
ela os transporta com fidelidade, e depois carimba tudo com o mesmo rótulo de
"adequado ao padrão ENAMED".

**Segunda: o estágio de adaptação funciona, e é subutilizado.** Os 144 itens que a
fábrica efetivamente reescreveu têm 3% de defeito — melhor que o próprio ENAMED.
O estágio que mais agrega valor foi aplicado a **16% do acervo**.

Os 161 erros remanescentes são quase todos o mesmo: **160 usam "assinale"** no
comando e 1 é um item `EXCETO` genuíno.

### Nota de honestidade sobre este número

A primeira contagem que fiz acusava 9 erros de construção negativa. **Sete eram
falso-positivo do meu próprio validador** — ele varria o enunciado inteiro, e
"exceto" é preposição corriqueira na vinheta ("exame físico sem particularidades,
exceto por espessamento da artéria temporal"), além de "falso-positivo" ser
vocabulário epidemiológico normal. Corrigi o validador para checar apenas a frase
de comando. Sobrou 1 erro real. O número acima já é o corrigido.

---

## 4. A classificação não classifica

`fase_alvo` deveria dizer para que fase do curso a questão serve. Medido:

```
area_clinica -> fase_alvo é função?  SIM — cada área mapeia para exatamente uma fase
   ciclo_basico                 -> fase 2        pediatria     -> fase  9
   saude_mental                 -> fase 6        gineco/obst   -> fase 10
   urgencia_emergencia          -> fase 8        cirurgia      -> fase 11
   clinica_medica               -> fase 12       med. família  -> fase 12
```

Não é classificação — é uma tabela de conversão. Toda questão de pediatria vira 9ª
fase por definição, independentemente do conteúdo. O campo não carrega informação
própria.

O efeito prático é severo para o "Meu Treino":

```
   fase  1:    0    <<< SEM NENHUMA QUESTÃO
   fase  2:   44
   fase  3:    0    <<< SEM NENHUMA QUESTÃO
   fase  4:    0    <<< SEM NENHUMA QUESTÃO
   fase  5:    0    <<< SEM NENHUMA QUESTÃO
   fase  6:   34
   fase  7:    0    <<< SEM NENHUMA QUESTÃO
   fase  8:   90
   fase  9:  119     fase 10: 121     fase 11: 76     fase 12: 430 (47% do banco)
```

**Cinco das doze fases não têm uma única questão** — e não é um vazio que se
preenche gerando mais itens da mesma forma: enquanto a fase for derivada da área,
nenhuma questão pode cair nas fases 1, 3, 4, 5 e 7, porque nenhuma área aponta para
elas. É um vazio estrutural.

Como quase metade do banco é fase 12, o acervo hoje serve bem o aluno do 6º ano e
não serve o ciclo básico e boa parte do clínico.

---

## 5. A fábrica desfaz o padrão ENAMED naquilo que ela mesma escreve

Formato do comando, por fonte (o ENAMED real é 60% completamento / 40% pergunta):

| Fonte | Completamento | Interrogativo | Aberto (":") |
|---|---|---|---|
| ENAMED 2025 Caderno 01 | 60% | 40% | 0% |
| Revalida | 66% | 32% | 0% |
| Simulados MED/ENAMED 2026 | 66% | 9% | 23% |
| TPMed 2025 | 28% | 48% | 23% |
| Teste de Progresso 2022 | 27% | 39% | 33% |
| Bancos institucionais `.docx` | 24% | 40% | 34% |
| **Item adaptado (reescrito pela fábrica)** | **3%** | **87%** | 9% |

O material importado das provas oficiais chega no padrão certo. **O que a fábrica
reescreve sai com 3% de completamento e 87% de pergunta direta** — a mesma
assinatura que encontrei nas simulações da skill de geração (0% de completamento em
17 itens). É a mesma causa-raiz nos dois lugares: a instrução de que o enunciado
"deve terminar em `?`".

Ou seja: o único estágio em que a fábrica agrega qualidade técnica (3% de defeito)
é também o estágio que **converte itens no formato do ENAMED para um formato que o
ENAMED usa em minoria**.

Há ainda 268 itens por completamento cujas alternativas começam em maiúscula,
quebrando a continuação da frase — inconsistência de formatação herdada dos
caminhos paralelos por fonte.

E o material institucional local (`.docx`, TP 2022, TPMed 2025) usa a construção
não-fechada terminada em ":" em **um terço dos itens** — construção que o ENAMED e o
Revalida não usam em **nenhum** item.

---

## 6. Vocabulário de tags: o custo real dos caminhos paralelos

Aqui o tamanho da fábrica **é** a causa direta.

- **2.754 tags distintas** para 914 questões.
- **303 famílias com grafias concorrentes**: `cetoacidose diabética` / `cetoacidose_diabetica`; `ânion gap` / `anion_gap`; `escore z` / `escore_z` / `escore-z`.
- **1.232 tags com espaço** e **417 com underscore** — duas convenções convivendo,
  porque cada caminho de fonte trouxe a sua.

Qualquer filtro por tag no app vê essas como coisas diferentes. **73% das questões
são afetadas.**

A origem foi localizada no código: os quatro montadores fazem `e.get("tags", [])`
e gravam **sem normalizar**, e o schema não tem `pattern` para o campo. Nada em
nenhum ponto do caminho impõe uma convenção. O resultado é que
`atenção primária` (34), `atencao_primaria` (9), `atencao primaria` (6) e
`atencao-primaria` (2) convivem **até dentro da mesma pasta de enriquecimento**.

Existem também **três critérios de deduplicação diferentes** em uso no pipeline
(25 palavras, 200 caracteres, e nenhum), dependendo do caminho.

---

## 7. Não é uma fábrica — são três, e elas não se conhecem

A auditoria dos acervos paralelos mudou o diagnóstico. Existem **três bancos de
questões vivos no ecossistema**, em branches diferentes, e nenhum sabe da
existência dos outros.

| Acervo | Onde | Questões | Schema |
|---|---|---:|---|
| **A1** — adequação ENAMED | `remote-access-generated-material` | **914** | canônico |
| **A2** — pool triado CCEM | `medical-question-banks` | **2.139** | próprio |
| **A3** — seed do app de sessões | `unidavi-question-sessions` | **839** | próprio |
| | | **3.892 brutas** | |

### A sobreposição entre eles é zero — e isso é a má notícia

Comparação por hash de 30 tokens normalizados e por shingles de 5 tokens com
Jaccard: **nenhuma questão aparece em mais de um acervo.** O Jaccard máximo entre
A1 e A3 é 0,041, que é ruído de vocabulário clínico.

Não são cópias divergentes de uma base comum. São **três bases disjuntas**. A
fragmentação é de cobertura e governança, não de duplicação.

O caso mais eloquente: A1 e A3 têm **exatamente uma UC em comum** —
`med_unidavi_f06_uc01_problemas_mentais_comportamento` — com **34 questões em A1 e
79 em A3, sem uma única questão compartilhada**. O docente dessa UC hoje tem dois
bancos que se ignoram.

### A3 é o que preenche o buraco da §4

Lembre que A1 não tem uma única questão nas fases 1, 3, 4, 5 e 7. A composição de
A3: **f04 = 280, f05 = 280, f06 = 279**.

E A3 não é material de segunda linha: rodando o validador canônico depois de
apenas **trocar o envelope** (preencher `tipo`, `fonte_geracao`, `status_curadoria`,
etc.), **818 de 839 passam — 97,5%**, com zero erros de UC inexistente. Os 10.091
erros de schema que ele acusa de saída são todos de embalagem, não de conteúdo.

Ou seja: as fases 4 e 5, que hoje aparecem como vazio estrutural no banco
principal, já têm 560 questões prontas em outro acervo, a uma migração de
distância. A2, ao contrário, é incompatível na raiz — está em inglês (MedQA,
NephSAP, USMLE), **87% dos itens têm 5 alternativas** e nenhum tem justificativa;
é insumo do CCEM/Treino-ENAMED, não do banco MED-UNIDAVI.

### Os dois validadores do ecossistema têm sinais invertidos

`sessao-questoes/src/lib/validacaoQuestao.ts` valida questões no app;
`validate_questao.py` valida no banco. Rodando os dois sobre os mesmos acervos:

> **O validador TypeScript não reprova nenhuma das 1.753 questões que o validador
> canônico reprova.** Em poder de bloqueio ele é um subconjunto próprio — e em dois
> pontos aponta na direção contrária.

**Inversão 1 — "assinale".** O TS usa a presença de `assinale|identifique|qual`
como *prova de que o enunciado é uma pergunta bem-formada*, e suprime o aviso por
causa dela. O Python trata o mesmo termo como **erro bloqueante**. São exatamente
os **160 itens** de A1 que o canônico reprova por `INSTRUCAO` — os mesmos que o app
considera exemplares.

**Inversão 2 — letra do gabarito.** O TS avisa quando a correta **não** é a letra A
("convenção do gerador institucional"). O canônico avisa quando **todas** caem na
mesma letra, tomando como alvo a distribuição uniforme do ENAMED. Os dois avisos
puxam para lados opostos — é a mesma inconsistência de convenção que eu já havia
registrado em `limitacoes.md`, agora com as duas pontas visíveis.

Foram construídos 6 casos sintéticos que **passam no TS e falham no Python**:
"assinale a alternativa", "nenhuma das opções acima", "exceto", justificativa com
2 caracteres, enunciado `"Qual?"`, e `uc_slug` bem-formado mas inexistente.

Há ainda um descompasso de gate: `pendenciasParaCurar` exige 4 campos, o schema
exige 16 — medido, **839 de 839 questões de A3 continuam inválidas depois de
"curadas" pelo critério do app**.

### Não existe chave estável em lugar nenhum

A1 e A3 não têm campo `id` — a identidade é posicional no array. O `id` de A2 é
`fonte#índice` do arquivo bruto, e os brutos nem estão no repositório. Consequência
prática: **a correção que um docente faz num acervo não chega a nenhum outro**, e
`pool_triado.json` é regenerável — correção manual nele é destruída na próxima
execução do script.

É também o que explica as duplicatas internas de A3: **40 pares (9,5% do acervo)**,
todos no padrão `SP N — Qk` ↔ `whatsapp:UC1_SPN_ENAMED — Qk`. As mesmas 40 questões
foram reingeridas por um segundo caminho de importação (colagem de WhatsApp) e nada
detectou, porque não há chave para detectar com.

### Nota metodológica desconfortável

Durante esta auditoria eu mesmo alterei `validate_questao.py` (a correção dos
falso-positivos de "exceto"). O mesmo banco A1, **sem uma única edição**, passou de
168 para 161 reprovações. A régua não é versionada junto com o acervo — então
"taxa de defeito do banco" é hoje um número que muda sozinho. Qualquer meta de
qualidade precisa fixar a versão do validador junto com a medição.

---

## 8. O que **não** é problema

Vale registrar, porque a suspeita inicial era mais ampla:

- **Duplicação de conteúdo é baixa.** Comparação por shingles de 5-gramas
  (Jaccard ≥ 0,8): **7 pares**, 14 questões, **1,5% do acervo**. Não é um banco
  inflado por repetição.
  Detalhe interessante: as duplicatas cruzam fontes — itens do Revalida 2023.2
  reaparecem nos "Simulados MED/ENAMED 2026". Os simulados que os alunos fazem
  reciclam questões do Revalida.
- **Coerência de identificadores é boa.** Zero divergências entre `fase_alvo` e a
  fase embutida no `uc_slug` nas 914.
- **A posição do gabarito já é uniforme** (A 224 · B 234 · C 226 · D 230) — melhor
  que a convenção da skill de geração, que grava tudo em A.
- **As justificativas por alternativa existem em todo o acervo** e 410 itens
  carregam justificativa oficial da origem.
- **A extração é de alta qualidade.** Em 921 questões processadas: 0 enunciados
  vazios, 0 alternativas faltando, 1 defeito. O trabalho de tirar texto de PDF em
  duas colunas e casar com gabarito oficial está bem-feito.
- **`AREA2UC` funciona como fonte única** — 0 divergências em 914 entre a área e a
  UC atribuída. Onde o pipeline tem uma tabela única, ele acerta; o problema aparece
  onde a mesma decisão é reimplementada em cada caminho.
- **O consenso de 3 juízes** para classificação e o anti-viés de posição
  determinístico são metodologicamente sólidos e devem ser preservados.

---

## 8. Recomendações, em ordem de retorno

1. **Tornar o schema read-only para o pipeline, com uma cópia canônica só.** É o
   item zero: enquanto dois estágios reescreverem a régua em disco — e com tipos
   incompatíveis entre si — "o banco valida" não significa nada, e uma inversão de
   ordem apaga 770 ancoragens da Portaria 478 com exit 0. Hoje há três cópias do
   schema no repositório e elas já divergiram. (`classificacao_fina` já foi tipada
   na cópia canônica da skill.)
1b. **Fazer os scripts falharem alto.** 22 dos 23 nunca retornam código de erro, e
   um `except Exception` já engoliu uma questão inteira sem aviso. Numa automação,
   isso torna falha e sucesso indistinguíveis.
2. **Criar chave estável — `id_questao`.** É o pré-requisito de tudo que vem
   depois. UUIDv5 sobre o hash do enunciado normalizado resolve os três problemas
   de uma vez: dá identidade para propagar correção entre acervos, teria bloqueado
   as 40 duplicatas de reingestão do A3, e permite medir cobertura de verdade.
   Hoje a identidade é a posição no array.
3. **Uma régua só, e versionada.** Eliminar `validacaoQuestao.ts` como *gate* —
   gerá-lo do JSON Schema (ajv) ou chamar o validador Python na importação. Enquanto
   houver duas implementações com sinais invertidos, "questão válida" não quer dizer
   nada. E fixar a versão do validador junto de qualquer meta de qualidade: o mesmo
   banco mudou de 168 para 161 reprovações durante esta auditoria, sem ser editado.
4. **Migrar A3 para o banco canônico.** Ganho imediato: as fases 4 e 5 saem do zero,
   com 560 questões que já passam 97,5% no validador. É trocar envelope, não
   reescrever conteúdo. `questoes-seed.ts` vira fixture de teste. A2 sai do escopo
   MED-UNIDAVI (é insumo do CCEM/Treino-ENAMED, como o próprio README dele diz).
5. **Porteiro na entrada, com rótulo de procedência.** Validar cada fonte na
   importação e gravar a taxa de defeito medida no próprio item. Um simulado com
   31% de defeito não pode entrar com o mesmo rótulo do ENAMED oficial. Sugestão:
   `qualidade_origem` (oficial_inep / institucional / simulado) + `defeitos_herdados`,
   para a curadoria priorizar.
6. **Desacoplar `fase_alvo` de `area_clinica`.** Enquanto a fase for derivada da
   área, as fases 1, 3 e 7 continuam impossíveis de preencher, mesmo depois da
   migração do A3. Não custa código — custa critério.
7. **Estender o estágio de adaptação.** É o que produz os melhores itens (3% de
   defeito) e cobre 16% do acervo. Priorizar as fontes de pior taxa (simulados,
   TPMed 2025, TP 2022) dá o maior ganho por item reescrito.
8. **Corrigir a instrução de formato do comando** nos prompts de adaptação, do mesmo
   jeito que foi corrigido na skill (§4a da SKILL.md v2.0). Hoje a adaptação
   descaracteriza o padrão que deveria preservar.
9. **Normalizar o vocabulário de tags** — uma convenção só, um passo de normalização
   único, vocabulário controlado. 2.754 tags para 914 questões não é indexação, é
   ruído. Uma única função de deduplicação também: hoje há três critérios diferentes
   em uso (25 palavras, 200 caracteres, nenhum).
10. **Consolidar os caminhos paralelos** do pipeline: **23 scripts → 11 arquivos,
    ~20 → 8 estágios**, com `comum.py` compartilhado e um único montador dirigido
    por perfil de fonte. Está provado por reprodução que dá o mesmo resultado (84/84
    e 90/90 questões idênticas). Este é o item de "tamanho" propriamente dito — e é
    o que menos afeta a qualidade do que sai hoje, por isso vem por último.

**Alvo da consolidação:** ~1.685 questões únicas e válidas, contra 3.892 brutas
espalhadas por três branches.
