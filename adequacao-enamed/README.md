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

- ✅ ENAMED 2025 — Caderno 01: **100 parseadas, 90 válidas** (10 anuladas/excluídas).
- ⏳ Simulados MED-ENAMED 2026 (01 e 02): em processamento.
- ⏳ Adequação canônica das 90 questões ENAMED: em processamento.

## Como reproduzir

```bash
python3 adequacao-enamed/scripts/extrair_enamed.py
```
