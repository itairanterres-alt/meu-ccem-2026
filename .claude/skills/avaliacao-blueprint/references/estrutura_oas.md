# Estrutura do banco de OAs

A skill consome `oas_med_unidavi_*.json` da skill `capi-questoes-enamed/references/`.

**Resolução por glob, nunca por nome fixo de semestre.** O nome do arquivo muda a
cada migração de semestre (`_2026_1` → `_2026_2` → ...). Resolver por nome literal
tem um histórico de quebra silenciosa neste ecossistema: o validador da
`capi-questoes-enamed` fazia isso e, ao renomear a referência, parava de achar o
arquivo sem emitir nenhum erro (ver CHANGELOG da `capi-questoes-enamed` v2.0). Use
sempre o padrão glob e pegue o de nome mais alto (mais recente); **imprima qual
arquivo foi efetivamente usado** antes de montar o blueprint, para quem lê o
relatório saber sobre qual semestre ele fala.

## Hierarquia
```
fases
  fXX
    ucYY
      sps
        spZZ
          slug: "med_unidavi_fXX_ucYY_spZZ"
          numero: int
          titulo: string
          objetivos_aprendizagem: [
            { slug: "med_unidavi_fXX_ucYY_spZZ_oaNN", numero: int, texto: string }
          ]
```

## Cuidados
- Cobertura: fases 1–8. Fases 9–12 (internato) NÃO estão no banco (formato APC/Ten Cate).
- Algumas SPs têm `objetivos_aprendizagem: []` (vazio). Sinalizar como "OAs não cadastrados", NUNCA tratar como "sem lacunas".
- O `texto` do OA é literal do Manual Docente. O mapeamento de questão→OA deve respeitar esse texto, não interpretação livre.

## Taxonomia (segunda dependência)
Além do banco de OAs, a skill usa `capi-questoes-enamed/references/taxonomia_med_unidavi_*.json` (mesma regra de glob acima):
- `enums.nivel_bloom`, `enums.dificuldade_editorial`, `enums.area_eixo_dcn_2025`, `enums.competencia_dcn_2025`
- `competencias_dcn_2025_referencia.competencias[]` — as 27 competências com id, número romano, título curto, texto oficial e area_eixo.
- `fases[].ucs[]` — metadados de cada UC (nome, ementa, carga horária, ciclo, área clínica).
- `matriz_enamed_478_2025` (bloco embutido na própria taxonomia desde a v2.0 da `capi-questoes-enamed`) — metadados de vigência e o total de áreas/competências/cenários/conteúdos da Portaria 478/2025. Os rótulos por extenso estão em `capi-questoes-enamed/references/matriz_enamed_478_2025.json`.

Se a taxonomia não estiver acessível na sessão, peça ao usuário ou trabalhe só com a dimensão de cobertura temática, avisando que Bloom/competência/dificuldade ficam pendentes.

## Classificação fina por Matriz ENAMED 478/2025 (terceira dependência, opcional)
Questões produzidas pela `capi-questoes-enamed` v2.0 (ou provas reais já adequadas) podem trazer
`classificacao_fina.matriz_enamed_478_2025: {area, competencias[], conteudos[], cenario, justificativa}`
— ver `schema_questao_med_unidavi.json`. Quando presente, é o dado que permite medir cobertura
contra a matriz do exame de fato, e não só por aproximação via competência DCN. É opcional: nem
toda questão do lote vai ter essa classificação, e o blueprint não deve fabricá-la — apenas
reportar a dimensão como "não classificado" para as questões sem esse bloco.
