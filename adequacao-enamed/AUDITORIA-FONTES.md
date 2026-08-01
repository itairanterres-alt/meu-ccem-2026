# Auditoria de fontes — a pasta do Drive contém questões de prova?

**Data:** 2026-08-01
**Escopo:** 17 arquivos de uma pasta do Google Drive.
**Método:** cada arquivo foi **baixado e aberto** (não julgado pelo nome).
- `.xlsx` → `openpyxl` (`read_only`, `data_only`): listagem de abas, cabeçalhos, contagem de células de texto com **> 180 caracteres** (indício de enunciado) e inspeção direta de `xl/sharedStrings.xml` (maior string do arquivo) + `xl/media` (imagens embutidas).
- `.pdf` → `pypdf`, extração de texto integral (391 páginas) e contagem de marcas `QUESTÃO n` / linhas de alternativa.
- `.docx` → `zipfile` + `xml.etree` sobre `word/document.xml` + extração de `word/media`.
- `.doc` (binário OLE2 antigo) → LibreOffice falhou na conversão; foi feita **extração binária direta** do stream WordDocument (CP1252), que recuperou o texto legível.

**Resultado global: 1 de 17 arquivos contém questão de prova.** Nenhum arquivo traz um banco de questões novo utilizável.

---

## Tabela de auditoria

| # | Arquivo | Tem questões? | Quantas | O que é de fato |
|---|---|---|---|---|
| 1 | UNIDAVI_ALUNOS_2025.pdf | **NÃO** | 0 | 391 páginas de cartas individuais de devolutiva do TPMed 2025 (uma por aluno, com % por área vs turma vs núcleo). 0 marcas `QUESTÃO n`, 0 linhas de alternativa em 663 mil caracteres. |
| 2 | UNIDAVI_RESULTADO_2025.xlsx | **NÃO** | 0 | Matriz de respostas brutas do TP 2025: colunas `Questão1…Questão120`, linha `GABARITO` e letras marcadas por aluno + abas de resultado consolidado. Maior string do arquivo = 37 caracteres. |
| 3 | Dashboard Simulado 02 - MED - (ENAMED 2025).xlsx | **NÃO** | 0 | Dashboard de desempenho: 60 abas `Q1…Q60` **vazias** (só gráficos, 240 charts), + `Planilha oculta` com rótulos "Questão 01…60", gabarito (A–E) e % por alternativa. Maior string do arquivo = **10 caracteres**. |
| 4 | Mapa_Atencao_TP2026.xlsx | **NÃO** | 0 | Mapa de atenção do TP 2026 por fase: z-score dentro da fase, bandas Crítico/Atenção/Vigiar, tendência 25→26 (399 linhas de alunos). |
| 5 | Residencia_2026_painel.xlsx | **NÃO** | 0 | Painel da coorte de residência 2026 (11ª+12ª fase, 58 formandos): índice clínico, tercis, z na fase, vs núcleo NAPISUL, foco clínico. |
| 6 | Internato_NAPISUL_2026_painel.xlsx | **NÃO** | 0 | Painel do internato 2026: bandas Sólido/VIRADA/CRÍTICO, ação por área, evolução de turmas, fora da curva, parâmetros por fase/área. |
| 7 | Trajetorias_Alunos_2022_2026.xlsx | **NÃO** | 0 | Base longitudinal de z-scores por aluno (TP 2022/23/25/26 + Simulados 2025/2026) com classificação de risco crônico e recuperados. **Zero** sharedStrings. |
| 8 | Projecao_ENAMED_2026.xlsx | **NÃO** | 0 | Projeção do PCP/Conceito ENAMED 2026 (T8+T9): margem de cada aluno sobre a barra de proficiência, zona de decisão, cenários base/pessimista/otimista. |
| 9 | **Questoes_Mais_Erradas_Simulados_2026.xlsx** | **NÃO** | 0 | ⚠️ Apesar do nome: **só estatística**. Colunas = Simulado, Q, Gabarito, % acerto geral, % acerto coorte 10+11, distrator dominante, % no distrator, tipo de erro (ARMADILHA / CONCEITO TROCADO / SEM DOMÍNIO / ERRO DE GABARITO), Área ENAMED e **"Tema específico" em uma linha** (ex.: "Valor preditivo positivo — teorema de Bayes"). **Não há enunciado nem alternativas.** |
| 10 | resultado_print.docx | **NÃO** | 0 | Documento com **uma única imagem PNG**: print do painel web do Teste de Progresso ABEM (4 gráficos: resultados por área, comparativo escola/núcleo/nacional, evolução por período, comparativo por área). Zero texto. |
| 11 | 46Ficha Modelo Branco.docx | **NÃO** | 0 | **Formulário em branco** ABEM/NAPISUL II para submissão de item: 5 fichas vazias com os campos INSTITUIÇÃO / ÁREA-CONTEÚDO-AUTOR / ENUNCIADO E ALTERNATIVAS / RESPOSTA CORRETA / COMENTÁRIOS / REFERÊNCIAS. Nenhum campo preenchido. |
| 12 | 14Ficha Modelo Exemplo.doc | **SIM** | **1** | Mesma ficha ABEM/NAPISUL II, **preenchida com o exemplo-modelo**. Ver detalhe abaixo. |
| 13 | resultado_2022_coordenador_UNIDAVI.xlsx | **NÃO** | 0 | Relatório do coordenador TP 2022. A aba `Questões` traz `Questão / Gabarito / **Assunto abordado** / % acerto NAPISUL-II / % acerto UNIDAVI` — só o **assunto em caixa-alta** (ex.: "ESPERMATOGÊNESE"), nunca o enunciado. Maior string do arquivo = 80 caracteres. Demais abas: respostas originais, consolidado, dificuldade, discriminação, histograma. |
| 14 | resultado_2023_coordenador_UNIDAVI_18_12.xlsx | **NÃO** | 0 | Idem 2023: aba `Questões` com `Questão / Área / Assunto` (ex.: "MANOBRA DE PRINGLE E TRÍADE HEPÁTICA") + percentuais. Maior string = 80 caracteres. |
| 15 | resultado_2025_coordenador_UNIDAVI.xlsx | **NÃO** | 0 | Idem 2025: `Questão / ÁREA / Assunto abordado` + % TODOS/INTERNOS, mais aba `Nacional`. Maior string = 85 caracteres. |
| 16 | Dashboard Simulado 01 - MED - (ENAMED 2026).xlsx | **NÃO** | 0 | Dashboard do Simulado 01/2026: abas `Q1…Q39` vazias (156 charts) + `Planilha oculta` com gabarito e distribuição A–E. Maior string = 10 caracteres. |
| 17 | Dashboard Simulado 02 - MED - (ENAMED 2026).xlsx | **NÃO** | 0 | Dashboard do Simulado 02/2026: abas `Q1…Q60` vazias (240 charts) + `Planilha oculta`. Maior string = 12 caracteres. |

