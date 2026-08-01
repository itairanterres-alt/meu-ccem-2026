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

## Estado atual — 190 questões prontas para curadoria

| Fonte | Questões | Arquivo canônico |
|---|---|---|
| ENAMED 2025 — Caderno 01 | **90** | `canonico/enamed2025_caderno1.canonico.json` |
| Simulados MED/ENAMED 2026 (01 e 02) | **100** | `canonico/simulados2026.canonico.json` |

**Todas as 190 validam 100% contra o `schema_questao_med_unidavi.json`.**
Verificação de integridade 190/190: cada questão tem exatamente 4 alternativas
e uma única correta, **idêntica à do gabarito oficial** da prova de origem.

- ENAMED: 100 extraídas → 10 anuladas/excluídas descartadas → 90 no banco.
- Simulados: 40 (Simulado 01) + 60 (Simulado 02) = 100, todas aproveitadas.
- **50 questões convertidas de 5 para 4 alternativas** (todo o Simulado 01 e as
  10 finais do Simulado 02; as outras 50 já vinham com 4).
- Distribuição do gabarito final: A=44, B=51, C=45, D=50 — **sem viés**.
- Áreas: MFC 93, clínica médica 23, pediatria 21, GO 17, saúde mental 16,
  urgência/emergência 14, cirurgia 6.

👉 **Comece pelo `canonico/RELATORIO-CURADORIA.md`** — versão legível das 190
questões, com a correta marcada, as justificativas, e o registro do que foi
descartado em cada conversão.

## Conversão de 5 para 4 alternativas

Autorizada pelo docente responsável. Regras aplicadas:

1. **A alternativa correta NUNCA é descartada** — o montador aborta se a decisão
   editorial apontar a letra do gabarito.
2. Sai o **distrator mais fraco**, nesta prioridade: (a) duplicata de outra
   alternativa (defeito da prova de origem), (b) opção implausível, (c) a menos
   discriminativa. O motivo fica registrado em cada questão.
3. As 4 mantidas preservam a ordem original e são renumeradas A–D; a nova letra
   da correta é recalculada. A correspondência completa
   (`remapeamento`, `gabarito_original` → `gabarito_novo`) fica em
   `_proveniencia`, para conferência.

**35 itens têm defeito sinalizado na prova de origem** (alternativas duplicadas,
enunciado ambíguo, dependência de figura não reproduzida). Estão marcados em
`_proveniencia.problema_detectado` e destacados no relatório — vale revisar na
curadoria. Em alguns casos o gabarito oficial é discutível; ele foi **preservado
como está** e o ponto foi sinalizado, nunca alterado por conta própria.

## Padronização aplicada (itens "fora de padrão")

- Rótulo duplicado da Q21 nas duas provas (erro de digitação na origem) —
  corrigido automaticamente, com registro.
- Palavras partidas pela extração do PDF (`aten ção` → `atenção`): 21 remontadas
  por heurística conservadora, que só junta quando um dos fragmentos não é
  palavra do corpus (evita falsos positivos como "com um" → "comum").
- Resíduos de layout (`ÁREA LIVRE`, cabeçalhos de página) removidos.
- Pontuação final das alternativas normalizada (`asma;` → `asma.`).

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
# ENAMED 2025
python3 adequacao-enamed/scripts/extrair_enamed.py            # PDF/txt -> intermediário
python3 adequacao-enamed/scripts/montar_canonico.py           # -> canônico + valida

# Simulados 2026
python3 adequacao-enamed/scripts/extrair_simulados.py         # PDFs -> intermediário
python3 adequacao-enamed/scripts/montar_canonico_simulados.py # -> canônico (5->4) + valida

# Relatório de curadoria (Markdown legível)
python3 adequacao-enamed/scripts/relatorio_curadoria.py
```

## O que ainda falta

- **Pasta do OneDrive** (`1drv.ms/...`): retorna HTTP 403 — exige login, não
  alcançável desta sessão. Se houver mais provas lá (Revalida, testes de
  progresso), o caminho é baixá-las para o Drive ou subir ao repositório; o
  pipeline as absorve com pequenas adaptações do parser.
- **Curadoria docente** de todas as 190 (justificativas redigidas por IA).
- **16 questões dependem de imagem** não reproduzida (figura, genograma,
  gráfico) — precisam do anexo antes de irem para o treino.
