# Auditoria da fábrica de questões

**Data:** 2 de agosto de 2026
**Objeto:** o pipeline `adequacao-enamed` e o banco de 914 questões que ele produz
**Pergunta:** a fábrica ficou grande demais, e é por isso que ela falha?

---

## Resposta curta

**A fábrica é grande demais — mas não é o tamanho que gera as falhas.** São três
causas distintas, e só uma delas tem a ver com tamanho:

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

Lição de desenho: quando um estágio novo passa a emitir um campo, o schema tem de
ser alterado no mesmo commit. Hoje não há nada que force isso.

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

Qualquer filtro por tag no app vê essas como coisas diferentes. É a consequência
mais concreta de ter N caminhos em vez de um com normalização única.

---

## 7. O que **não** é problema

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

---

## 8. Recomendações, em ordem de retorno

1. **Fechar o contrato (feito).** `classificacao_fina` tipada no schema. Regra a
   adotar: estágio que emite campo novo altera o schema no mesmo commit.
2. **Porteiro na entrada, com rótulo de procedência.** Validar cada fonte na
   importação e gravar a taxa de defeito medida no próprio item. Um simulado com
   31% de defeito não pode entrar no banco com o mesmo rótulo do ENAMED oficial.
   Sugestão de campo: `qualidade_origem` (oficial_inep / institucional / simulado)
   + `defeitos_herdados`, para que a curadoria priorize.
3. **Desacoplar `fase_alvo` de `area_clinica`.** Enquanto a fase for derivada,
   metade do curso fica sem banco. Esta é a decisão de maior impacto no "Meu Treino"
   e não custa código — custa critério.
4. **Estender o estágio de adaptação.** É o que produz os melhores itens (3% de
   defeito) e cobre 16% do acervo. Priorizar as fontes de pior taxa (simulados,
   TPMed 2025, TP 2022) dá o maior ganho por item reescrito.
5. **Corrigir a instrução de formato do comando** nos prompts de adaptação, do mesmo
   jeito que foi corrigido na skill (§4a da SKILL.md v2.0). Hoje a adaptação
   descaracteriza o padrão que deveria preservar.
6. **Normalizar o vocabulário de tags** — uma convenção só, um passo de normalização
   único, e um vocabulário controlado. 2.754 tags para 914 questões não é
   indexação, é ruído.
7. **Consolidar os caminhos paralelos** em um pipeline com adaptadores de entrada.
   Isso é o item de "tamanho" propriamente dito. Vale fazer, mas depois de 1 a 5 —
   é o que menos afeta a qualidade do que sai hoje.
