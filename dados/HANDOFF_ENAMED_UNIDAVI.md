# HANDOFF — Análise ENAMED / Teste de Progresso · Medicina UNIDAVI

> Documento de passagem para retomar a análise em outra conversa. Autocontido:
> traz os números-chave, os métodos e a localização dos arquivos. Dado nominal de
> aluno — circulação restrita.

## 1. Contexto

Curso de Medicina UNIDAVI (Rio do Sul/SC), 12 fases, ~397–407 alunos.
Objetivo do trabalho: acompanhar desempenho por coorte, identificar alunos em
risco e recuperação, e projetar o resultado do **ENAMED 2026** (exame em outubro/2026).

Coortes de interesse (2º semestre 2026): **T8 = 12ª fase** (formandos), **T9 = 11ª fase**.
T7 já se formou. ENAMED 2025 real da UNIDAVI: **PCP 82% → Conceito 4** (5º de SC).

## 2. Fontes de dados (todas já processadas)

| Fonte | O que é | Formato do dado |
|---|---|---|
| Dashboard Simulado 01 2026 | 40 questões, fases 6/7/10/11 | imagens + cache de gráficos |
| Dashboard Simulado 02 2026 | 60 questões, fases 6/7/10/11 | imagens + cache de gráficos |
| Dashboard Simulado 03 2026 | **prova REAL do ENAMED**, 89 itens válidos, fases 7/8/11/12 | imagens + cache |
| Dashboard Simulado 02 2025 | 60 questões, fases 11/12 (elo da T8) | imagens + cache |
| TP NAPISUL 2022/2023/2025/2026 | teste de progresso, % por área, todas as fases | planilha coordenador |
| Mapa_Atencao_TP2026 | z na fase + trajetória por aluno | planilha nominal |
| Internato_NAPISUL_2026_painel | F9–F12, z, tendência | planilha nominal |

**IMPORTANTE (armadilha dos dashboards):** os dashboards de simulado NÃO têm dados
em células — os números vivem como **imagens coladas** e no **cache dos gráficos**.
Método de extração: ler imagens (OCR visual) + cruzar com o cache numérico dos
gráficos (`xl/charts/chartN.xml`, tags `c:numCache`) + validar por fechamento
(soma de acertos por questão = soma de acertos por aluno, por fase).

## 3. Gabaritos oficiais (conferidos)

- **Simulado 01/2026** (40q): `EEEDABDEEBCAECEBCEEB ABDAEDEDDCAAACABBEDB` — Q24 anulada.
  - **Q17 tem erro de gabarito**: oficial C, correta é B (88–94% marcaram B). Q20 idem, defeituosa.
  - **Q39**: dashboard usou E (correta); PDF do gabarito trazia D (erro de digitação).
- **Simulado 02/2026** (60q): `DBCCCDCBDADCBABBACCBACDCBADABBACADABAABCCDCBABBCADCCEEBDEDBC`
  - **Q59 provável erro de gabarito**: oficial B, conduta correta é C (57–90% marcaram C).
- **Simulado 03/2026** (prova real ENAMED, 90q):
  `AADCBBDCBABDDDCAABDA CDBACBDCBDCDDDCDBBCC DBCCACCADDBBCABBDAAC BCBBACAABDBADDBCBDBA CBACABDCCA` — Q24 e Q46 sem gráfico no dashboard.
  - **Q51 tem erro de chave no dashboard: registrada B, correta é A.** Vinheta de
    tireoidite subaguda de De Quervain; A = "captação de iodo radioativo reduzida +
    betabloqueador + AINE" (conduta correta). B = nódulo quente + tireoidectomia
    (adenoma tóxico, errado). 57,1% da 12ª marcou A. Sob a chave B, Q51 é o item mais
    anômalo da prova na 12ª (z = −2,87 DP); sob A normaliza (−0,72). Provável typo na
    montagem do dashboard, não erro do INEP.
  - Varredura "distrator vence a chave nas 4 fases" também sinaliza Q14, Q41, Q88, Q89
    como candidatas — mas são prova real (chave INEP autoritativa): mais provavelmente
    itens genuinamente difíceis, não erros. Só Q51 tem incompatibilidade clínica clara.
    Revisar conteúdo desses itens.

## 4. PROJEÇÃO ENAMED 2026 (resultado principal)

Métrica do conceito = **PCP** (% de concluintes proficientes, nota ≥ 60 TRI).
Faixas: <40→1 · 40–60→2 · 60–75→3 · **75–90→4** · ≥90→5.

**Barra de proficiência = 54/89 acertos (60,3%) na prova real.** Dupla âncora
convergente: reproduz os 82% de 2025 **e** coincide com os "60 pontos" do INEP.

Três medições independentes convergem:

| Fonte | PCP | Conceito |
|---|---|---|
| ENAMED 2025 real (âncora) | 82,0% | 4 |
| Projeção por Teste de Progresso | 83,1% | 4 |
| **Prova real (Simulado 03)** | **81,8%** | **4** |

Correlação prova-real × margem-projetada-por-TP: **r = 0,54** (validação cruzada).

**Por turma na prova real:** T8 (12ª) = **85,7%** proficientes (encosta no 5);
T9 (11ª) = **77,4%**. Se o conceito oficial contar só concluintes (12ª), leitura melhor.

