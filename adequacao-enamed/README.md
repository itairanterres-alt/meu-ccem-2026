# Adequação ENAMED → Banco de Questões (Capi Treino ENAMED)

Pipeline que "adequa" provas reais (ENAMED, simulados) ao **banco de questões
canônico** do ecossistema MED-UNIDAVI, no formato do
`schema_questao_med_unidavi.json` (v2026.1/v3.1) consumido pelo app
`sessao-questoes` / Capi Treino ENAMED.

> Reconstruído na nuvem a partir das fontes no Google Drive
> (pasta *"Resultados de avaliações dos alunos - simulados enamed e TP"* →
> subpasta *"Simulados Enamed"*), para permitir acesso ao material de qualquer
> lugar. O material-fonte original permanece no Drive; aqui fica a versão
> estruturada + adequada, versionada no Git.

## Estrutura

| Pasta | Conteúdo |
|---|---|
| `fontes/` | Texto/insumos crus das provas (caderno ENAMED, gabaritos) |
| `scripts/` | Extratores e validadores (determinísticos) |
| `intermediario/` | Questões **estruturadas** (enunciado + A–D + gabarito), fiéis à fonte |
| `canonico/` | Questões no **schema canônico** do banco (com classificação e justificativas), `status_curadoria: pendente` |

## Etapas

1. **Extração (determinística, fiel à fonte).** `scripts/extrair_enamed.py`
   de-columniza o PDF ENAMED (2 colunas), separa as 100 questões, casa com o
   gabarito oficial e grava `intermediario/enamed2025_caderno1.json`. Não
   inventa conteúdo. Questões *Anuladas/Excluídas* são descartadas; questões
   que dependem de imagem são sinalizadas (`requer_imagem`) para curadoria.

2. **Adequação canônica (enriquecimento).** Cada questão válida é mapeada ao
   `schema_questao_med_unidavi.json`: classificação (`fase_alvo`, `uc_slug`,
   `area_clinica`, `nivel_bloom`, `competencia_dcn_2025`, `tema`) + uma
   `justificativa` por alternativa. `cenario_origem: ["preparacao_enamed"]`,
   `fonte_geracao` identifica a prova de origem, `status_curadoria: pendente`
   (o design institucional prevê curadoria docente antes do uso avaliativo).

3. **Validação.** Contra o JSON Schema canônico (mesmas regras de
   `docs/anexos/schema-institucional/validate_questao.py`).

## Estado atual

- ✅ **ENAMED 2025 — Caderno 01: 90 questões canônicas** em
  `canonico/enamed2025_caderno1.canonico.json` — **100% válidas** contra o
  `schema_questao_med_unidavi.json`, com gabarito conferido 90/90 contra o
  oficial do INEP. (100 extraídas; 10 anuladas/excluídas descartadas.)
  Distribuição por área: MFC 21, pediatria 16, clínica médica 15, GO 15,
  urgência/emergência 11, cirurgia 6, saúde mental 6.
- ⛔ **Simulados MED-ENAMED 2026 (01 e 02):** fonte extraível e gabaritos
  disponíveis, **mas bloqueados** para o banco canônico — ver abaixo.

### Bloqueio dos simulados (decisão de produto necessária)

Os simulados usam **5 alternativas (A–E)**, enquanto o
`schema_questao_med_unidavi.json` exige **exatamente 4** (`alternativas`:
`minItems: 4, maxItems: 4`). Não dá para adequá-los ao banco sem descartar uma
alternativa (o que descaracteriza a questão). Opções para decidir:
1. Criar uma **variante do schema** que aceite 4–5 alternativas; ou
2. Manter os simulados só como material de treino fora do banco canônico.

Enquanto isso, os simulados podem ser preservados em `intermediario/` no
formato estruturado (enunciado + A–E + gabarito) — o gabarito do Simulado 01
já foi capturado. Não force a adequação canônica antes dessa decisão.

## Decisões de modelagem (ENAMED → banco)

- **`fase_alvo` + `uc_slug`** derivam de `area_clinica` (mapa em
  `scripts/montar_canonico.py`): como o ENAMED é exame de saída, cada questão é
  ancorada na UC do ciclo clínico/internato onde o tema é ensinado.
- **`correta`** é sempre a letra do **gabarito oficial** — o enriquecimento por
  IA não decide a resposta, só escreve as justificativas coerentes com ela.
- Vinhetas longas (> 1000 ca*) vão para **`texto_base`**; o comando fica em
  **`enunciado`** (modelagem canônica).
- `cenario_origem: ["preparacao_enamed"]`, `status_curadoria: "pendente"` —
  **toda questão exige curadoria docente antes de uso avaliativo.** As
  justificativas foram redigidas por IA e precisam de revisão.
- Questões que dependem de imagem (`_proveniencia.requer_imagem: true`) precisam
  ter a imagem anexada na curadoria: 6, 14, 21, 29, 31, 33, 53, 91, 96.

## Como reproduzir

```bash
python3 adequacao-enamed/scripts/extrair_enamed.py     # fonte -> intermediário
python3 adequacao-enamed/scripts/montar_canonico.py    # intermediário + enriquecimento -> canônico + valida
```