---

## Detalhe do único arquivo com questão (#12)

**`14Ficha Modelo Exemplo.doc`** — formato Word 97 (OLE2, `d0cf11e0`), 75 KB.

- **Onde:** ficha única, página 1 do documento.
- **Quantas:** **1 (uma) questão**, completa.
- **Conteúdo:** Instituição FMRP-USP · Área: Básica – Anatomia topográfica do abdome · Autor: Fernando Ramalho.
  - Enunciado (vinheta clínica): paciente de 32 anos, ferimento por arma branca no abdome, lesão penetrante no lobo direito do fígado com sangramento profuso — qual estrutura comprimir entre polegar e indicador para reduzir o fluxo sanguíneo hepático.
  - **4 alternativas** (ligamento hepatoduodenal / ligamento falciforme / mesentérica superior antes da origem da gastroduodenal / ligamento redondo do fígado).
  - **Resposta correta: A**, com comentário justificativo e referência (Moore & Dalley, *Anatomia Orientada para a Clínica*, 5ª ed., 2007).
- **Novo ou repetido?** É **material novo em relação ao corpus conhecido** (não pertence a ENAMED 2025 Caderno 1, Revalida 2023.2/2024.1, TPMed 2022/2025, Simulados 01/02 2026, Questões CLM, nem NAPISUL 2 2026). Mas o **valor prático é baixo**: trata-se do item-exemplo didático que acompanha o formulário ABEM desde ~2007, com 4 alternativas (fora do padrão ENAMED de 5) e função ilustrativa de como preencher a ficha. **Serve como modelo de formato, não como item de banco.**

---

## O que estes arquivos realmente cobrem

Os 16 arquivos sem questões se agrupam em três famílias:

1. **Dados brutos de resposta e gabarito** (#2, #13, #14, #15 aba `original`; #3, #16, #17 `Planilha oculta`) — letra marcada por aluno + gabarito, sem texto do item.
2. **Metadados de conteúdo por item** (#13, #14, #15 aba `Questões`; #9) — assunto/tema em uma linha + índice de dificuldade e discriminação. Útil para **blueprint e diagnóstico de lacunas**, inútil para reaproveitar item.
3. **Painéis analíticos derivados** (#4, #5, #6, #7, #8, #1, #10) — z-scores, bandas de risco, projeção de PCP/Conceito, devolutivas individuais.

---

## Extrações ainda pendentes

**Nenhuma.** Todos os 17 arquivos foram abertos e lidos integralmente; não restou nenhum bloco de conteúdo inacessível.

Registros de método que merecem nota:

- **#12 (`.doc` legado)** — a conversão via LibreOffice falhou (`Error: source file could not be loaded`) e `antiword`/`catdoc` não estão instalados no ambiente. O texto foi recuperado por **leitura binária direta do stream WordDocument** e está completo e legível (enunciado, 4 alternativas, gabarito, comentário e referência conferidos). Não há adivinhação envolvida. Caso se queira o arquivo em formato editável, seria necessário instalar `antiword` ou um filtro Word 97 no LibreOffice — mas isso **não muda o achado**.
- **#10 (`resultado_print.docx`)** — o conteúdo é 100% imagem; foi extraído o PNG e lido visualmente (dashboard de gráficos ABEM). Não há OCR pendente porque não há texto de questão na imagem.
- **#3, #16, #17 (dashboards)** — confirmado que as abas `Q1…Qn` estão genuinamente vazias (1.130 bytes de XML cada, apenas âncora de gráfico) e que as imagens embutidas (`xl/media`) são logotipos e elementos gráficos, não prints de questões.

## Implicação para o projeto

Se o objetivo é **ampliar o banco de itens**, esta pasta não contribui: nenhuma fonte nova de enunciados foi encontrada. O material continua sendo o corpus já conhecido (ENAMED 2025 Caderno 1, Revalida 2023.2/2024.1, TPMed 2022/2025, Simulados 01/02 2026, Questões CLM, NAPISUL 2 2026).

Se o objetivo é **priorizar conteúdo**, a pasta é rica: `Questoes_Mais_Erradas_Simulados_2026.xlsx` (#9) e as abas `Questões` dos relatórios de coordenador (#13–#15) dão o mapa de temas com pior desempenho — com o achado de que o gargalo está em **Saúde Coletiva / gestão do SUS / legislação** (12 das 29 questões com acerto < 50%), e não em raciocínio clínico.
