# Auditoria de fragmentação de bancos de questões — MED-UNIDAVI

**Data:** 2026-08-02 · **Repo:** `/home/user/meu-ccem-2026` · **HEAD durante a medição:** `ee53aac`

Todos os números abaixo vêm de contagem executada sobre os arquivos extraídos das
branches com `git show`, em diretório próprio
(`.../scratchpad/audit_acervos/`). Onde não consegui medir, está dito.

> **Nota de procedência do validador.** O arquivo
> `skills/capi-questoes-enamed/scripts/validate_questao.py` mudou no working tree
> durante esta auditoria (de 570 para 598 linhas; commit `cd6a95e` — "NEGATIVO/INSTRUCAO
> só no comando"). **Todos os números de validação reportados aqui foram
> re-executados contra a versão atual (598 linhas).** A versão anterior dava
> 168 questões com ERRO em A1; a atual dá 161. Isso é, por si só, um achado:
> a régua de validação é móvel e não é versionada junto com os acervos.

---

## 1. Inventário

### 1.1 Contagem

| # | Acervo | Branch | Caminho | Questões |
|---|--------|--------|---------|---------:|
| A1 | Banco canônico adequação ENAMED | `origin/claude/remote-access-generated-material-8sn1zk` | `adequacao-enamed/canonico/banco-completo.json` | **914** |
| A2 | Pool triado CCEM (endocrino) | `origin/claude/medical-question-banks-zwiygx` | `question-banks/pool_triado.json` | **2.139** |
| A3 | Seed do app de sessões | `origin/claude/unidavi-question-sessions-1jd2xn` | `sessao-questoes/src/lib/questoes-seed.ts` | **839** |
| | | | **Total bruto** | **3.892** |

Detalhes medidos:

- **A1** — lista JSON de 914 objetos. 100% `status_curadoria: "pendente"`. Fases:
  f12=430, f10=121, f09=119, f08=90, f11=76, f02=44, f06=34. 8 UCs distintas.
  `texto_base` preenchido em 190/914. `sp_referencia` não-nulo em **0/914**;
  `oa_referencia` ausente em 100%. Enunciado médio: 386 caracteres.
- **A2** — **dict de 13 sessões → listas**, não uma lista plana. 2.139 itens, ids
  únicos (0 repetidos entre chaves de sessão), mas 704 itens carregam
  `outras_sessoes`, totalizando 3.008 etiquetas sessão×item. Fontes: MedQA-train
  1429, NephSAP 211, MedQA-test 183, MedQA-dev 160, MedMCQA 111, USMLE-step2/1/3 45.
  **Em inglês, não curado** (o próprio README diz isso). Número de opções:
  **5 opções em 1.857 itens**, 4 em 281, 3 em 1 — ou seja, 87% viola o padrão ABDC
  na origem.
- **A3** — array TS embutido em `QUESTOES_SEED` (~30 mil linhas). O comentário no
  topo do arquivo diz *"as 40 questões reais da amostra UC1/fase4"*; **o arquivo
  contém 839**. Fases: f04=280, f05=280, f06=279. 9 UCs distintas.
  `tema` = null em **839/839**, `texto_base` = null em **839/839**,
  `sp_referencia` = null em **839/839** (a vinheta inteira está dentro de
  `enunciado`). Campo extra `_proveniencia` (ex.: `"whatsapp:UC1_SP2_ENAMED — Q20"`),
  declarado no próprio código como "não existe no schema real".

### 1.2 Schema — cada um inventou o seu?

**A1 é o único que usa o schema canônico.** A2 e A3 têm schemas próprios.

| Campo canônico (`schema_questao_med_unidavi.json`) | A1 | A2 | A3 (`QuestaoSeed`) | A3 (`types.ts` / `QuestaoRascunho`) |
|---|:--:|:--:|:--:|:--:|
| `tipo` (const "questao") | ✅ | ❌ | ❌ | ❌ |
| `fase_alvo` | ✅ | ❌ | ✅ | ✅ |
| `uc_slug` | ✅ | ❌ | ✅ | ✅ |
| `tema` | ✅ | ❌ | ⚠️ existe, 100% null | ⚠️ `string \| null` (canônico exige string) |
| `subtema` | ✅ | ❌ | ❌ | ✅ |
| `sp_referencia` | ⚠️ 0/914 preenchido | ❌ | ⚠️ existe, 100% null | ✅ |
| `oa_referencia` | ❌ | ❌ | ❌ | ⚠️ renomeado p/ `oa_slugs` |
| `cenario_origem` | ✅ | ❌ | ❌ | ❌ |
| `competencia_dcn_2025` | ✅ | ❌ | ❌ | ✅ |
| `nivel_bloom` | ✅ | ❌ | ❌ | ⚠️ nullable |
| `area_clinica` | ✅ | ❌ | ❌ | ⚠️ nullable |
| `dificuldade_editorial` | ✅ | ❌ | ✅ | ⚠️ nullable |
| `tags` | ✅ | ❌ | ❌ | ✅ |
| `texto_base` | ✅ | ❌ | ⚠️ existe, 100% null | ✅ |
| `enunciado` | ✅ | ✅ (nome igual, semântica ≠) | ✅ | ✅ |
| `alternativas[]` (letra/texto/correta/justificativa) | ✅ | ❌ → `opcoes[]` (string pura, 3–5 itens) | ✅ | ⚠️ `correta`/`justificativa` **opcionais** |
| gabarito | dentro de `alternativas[].correta` | ❌ campos separados `gabarito` + `resposta` | dentro de `alternativas[].correta` | idem |
| justificativa por alternativa | ✅ obrigatória | ❌ **não existe** | ✅ | ⚠️ opcional |
| `imagens_anexadas` | ✅ | ❌ | ❌ | ❌ |
| `referencia` | ✅ | ❌ | ❌ | ✅ |
| `fonte_geracao` | ✅ | ⚠️ `fonte` (nome do banco-fonte) | ❌ | ✅ |
| `status_curadoria` | ✅ | ❌ | ❌ | ⚠️ renomeado p/ `status` |
| `disponibilidade` | ✅ | ❌ | ❌ | ❌ |
| `versao` | ✅ | ❌ | ❌ | ✅ (só em `Questao`) |
| `uso_em_avaliacoes` | ✅ | ❌ | ❌ | ❌ |
| `performance` (TRI) | ✅ | ❌ | ❌ | ❌ |
| `auditoria` (criada_por/em, edições) | ✅ | ❌ | ❌ | ❌ |
| **Campos fora do schema** | `classificacao_fina` (absorvido pelo schema em `cd6a95e`) | `id`, `score`, `termos`, `meta`, `outras_sessoes` | `_proveniencia` | `oa_slugs` |
| **Chave estável (ID)** | ❌ **nenhuma** | ⚠️ `fonte#índice` (posicional) | ❌ **nenhuma** | ✅ `id: string` no tipo, **ausente no seed** |

Resultado da validação contra o validador canônico (`validate_questao.py`, com
taxonomia 2026.2 e banco de OAs 2026.2 carregados):

| Acervo | n | Com ERRO | Códigos |
|---|---:|---:|---|
| A1 | 914 | **161 (17,6%)** | `INSTRUCAO` 160, `NEGATIVO` 1 |
| A2 | 2.139 | **2.139 (100%)** | `SCHEMA` 34.749, `ABDC` 2.139, `UC_INEXISTENTE` 2.139 |
| A3 | 839 | **839 (100%)** | `SCHEMA` 10.091 |

O caso de A3 é o mais informativo: **os 10.091 erros de schema são de envelope,
não de conteúdo**. Re-rodei A3 depois de embrulhar cada item no envelope canônico
(remover `_proveniencia`, preencher `tipo`, `fonte_geracao`, `status_curadoria`,
`versao`, `uso_em_avaliacoes`, `performance`, `auditoria`, `tema`, `area_clinica`,
`nivel_bloom`, `competencia_dcn_2025`):

- **818/839 (97,5%) passam.** As 21 que restam falham por `justificativa` ou
  `texto` de alternativa acima do limite (`maxLength` 800/500) — 23 violações.
- **0 erros de `UC_INEXISTENTE` e 0 de `SP_INEXISTENTE`:** os 9 `uc_slug` de A3
  existem na taxonomia 2026.2.

Ou seja: A3 não é lixo, é o mesmo conteúdo em roupa errada. A2, ao contrário,
é incompatível na raiz (inglês, 5 alternativas, sem justificativa).

---

## 2. Sobreposição entre acervos: **zero medido**

Método: normalizei (minúsculas, sem acento via NFD, pontuação → espaço),
concatenei `texto_base + enunciado`, e comparei por (a) hash dos **primeiros 30
tokens** e (b) **shingles de 5 tokens com índice invertido + Jaccard**.

| Par | Match exato (30 tokens) | Jaccard ≥ 0,50 | **Jaccard máximo observado** |
|---|---:|---:|---:|
| A1 × A2 | 0 | 0 | 0,006 |
| A1 × A3 | 0 | 0 | **0,041** |
| A2 × A3 | 0 | 0 | 0,000 |

**Nenhuma questão aparece em mais de um acervo.** O par de maior similaridade
A1×A3 (0,041) são duas questões inteiramente distintas (lombalgia ocupacional vs.
rotura de membranas na gestação) — ruído de vocabulário clínico comum, não
duplicata.

Isso **não** é boa notícia. Significa que os três acervos não são cópias
divergentes de uma mesma base — são **três bases disjuntas**, e a fragmentação é
de *cobertura* e *governança*, não de duplicação. Confirmação: A1 e A3 têm
**exatamente uma UC em comum**, `med_unidavi_f06_uc01_problemas_mentais_comportamento`,
com **34 questões em A1 e 79 em A3, sem uma única questão compartilhada**. Um
docente dessa UC hoje tem dois bancos de questões que não se conhecem.

### 2.1 Duplicação **dentro** de cada acervo — aí sim existe

Mesmo método (Jaccard ≥ 0,85 sobre shingles de 5 tokens):

| Acervo | Pares near-duplicate | Grupos | Itens envolvidos |
|---|---:|---:|---:|
| A1 | 5 | 5 | 10 |
| A2 | 1 | 1 | 2 |
| **A3** | **40** | **40** | **80 (9,5% do acervo)** |

O caso de A3 é sistemático e diagnosticável: as 40 duplicatas são exatamente o
par `SP N — <título> — Qk` ↔ `whatsapp:UC1_SPN_ENAMED — Qk`. As mesmas 40
questões da amostra original foram **reingeridas por um segundo caminho de
importação** (colagem de WhatsApp) e nada detectou. Exemplos:

- `SP 2 — Quando o tempo é decisivo... — Q20` ≡ `whatsapp:UC1_SP2_ENAMED — Q20`
  ("comparando as políticas de rastreamento do câncer de próstata…")
- `SP 1 — O que eu fiz de errado? — Q3` ≡ `whatsapp:UC1_SP1_ENAMED — Q3`
  ("o papilomavírus humano (HPV) oncogênico é reconhecido como agente etiológico…")

O validador canônico **detecta** isso (`check_lote` → 40 avisos `DUPLICIDADE` em
A3, 9 em A1, 2 em A2), mas o validador do app (`validacaoQuestao.ts`) valida
**uma questão por vez** e não tem nenhuma checagem de lote — por isso as
duplicatas entraram.

Em A1 há um caso pior que duplicata simples: a mesma questão aparece sob
**UCs diferentes** — ex. um item de sigilo profissional em
`f12_uc02_saude_familia_comunidade` e `f12_uc01_clinica_medica`; e um item de
saúde da criança em `f12_uc02` e `f09_uc01_saude_crianca`.

### 2.2 Três normalizações diferentes para "questão duplicada"

Vale registrar porque é a causa mecânica de 2.1: o ecossistema tem **três
definições incompatíveis de identidade de questão**, nenhuma compartilhada.

| Onde | Chave de deduplicação |
|---|---|
| `validate_questao.py` (`check_lote`) | primeiras **25 palavras** normalizadas |
| `triagem_endocrino.py` (A2) | `re.sub(r"\W+","",enunciado.lower())[:200]` — **200 caracteres** |
| `validacaoQuestao.ts` (A3) | **nenhuma** — não existe checagem de duplicidade |

---

## 3. Divergência de regras: `validacaoQuestao.ts` × `validate_questao.py`

### 3.1 Medição

Portei as regras de `validarRascunho()` para Python (fielmente, incluindo os dois
avisos) e rodei as duas implementações sobre os dois acervos em português:

| Acervo | n | Reprovado pelo **TS** | Reprovado pelo **Python** | Só Python | **Só TS** |
|---|---:|---:|---:|---:|---:|
| A1 | 914 | **0** | 161 | 161 | **0** |
| A3 | 839 | **0** | 839 | 839 | **0** |

**O validador TypeScript não reprova uma única das 1.753 questões reais que o
validador canônico reprova.** Não achei, nem nos dados nem construindo casos, uma
questão que o TS bloqueie e o Python aprove — o conjunto de regras do TS é um
**subconjunto próprio** do canônico em poder de bloqueio, com **duas inversões
semânticas** (abaixo).

### 3.2 Casos concretos que passam no TS e falham no Python

Construí 6 questões sintéticas a partir de um item válido de A1, alterando um
ponto de cada vez. **Todas as 6 passam no validador TS (0 erros) e todas as 6
falham no validador Python.**

| # | Alteração | TS | Python |
|---|---|:--:|---|
| C1 | Enunciado: *"**Assinale** a alternativa que descreve corretamente…"* | ✅ passa | ❌ `INSTRUCAO` |
| C2 | Alternativa A: *"**nenhuma das opções acima**."* | ✅ passa | ❌ `ANTERIORES` |
| C3 | Enunciado: *"Todos os achados sustentam o diagnóstico, **exceto**…"* | ✅ passa | ❌ `NEGATIVO` |
| C4 | Todas as justificativas = `"ok"` (2 caracteres) | ✅ passa | ❌ `SCHEMA` (`minLength: 10`) ×4 |
| C5 | Enunciado = `"Qual?"` (5 caracteres) | ✅ passa | ❌ `SCHEMA` (`minLength: 10`) |
| C6 | `uc_slug` bem-formado mas inexistente: `med_unidavi_f04_uc09_uc_inventada_pelo_docente` | ✅ passa | ❌ `UC_INEXISTENTE` |

### 3.3 As duas inversões semânticas (não é só severidade — é sinal trocado)

**(a) "assinale".** O TS usa a presença de `assinale|identifique|qual` como
**prova de que o enunciado é uma pergunta bem-formada** — a presença do termo
*suprime* o aviso `SEM_PERGUNTA`:

```ts
else if (!q.enunciado.includes('?') && !/\bassinale\b|\bidentifique\b|\bqual\b/i.test(q.enunciado)) {
  avisos.push('Enunciado não parece ser uma pergunta direta (sem "?").')
}
```

O Python trata exatamente o mesmo termo como **erro bloqueante**:

```python
VERBOS_INSTRUCAO = ["assinale", "indique", "aponte", "marque", "selecione"]
...
rep.err("INSTRUCAO", f"Verbo de instrução proibido no comando: '{v}'.")
```

Impacto medido: **160 das 914 questões de A1 (17,5%) são bloqueadas por
`INSTRUCAO`** — e são exatamente as que o TS considera bem-formadas.

**(b) Letra do gabarito.** O TS emite aviso quando a correta **não** é a letra A
("convenção do gerador institucional"). O canônico emite aviso de lote
`GABARITO_CONCENTRADO` quando **todas** caem na mesma letra, e cita como alvo a
distribuição uniforme do ENAMED 2025 (A21/B24/C23/D22). Os dois avisos apontam em
direções opostas. Medido:

| Acervo | A | B | C | D |
|---|---:|---:|---:|---:|
| A1 (segue o canônico) | 224 | 234 | 226 | 230 |
| A3 (nasceu sob o TS) | **495 (59%)** | 329 | 14 | 1 |

Em A1 o TS emitiria **690 avisos** "correta não está na letra A" sobre um banco
cuja distribuição é justamente a desejada.

### 3.4 Regras que só existem de um lado

| Regra | TS | Python |
|---|:--:|:--:|
| Enunciado vazio / >1000 chars | ✅ erro | ✅ erro (schema) |
| Enunciado `minLength: 10` | ❌ | ✅ erro |
| Exatamente 4 alternativas A–D, 1 correta | ✅ erro | ✅ erro |
| Justificativa presente | ✅ erro se vazia | ✅ erro se <10 ou >800 chars |
| `maxLength` de texto (500) / texto_base (4000) | ❌ | ✅ erro |
| "todas/nenhuma das anteriores" | ⚠️ só 2 frases literais | ✅ 6 padrões (inclui "das opções/alternativas/acima") |
| Enunciado negativo (`exceto`, `incorreta`, `falso`) | ❌ | ✅ erro |
| Verbo de instrução (`assinale`…) | ❌ (é sinal **positivo**) | ✅ erro |
| `uc_slug` — formato | ✅ erro | ✅ erro (schema) |
| `uc_slug` — **existe na taxonomia** | ❌ | ✅ erro |
| `fase_alvo` × fase | ✅ vs. string do slug | ✅ vs. **taxonomia** (fonte diferente) |
| `sp_referencia` — formato | ✅ erro | ✅ erro |
| `sp_referencia` / `oa_referencia` — **existe no banco de OAs vigente** | ❌ | ✅ erro |
| `competencia_dcn_2025` — `minItems: 1` | ❌ (array vazio passa) | ✅ erro |
| Campos de governança (`versao`, `auditoria`, `performance`, `uso_em_avaliacoes`, `tipo`, `status_curadoria`, `fonte_geracao`, `disponibilidade`) | ❌ inexistentes | ✅ obrigatórios |
| Termo vago, extensão da correta, pista no enunciado/vinheta, teto de nível, regras de completamento | ❌ | ✅ avisos |
| Duplicidade / concentração de gabarito / monocultura de formato (lote) | ❌ | ✅ avisos |

### 3.5 O gate "curar" também é mais frouxo que o schema

`pendenciasParaCurar()` exige **4** campos para promover `pendente → curado`:
`tema`, `area_clinica`, `nivel_bloom`, `competencia_dcn_2025`. O schema canônico
exige **16**. Medi: aplicando só esses 4 campos às 839 questões de A3,
**839/839 continuam falhando** o validador canônico (6.735 erros de schema),
por `tipo`, `fonte_geracao`, `status_curadoria`, `versao`, `uso_em_avaliacoes`,
`performance`, `auditoria` e `_proveniencia`. Ou seja: **uma questão pode chegar
a "curada" no app e ainda assim não ser uma questão válida do banco institucional.**

O comentário no topo de `validacaoQuestao.ts` é honesto sobre isso — diz que
"não reimplementa o JSON Schema inteiro (isso é trabalho do validador Python
institucional)". O problema é operacional, não de honestidade: **o validador
Python não roda em lugar nenhum do caminho de importação do app**, então na
prática o TS é o único gate.

