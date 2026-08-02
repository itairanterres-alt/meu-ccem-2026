# Auditoria de arquitetura — pipeline `adequacao-enamed`

**Objeto:** 23 scripts Python (4.748 linhas físicas, 3.460 significativas), 20 subpastas de
estágio com 200 arquivos, saída `canonico/banco-completo.json` com 914 questões.
**Data:** 2026-08-02.

**Regra de rigor aplicada.** Toda afirmação numérica abaixo vem de contagem executada sobre o
código e os dados desta pasta. Onde não foi possível medir, está escrito. Os experimentos foram
rodados em cópias em sandbox (`scratchpad/sandbox`, `scratchpad/sandbox2`); a árvore original
não foi alterada.

**Veredito curto.** A hipótese do coordenador está *parcialmente* certa e por um motivo diferente
do que ele imagina. O problema não é o número de linhas — a extração é boa e boa parte do volume
é trabalho legítimo de parsing. O problema é que **o pipeline não tem contrato entre estágios**:
nenhum estágio valida o que recebe, nenhum script devolve código de saída diferente de zero, e a
mesma decisão (classificar, normalizar, validar) está implementada 4, 5 ou 6 vezes com respostas
diferentes. As falhas que aparecem no banco são consequência disso, não do tamanho.

---

## 1. Grafo real do pipeline

### 1.1 Fluxo medido

```mermaid
flowchart TD
    subgraph FONTES["fontes/ (PDF, TXT, DOCX)"]
        F1[enamed2025_caderno1.txt]
        F2[simulado0{1,2}_2026.txt]
        F3[revalida202{3,4}_pv_objetiva.txt<br/>+ gabaritos]
        F4[tpmed2022_comentadas.txt]
        F5[3 x .docx NAPISUL/CLM]
        F6[simulado_nacional.pdf<br/>enamed_simulado_2026_1.pdf<br/>tpmed2025_gabarito.pdf]
    end

    F1 --> E1[extrair_enamed.py]
    F2 --> E2[extrair_simulados.py]
    F3 --> E3[extrair_revalida.py] --> E3b[aplicar_gabarito_revalida.py]
    F4 --> E4[extrair_tp2022.py]
    F5 --> E5[extrair_docx.py]
    F5 --> E5b[recuperar_conteudo_fichas.py]
    F6 --> E6[extrair_simulados_nacionais.py]

    E1 --> I1[(enamed2025_caderno1.json<br/>100 regs)]
    E2 --> I2[(simulados2026.json<br/>100)]
    E3b --> I3[(revalida.json<br/>200)]
    E4 --> I4[(tp2022.json<br/>120)]
    E5 --> I5[(questoes_docx.json<br/>176)]
    E6 --> I6[(simulados_nacionais.json<br/>270)]
    E5b --> IF[(conteudo_fichas.json)]

    I1 & I2 & I3 & I4 & I5 & I6 --> DD[deduplicar.py --aplicar<br/>MUTA os intermediários in place]

    DD -.-> L["`lotes*/` 8 pastas, 73 arquivos<br/>NENHUM script escreve<br/>NENHUM script lê"]
    L -.->|passo manual / IA<br/>não registrado em código| ENR

    ENR["`enriquecimento*/` 6 pastas<br/>NENHUM script escreve"]

    I1 --> M1[montar_canonico.py]
    ENR --> M1
    I2 --> M2[montar_canonico_simulados.py]
    ENR --> M2
    I3 & I4 & I5 & I6 --> M3[montar_canonico_generico.py<br/>4 invocações CLI distintas]
    ENR --> M3

    I6 -->|150 sem gabarito| CS[apurar_consenso.py] --> PA[preparar_adaptacao.py] --> AD["`adaptacao/` manual/IA"] --> M4[montar_canonico_adaptado.py]

    M1 --> C1[(enamed…canonico.json 90)]
    M2 --> C2[(simulados2026…84)]
    M3 --> C3[(revalida 186 · tp2022 115<br/>tpmed2025 120 · questoes_docx 175)]
    M4 --> C4[(adaptadas 144)]

    C1 & C2 & C3 & C4 --> AE[aplicar_especialidade.py<br/>ESCREVE no schema de referência]
    AE --> AM[aplicar_matriz.py<br/>ESCREVE no schema de referência]
    AM --> AV[ampliar_vocabulario.py]
    AV --> AI[anexar_imagens.py<br/>sobrescreve requer_imagem]
    AI --> CB[consolidar_banco.py]
    CB --> BC[(banco-completo.json<br/>914)]
    CB --> RC[relatorio_curadoria.py]
    C4 --> CA[checar_adaptadas.py]

    style L fill:#fdd,stroke:#c00
    style ENR fill:#fdd,stroke:#c00
    style AE fill:#ffd,stroke:#a80
    style AM fill:#ffd,stroke:#a80
```

### 1.2 Onde há caminho paralelo por fonte em vez de caminho único com adaptador

**Seis extratores** — legítimo em parte. Os formatos de origem são genuinamente diferentes (PDF
2 colunas, PDF LaTeX, DOCX OOXML). Mas os quatro extratores de PDF resolvem o *mesmo* problema
em quatro implementações: de-columnizar → fatiar por questão → separar alternativas → normalizar.
`extrair_simulados_nacionais.py` já tem a forma certa (uma lista `PROVAS` de perfis declarativos,
linhas 367-403) e nunca foi usada pelos outros três.

**Quatro montadores** — não legítimo. Medição na seção 1.3.

**Seis pastas de enriquecimento com o mesmo esquema.** Medido:

