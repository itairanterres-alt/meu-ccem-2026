# Changelog — capi-questoes-enamed

A string de versão canônica vive em `references/VERSION`; este arquivo é o histórico.

## 2.0 — 2026-08-02

Revisão a partir de **análise crítica com simulações controladas** (relatório em
`ANALISE-CRITICA-2026-2.md`) e da chegada dos **Manuais Docentes 2026.2**.
Quatro simulações independentes rodaram a v1.3 em cenários reais; os defeitos
abaixo foram todos reproduzidos, não inferidos.

### Migração de semestre
- **Banco de OAs 2026.2** (`oas_med_unidavi_2026_2.json`): 109 SPs, 867 OAs,
  substituindo o de 2026.1 (107 SPs, 810 OAs). Construído por **dupla extração
  independente** dos 8 manuais; 106 das 109 SPs saíram idênticas ao pé da letra nas
  duas extrações, e as 3 divergentes foram adjudicadas por leitura direta do Manual.
- **Lacuna preenchida**: a UC *Fadiga, Perda de Peso e Anemias* (6ª fase) não
  existia no banco 2026.1. Agora tem 33 OAs.
- **Defeitos de integridade corrigidos** em relação à extração 2026.2 preexistente:
  4 slugs de OA colididos, 3 SPs com numeração corrompida, 3 artefatos de
  hifenização de quebra de linha, e 1 OA perdido numa quebra de página
  (f04/uc03/sp02, OA 8 — a extração anterior se declarava íntegra).
- **Nova regra de slug**: o slug do OA deriva da **posição ordinal** na SP, não do
  número impresso. Alguns Manuais repetem ou saltam a numeração; derivar o slug do
  número impresso produzia identificadores duplicados. O número impresso, quando
  difere, é preservado em `numero_impresso`.

### Correções de defeito (todas reproduzidas em teste)
- **Degradação silenciosa do validador.** O script procurava as referências pelo
  nome literal com o semestre embutido (`taxonomia_med_unidavi_2026_1.json`). Ao
  renomear a referência para 2026_2 — exatamente o que esta migração exige — o
  arquivo deixava de ser encontrado, a checagem de `uc_slug` era desligada **sem
  nenhum aviso**, e uma questão com UC inventada passava com *"OK (sem erros, sem
  avisos)"* e exit code 0. Agora: resolução por glob, referência usada impressa no
  relatório, e referência ausente é **ERRO** (exit 2), com `--sem-referencias` para
  assumir o risco explicitamente.
- **Contradição entre a Skill e o schema.** A §3 mandava preencher `origem` em toda
  questão e a §13 exigia `questao_original_referencia`; o schema é
  `additionalProperties: false` e **não tinha nenhum dos dois**, nem `oa_referencia`.
  Seguir a Skill ao pé da letra gerava JSON que o próprio validador rejeitava — e a
  simulação em modo banco só passou porque desobedeceu a §3. Os campos foram
  acrescentados ao schema, junto de `area_enamed` e `tipo_comando`.
- **Ancoragem em OA nunca era verificada.** O validador conferia o *padrão* do slug
  de SP/OA, jamais a *existência* do objetivo. Como 102 das 104 SPs em posição comum
  trocaram de título entre 2026.1 e 2026.2, um slug bem-formado podia apontar para
  uma SP morta. Novos erros `SP_INEXISTENTE` e `OA_INEXISTENTE`.
- **UCs da 4ª fase rotacionadas no banco 2026.1.** Objetivos de intoxicação
  ambiental estavam arquivados sob "Proliferação Celular", os de proliferação sob
  "Saúde da Mulher" e os de saúde da mulher sob "Doenças por Agressão do Meio
  Ambiente" — uma permutação limpa das três UCs. Nenhuma checagem formal pegava
  (slug válido, UC existente, fase coerente). Corrigido no banco 2026.2; o Passo 1
  agora exige conferir o **conteúdo** do OA contra a ementa da UC.

