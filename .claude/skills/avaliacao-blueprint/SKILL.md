---
name: avaliacao-blueprint
description: Monta o blueprint de cobertura temática de uma avaliação MED-UNIDAVI — mapeia as questões dos tutores contra os Objetivos de Aprendizagem (OAs) de uma UC, identifica lacunas (OA sem questão) e redundâncias (OA com excesso), e orienta a geração de questões para preencher as lacunas via a skill capi-questoes-enamed. Use SEMPRE que o usuário pedir para "fazer o blueprint", "mapear cobertura", "ver quais OAs estão cobertos", "analisar as questões dos tutores", "ver o que falta na prova", "analisar redundância entre questões", "diagnosticar a avaliação", "montar a matriz de referência", ou quando fornecer um conjunto de questões de uma UC e pedir análise de cobertura — mesmo que não diga "blueprint" explicitamente. Também dispara ao avaliar propostas de retirar/incluir questões numa prova já montada. Ancora tudo no banco oficial de OAs; nunca inventa objetivo de aprendizagem.
---

# Blueprint de Avaliações — MED-UNIDAVI

Monta o mapa de cobertura temática de uma avaliação cognitiva (AC): cada Objetivo de Aprendizagem (OA) de uma Unidade Curricular (UC) versus as questões que o cobrem. Serve para o docente ver, antes de aplicar a prova, o que está coberto, o que ficou de fora e o que está redundante — e para decidir com fundamento sobre inclusões e retiradas.

O produto final não é só o diagnóstico: é **a avaliação com cobertura adequada dos OAs**. Quando há lacuna, a skill orienta a geração de questões para preenchê-la (via `capi-questoes-enamed`), sempre com curadoria humana obrigatória.

## Princípios inegociáveis

1. **Ancoragem no banco oficial.** O universo de OAs vem de `capi-questoes-enamed/references/oas_med_unidavi_*.json` (resolva pelo padrão glob, use o de semestre mais recente — nunca fixe o nome de um semestre específico, ver `references/estrutura_oas.md`) — nunca de interpretação livre. Se um OA não está no banco, não existe para fins de blueprint. Se uma SP tem `objetivos_aprendizagem: []`, sinalize "OAs não cadastrados no banco", não "sem lacunas".
2. **Cobertura ≠ saturação.** O alvo é cobrir os OAs, não esgotar o conteúdo das aulas nem se limitar a elas. Os alunos estudam pela bibliografia das SPs; uma questão pode cobrir um OA a partir de fonte que não está no PPTX da conferência.
3. **Curadoria humana inegociável.** A skill mapeia, diagnostica e gera rascunhos. A decisão clínico-pedagógica — aprovar questão, aceitar mapeamento ambíguo, retirar item — é do docente.
4. **Documento acima de suposição.** Toda conclusão rastreia a um dado concreto: o texto do OA, o enunciado da questão, a resposta do aluno. Análise "etérea" não ancorada em documento é erro. Quando confrontada com evidência contrária a uma conclusão anterior, revise-a — não a confirme por inércia.
5. **Padrão institucional.** Avaliação qualitativa S/PM/I (Suficiente / Precisa Melhorar / Insuficiente) é incompatível com rubrica numérica. Questões objetivas seguem padrão ABDC/ENAMED (4 alternativas A–D). Se a prova em análise usa 5 alternativas, sinalize a divergência — não a replique silenciosamente ao gerar novas.
6. **Cobertura é multidimensional.** "OA coberto" não basta. Um OA coberto só por questões de nível Bloom baixo (conhecimento/compreensão) tem lacuna de profundidade cognitiva. Uma prova toda em dificuldade média não discrimina desempenho. O blueprint cruza cobertura temática com nível de Bloom, competência DCN, dificuldade editorial e — quando o dado existir — a Matriz ENAMED 478/2025 (§ "Dimensões de análise").

## Fluxo em 4 fases

### Fase 1 — Carregar o universo de OAs

Pergunte (ou infira do contexto) **fase + UC**. Ex.: F1/UC2.

Leia o banco de OAs mais recente (`capi-questoes-enamed/references/oas_med_unidavi_*.json`, resolvido por glob — imprima qual arquivo foi usado) e extraia todas as SPs da UC, com seus OAs (slug, número, texto). Esse é o universo completo — o denominador do blueprint.

Se os `references/` da `capi-questoes-enamed` não estiverem acessíveis na sessão, peça ao usuário o arquivo `oas_med_unidavi_*.json` (upload ou Filesystem). Sem o banco, não prossiga inventando OAs.

Detalhes de navegação do JSON: veja `references/estrutura_oas.md`.

### Fase 2 — Mapear questões → OAs (com atributos)

Receba as questões dos tutores. Formatos comuns: `.docx` (uma prova), `.xlsx` (export do Google Forms — colunas de conteúdo a partir da 5ª, cada coluna = um item), texto colado.

Para cada questão:
- Identifique o **OA que ela cobre** (slug canônico). Uma questão pode tocar mais de um OA; registre o principal e os secundários.
- Registre **autoria** (tutor) e **formato** (MCQ com vinheta / MCQ conceitual / discursiva / associação de colunas / V-F).
- Classifique os **três atributos** (valores exatos da taxonomia — nunca invente):
  - **Nível de Bloom**: conhecimento, compreensao, aplicacao, analise, sintese, avaliacao. Uma vinheta que exige integrar dados clínicos é aplicacao/analise; uma que pede definição é conhecimento/compreensao.
  - **Competência DCN**: dcn2025_comp_01 a _27. Registre a(s) competência(s) que a questão avalia.
  - **Dificuldade editorial**: facil, medio, dificil.