| pasta | chaves do registro |
|---|---|
| `enriquecimento_sim` | area_clinica, competencia_dcn_2025, **descartar**, dificuldade_editorial, **id_origem**, justificativas, motivo_descarte, nivel_bloom, problema_detectado, subtema, tags, tema |
| `enriquecimento_revalida` | idêntico |
| `enriquecimento_docx` | idêntico |
| `enriquecimento_tp2022` | idêntico |
| `enriquecimento_tpmed2025` | idêntico |
| `enriquecimento` (ENAMED) | igual, **exceto**: usa `num` no lugar de `id_origem`; sem `descartar`, `motivo_descarte`, `problema_detectado` |

Cinco das seis são o mesmo contrato. A sexta difere por uma chave. **`montar_canonico.py`
(165 linhas) existe porque uma pasta usa `num` em vez de `id_origem`.**

### 1.3 Quanto dos quatro montadores é código duplicado — medido, não estimado

Método: linhas significativas (sem docstring, sem comentário, indentação normalizada); clones =
blocos idênticos de ≥3 linhas consecutivas via `difflib.SequenceMatcher`; e uma segunda passada
com identificadores anonimizados, para pegar clone com variável renomeada.

```
montar_canonico.py             165 físicas / 130 significativas
montar_canonico_simulados.py   182 físicas / 148 significativas
montar_canonico_generico.py    234 físicas / 184 significativas
montar_canonico_adaptado.py    270 físicas / 214 significativas
                               ---
                               851 físicas / 676 significativas
```

Clones par a par (linhas significativas idênticas, bloco ≥3):

| par | linhas clonadas | blocos |
|---|---:|---:|
| simulados × generico | **71** | 13 |
| canonico × simulados | 30 | 3 |
| canonico × generico | 27 | 5 |
| simulados × adaptado | 26 | 8 |
| generico × adaptado | 25 | 5 |
| canonico × adaptado | 13 | 4 |

Similaridade das funções `montar()` (o núcleo de cada montador):

| par | literal | com variáveis renomeadas |
|---|---:|---:|
| `_simulados` × `_generico` | 65/89 vs 112 = **65%** | **72%** |
| base × `_simulados` | 47% | 48% |
| base × `_generico` | 37% | 40% |
| base × `_adaptado` | 21% | 29% |
| `_simulados` × `_adaptado` | 22% | 30% |
| `_generico` × `_adaptado` | 20% | 27% |

Repetição literal bruta: das 676 linhas significativas somadas dos quatro, apenas **456 são
distintas** — **220 linhas são repetição textual exata**.

O **envelope canônico** (o dict com os 24 campos do schema) está escrito **4 vezes**, com
10/10 campos idênticos: 28 + 27 + 28 + 31 = **114 linhas**. O **bloco de validação jsonschema**
está escrito **5 vezes** (os 4 montadores + `consolidar_banco.py`): 12 + 14 + 14 + 15 + 6 =
**61 linhas**.

**Prova experimental de redundância — o teste decisivo.** Rodei `montar_canonico_generico.py`
sobre as entradas dos outros dois montadores, em sandbox, e comparei campo a campo com o arquivo
canônico que está no repositório:

*Simulados 2026:*
```
Canônicas: 84/84 | convertidas 5->4: 50 | Validação schema: 84/84 OK
campos do schema que diferem entre generico e montar_canonico_simulados:
  referencia: 84/84 questões
     generico: "Simulado 01 — MED/ENAMED 2026, questão 1; gabarito oficial."
     dedicado: "Simulado 01 — MED/ENAMED 2026, questão 1; gabarito oficial do simulado."
```
→ **`montar_canonico_simulados.py` (182 linhas) reproduz-se integralmente com `generico`,
exceto o sufixo de uma string literal.** Os 24 campos do schema e as 84 questões batem.

*ENAMED 2025* (com um adaptador de 6 linhas que injeta `id_origem = f"enamed2025_q{num:03d}"`
nos dois lados):
```
Canônicas: 90/90 | Validação schema: 90/90 OK
campos que diferem:
  referencia: 90/90  (texto da citação da Portaria)
  alternativas: 6/90 (generico aplica normalizar_texto; montar_canonico.py não)
```
→ **`montar_canonico.py` (165 linhas) reproduz-se com `generico` + 6 linhas de adaptador**, e as
6 divergências são um *defeito* do caminho dedicado, não uma funcionalidade (seção 3.3).

`montar_canonico_adaptado.py` é o único com lógica própria real (detector de plágio por janela de
9 palavras, validação contra a Portaria 478, posição da correta sorteada por hash) — mas repete o
envelope (31 linhas), o bloco jsonschema (15) e o carregador de lotes (~10).

**Acoplamento invertido.** `montar_canonico_generico.py:31-32` importa `AREA2UC, BLOOM, DIFIC,
split_vinheta` de `montar_canonico.py` e `normalizar_texto` de `montar_canonico_simulados.py`.
O montador "genérico" depende dos dois específicos — não dá para apagá-los sem antes mover o
código compartilhado. Isso trava a limpeza.

**Resposta direta: dos 851 linhas dos quatro montadores, ~372 (44%) são elimináveis sem perda
de comportamento**, provado por reprodução da saída, não por leitura.

---

## 2. Duplicação de código — quantificada

### 2.1 Panorama

- 23 scripts, **132 funções** definidas.
- Clones exatos ≥4 linhas significativas entre quaisquer dois scripts: **316 linhas de 3.460
  significativas (9,1%)**. Esse número *subestima* a duplicação, porque só conta cópia literal.

Funções com o mesmo nome e a mesma responsabilidade, com corpo próprio em cada script:

| função | nº de scripts | linhas por cópia |
|---|---:|---|
| `norm` | 6 | docx 5, enamed 8, revalida 6, simulados 3, nacionais 4, fichas 3 = **29** |
| `montar` | 4 | 52 + 95 + 124 + 143 = **414** |
| `parse_alternativas` | 3 | 13 + 14 + 18 = **45** |
| `limpar` | 4 | 3 + 4 + 3 + 3 = **13** |
| `corrigir_quebras` | 2 | 45 + 43 = **88** |
| `_e_palavra`, `campos`, `get`, `put`, `sub` | 2–3 | 62 no total |