---

## 4. Risco operacional: a correção do docente não se propaga

**Não existe chave estável ligando a mesma questão entre acervos. Nem dentro de A1 e A3.**

Medido:

- **A1:** nenhum campo `id` em 914/914 objetos. União de chaves = 26 campos,
  nenhum identificador. A identidade de uma questão é a **posição no array**.
- **A3:** nenhum `id` em 839/839. Idem — identidade posicional. O tipo
  `Questao` em `types.ts` *declara* `id: string`, mas o seed usa `QuestaoSeed`,
  que não tem `id`. O ID só nasce quando o Supabase insere a linha.
- **A2:** tem `id`, no formato `fonte#índice` — mas é o **índice de enumeração do
  arquivo-fonte** (`"id": f"{fonte}#{i}"` em `triagem_endocrino.py`). Reordenar
  ou reprocessar o banco bruto reatribui todos os IDs. Além disso, o README
  informa que os bancos brutos **não estão neste repositório** (foram movidos
  para `itairanterres-alt/Treino-enamed`), o que torna os IDs de A2
  não-reproduzíveis a partir deste repo.
- **A1 tem `auditoria.edicoes[]`** (editor, data, campo, antes, depois) — a única
  estrutura de rastro de correção do ecossistema. A3 e A2 não têm nenhuma.
  Não medi o preenchimento efetivo de `edicoes`, mas 914/914 estão em
  `status_curadoria: "pendente"`, isto é, nenhuma passou por ação humana docente
  registrada.

