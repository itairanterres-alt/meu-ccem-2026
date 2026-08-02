# Perfil empírico do item ENAMED — referência de forma

Este arquivo não é opinião sobre "como deveria ser" um item ENAMED. É a **medição
do que o ENAMED de fato é**, feita sobre as provas oficiais. Onde a Skill precisar
decidir uma questão de forma (o enunciado termina em "?" ou não? quantas palavras
tem a vinheta? a correta pode ser mais longa?), a resposta está aqui, não na
intuição do modelo.

## Corpus medido

| Corpus | Itens | Papel |
|---|---|---|
| **ENAMED 2025 — Caderno 1** | 90 (das 100; 10 anuladas) | **fonte primária** |
| Revalida 2023.2 + 2024.1 | 186 | corpus secundário — mesma Matriz de Referência (Portaria Inep nº 478/2025) |

Origem: `adequacao-enamed/fontes/` e `adequacao-enamed/canonico/` (extração
determinística do PDF oficial do Inep, casada com o gabarito oficial). Todos os
números abaixo vêm de contagem sobre esse texto — nenhum é estimativa.

---

## 1. O achado que mais contraria a intuição: o comando é majoritariamente por completamento

| Tipo de comando | ENAMED 2025 | Revalida |
|---|---|---|
| **Completamento** (termina sem "?", a alternativa completa a frase) | **54/90 — 60%** | 124/186 — 67% |
| Interrogativo (termina em "?") | 36/90 — 40% | 61/186 — 33% |
| Terminado em dois-pontos | 0 | 1 |

O formato dominante do ENAMED **não** é a pergunta direta. É a frase truncada que
a alternativa completa:

> ...Para melhorar o controle da HAS e o prognóstico da paciente, o tratamento com
> inibidor da enzima conversora de angiotensina foi mantido, e o especialista optou
> por associar determinado fármaco, devido ao impacto positivo no prognóstico de
> sobrevida dessa paciente. **O fármaco introduzido no tratamento da paciente foi**
>
> (A) espironolactona.
> (B) clortalidona.
> (C) hidralazina.
> (D) clonidina.

Fechos de comando efetivamente usados: `...a conduta adequada é`, `...o fármaco
introduzido no tratamento da paciente foi`, `...a principal hipótese diagnóstica é`,
`...o médico de família e comunidade deve`, `...o tratamento recomendado para o caso
clínico será`, `...os dados devem ser plotados nas`, `...são, respectivamente,`.

**Consequência para a redação:** o item por completamento é uma frase única. As
alternativas começam em **minúscula** e terminam em **ponto**, porque são a
continuação gramatical do enunciado.

**Consequência para a validação — regra nova e específica do português:** num item
por completamento, gênero, número e regência das quatro alternativas precisam
concordar com o fecho do enunciado. Se o enunciado termina em "...o fármaco
introduzido foi" e três alternativas são substantivos femininos e uma é masculina,
a concordância entrega a resposta. Essa falha (*grammatical cue*, na taxonomia
NBME) **não existe** em enunciado interrogativo e passa a ser o principal risco de
test-wiseness quando se adota o completamento.

## 2. Extensão

| Medida (palavras, vinheta + comando) | ENAMED 2025 | Revalida |
|---|---|---|
| Mediana | **86** | 102 |
| Média | 89 | 109 |
| p10 – p90 | 51 – 133 | 60 – 167 |
| Mín – Máx | 30 – 203 | 16 – 286 |

O ENAMED avalia o **egresso**. Uma prova interna de ciclo básico não deve copiar
esses números; deve copiar a *disciplina* deles — economia narrativa, nada de
vinheta de 200 palavras como padrão.

## 3. Alternativas

- **4 alternativas em 100% dos itens** (90/90 e 186/186). Confirma o padrão ABDC.
- Extensão média da alternativa: **11,3 palavras** (mediana 9).
- Razão entre a extensão da correta e a média dos distratores: **mediana 1,00,
  média 0,99**. O ENAMED real é bem equilibrado — a correta *não* é sistematicamente
  mais longa.
- Porém **21% dos itens** (19/90) caem fora da faixa 0,70–1,30. Ou seja: a faixa é
  um bom alvo, mas violá-la pontualmente não é defeito. Por isso ela é **aviso**, e
  não erro, no validador.
- Alternativas de múltiplos elementos ("diagnóstico; exame; tratamento —
  respectivamente") são um padrão ENAMED legítimo e frequente.

## 4. Posição do gabarito

| | A | B | C | D |
|---|---|---|---|---|
| ENAMED 2025 | 21 | 24 | 23 | 22 |
| Revalida | 47 | 45 | 47 | 47 |

Distribuição uniforme. O aluno treinado no padrão ENAMED não encontra viés de
posição — e o banco institucional que alimenta o treino não pode ter esse viés
tampouco.

## 5. Termos que a Skill proíbe — frequência real no ENAMED

| Termo | ENAMED 2025 | Revalida | Leitura |
|---|---|---|---|
| `EXCETO` | **0%** | 2% | Proibição confirmada pela fonte canônica. |
| `incorreto` | **0%** | 0% | Idem. |
| `assinale` | 6% (5 itens) | 17% (31 itens) | **O ENAMED usa.** A proibição da Skill é mais estrita que a fonte — e é uma escolha deliberada, ver abaixo. |
| `mais provável` / `mais adequada` | 6% / 6% | 11% / 4% | Superlativo ancorado é padrão, não defeito. |
| `sempre` / `nunca` | 1% / 4% | 2% / 2% | Aparecem, geralmente em uso legítimo. |

**Sobre `assinale`:** dos 5 casos no ENAMED 2025, dois são "assinale a alternativa
correta" — um comando que não permite ao estudante formular a resposta antes de ler
as opções, violando frontalmente a *cover-the-options rule* do NBME. A Skill mantém
a proibição **por opção pedagógica declarada**, não porque o ENAMED não use. Isso
precisa ser dito honestamente: aqui a Skill segue o NBME contra a prática do ENAMED,
e é o único ponto em que ela o faz.

## 6. Anatomia gráfica

No caderno oficial o item é um **bloco corrido**: parágrafo(s) de vinheta, frase de
comando e alternativas rotuladas `(A)` a `(D)`. Não há separação tipográfica entre
"texto-base" e "enunciado" — a distinção é analítica, não visual (só 6 dos 90 itens
têm estímulo destacável, tipicamente tabela de exames com valores de referência).

Valores laboratoriais aparecem **com unidade e faixa de referência ao lado**:

> Hemoglobina 8,4 g/dL (11,5 a 15,5 g/dL) · VCM 62 fL (80 a 98 fL) · RDW ...

## 7. Checklist de conformidade ENAMED (derivado das medições)

Ao emitir um item, confira:

1. Exatamente 4 alternativas, uma correta. *(100% da fonte)*
2. Comando fechado — o estudante formula a resposta antes de ler as opções.
3. Se por completamento: alternativas em minúscula, terminadas em ponto, **e
   concordância gramatical idêntica nas quatro**.
4. Vinheta enxuta; mediana-alvo próxima de 86 palavras para item de fim de curso,
   proporcionalmente menor no ciclo básico.
5. Alternativas homogêneas e de extensão comparável (alvo 0,70–1,30; fora disso,
   justifique).
6. Sem `EXCETO`, sem construção negativa, sem "assinale a alternativa correta".
7. Exames laboratoriais com unidade e valor de referência.
8. Superlativo ancorado no caso é bem-vindo; superlativo sem âncora, não.