### 2.2 Blocos copiados, com arquivo e linha

**(a) `corrigir_quebras` — 88% idêntica entre dois extratores.**
`extrair_simulados.py:76-120` (45 linhas) vs `extrair_simulados_nacionais.py:301-343` (43 linhas):
**33 linhas idênticas de 38/37 significativas (88%)**. Diferenças reais: 4 linhas (uma remove
`RESIDUO_FIM`, a outra junta hífen). A constante `CURTAS` está duplicada em
`extrair_simulados.py:62-66` e `extrair_simulados_nacionais.py:289-293`, com uma palavra de
diferença (`caso`/`qual`/`dl` só na segunda) — o que significa que os dois corpora reparam
palavras quebradas com vocabulários ligeiramente diferentes.

**(b) Envelope canônico — 4 cópias.** `montar_canonico.py:90-121`,
`montar_canonico_simulados.py:87-114`, `montar_canonico_generico.py:94-122`,
`montar_canonico_adaptado.py:137-168`. 114 linhas.

**(c) Bloco de validação jsonschema — 5 cópias.** `montar_canonico.py:146-161`,
`montar_canonico_simulados.py:161-177`, `montar_canonico_generico.py:213-229`,
`montar_canonico_adaptado.py:248-265`, `consolidar_banco.py:61-69`. 61 linhas.

**(d) Bloco de 15 linhas idênticas.** `montar_canonico.py:91-105` == `montar_canonico_simulados.py:88-102`
(maior clone exato do pipeline). Segundo maior: 12 linhas, `montar_canonico_simulados.py:38-50`
== `montar_canonico_generico.py:38-50`. Terceiro: 11 linhas,
`montar_canonico.py:108-118` == `montar_canonico_simulados.py:104-114`.

**(e) Carregamento da matriz 478.** `montar_canonico_adaptado.py:222-226` ==
`aplicar_matriz.py:59-63` (5 linhas idênticas).

**(f) Seis detectores de `requer_imagem`** para a mesma decisão — 77 linhas no total:
`extrair_enamed.py:37-39` (3), `extrair_simulados.py:29-31` (3),
`extrair_revalida.py:65-102` (38), `extrair_tp2022.py:268-273` (6),
`extrair_simulados_nacionais.py:346-361` (16), `anexar_imagens.py:100-110` (11).
Não são cópias — são *seis regras diferentes para a mesma pergunta* (seção 3.2).

### 2.3 Quantas das 4.748 linhas são duplicação evitável

| # | item | medida | eliminável |
|---|---|---|---:|
| 1 | `montar_canonico_simulados.py` inteiro (saída provada idêntica), menos `normalizar_texto` (l.28-34) que migra para módulo comum | 182 − 7 | **175** |
| 2 | `montar_canonico.py` inteiro, menos `AREA2UC/BLOOM/DIFIC` (l.22-35, 14) e `split_vinheta` (l.49-68, 20) | 165 − 34 | **131** |
| 3 | `montar_canonico_adaptado.py`: envelope (31) + bloco jsonschema (15) + carregador de lotes (10) | | **56** |
| 4 | `corrigir_quebras` + `CURTAS` + `_e_palavra` duplicados em `extrair_simulados.py` | 45+5+3 | **53** |
| 5 | `norm()` × 6 → 1 implementação de 8 linhas | 29 − 8 | **21** |
| 6 | `parse_alternativas` × 3 → 1 de 18 linhas | 45 − 18 | **27** |
| 7 | detectores `requer_imagem` × 6 → 1 de 38 linhas | 77 − 38 | **39** |
| 8 | bloco jsonschema restante (`generico` 14 + `consolidar` 6) → 1 de 14 | 20 − 14 | **6** |
| 9 | `limpar()` × 4 → 1 de 4 linhas | 13 − 4 | **9** |
| | **TOTAL** | | **517** |

**517 linhas físicas de 4.748 (10,9%) são duplicação evitável sem perda de comportamento.**

Esse número é conservador de propósito: não conta o `main()` de cada script (23 `main()`, 1.284
linhas somadas — há boilerplate ali, mas cada um imprime um relatório genuinamente diferente e
não sei separar as partes sem executar todos), nem a fusão dos quatro extratores de PDF em um
extrator dirigido por perfil, que economizaria mais algumas centenas de linhas mas é reescrita,
não deduplicação.

**O que não consegui medir:** duplicação *semântica* entre `extrair_simulados.py` e
`extrair_simulados_nacionais.py` além das funções homônimas — as duas implementações de
de-columnização (`decolumnize`/`_decol_layout`/`linear_coord`) resolvem o mesmo problema com
algoritmos diferentes, e não há métrica objetiva de "quanto disso é o mesmo trabalho".

---

## 3. Onde o desenho cria risco de falha

### 3.1 Estágios cujo output vira input do próximo sem validação

**Nenhum estágio valida o que recebe.** Não existe um só `validar_intermediario.py`. As
consequências são mensuráveis.

**Caso concreto: uma questão perdida em silêncio.** Rodando o pipeline em sandbox:

```
Canônicas: 175/176 | convertidas 5->4: 87
  ! ERRO: clm_napisul2_2026_q074: gabarito 'E' não está entre as alternativas
```