**O que acontece hoje, na prática:**

1. Docente corrige uma questão no app de sessões (A3). A correção fica no
   Supabase do app. O arquivo `questoes-seed.ts` na branch **não muda**, o
   `banco-completo.json` (A1) **não muda**, o `pool_triado.json` (A2) **não muda**.
2. Não há como saber se a questão corrigida existe em outro acervo, porque não há
   chave — e a comparação por conteúdo dá 0 (§2). Descobrir exigiria rodar a
   análise de similaridade que fiz aqui, a cada correção.
3. `pool_triado.json` (A2) é declarado **regenerável** pelo script
   (`são reproduzíveis rodando o script`). Qualquer correção manual feita nele é
   **destruída** na próxima execução de `triagem_endocrino.py` — e como os
   IDs são posicionais, nem o alvo da correção sobrevive.
4. A UC `f06_uc01_problemas_mentais_comportamento` tem 34 questões em A1 e 79 em
   A3, sem interseção. Uma correção de mérito clínico (ex. atualização de
   critério diagnóstico) aplicada num lado deixa o outro lado desatualizado, sem
   sinal nenhum.
5. Se a mesma questão for reimportada por outro caminho, entra de novo: é
   literalmente o que aconteceu com as **40 duplicatas de A3** (§2.1).