- Se a questão já vier classificada por `classificacao_fina.matriz_enamed_478_2025` (saída da `capi-questoes-enamed` v2.0 ou de provas já adequadas), registre também área/competências/conteúdo/cenário ENAMED — sem essa classificação prévia, não infira a matriz 478 a partir do texto; deixe a dimensão como "não classificado" (ver `references/dimensoes_analise.md`).
- Aplique o **teste de aterrissagem**: "o que a questão cobra está no texto do OA?" Se a questão não corresponde a nenhum OA da UC, sinalize.

Como ler os arquivos: `references/leitura_arquivos.md`. Valores dos enums e cuidados: `references/dimensoes_analise.md`.

### Fase 3 — Diagnosticar (multidimensional)

Produza o **blueprint de cobertura temática**: para cada OA, o status (coberto / parcial / lacuna / não cadastrado — critérios em `references/criterios_diagnostico.md`).

E os **diagnósticos de dimensão**:
- **Perfil de Bloom** — distribuição das questões pelos 6 níveis. Sinalize concentração excessiva em níveis baixos (prova que só cobra memorização) e OAs cobertos apenas em nível baixo quando o verbo do OA pede mais ("analisar", "avaliar", "correlacionar" pedem Bloom alto).
- **Cobertura por competência DCN (formação)** — quais das 27 competências a prova avalia e quais ficam de fora. Nota: o mapeamento competência→eixo da taxonomia é interpretativo e "recomenda-se validação pelo NDE" — apresente como sugestão, não como definitivo.
- **Distribuição de dificuldade** — proporção fácil/médio/difícil. Uma prova sem itens difíceis não discrimina os melhores; sem fáceis, desmotiva. Sinalize desequilíbrios.
- **Cobertura pela Matriz ENAMED 478/2025 (avaliação), quando disponível** — distinta da competência DCN (formação, ver `references/dimensoes_analise.md`): áreas (Art. 3º), competências (Art. 6º), cenários/redes (Art. 7º) e conteúdos/domínios (Art. 8º) efetivamente cobertos pelas questões que já carregam `classificacao_fina.matriz_enamed_478_2025`. Esta é a dimensão que de fato mede alinhamento ENAMED — a competência DCN é só um proxy aproximado. Se nenhuma questão do lote tiver essa classificação, declare a dimensão como indisponível em vez de aproximar pela DCN.

E o **diagnóstico de redundância**: OAs com excesso de questões. Ao avaliar retirada, considere também as dimensões — retirar a única questão de Bloom alto de um OA empobrece a profundidade mesmo que o OA continue "coberto".

Quando o usuário propõe retirar/incluir questões: avalie o impacto em TODAS as dimensões antes de opinar. Se a retirada proposta descobre um OA, ou remove o único item de Bloom alto, ou desbalanceia a dificuldade, diga qual é o custo. Se o usuário tem razão numa defesa, diga que tem — e proponha cortar na redundância real.

Critérios detalhados: `references/criterios_diagnostico.md` e `references/dimensoes_analise.md`.

### Fase 4 — Gerar questões para as lacunas

Para cada lacuna priorizada pelo docente, gere questão delegando à skill `capi-questoes-enamed` (padrão ABDC, vinheta quando há raciocínio clínico, justificativa por alternativa, status pendente de curadoria). Passe o slug do OA e o material-fonte quando houver.

Respeite a regra de recusa da `capi-questoes-enamed`: se o OA não tem lastro no material fornecido, sinalize a lacuna de fonte em vez de preencher com conhecimento geral.

Não auto-aprove. Toda questão gerada nasce pendente de curadoria.

## Saídas

Sugira o formato conforme o caso, não imponha:
- **Tabela no chat** — sempre, como diagnóstico primário. Use o visualizador para a matriz de cobertura (verde/âmbar/vermelho por OA, com autoria).
- **PDF** — quando for compartilhar com tutores/reunião. Layout limpo, legenda, uma página quando possível.
- **DOCX** — quando o docente quer editar ou anexar a um documento maior.

Para gerar PDF/DOCX da matriz, veja `scripts/` (gerador reutilizável).

## Erros recorrentes a evitar

- Tratar SP com `objetivos_aprendizagem: []` como "sem lacunas" — é "OAs não cadastrados".
- Mapear questão a OA por semelhança de tema quando o texto do OA pede outra coisa (ex.: OA de "avaliação clínica puberal" ≠ questão de "fisiologia do eixo HHG").
- Classificar redundância sem verificar se os itens cobrem o mesmo OA ou ângulos diferentes do mesmo tema (dois itens sobre "gestação de alto risco" podem cobrir conceito vs. comunicação — não é redundância pura).
- Replicar 5 alternativas ao gerar questão nova porque a prova em análise usa 5 — o padrão de banco é 4 (A–D).
- Concluir sobre desempenho a partir de pontuação do Forms sem confirmar se as discursivas já foram corrigidas e computadas.
- Confirmar uma conclusão anterior por inércia quando surge evidência contrária.

## Resumo operacional

Carregue os OAs do banco (fase/UC) → mapeie cada questão ao seu OA com autoria e formato → diagnostique cobertura e redundância → para lacunas, gere via capi-questoes-enamed com curadoria obrigatória. Ancore tudo no banco e nos documentos; sugira o formato de saída conforme o uso; nunca auto-aprove.