O registro produzido por `extrair_docx.py` tem `gabarito: "E"` mas `alternativas: {A,B,C,D,
E: null}` — `resolver_gabarito()` (`extrair_docx.py:266-306`) devolveu uma letra que não existe.
Nenhum estágio checou isso. O montador capturou com `except Exception` (`montar_canonico_generico.py:195`),
guardou numa lista, imprimiu uma linha em stdout e **saiu com código 0**. A questão sumiu do banco.
Ela está no `intermediario/questoes_docx.json` (176 válidas) e tem enriquecimento; simplesmente
não chegou ao `canonico/questoes_docx.canonico.json` (175).

Auditei todos os intermediários com essa régua — a boa notícia é que é o único caso:

| intermediário | válidas | gabarito fora das alternativas | sem gabarito | alternativa vazia |
|---|---:|---:|---:|---:|
| enamed2025_caderno1 | 90 | 0 | 0 | 0 |
| questoes_docx | 176 | **1** | 0 | 0 |
| revalida | 186 | 0 | 0 | 0 |
| simulados2026 | 84 | 0 | 0 | 0 |
| simulados_nacionais | 270 | 0 | 150 (por desenho) | 0 |
| tp2022 | 115 | 0 | 0 | 0 |

Mas o desenho não garante que continue sendo 1: nada impede que a próxima extração produza 30.

**Seleção de fonte por omissão.** `montar_canonico_generico.py:188-191` faz
`e = enr.get(r["id_origem"]); if not e: continue`. É assim que `simulados_nacionais.json`
(270 registros: 120 TPMed + 100 FPS + 50 Estratégia) vira `tpmed2025.canonico.json` com 120: o
script lê os 270 e descarta 150 *porque não têm enriquecimento na pasta apontada*. A separação
de fontes está implementada como efeito colateral de um `continue`. Trocar a pasta `--enriquecimento`
por engano produz um banco diferente sem erro nenhum.

**Nenhum script sinaliza falha ao sistema operacional.** Grep em `scripts/*.py`: 22 dos 23
não têm `sys.exit`; o único (`extrair_tp2022.py:443`) faz `raise SystemExit(main())` e `main()`
sempre retorna 0. **Qualquer orquestração (`&&`, Makefile, CI) enxerga sucesso em 100% dos casos.**

### 3.2 A mesma questão classificada diferente conforme o caminho

**`requer_imagem` — 15% do banco.** Existem seis detectores independentes (§2.2f). Apliquei todos
os seis ao mesmo texto (`texto_base + enunciado`) das 914 questões do banco:

| detector | marca `requer_imagem` em |
|---|---:|
| R1 `extrair_enamed.py` | 130/914 (14%) |
| R2 `extrair_simulados.py` | 35/914 (4%) |
| R3 `extrair_revalida.py` | 22/914 (2%) |
| R4 `extrair_tp2022.py` | **8/914 (1%)** |
| R5 `extrair_simulados_nacionais.py` | 16/914 (2%) |
| R6 `anexar_imagens.py` | 10/914 (1%) |

Concordância: 771 questões com 0/6 detectores dizendo "sim", 4 com 6/6. **Nas 139 restantes
(15,2% do banco) a resposta depende de qual script processou a questão.** O detector mais liberal
(R1, ENAMED) marca **16× mais** que o mais restritivo (R4, TP2022). Exemplos de discordância
máxima: `enamed q53` (sim para R1, R2, R5; não para R3, R4, R6);
`revalida2023_2_q096` (sim para R1, R3, R5).

Pior: `anexar_imagens.py:204` faz `p["requer_imagem"] = cita or bool(reg)`, **sobrescrevendo** o
valor do extrator — mas só para ENAMED e Simulados 2026 (`anexar_imagens.py:171-172`). As outras
cinco fontes ficam com o valor do respectivo extrator. O campo `requer_imagem` no banco significa
coisas diferentes conforme a fonte, e um curador que filtrar por ele terá cobertura enviesada.

**`nivel_bloom` — sinônimo aceito num caminho só.** `montar_canonico_adaptado.py:75` traduz
`{"lembrar": "conhecimento"}`. Os outros três montadores rejeitam `"lembrar"`
(`montar_canonico.py:87`, `_simulados.py:43`, `_generico.py:42`). O mesmo valor de enriquecimento
produz uma questão válida por um caminho e uma exceção capturada em silêncio (= questão perdida)
por outro.

**`assert` em vez de `raise`.** `montar_canonico.py:87-88` valida `nivel_bloom` e
`dificuldade_editorial` com `assert`. Sob `python -O` esses dois asserts desaparecem e valores
fora do enum entram no banco. Os outros três montadores usam `raise ValueError`. É a mesma
validação com dois níveis de garantia.

**O que está consistente (e é bom).** `fase_alvo` e `uc_slug` derivam de um único mapa `AREA2UC`
importado pelos quatro montadores. Verifiquei as 914 questões: **0 divergências** entre
`(fase_alvo, uc_slug)` e `AREA2UC[area_clinica]`. `cenario_origem` é `["preparacao_enamed"]` em
914/914. Esse é o modelo que os outros campos deveriam seguir.

### 3.3 Normalização de texto inconsistente

Seis implementações de normalização, cada uma resolvendo um subconjunto diferente:
`extrair_enamed.norm` (l.84-91: `\xad`, espaços, "ÁREA LIVRE", nº de página),
`extrair_simulados.norm` (l.39-41: `\xad`, espaços),
`extrair_revalida.norm` (l.169-174: `\xad`, nbsp, espaços),
`extrair_simulados_nacionais.norm` (l.283-286: `\xad`, zero-width, espaços),
`extrair_docx.limpar` (l.188-190), `extrair_tp2022.junta` (l.253-259: espaços + pontuação).
Só `extrair_tp2022.py:67-83` mapeia ligaduras e aspas/travessões tipográficos para ASCII.

Resultado medido no banco final (campos de texto com o resíduo):

