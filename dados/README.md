# Dados dos Simulados MED / ENAMED 2026

`Dados_Simulados_MED_ENAMED_2026.xlsx` remonta, em tabelas de dados, o conteúdo que nos
dashboards originais existia apenas como **imagens coladas** e como **cache de gráficos**.
Nos dois arquivos de dashboard todas as abas estavam com `sheetData` vazio: não havia
nenhum número em célula.

## Extração

| Origem | O que forneceu |
|---|---|
| 12 imagens (Simulado 01) e 16 imagens (Simulado 02) | nomes, acertos e % de acerto por questão |
| cache dos 39 + 60 gráficos | distribuição de respostas A–E, com valores exatos |
| `Gabarito_Simulado_1_2026.pdf` | gabarito oficial do Simulado 01 |
| `Simulado_01_2026.pdf`, `Simulado_02_20261.pdf` | enunciados |

## Conferência

Para cada uma das 8 combinações simulado × fase, a soma dos acertos por questão é **idêntica**
à soma dos acertos dos alunos (diferença = 0). As 396 distribuições somam exatamente 100% e
produzem apenas contagens inteiras de alunos. O gabarito do Simulado 02, ausente do PDF, foi
deduzido e é o único que satisfaz essas duas restrições nas 60 questões.

## Ressalvas registradas na aba `Leia-me`

1. **Q39 do Simulado 01** — o PDF do gabarito indica **D**, mas o dashboard inteiro foi
   calculado com **E**, que é a alternativa correta pelo enunciado (definição de SRAG do
   Ministério da Saúde). A planilha reproduz o dashboard e sinaliza a divergência.
2. **Q24 do Simulado 01** — anulada; não sobrou nenhum dado dela.
3. **Gabarito do Simulado 02** — deduzido, não oficial.
4. **Dois nomes** truncados na imagem da 10ª Fase do Simulado 01 foram completados pela
   lista do Simulado 02.

## Scripts

`extract_charts.py` (lê o cache dos gráficos) · `imgdata.py` (transcrição das imagens) ·
`validate.py` (deduz o gabarito e confere o fechamento) · `build.py` (gera o xlsx) ·
`audit.py` (confere as 4016 fórmulas do arquivo gerado contra o cálculo em Python).