6. A régua muda debaixo do acervo: o validador canônico foi alterado durante
   esta auditoria e o número de reprovações de A1 mudou de 168 para 161, sem que
   nada em A1 mudasse. Não há registro de "validado contra a versão X" em
   nenhuma questão.

---

## 5. Recomendação de consolidação

### 5.1 Fonte de verdade: **A1** (`adequacao-enamed/canonico/banco-completo.json`)

Critérios medidos que sustentam a escolha:

- É o **único** acervo que valida contra `schema_questao_med_unidavi.json`
  (161/914 reprovadas por regra de estilo — 17,6% — contra 100% em A2 e A3).
- É o único com os campos de governança que o problema exige: `auditoria.edicoes[]`,
  `versao`, `status_curadoria`, `uso_em_avaliacoes`, `performance` (TRI),
  `disponibilidade`.
- Distribuição de gabarito uniforme (224/234/226/230), contra 59% em A em A3.
- Menor taxa de duplicação interna (5 grupos em 914 = 0,5%, contra 40 em 839 = 4,8%).
- Cobre as fases 8–12 (836/914), que é onde o blueprint contra a matriz do ENAMED
  faz sentido.

### 5.2 O que vira derivado

| Acervo | Destino | Justificativa medida |
|---|---|---|
| **A3** | **Migrar para A1** e o arquivo `questoes-seed.ts` vira **fixture de teste**, não banco | 818/839 (97,5%) passam o validador canônico só com envelope. Cobre f04–f06, que A1 quase não cobre (só 34 itens de f06). É ganho líquido de cobertura. |
| **A2** | **Sai do escopo MED-UNIDAVI.** Fica como *matéria-prima* do projeto CCEM/Treino-ENAMED | 87% tem 5 alternativas, 100% em inglês, 0% tem justificativa por alternativa, `UC_INEXISTENTE` em 2.139/2.139. O próprio README já declara que é insumo de outro projeto e "nenhum destes itens está pronto para uso". Tratá-lo como banco de questões MED-UNIDAVI é erro de categoria. |