| arquivo canônico | n | aspas curvas | travessão/en-dash | espaço antes de pontuação | NFD (acento decomposto) |
|---|---:|---:|---:|---:|---:|
| adaptadas | 144 | 0 | 15 | 0 | 0 |
| enamed2025_caderno1 | 90 | 8 | 4 | 7 | 0 |
| questoes_docx | 175 | 26 | 15 | 10 | 0 |
| revalida | 186 | 6 | 13 | 5 | 0 |
| simulados2026 | 84 | 10 | 13 | 2 | **1** |
| **tp2022** | 115 | **0** | **0** | **0** | 0 |
| tpmed2025 | 120 | 6 | 0 | 1 | 0 |

`tp2022` é a única fonte limpa — porque é a única que passa por `LIGADURAS`. Consequência prática:
uma busca textual por um termo com aspas ou hífen retorna resultados diferentes conforme a fonte.
E há **1 string em NFD** (acento decomposto) em `simulados2026`, que não casa com a mesma palavra
em NFC — invisível para qualquer busca.

**Normalização de alternativas aplicada em 6 dos 7 caminhos.** `normalizar_texto()` (pontuação
final) roda em `_simulados` e `_generico`, não em `montar_canonico.py`. Alternativas sem pontuação
final: 6/360 no ENAMED, 4/576 nas adaptadas, **0** em todas as demais.

**Resíduo de extração que chegou ao banco final.** As 6 divergências do teste ENAMED da §1.3 não
são só pontuação — são caudas de de-columnização que ninguém validou:

```
canonico/enamed2025_caderno1.canonico.json q35 alt D: "...pela equipe da UBS. o"
                                           q45 alt D: "...diagnóstica de tuberculose. 10"
                                           q82 alt A: "...do Grupo B na 28ª 3 semana. de"
                                           q83 alt A: "Solicitar ultrassonografia transvaginal. do"
```

São 4 alternativas do banco de produção com lixo colado no fim. `normalizar_texto` não teria
resolvido — teria acrescentado um ponto ao lixo. Só um validador de intermediário resolveria.

### 3.4 Vocabulário de tags não normalizado — origem localizada

Medição sobre `canonico/banco-completo.json`:

```
tags distintas no banco ................. 2.754
conceitos com mais de uma grafia ........   299
grafias envolvidas ......................   645
ocorrências de tag afetadas ............. 1.221 de 4.301 (28%)
questões com >=1 tag ambígua ............   670 de 914 (73%)
```

Oito estilos convivem no mesmo vocabulário: `simples/sem_acento` 823 tags, `espaco/com_acento`
675, `espaco/sem_acento` 557, `snake/sem_acento` 396, `simples/com_acento` 151,
`hifen/sem_acento` 114, `snake/com_acento` 21, `hifen/com_acento` 17.

O caso citado pelo coordenador, rastreado até a pasta de origem:

| grafia | ocorrências | onde nasce |
|---|---:|---|
| `atenção primária` | 34 | `enriquecimento_revalida` (13), `_sim` (8), `_tp2022` (7), `_tpmed2025` (8), `_docx` (1) |
| `atencao_primaria` | 9 | `adaptacao` (7), `enriquecimento` (1), `enriquecimento_revalida` (1) |
| `atencao primaria` | 6 | `adaptacao` (4), `enriquecimento_tpmed2025` (2) |
| `atencao-primaria` | 2 | `enriquecimento_revalida` (2) |

**Origem no código:** não existe. Os quatro montadores fazem literalmente
`"tags": e.get("tags", [])` — `montar_canonico.py:102`, `montar_canonico_simulados.py:99`,
`montar_canonico_generico.py:106`, `montar_canonico_adaptado.py:149`. Nenhum normaliza, nenhum
valida contra vocabulário controlado, e o schema declara
`"tags": {"type":"array","items":{"type":"string"}}` sem `pattern` nem `enum`. As quatro grafias
convivem inclusive **dentro da mesma pasta** (`enriquecimento_revalida` tem três das quatro), o
que mostra que nem o passo de enriquecimento tem vocabulário fixado. É uma ausência de estágio,
não um bug.

### 3.5 Estágios que gravam campo que o schema não aceita

O schema tem `additionalProperties: false`. **Dois estágios do pipeline reescrevem o próprio
schema para caber no que produzem:**

- `aplicar_especialidade.py:46-78` — `estender_schema()` acrescenta a propriedade
  `classificacao_fina` e grava o arquivo (`json.dump(sch, open(SCHEMA, "w"))`, l.77).
- `aplicar_matriz.py:25-54` — `ajustar_schema()` converte
  `classificacao_fina.matriz_enamed_478_2025` de `string` para `object` e grava (l.53).

Medido:

| schema | questões inválidas |
|---|---|
| schema **atual** (já mutado pelos dois estágios) | **0 / 914** |
| schema **original** (sem `classificacao_fina`) | **914 / 914** — *"Additional properties are not allowed ('classificacao_fina' was unexpected)"* |

Ou seja: **o banco só é válido porque duas etapas do pipeline editaram o validador.** A validação
final de `consolidar_banco.py` não é uma verificação independente.

Além disso, todos os `canonico/*.canonico.json` carregam `_proveniencia`, que o schema rejeita
(`"Additional properties are not allowed ('_proveniencia' was unexpected)"`). Isso é por desenho
— os montadores removem o campo antes de validar (`{k: v for k, v in q.items() if k !=
"_proveniencia"}`) e `consolidar_banco.py:27` o remove ao gravar. Mas significa que **os arquivos
por fonte, que são o insumo de 5 estágios seguintes, nunca são validados como estão em disco.**

### 3.6 Dependência de ordem não declarada — 770 registros destruídos em silêncio

