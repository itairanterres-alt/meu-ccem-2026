# Changelog — capi-questoes-enamed

Formato: cada versão lista as mudanças em relação à anterior. A string de
versão canônica vive em `references/VERSION`; este arquivo é o histórico.

## 1.3 — 2026-07-04
Refinamento a partir de avaliação de uso real (falhas percebidas na v1.2).
- **Passo 0 (novo)** — ancoragem obrigatória na fonte + teto de conteúdo por
  fase. Trava a falha mais perigosa: gerar item desancorado do material e acima
  do nível da fase ao "clinicalizar" conteúdo conceitual.
- **§3a** — regra de recusa por fidelidade à fonte: distingue "o material menciona
  o termo" de "o material ensina o conteúdo"; não gera OA sem lastro.
- **§3b (nova)** — anatomia do item ENAMED, núcleo gerativo independente de arquivo
  externo. Eixo recordação vs. aplicação; **três** casos de vinheta vs. enunciado
  direto (recupera a vinheta clínica honesta no ciclo básico quando o conceito tem
  manifestação clínica observável).
- **§5** — teste recíproco aprofundado: armadilha definição-pura-com-vinheta; a
  vinheta não pode conter a pista da resposta.
- **§7** — superlativo com nuance (ancorado na vinheta = padrão NBME; nu = proibido);
  causa-raiz do desbalanço de extensão (a explicação causal pertence à justificativa,
  não à alternativa).
- **§9** — validação executável via `scripts/validate_questao.py`; itens do checklist
  marcados [script] passam a ser verificados por máquina.
- **Convenção de banco** — a alternativa correta é registrada na letra A; a
  aleatorização da posição é responsabilidade da emissão (backend). Removida a
  regra de "ordem natural".
- **Versionamento em fonte única** — versão movida para `references/VERSION`,
  eliminando os carimbos inconsistentes (v1.0/v1.1) que coexistiam na v1.2.
- Referências novas: `exemplo_questao_enunciado_direto.json`, `references/VERSION`,
  `references/CHANGELOG.md`, `references/limitacoes.md`.

## 1.2 — 2026-04-29
- Modo 2 (reformulação de questão existente); tratamento de erro conceitual na
  original; banco de OAs (`oas_med_unidavi_2026_1.json`, fases 1–8); §3a inputs
  preferidos; campos de schema `origem`, `questao_original_referencia`, `oa_referencia`.

## 1.1 — 2026-04-28
- Vinheta deixa de ser universal; teste de economia narrativa; proibição de
  vinheta-moldura-acadêmica; checklist de auto-validação; modo enxuto (só Markdown)
  por padrão; política de lote em escala.

## Renomeação — 2026-06-29
- Persona Davi descontinuada; agente e skill passam a `capi-questoes-enamed`.
  Registros históricos no banco preservam `davi-questoes-enamed` (proveniência
  não é reescrita retroativamente).

## 1.0 — 2026-04
- Versão inicial: geração nova ancorada em taxonomia + schema + guias ENAMED/NBME/ENADE.