Após consolidação: **1.753 questões** candidatas (914 + 839), das quais **1.732**
passam o validador canônico com envelope (914 + 818), menos 40 duplicatas de A3
e ~10 de A1 → **~1.685 questões únicas e válidas**, contra os 3.892 itens brutos
espalhados hoje.

### 5.3 O que precisa existir (na ordem)

**1. Chave estável — é o pré-requisito de tudo.**
Nenhuma migração sobrevive sem isso, porque hoje a identidade é posicional.
Adicionar ao schema canônico um campo obrigatório:

```
"id_questao": UUIDv5(namespace_med_unidavi, sha256(normalizar(texto_base + enunciado)))
```

Normalização = a mesma das §2 (minúsculas, NFD sem acento, pontuação removida,
colapso de espaço). Duas propriedades que isso compra: (a) o ID é **derivável do
conteúdo**, então reimportar a mesma questão por outro caminho colide em vez de
duplicar — o que teria bloqueado as 40 duplicatas de A3; (b) é reproduzível sem
banco de dados, então funciona igual no arquivo JSON, no Supabase e no script Python.
O ID original **não** muda em edição (isso é o que `versao` + `auditoria.edicoes[]`
registram); um `id_conteudo` secundário, recalculado a cada edição, serve à
detecção de duplicata.