`aplicar_especialidade.py` e `aplicar_matriz.py` parecem independentes: mexem em campos
diferentes, nenhum importa o outro, o README não diz a ordem. Rodei os dois na ordem inversa,
em sandbox, partindo do schema original:

```
$ python3 scripts/aplicar_matriz.py           # primeiro
ancoragens carregadas: 770
aplicadas: 770 | sem ancoragem: 144 | inválidas: 0

$ python3 scripts/aplicar_especialidade.py    # depois
schema de referência: propriedade opcional `classificacao_fina` adicionada
aplicadas: 770 | sem classificação: 144

$ python3 scripts/consolidar_banco.py
Validação do banco consolidado: 770/914 OK        <- 144 inválidas
Integridade (4 alternativas, 1 correta): 914/914
$ echo $?
0
```

Resultado comparado com a ordem correta:

```
ordem original  (especialidade -> matriz): questões com ancoragem na matriz 478 = 914/914
ordem invertida (matriz -> especialidade): questões com ancoragem na matriz 478 = 144/914
```

**Inverter a ordem de dois scripts sem dependência declarada apaga 770 das 914 ancoragens na
Portaria 478** — porque `aplicar_especialidade.py:106` grava `"matriz_enamed_478_2025": None`
dentro do `cf` que sobrescreve (l.108) o que `aplicar_matriz.py:89` havia posto. E porque
`estender_schema()` volta a declarar o campo como `string`, invalidando as 144 adaptadas que o
gravam como objeto. O pipeline reporta "770/914 OK" no meio de 18 linhas de estatística e sai
com código 0.

### 3.7 Não idempotência: re-rodar um extrator apaga a deduplicação

`deduplicar.py --aplicar` (l.87-98) **muta os arquivos intermediários in place**, marcando
`descartada: true`. Os extratores reescrevem os mesmos arquivos do zero. Testado:

```
ANTES:  descartadas = 16          (intermediario/simulados2026.json)
$ python3 scripts/extrair_simulados.py ; echo $?
0
DEPOIS: descartadas = 0  | campo 'descartada' existe? False
```

Re-rodar o extrator apaga as 16 marcas de duplicata. Se o montador rodar em seguida, **as 16
questões que o Simulado 02 reaproveitou do Revalida entram no banco duas vezes** — sem erro, sem
aviso, exit 0. O mesmo vale para `aplicar_gabarito_revalida.py:71-72`, que reescreve `descartada`
por conta própria.

### 3.8 Erros que passam em silêncio — inventário

| local | padrão | efeito |
|---|---|---|
| `montar_canonico.py:135`, `_simulados.py:148`, `_generico.py:195`, `_adaptado.py:235` | `except Exception as ex: erros.append(str(ex))` | questão descartada do banco; só aparece em stdout; exit 0 |
| `montar_canonico_generico.py:208-211`, `_adaptado.py:243-246` | `for e in erros[:10]` / `[:15]` | com mais de 10 (ou 15) falhas, as demais **nem são impressas** |
| `montar_canonico_generico.py:228-229`, `_adaptado.py:264-265` | `except ImportError: pass` | sem `jsonschema` instalado a validação **não acontece e nada é dito** |
| `consolidar_banco.py:68-69` | `except ImportError: pass` | a **validação final do banco** desaparece em silêncio |
| `montar_canonico_generico.py:189-190`, `_simulados.py:145`, `montar_canonico.py:131` | `if not e: continue` | questão sem enriquecimento sai do banco; vira "seleção de fonte" (§3.1) |
| `aplicar_especialidade.py:94-96`, `aplicar_matriz.py:80-82` | `sem.append(idg); continue` | ancoragem ausente é contada mas não é erro |
| `ampliar_vocabulario.py:115-119, 145-146` | `if not r: continue` / `if not cf: continue` | reclassificação silenciosamente não aplicada se a questão ainda não tem `classificacao_fina` — mais uma dependência de ordem |
| `anexar_imagens.py:118-119, 176-177` | `if not os.path.exists(...): continue` | PDF de origem ausente → nenhuma imagem, nenhum aviso |
| `deduplicar.py:60-61` | `if not os.path.exists(caminho): continue` | intermediário faltando → deduplicação parcial silenciosa |
| todos os 23 | ausência de `sys.exit(1)` | orquestrador nunca detecta falha |

**Valor default que mascara falha:** `extrair_docx.py:306` — `resolver_gabarito()` devolve `None`
quando as três estratégias falham, e `extrair_simulados_nacionais.py:483` grava
`"n_alternativas": len(prova["letras"])` — o valor **declarado no perfil**, não o contado no
texto. Se o parser achar 3 alternativas, o campo dirá 5. (Nos dados atuais isso não ocorre:
`n_alternativas` bate com a contagem real em 921/921 registros — mas o campo não é uma medida,
é uma constante.)

---

## 4. Estágios candidatos a eliminação ou fusão

