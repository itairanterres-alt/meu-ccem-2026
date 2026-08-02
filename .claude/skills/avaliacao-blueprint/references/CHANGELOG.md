# Changelog — avaliacao-blueprint

A string de versão canônica vive em `references/VERSION`; este arquivo é o histórico.

## 1.1 — 2026-08-02

Atualização decorrente da mesma auditoria que produziu `capi-questoes-enamed` v2.0,
e movida para `.claude/skills/` (versão de uso geral, versionada no repositório —
antes só existia em `~/.claude/skills/`, cópia de sessão não versionada).

### Correção de bug de classe já conhecida no ecossistema
- **Referências por nome fixo de semestre.** `SKILL.md`, `estrutura_oas.md` e
  `dimensoes_analise.md` apontavam para `oas_med_unidavi_2026_1.json` e
  `taxonomia_med_unidavi_2026_1.json` — os mesmos nomes que a migração para os
  Manuais Docentes 2026.2 substituiu. É a mesma classe de bug que quebrou
  silenciosamente o validador da `capi-questoes-enamed` v1.3 (ver seu CHANGELOG):
  resolução por nome literal para de encontrar o arquivo assim que o semestre
  migra, sem aviso algum. Corrigido para resolução por glob (`oas_med_unidavi_*.json`,
  `taxonomia_med_unidavi_*.json`), pegando o de nome mais alto — mesma convenção
  adotada pelo validador — com instrução explícita para imprimir qual arquivo foi
  usado.

### Nova dimensão de diagnóstico — Matriz ENAMED 478/2025
- A `capi-questoes-enamed` v2.0 passou a anexar `classificacao_fina.matriz_enamed_478_2025`
  (área/competências/conteúdos/cenário da Portaria 478/2025) às questões que classifica,
  e o próprio schema já documentava a intenção: "o bloco que permite fazer blueprint do
  banco contra a matriz do exame". Esta skill não usava esse dado; media alinhamento
  ENAMED só por aproximação via competência DCN (matriz de FORMAÇÃO, não de AVALIAÇÃO).
  Adicionada como quarta dimensão de diagnóstico, condicionada à presença do bloco —
  quando ausente no lote, a dimensão é reportada como indisponível, nunca aproximada
  por leitura livre do enunciado (violaria o princípio de nunca inventar classificação).
- `gerar_matriz_pdf.py` ganhou uma seção opcional "Matriz ENAMED 478/2025" no resumo de
  dimensões, paralela à de competências DCN já existente.

### Sem mudança
- Fluxo de 4 fases, critérios de status de cobertura (coberto/parcial/lacuna/não
  cadastrado), diagnóstico de redundância e teste de aterrissagem seguem os mesmos —
  nenhuma falha de simulação foi encontrada neles nesta rodada.

## 1.0

Versão inicial (sem changelog retroativo).