**2. Uma única normalização de duplicidade.**
Hoje são três (25 palavras / 200 caracteres / nenhuma). Extrair a função de
normalização + shingles para um módulo único, exposto tanto ao Python quanto ao
TS (ou expor o Python como endpoint), e rodar `check_lote` em **todo** caminho de
importação — inclusive o do app, que hoje não roda nenhum.

**3. Migração, em três passos verificáveis:**
- (a) Gerar `id_questao` para as 914 de A1 e as 839 de A3.
- (b) Embrulhar A3 no envelope canônico (o script que escrevi para medir isso
  produz 818/839 aprovadas; ver `a3_envelope.json` em
  `.../scratchpad/audit_acervos/`). As 21 restantes exigem edição humana —
  são justificativas/textos acima de `maxLength`, não erro conceitual.
- (c) **Reter `_proveniencia`** em campo canônico (`questao_original_referencia`,
  que já existe no schema) em vez de descartá-lo: é a única evidência de como as
  40 duplicatas entraram.
- (d) Resolver as 5 duplicatas de A1 — em especial os **2 casos do mesmo item sob
  UCs diferentes** (`f12_uc02`↔`f12_uc01` e `f12_uc02`↔`f09_uc01`), que não são
  duplicata acidental e sim ambiguidade de classificação a ser adjudicada por docente;
  os outros 3 pares são duplicata dentro da mesma UC.