| estágio | o que faz | resultado usado adiante? | o que se perde ao remover |
|---|---|---|---|
| **`montar_canonico_simulados.py`** (182 l.) | monta canônico dos Simulados 2026 | sim — `simulados2026.canonico.json` | **Nada.** Provado: `generico` gera as 84 questões com os 24 campos idênticos, exceto o sufixo `" do simulado"` na string `referencia`. Mover `normalizar_texto` (7 linhas) para o módulo comum e passar `--referencia-sufixo`. |
| **`montar_canonico.py`** (165 l.) | monta canônico do ENAMED | sim — e é importado por `_generico` e `_simulados` | **Nada de comportamento.** `generico` + 6 linhas de adaptador (`id_origem` no extrator) gera as 90. Ganha-se de brinde a normalização de alternativas que hoje falta. Preservar `AREA2UC`, `BLOOM`, `DIFIC`, `split_vinheta` num `comum.py`. |
| **`montar_canonico_adaptado.py`** (270 l.) | monta as 144 adaptadas com anti-plágio e validação da Portaria | sim | Lógica real e valiosa: janela de 9 palavras, posição sorteada por hash, validação dos 4 eixos da 478. **Não eliminar — fundir** como `--modo adaptado` do montador único, reaproveitando envelope + validação (economia de 56 l.). |
| **`aplicar_especialidade.py`** + **`aplicar_matriz.py`** + **`ampliar_vocabulario.py`** | 3 passadas sobre os mesmos 7 arquivos canônicos, escrevendo dentro de `classificacao_fina` | sim | Nada. São três leituras/escritas do mesmo conjunto de arquivos com dependência de ordem não declarada (§3.6) e duas mutações do schema (§3.5). **Fundir em um `aplicar_classificacao.py`** que monta `classificacao_fina` completo de uma vez e **não escreve no schema**. Elimina a classe inteira de bug da §3.6. |
| **`recuperar_conteudo_fichas.py`** (154 l.) | reabre os mesmos `.docx` para ler o cabeçalho "ÁREA – CONTEÚDO – AUTOR" e casa por similaridade de enunciado (`SequenceMatcher`, l.113) | sim — `conteudo_fichas.json` | Nada. `extrair_docx.py` já lê `word/document.xml` desses arquivos e já tem os índices dos blocos (`inicios`, l.315). Ler o cabeçalho ali custa ~15 linhas e **dispensa o casamento fuzzy inteiro** — que hoje descarta silenciosamente o que fica abaixo de 0,75 de similaridade (l.116-118). |
| **`aplicar_gabarito_revalida.py`** (89 l.) | aplica o gabarito do INEP ao `revalida.json` já gravado | sim | Nada. É um segundo passe sobre o arquivo que `extrair_revalida.py` acabou de escrever. Fundir: o extrator lê os dois PDFs de gabarito e grava tudo de uma vez. Remove uma escrita/releitura e a reescrita de `descartada` (§3.7). |
| **8 pastas `lotes_*`** (73 arquivos) | insumo do passo de enriquecimento por IA | **não** — nenhum script escreve, nenhum script lê | Nada, em código. São artefatos de um passo manual. Devem sair de `intermediario/` (que é o espaço de dados do pipeline) e ir para `prompts/` ou serem gerados por um `preparar_lotes.py` — hoje **não são reprodutíveis**. |
| **`extrair_simulados.py`** (203 l.) vs **`extrair_simulados_nacionais.py`** (621 l.) | dois extratores de PDF de 2 colunas | sim, ambos | O primeiro é subconjunto do segundo em de-columnização (`melhor_linearizacao` escolhe entre duas estratégias e pontua; `decolumnize` tem uma só). **Fundir** com um perfil declarativo por prova — a estrutura já existe em `PROVAS` (l.367-403). |
| **`checar_adaptadas.py`** (116 l.) | QA das adaptadas (maior subsequência comum, convergência de tema, cobertura) | **não** — só imprime | Manter. É o único estágio de QA real do pipeline. Mas **deve retornar exit != 0** quando encontrar sobreposição acima do limiar; hoje sempre sai 0. |
| **`extrair_matriz_478.py`** (158 l.) | constrói `referencia/matriz_enamed_478_2025.json` do PDF da Portaria | sim, como referência | Manter, mas **fora do pipeline**: roda uma vez por norma, não por execução. |

### 4.1 Desenho enxuto proposto

**De 23 scripts → 11 arquivos. De ~20 estágios → 8 estágios no caminho principal.**

```
comum.py                    biblioteca (não é estágio): norm/desLatex/ligaduras unificados,
                            corrigir_quebras, requer_imagem (UM detector), split_vinheta,
                            AREA2UC/BLOOM/DIFIC, normalizar_tag, envelope_canonico(),
                            validar_contra_schema()  — schema é READ-ONLY

 1. extrair_pdf.py          ENAMED + Revalida (+gabarito) + Simulados 2026 + Nacionais + FPS,
                            dirigido por perfis declarativos (o padrão de `PROVAS`)
 2. extrair_docx.py         3 .docx + cabeçalho ÁREA/CONTEÚDO/AUTOR (absorve recuperar_conteudo_fichas)
 3. extrair_latex.py        TPMed 2022 e 2025 (o reparo de diacríticos é genuinamente distinto)
      ↓  intermediario/<fonte>.json  — UM contrato só
 4. validar_intermediario.py   [NOVO, ~70 l.] gabarito ∈ alternativas, enunciado não vazio,
                               n_alternativas = contagem real, sem resíduo de extração.
                               exit 1 se falhar.
 5. deduplicar.py           grava marcas num arquivo SEPARADO (`duplicatas.json`),
                            nunca mutando o intermediário  → resolve §3.7
 6. montar_canonico.py      ÚNICO. --perfil <fonte> | --modo adaptado.
                            Normaliza tags contra vocabulário controlado. exit 1 se rejeitar item.
 7. aplicar_classificacao.py  especialidade + matriz 478 + vocabulário, UMA passada, sem tocar no schema
 8. anexar_imagens.py       usa o requer_imagem de comum.py, não sobrescreve
 9. consolidar_banco.py     valida contra o schema ORIGINAL. exit 1 se 1 questão falhar.
10. relatorio_curadoria.py
11. trilha_adaptacao.py     apurar_consenso + preparar_adaptacao + checar_adaptadas (só para
                            fontes sem gabarito oficial)
     (extrair_matriz_478.py sai do pipeline: utilitário de referência, roda por norma)
```

Estágios do caminho principal: **extrair → validar → deduplicar → montar → classificar →
imagens → consolidar → relatar** = 8.
Pastas em `intermediario/`: de 20 para 6 (`<fonte>.json` × 6 + `enriquecimento/<fonte>/` +
`adaptacao/`), com os `lotes_*` movidos para fora.

