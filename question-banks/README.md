# Triagem endocrinológica para os quizzes do CCEM

Ferramenta de curadoria que seleciona, de bancos públicos de questões médicas,
os itens pertinentes a cada sessão do 12º Congresso Catarinense de Endocrinologia
e Metabologia — matéria-prima para os quizzes preparatórios de `SESSION_META`
em `ccem-data.js`.

## Os bancos-fonte não ficam aqui

Os bancos brutos (MedQA, MedQA4, MedMCQA, USMLE, PubMedQA, NephSAP e outros,
39 MB, medicina geral) foram movidos para o projeto onde pertencem:

**`itairanterres-alt/Treino-enamed` → `data/question-banks/`**

São dois projetos distintos: o Treino-ENAMED é um app de treino para o exame
nacional de medicina, e cobre todas as áreas. Este repositório é o app do
congresso, restrito à endocrinologia. Os bancos de medicina geral são insumo
do primeiro; aqui entra apenas o recorte endócrino derivado deles.

## Uso

```bash
git clone https://github.com/itairanterres-alt/Treino-enamed /tmp/te
BANCOS_DIR=/tmp/te/data/question-banks \
  python3 question-banks/tools/triagem_endocrino.py
```

O script normaliza os bancos heterogêneos num esquema único, deduplica
(29.540 → 18.046 itens únicos) e pontua cada item por relevância para cada
sessão do congresso, usando um léxico de domínio endocrinológico.

## Saída — `pool_triado.json`

2.139 itens etiquetados por sessão, versionados aqui por conveniência de
curadoria (são reproduzíveis rodando o script).

| Sessão | Itens | | Sessão | Itens |
|--------|------:|-|--------|------:|
| `simp1-dm2` | 932 | | `simp8-adrenal` | 106 |
| `simp7-osseo` | 447 | | `simp3-cdt` | 103 |
| `simp2-dm1` | 151 | | `simp9-pediatrica` | 43 |
| `simp6-gonadas` | 142 | | `simp10-obesidade` | 30 |
| `simp4-hipofise` | 138 | | `simp5-modismos` | 24 |
| | | | `mini-glicemia` | 20 |

Cada item traz `fonte`, `enunciado`, `opcoes`, `gabarito`, `score` e os
`termos` do léxico que dispararam a classificação — para o curador julgar
a pertinência sem reler o banco inteiro.

## Estado

Matéria-prima em inglês, não curada. Nenhum destes itens está pronto para
uso: são questões de exames estrangeiros (USMLE, admissão médica indiana)
voltadas à avaliação de modelos de linguagem. Antes de virar quiz do
congresso, cada item exige tradução, adaptação ao padrão de 4 alternativas
e revisão pela Comissão Científica — o mesmo estado de "modo curadoria"
descrito no README principal.

Das 14 sessões, 11 ainda não têm quiz em `SESSION_META`.