**4. Validação única, e só uma.**
Eliminar `validacaoQuestao.ts` como *gate* — ele reprova 0 do que o canônico
reprova e tem sinal invertido em dois pontos ("assinale", letra A). Duas saídas:
(i) o app chama o validador Python (endpoint/serverless) na importação; ou
(ii) `validacaoQuestao.ts` passa a ser **gerado** a partir do JSON Schema
(`ajv` compilando `schema_questao_med_unidavi.json`), mantendo em TS artesanal
apenas o feedback de UX — nunca a decisão de bloquear. A regra "assinale" e a
convenção de letra A precisam ser decididas de um jeito só e escritas num lugar só.

**5. Versionar a régua junto com o acervo.**
Gravar em cada questão `validado_contra: {schema: <hash>, validador: <commit>}`.
Sem isso, "914 questões válidas" é uma afirmação sem data — como se viu, o mesmo
banco passou de 168 para 161 reprovações em minutos, sem nenhuma edição.

---

## Anexo — o que não consegui medir

- **Se as correções docentes efetivamente divergiram.** A1 está 914/914 em
  `status_curadoria: "pendente"` e não inspecionei o conteúdo de
  `auditoria.edicoes[]`; A3 e A2 não têm campo de auditoria. Não há histórico de
  edição para comparar. A afirmação de §4 é sobre o **mecanismo** (não há chave,
  logo não pode propagar), não sobre divergências já ocorridas.
- **O estado real do banco Supabase do app de sessões.** Auditei o seed
  versionado (`questoes-seed.ts`), que é o dado de demo; o banco vivo pode ter
  outro conteúdo. As migrations citadas nos comentários
  (`supabase/migrations/schema_inicial.sql`) não estavam no escopo dos arquivos
  que me foram indicados.
- **A2 antes da triagem.** Os bancos brutos (29.540 → 18.046 itens, segundo o
  README) não estão neste repositório; medi apenas os 2.139 itens triados.
- **O pipeline de geração de A1** — fora de escopo por instrução (auditado por
  outro agente).