**Conceito 4 é medição, não projeção.** Conceito 5 (PCP ≥ 90%) exige +6 proficientes
dos 66 → improvável, possível se quase todos os "duvidosos" virarem. Risco de cair
ao 3 é baixo (cenário pessimista ainda ~78%).

**Efeito da correção da Q51 no PCP (marginal):** corrigir para A dá +1 ponto a quem
marcou A (20 na 12ª, 7 na 11ª), melhorando margens. Na contagem de proficientes:
T8 (12ª) **não muda** (85,7% — nenhum marcador de A estava na barra−1); T9 (11ª) sobe
de 77,4% para até 80,6% (só Gabriel Olivo Leandro, em 53, cruzaria — condicional a ter
marcado A). Cohort: 81,8% → até 83,3%. **Conceito segue 4.** Ganho de média: 12ª +0,64 p.p.,
11ª +0,25 p.p. (Não dá para corrigir nota individual: só temos a contagem de quem marcou A
por fase, não a identidade — exceto os que estão na fronteira.)

### Zona de decisão (define entre 4-folgado e encosto no 5) — prioridade pedagógica
Taina Farias, Gabriel Olivo Leandro, Aline Agostini, Mariana Braatz Fagundes,
Luisa Cristina Matê, Yasmin Paes Turnes.

### Abaixo da barra na prova real (9) — plano estruturado
T9: Camila Cabral, Camila Debatin, Kerollin Waltrick, Marieva Niehues, Sofia Boldrini, Tassiane Thiesen.
T8: Yasmin Rafaela Braun, Maria Amélia Deluca, Luiza Tonet, Raquel Michels. (quase todos crônicos)

### Alerta de FORMATO (vão bem em prova curta, mal na de 90 itens)
Tassiane (−17 p.p. real vs simulado), Camila Cabral (−16), Kerollin (−13),
Sofia Boldrini (−10). Precisam de treino no formato longo, não de conteúdo.

## 5. ANÁLISE LONGITUDINAL (risco e recuperação)

Base de 407 alunos. Métrica comparável entre provas de perfis diferentes =
**z-score dentro do grupo de pares** (mesma fase/coorte, mesma onda). Ondas:
TP22 → TP23 → TP25 → Sim25 → S01-26 → TP26 → S02-26 → S03(prova real).

- **75 em risco em 2026** (z ≤ −1 em TP26 ou S02): 19 crônicos, 21 recorrentes,
  12 quedas em 2026, 6 quedas graduais, 17 sem histórico.
- **35 recuperados** (estiveram ≤ −1, hoje todos os sinais > −0,5) + 18 parciais.
- **Crônicos-alerta**: Kauany Wagner, Camila Debatin, Paula Fiamoncini, Poliana Akamine,
  Micheli Padilha, Taina Farias, Élton Junglos, Emanuela Tenfen (3–4 anos de flag).
- **8ª fase = caso de sucesso coletivo** (7 recuperados, nenhum crônico novo).

## 6. QUESTÕES MAIS ERRADAS (diagnóstico de conteúdo)

29 questões com acerto < 50% nos simulados 01/02. Concentração:
- **20 de 29 são Saúde Coletiva / Gestão do SUS / legislação** (não clínica).
  Gargalo = conteúdo normativo (Leis 8.080/8.142, RDC 36/2013, portarias, políticas nacionais).
- Por tipo: 12 "armadilhas" (1 distrator vence o gabarito), 7 conceito trocado,
  7 sem domínio, 3 erros de gabarito.
- Mais críticas na coorte ENAMED: S01-Q08 (evento adverso RDC36), S02-Q33 (valor
  preditivo/Bayes), S02-Q48 (ECA/recusa vacinal), S01-Q06 (equipe ribeirinha).
- Recomendação: revisão de véspera focada nas 12 armadilhas de Saúde Coletiva.

## 7. Onde estão os arquivos

**Repositório GitHub** (branch `claude/dashboard-data-spreadsheet-hhvvpb`), pasta `dados/`:
- `Dados_Simulados_MED_ENAMED_2026.xlsx` — dados brutos remontados dos dashboards
- `Trajetorias_Alunos_2022_2026.xlsx` — base longitudinal + risco + recuperação
- `Projecao_ENAMED_2026.xlsx` — projeção por teste de progresso
- `Projecao_ENAMED_2026_prova_real.xlsx` — projeção recalibrada (prova real) ← principal
- `Questoes_Mais_Erradas_Simulados_2026.xlsx` — ranking + temas + tipo de erro
- scripts `.py` (extração, validação, análise) + `README.md`

**Google Drive**: pasta "Simulados Enamed" (dashboards, PDFs, gabaritos).

## 8. Ressalvas metodológicas (carregar junto)

1. n pequeno por fase (21–38): diferenças de |z| < 0,3 ou de PCP < 5 p.p. são ruído.
2. A barra de proficiência (60,3%) é bem ancorada, mas o PCP é sensível a ela
   (a 65% raw, cairia para ~70% = conceito 3). Erro-padrão binomial ±4,7 p.p.
3. Coorte assumida = 66 (T8+T9). Se a lista oficial de concluintes diferir, refazer a conta.
4. TP e ENAMED medem coisas diferentes; a prova real (Simulado 03) é a melhor âncora.
5. Régua do painel de especialistas do INEP em 2026 é incógnita.
6. 4 erros de gabarito identificados (S01-Q17, S01-Q20, S02-Q59, S03-Q51) — não são erro de aluno.