O mesmo `banco-completo.json` de 914 questões sai desse desenho — com quatro diferenças, todas
melhorias: as 4 alternativas com resíduo de extração seriam barradas no estágio 4; a questão
`clm_napisul2_2026_q074` seria corrigida em vez de sumir; `requer_imagem` teria um valor só; e
as 670 questões com tag ambígua teriam vocabulário único.

---

## 5. O que está bom e deve ser preservado

1. **A separação extração / enriquecimento / montagem canônica é a arquitetura certa.** Os três
   níveis existem e as fronteiras são claras. O problema é a falta de contrato *entre* eles, não
   a divisão.

2. **A regra "a correta é sempre a letra do gabarito oficial" é aplicada por código, não por
   convenção.** Os quatro montadores derivam `correta` de `rec["gabarito"]` e nenhum aceita a
   opinião do enriquecedor. `montar_canonico_generico.py:58` recusa explicitamente descartar a
   correta. Isso é a decisão de desenho mais importante do pipeline e está certa.

3. **`AREA2UC` é fonte única de verdade e funciona.** 914/914 questões têm `(fase_alvo, uc_slug)`
   exatamente igual a `AREA2UC[area_clinica]`. É a prova de que o padrão de módulo compartilhado
   resolve — e o modelo a estender para tags, `requer_imagem` e normalização.

4. **A qualidade da extração é alta e mensurável.** Das 921 questões válidas nos intermediários:
   0 com enunciado vazio, 0 com alternativa faltando, 0 com `n_alternativas` divergente da
   contagem real, **1** com gabarito fora das alternativas. Os parsers de PDF são o trabalho mais
   difícil desta pasta e estão bem-feitos — em particular a de-columnização por duas estratégias
   com escolha por pontuação (`extrair_simulados_nacionais.melhor_linearizacao`), a detecção de
   alternativas de trás para frente no Revalida (`localizar_alternativas`, l.177-208, que evita o
   falso positivo clássico das linhas iniciadas por "A "), e o reparo de diacríticos do LaTeX no
   TP 2022. **Nada disso deve ser reescrito** — deve ser reorganizado atrás de perfis.

5. **`_proveniencia` é excelente e não tem equivalente na maioria dos pipelines.** Registra
   remapeamento 5→4, gabarito original e novo, motivo do descarte, defeito detectado na origem,
   posição redistribuída, status da imagem, e — nas adaptadas — o item que inspirou, o consenso
   dos três juízes e o aviso de que a chave não é oficial. É auditável de ponta a ponta. Manter
   integralmente.

6. **A distinção entre gabarito oficial e chave por consenso é rigorosa.** `apurar_consenso.py`
   fixa as regras de decisão *antes* de ver os resultados (l.12-16), descarta 2/3 quando a
   divergente tem confiança alta, e `preparar_adaptacao.py` explica por que adaptar em vez de
   importar. As 150 sem gabarito nunca entraram no banco com chave inventada. Isso é integridade
   metodológica e é raro.

7. **O anti-viés de posição é determinístico e reproduzível.** Posição da correta por
   `md5(id_origem) % 4` (`montar_canonico_generico.py:75`, `preparar_adaptacao.py:76`), com o
   remapeamento registrado. Resolve um problema real (175 de 176 fichas NAPISUL com a correta em
   "A") sem introduzir aleatoriedade não reproduzível.

8. **`checar_adaptadas.py` faz QA de segunda ordem** — mede a maior subsequência comum contra o
   original (régua mais fina que a do montador), procura convergência entre adaptadas escritas em
   paralelo e mede cobertura de tema contra o banco. E o comentário em `campos_de()` (l.53-56)
   documenta um falso positivo já cometido e corrigido. Manter e dar exit code.

9. **Os comentários explicam o *porquê*, não o *o quê*.** `extrair_revalida.py:66-69` explica por
   que `esquema` ficou fora da lista de indícios visuais; `extrair_simulados.py:61-62` explica por
   que "com um" não vira "comum"; `ampliar_vocabulario.py:19-21` justifica reclassificar caso a
   caso em vez de por regex. Esse padrão deve sobreviver a qualquer refatoração.

10. **`AUDITORIA-FONTES.md` é modelo de auditoria negativa** — documenta os 16 arquivos que *não*
    tinham questão, com o método usado em cada um. E `extrair_matriz_478.py:116-119` registra que
    a taxonomia institucional fala em "20 competências ENAMED" quando a Portaria tem 15, em vez de
    acomodar a divergência em silêncio.

---

## Anexo — como reproduzir as medições

Scripts em `scratchpad/`:
- `medir_dup.py` — clones exatos entre todos os pares de scripts (§1.3, §2.1).
- `medir_funcs.py` — similaridade das funções homônimas, com e sem anonimização de
  identificadores; contagem do envelope e do bloco jsonschema (§1.3, §2.2).
- `medir_img.py` — aplica os 6 detectores `requer_imagem` às 914 questões (§3.2).

Experimentos em sandbox (`scratchpad/sandbox`, `scratchpad/sandbox2`): reprodução da saída do
montador genérico contra os montadores dedicados (§1.3), inversão da ordem
`aplicar_matriz` / `aplicar_especialidade` (§3.6), re-execução de `extrair_simulados.py` sobre
intermediário deduplicado (§3.7).

Não medido / limitações declaradas:
- Duplicação semântica entre as implementações de de-columnização (§2.3).
- Boilerplate dos 23 `main()` (1.284 linhas somadas) — não separei relatório de andaime.
- Não executei os extratores de PDF de ponta a ponta (dependem de `pypdf`/`PIL` e dos PDFs
  originais); as medições de extração vêm dos intermediários já gravados.
