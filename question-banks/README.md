# Bancos de Questões Médicas (Medical Question Banks)

Coleção de bancos de questões médicas baixados a partir dos repositórios listados no
tópico [`medical-question-answering`](https://github.com/topics/medical-question-answering)
do GitHub. Cada subpasta corresponde a um banco distinto, com indicação da fonte,
licença e formato.

> **Nota de curadoria:** estes datasets são de terceiros, em inglês/persa e voltados a
> avaliação de modelos de linguagem (LLMs). Servem como **material de referência e fonte
> de itens** — não são questões no padrão ENAMED/ABDC do MED-UNIDAVI. Antes de reutilizar
> qualquer item em avaliações institucionais, é necessária curadoria e adaptação.

## Resumo do que foi baixado

| Banco | Pasta | Itens | Formato | Fonte (repo) | Licença |
|-------|-------|-------|---------|--------------|---------|
| **MedQA (USMLE, 5 opções)** | `MedQA/` | 10.178 treino · 1.272 dev · 1.273 teste | JSONL | [rbr7/ANNEALER](https://github.com/rbr7/ANNEALER) | ver repo |
| **MedQA4 (USMLE, 4 opções)** | `MedQA4/` | 10.178 treino · 1.273 teste · 176 teste (small) | JSONL | [rbr7/ANNEALER](https://github.com/rbr7/ANNEALER) | ver repo |
| **NephSAP (nefrologia)** | `NephSAP/` | 858 | JSONL | [rbr7/ANNEALER](https://github.com/rbr7/ANNEALER) | ver repo |
| **PubMedQA** | `PubMedQA/` | 500 teste · 500 train/dev · 1.000 teste (OntoTune) | CSV + JSON | [rbr7/ANNEALER](https://github.com/rbr7/ANNEALER) · [zjukg/OntoTune](https://github.com/zjukg/OntoTune) | ver repos |
| **MedMCQA** | `MedMCQA/` | 4.183 teste | JSON | [zjukg/OntoTune](https://github.com/zjukg/OntoTune) | ver repo |
| **USMLE Steps 1–3** | `USMLE/` | 94 + 109 + 122 | JSON | [zjukg/OntoTune](https://github.com/zjukg/OntoTune) | ver repo |
| **TREC-2017 LiveQA Medical** | `TREC-LiveQA-2017/` | 104 perguntas de teste (+ qrels) | XML + TXT | [abachaa/LiveQA_MedicalTask_TREC2017](https://github.com/abachaa/LiveQA_MedicalTask_TREC2017) | CC BY 4.0 |
| **DrHast (persa)** | `DrHast-Persian-QA/` | 1.971 pares P&R | JSON | [alimoameri/drhast-persian-medical-QA-](https://github.com/alimoameri/drhast-persian-medical-QA-) | ver repo |

## Detalhes por banco

### MedQA / MedQA4 — `MedQA/`, `MedQA4/`
Questões de múltipla escolha estilo USMLE (exame de licenciamento médico dos EUA).
`MedQA` usa 5 alternativas; `MedQA4` usa 4. Cada linha JSONL contém `question`,
`options` (dicionário A–E) e `answer`. É um dos benchmarks mais usados para avaliar
raciocínio clínico de LLMs.

### NephSAP — `NephSAP/`
858 questões de nefrologia (Nephrology Self-Assessment Program) em JSONL, com `ID`,
`question`, `options` e resposta.

### PubMedQA — `PubMedQA/`
Perguntas de pesquisa biomédica derivadas de resumos do PubMed, com resposta
`yes/no/maybe`. Incluídas duas versões: os CSVs do ANNEALER (`test.csv`,
`train_dev.csv`) e o conjunto de teste em JSON do OntoTune (1.000 itens).

### MedMCQA — `MedMCQA/`
4.183 questões de teste de exames de admissão médica da Índia (AIIMS/NEET-PG),
múltipla escolha (A–D), em JSON no formato instrução/entrada/saída.
O dataset completo (~194 mil itens) requer download separado via
[medmcqa/medmcqa](https://github.com/medmcqa/medmcqa) (link Google Drive no README) —
aqui está o split de teste distribuído pelo OntoTune.

### USMLE Steps 1–3 — `USMLE/`
Amostras dos três passos do USMLE (94/109/122 itens), em JSON, boas para itens de
alta dificuldade e vinhetas clínicas.

### TREC-2017 LiveQA Medical — `TREC-LiveQA-2017/`
Perguntas de saúde do consumidor recebidas pela U.S. National Library of Medicine,
com anotações de foco/tipo e respostas de referência. Formato XML. Licença **CC BY 4.0**
(citar Ben Abacha et al., TREC 2017). O conjunto de treino (634 pares) não está
versionado no repositório de origem; apenas o conjunto de teste está incluído aqui.

### DrHast (persa) — `DrHast-Persian-QA/`
1.971 pares pergunta-resposta de saúde coletados do site iraniano drhast.com,
com respostas de médicos verificados (nome, especialidade, status de verificação).
Idioma: persa (farsi). Extraído do arquivo `.rar` original do repositório.

## Fontes visitadas que NÃO trazem os dados no próprio repositório

Os repositórios abaixo, do mesmo tópico, apenas apontam para downloads externos
(Google Drive, Hugging Face, PhysioNet) — não há arquivos de banco versionados:

- **medmcqa/medmcqa** — dataset completo via Google Drive (link no README).
- **gersteinlab/MedAgents** — datasets via Google Drive (apenas `MedQA/test.jsonl`
  vem no repo; incluído indiretamente pois é idêntico ao `MedQA/test.jsonl` do ANNEALER).
- **disi-unibo-nlp/medgenie** — links para Hugging Face / Google Drive.
- **BIDS-Xu-Lab/Me-LLaMA** — dados/modelos atrás de conta no PhysioNet (acordo de uso).
- **fensorechase/rag-patient-metabolic-qa** — usa MedQuAD (download externo).
- **Kanisha-Shah/Hallucination-Mitigation-Using-RAG** — código/dados não compartilhados (confidencialidade Elsevier).
- **dhchenx/chatgpt-in-healthcare**, **Pavansomisetty21/...DeepSeek-R1**,
  **omargalal20/medical-assistant-chatbot** — sem arquivos de banco de questões.

## Ferramenta de triagem — `tools/triagem_endocrino.py`

Script que normaliza os bancos heterogêneos (MedQA, MedQA4, MedMCQA, USMLE, NephSAP)
num esquema único e pontua cada item por relevância para cada sessão do 12º CCEM,
usando um léxico de domínio endocrinológico.

```bash
python3 question-banks/tools/triagem_endocrino.py
```

Saída: `pool_triado.json` — 2.139 itens etiquetados por sessão, a partir de 18.046
itens únicos (29.540 antes da deduplicação). Distribuição por sessão:

| Sessão | Itens | | Sessão | Itens |
|--------|------:|-|--------|------:|
| `simp1-dm2` | 932 | | `simp8-adrenal` | 106 |
| `simp7-osseo` | 447 | | `simp3-cdt` | 103 |
| `simp2-dm1` | 151 | | `simp9-pediatrica` | 43 |
| `simp6-gonadas` | 142 | | `simp10-obesidade` | 30 |
| `simp4-hipofise` | 138 | | `simp5-modismos` | 24 |
| | | | `mini-glicemia` | 20 |

**Escopo:** a triagem é específica do CCEM — filtra endocrinologia e mapeia para as
14 sessões do congresso. Não serve para uso geral em medicina; um banco de propósito
amplo (ENAMED, por exemplo) usaria os 18.046 itens sem esse filtro temático.

`pool_triado.json` é artefato derivado: pode ser regerado a qualquer momento rodando
o script. Está versionado apenas por conveniência de curadoria.

## Licenças e uso

Cada dataset mantém a licença do repositório de origem. Verifique o link da fonte
antes de redistribuir ou usar comercialmente. O TREC-LiveQA é CC BY 4.0 (exige
citação). Para os demais, consulte o `LICENSE`/README do repositório correspondente.

_Baixado em 2026-08-01 a partir dos repositórios do tópico GitHub `medical-question-answering`._