### Conformidade com o padrão ENAMED (nova §4a)
Baseada em `references/perfil_estilo_enamed.md`, medição sobre as provas oficiais
(ENAMED 2025 Caderno 1, n=90; Revalida, n=186).
- **Enunciado por completamento deixa de ser penalizado e passa a ser ensinado.**
  60% dos itens do ENAMED 2025 não terminam em "?". A v1.3 prescrevia pergunta
  interrogativa e o validador emitia aviso `SEM_INTERROGACAO` — empurrando a geração
  para o lado minoritário do padrão real. Nas quatro simulações, **100% das questões
  geradas foram interrogativas**, em 0% de completamento.
- **Nova checagem `CONCORDANCIA`**: em item por completamento, gênero/número das
  quatro alternativas precisam concordar com o fecho do enunciado. É a falha
  *grammatical cue* do NBME, específica do português e inexistente em enunciado
  interrogativo — o risco que se assume ao adotar o completamento.
- **Checagens de lote** (`GABARITO_CONCENTRADO`, `MONOCULTURA_FORMATO`,
  `DUPLICIDADE`): defeitos que só existem no conjunto e que a v1.3, olhando uma
  questão por vez, não podia ver.
- Faixa de extensão da correta (±30%) **mantida como aviso**, agora com
  justificativa empírica: no ENAMED real a razão mediana é 1,00, mas 21% dos itens
  caem fora da faixa — logo não pode ser erro.

### Matriz de Referência do ENAMED
- Nova referência `matriz_enamed_478_2025.json` (Portaria Inep nº 478/2025):
  7 áreas, 15 competências, 6 cenários, 21 conteúdos.
- **`saude_coletiva` acrescentada ao enum `area_clinica`** — era uma das sete áreas
  oficiais do exame **sem nenhuma representação na taxonomia**, o que tornava
  impossível fazer blueprint do banco contra a matriz da prova.
- Novo campo `area_enamed`, esperado da fase 8 em diante.
- §2 passa a distinguir explicitamente as duas camadas: 27 competências DCN 2025
  (referência curricular) vs. 7 áreas da Matriz 478 (blueprint do exame).

### Honestidade normativa
- A referência NBME foi atualizada de "Construindo o Teste Escrito, 2016" para o
  *NBME Item-Writing Guide* (ed. 2020/2021).
- A §2 passa a **declarar** o único ponto em que a Skill diverge deliberadamente do
  ENAMED: a proibição de "assinale", que o ENAMED usa em 6% dos itens e que a Skill
  veta por seguir a *cover-the-options rule* do NBME. Antes isso era apresentado
  como se fosse o padrão ENAMED.

## 1.3 — 2026-07-04
Refinamento a partir de avaliação de uso real (falhas percebidas na v1.2).
- **Passo 0** — ancoragem obrigatória na fonte + teto de conteúdo por fase.
- **§3a** — regra de recusa por fidelidade à fonte.
- **§3b** — anatomia do item ENAMED; eixo recordação vs. aplicação; três casos de
  vinheta vs. enunciado direto.
- **§5** — teste recíproco aprofundado; armadilha definição-pura-com-vinheta.
- **§7** — superlativo com nuance; causa-raiz do desbalanço de extensão.
- **§9** — validação executável via `scripts/validate_questao.py`.
- **Convenção de banco** — a alternativa correta é registrada na letra A.
- **Versionamento em fonte única** — versão movida para `references/VERSION`.

## 1.2 — 2026-04-29
- Modo 2 (reformulação); tratamento de erro conceitual na original; banco de OAs
  (fases 1–8); §3a inputs preferidos. *(Nota: os campos de schema `origem`,
  `questao_original_referencia` e `oa_referencia` foram documentados como
  adicionados nesta versão, mas nunca chegaram ao schema — corrigido só na v2.0.)*

## 1.1 — 2026-04-28
- Vinheta deixa de ser universal; economia narrativa; proibição de
  vinheta-moldura-acadêmica; checklist de auto-validação; modo enxuto por padrão.

## Renomeação — 2026-06-29
- Persona Davi descontinuada; agente e skill passam a `capi-questoes-enamed`.
  Registros históricos preservam `davi-questoes-enamed`.

## 1.0 — 2026-04
- Versão inicial: geração ancorada em taxonomia + schema + guias ENAMED/NBME/ENADE.
