# Dimensões de análise — Bloom, competência DCN, dificuldade, Matriz ENAMED 478/2025

Fonte dos valores: `capi-questoes-enamed/references/taxonomia_med_unidavi_*.json` (resolvido por
glob, versão mais recente — nunca fixe o semestre no nome), seção `enums` e
`competencias_dcn_2025_referencia`. Use os valores literais; nunca invente rótulos.

## Nível de Bloom
Enum: `conhecimento`, `compreensao`, `aplicacao`, `analise`, `sintese`, `avaliacao`.

Como classificar uma questão:
- **conhecimento** — recordar fato/definição. "Qual é a definição de...".
- **compreensao** — explicar com palavras próprias, interpretar. "Explique por que...".
- **aplicacao** — usar conceito em situação nova. Vinheta clínica onde o aluno aplica um princípio a um caso.
- **analise** — decompor, relacionar partes, diferenciar. "Correlacione o achado X com o mecanismo Y".
- **sintese** — integrar elementos num todo novo, propor. Menos comum em MCQ.
- **avaliacao** — julgar com critérios, decidir a melhor conduta justificando. "Qual a conduta mais adequada e por quê".

Alinhamento verbo do OA × Bloom da questão: se o OA usa "analisar/correlacionar/avaliar/diferenciar" mas todas as questões que o cobrem são de conhecimento/compreensão, há **lacuna de profundidade** — o OA está "coberto" mas não no nível cognitivo que pede. Sinalize.

## Competência DCN 2025
Enum: `dcn2025_comp_01` a `dcn2025_comp_27`. As 27 competências do Art. 8º da Res. CNE/CES nº 3/2025.

Cada competência tem `area_eixo_principal` (atencao_saude | gestao_saude | educacao_saude) e `area_eixos_secundarios`.

**Cuidado obrigatório:** a própria taxonomia registra que o mapeamento competência→eixo é INTERPRETATIVO e "recomenda-se validação pelo NDE antes de uso operacional pleno". Ao apresentar cobertura por eixo, deixe claro que é sugestão, não classificação oficial.

**Não confundir:** as 27 competências DCN (matriz de FORMAÇÃO) são distintas das competências ENAMED (matriz de AVALIAÇÃO, Portaria INEP 478/2025, ver seção seguinte). Esta seção é sobre as 27 DCN.

Diagnóstico: liste quais competências a prova avalia e quais ficam descobertas. Numa AC de UC específica, é normal cobrir só um subconjunto — o objetivo não é cobrir todas as 27 numa prova, mas ver se o perfil de competências avaliado condiz com a natureza da UC.

## Matriz ENAMED 478/2025 (avaliação) — quando disponível

Fonte: `classificacao_fina.matriz_enamed_478_2025` de cada questão (schema em
`capi-questoes-enamed/references/schema_questao_med_unidavi.json`), com rótulos por extenso em
`capi-questoes-enamed/references/matriz_enamed_478_2025.json`. Bloco opcional — nem toda questão
do lote vai ter essa classificação (questões antigas, importadas de outra fonte, ou geradas antes
da v2.0 da `capi-questoes-enamed` normalmente não têm).

Estrutura: `area` (`enamed_area_01`.._07, Art. 3º), `competencias[]` (`enamed_comp_01`.._15,
Art. 6º), `conteudos[]` (`enamed_cont_01`.._21, Art. 8º), `cenario` (`enamed_cenario_01`.._06,
Art. 7º).

Esta é a dimensão que de fato mede alinhamento com a matriz do exame — a competência DCN (seção
anterior) é FORMAÇÃO, não AVALIAÇÃO, e serve só como proxy aproximado. Ao diagnosticar:
- Reporte cobertura por área/competência/conteúdo/cenário ENAMED separadamente da cobertura DCN.
- Para questões sem `classificacao_fina.matriz_enamed_478_2025`, reporte como "não classificado" —
  nunca infira a matriz 478 a partir do enunciado ou do tema. A classificação exige o bloco
  estruturado; aproximar por leitura livre reintroduziria exatamente a suposição não ancorada em
  documento que o princípio 4 da Skill proíbe.
- Se nenhuma questão do lote tiver essa classificação, diga isso explicitamente e omita a
  dimensão do relatório em vez de preenchê-la com "0% cobertura" (que sugeriria uma medição real
  onde não houve nenhuma).

## Dificuldade editorial
Enum: `facil`, `medio`, `dificil`.

É julgamento editorial do elaborador, não índice psicométrico (o índice de dificuldade real vem depois, da análise das respostas). Distribuição saudável costuma ter os três níveis representados. Sinalize:
- prova sem itens `dificil` → não discrimina os melhores alunos;
- prova sem itens `facil` → pode desmotivar e não medir domínio básico;
- concentração total em `medio` → baixo poder discriminante (foi o padrão observado na AC UC2 T18, amplitude de só 6 pontos).

## Como exibir
Além da matriz OA × cobertura, apresente:
- um resumo do perfil de Bloom (contagem por nível);
- a lista de competências DCN cobertas/descobertas;
- a distribuição de dificuldade;
- quando houver dado, a cobertura por área/competência/conteúdo/cenário ENAMED 478/2025, e quantas questões do lote ficaram "não classificado" nessa dimensão.
Use gráficos simples quando ajudar; tabela quando o detalhe por questão importa.
