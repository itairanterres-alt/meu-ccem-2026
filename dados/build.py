# -*- coding: utf-8 -*-
"""Remonta, em planilha de dados, o conteúdo que estava embutido como IMAGENS
nos dashboards Simulado 01 e 02 (MED/ENAMED 2026)."""
import json
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter
from openpyxl.worksheet.table import Table, TableStyleInfo
import imgdata as D

LET = "ABCDE"
FASES = ["6ª Fase", "7ª Fase", "10ª Fase", "11ª Fase"]

def load(f):
    out = {}
    for i, c in enumerate(json.load(open(f)), start=1):
        d = {}
        for s in c['series']:
            v = [float(x) if x is not None else 0.0 for x in s['vals']]
            d[s['name']] = (v + [0.0]*5)[:5]
        out[i] = d
    return out

C1, C2 = load('charts1.json'), load('charts2.json')
GAB2 = open('gab_s2.txt').read().strip()

Q1 = [q for q in range(1, 41) if q != 24]            # 39 questões analisadas
Q2 = list(range(1, 61))
GAB = {"Simulado 01": {q: D.GAB_S1[q-1] for q in range(1, 41)},
       "Simulado 02": {q: GAB2[q-1] for q in Q2}}
N = {"Simulado 01": {f: len(D.S1_ALUNOS[f]) for f in FASES},
     "Simulado 02": {f: len(D.S2_ALUNOS[f]) for f in FASES}}
CH = {"Simulado 01": (C1, Q1), "Simulado 02": (C2, Q2)}
# Chave efetivamente aplicada pelo dashboard. Difere do gabarito oficial só na Q39 do
# Simulado 01: o PDF traz D, mas gráficos, % de acerto e notas foram calculados com E
# (e E é a alternativa correta pelo enunciado). Usar a chave do dashboard é o que faz a
# soma dos acertos por questão fechar com a soma dos acertos dos alunos nas 4 fases.
KEY = {s_: dict(g) for s_, g in GAB.items()}
KEY["Simulado 01"][39] = "E"
NOTA_Q39 = "Dashboard pontuou E (soma fecha com as notas); gabarito oficial do PDF indica D"
BASE_PCT = {"Simulado 01": 39, "Simulado 02": 60}     # denominador do %Acertos no dashboard
# Q24/S01: anulada. Não tem aba, gráfico nem linha nas imagens: não há dado algum.

def dist(sim, qn):
    """% por alternativa A..E, por fase (do cache dos gráficos)."""
    ch, qs = CH[sim]
    return ch[qs.index(qn) + 1]

# ---------------------------------------------------------------- estilo
ARIAL      = "Arial"
HDR_FILL   = PatternFill("solid", fgColor="1F4E5F")
HDR_FONT   = Font(name=ARIAL, size=10, bold=True, color="FFFFFF")
CELL_FONT  = Font(name=ARIAL, size=10)
NOTE_FONT  = Font(name=ARIAL, size=10, italic=True, color="7A5200")
TITLE_FONT = Font(name=ARIAL, size=14, bold=True, color="1F4E5F")
THIN       = Side(style="thin", color="BFBFBF")
BORDER     = Border(left=THIN, right=THIN, top=THIN, bottom=THIN)
ALT_FILL   = PatternFill("solid", fgColor="F2F7F9")
FLAG_FILL  = PatternFill("solid", fgColor="FFF3CD")

wb = Workbook()

def sheet(name, headers, rows, widths, numfmt=None, freeze="A2", flag_col=None):
    ws = wb.create_sheet(name)
    ws.append(headers)
    for c in range(1, len(headers)+1):
        cell = ws.cell(1, c); cell.font = HDR_FONT; cell.fill = HDR_FILL
        cell.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)
        cell.border = BORDER
    for r in rows:
        ws.append(r)
    for i, r in enumerate(ws.iter_rows(min_row=2, max_row=ws.max_row), start=2):
        flagged = flag_col and ws.cell(i, flag_col).value not in (None, "", "OK")
        for cell in r:
            cell.font = CELL_FONT; cell.border = BORDER
            if flagged:      cell.fill = FLAG_FILL
            elif i % 2 == 0: cell.fill = ALT_FILL
    for col, w in enumerate(widths, start=1):
        ws.column_dimensions[get_column_letter(col)].width = w
    if numfmt:
        for col, fmt in numfmt.items():
            for i in range(2, ws.max_row+1):
                ws.cell(i, col).number_format = fmt
                ws.cell(i, col).alignment = Alignment(horizontal="center")
    ws.freeze_panes = freeze
    ws.auto_filter.ref = f"A1:{get_column_letter(len(headers))}{ws.max_row}"
    ws.row_dimensions[1].height = 30
    return ws

# ================================================================ 1. ALUNOS
rows = []
BLOCOS = {}
for sim, src in (("Simulado 01", D.S1_ALUNOS), ("Simulado 02", D.S2_ALUNOS)):
    for f in FASES:
        ini = len(rows) + 2
        for item in src[f]:
            nome, ac = item[0], item[1]
            rows.append([sim, f, nome, ac, BASE_PCT[sim], None, None, None])
        BLOCOS[(sim, f)] = (ini, len(rows) + 1)
ws = sheet("Alunos",
    ["Simulado", "Fase", "Nome do acadêmico", "Acertos", "Base do %\n(questões)",
     "% Acertos", "Posição na fase", "Posição no simulado"],
    rows, [12, 10, 40, 10, 12, 11, 13, 15], freeze="D2")
last = ws.max_row
for i in range(2, last+1):
    ws.cell(i, 6).value = f"=IF(E{i}=0,\"\",D{i}/E{i})"
    ws.cell(i, 7).value = (f"=SUMPRODUCT(($A$2:$A${last}=A{i})*($B$2:$B${last}=B{i})"
                           f"*($D$2:$D${last}>D{i}))+1")
    ws.cell(i, 8).value = (f"=SUMPRODUCT(($A$2:$A${last}=A{i})*($D$2:$D${last}>D{i}))+1")
    ws.cell(i, 6).number_format = "0.00%"
    for c in (4, 5, 6, 7, 8):
        ws.cell(i, c).alignment = Alignment(horizontal="center")
ws_alunos_last = last

# ================================================================ 2. QUESTÕES (largo)
hdr = ["Simulado", "Questão", "Gabarito\n(chave do dashboard)"]
for f in FASES: hdr += [f"Acertos {f}", f"% {f}"]
hdr += ["Total de acertos", "Total de alunos", "% geral", "Dificuldade", "Situação"]
rows = []
for sim in ("Simulado 01", "Simulado 02"):
    qall = range(1, 41) if sim == "Simulado 01" else Q2
    for qn in qall:
        anulada = (sim == "Simulado 01" and qn == 24)
        r = [sim, qn, KEY[sim][qn]]
        for f in FASES:
            n = None if anulada else round(dist(sim, qn)[f][LET.index(KEY[sim][qn])] * N[sim][f])
            r += [n, None]
        r += [None, None if anulada else sum(N[sim].values()), None, None,
              "ANULADA - sem dados no dashboard" if anulada
              else (NOTA_Q39 if (sim == "Simulado 01" and qn == 39) else "OK")]
        rows.append(r)
ws = sheet("Questões", hdr, rows,
           [12, 13, 13] + [11, 9]*4 + [14, 13, 10, 14, 66], freeze="D2", flag_col=16)
for i in range(2, ws.max_row+1):
    anul = ws.cell(i, 4).value is None      # questão anulada: sem acertos
    for k, f in enumerate(FASES):
        ac, pc = 4 + k*2, 5 + k*2
        nal = N[ws.cell(i,1).value][f]
        ws.cell(i, pc).value = None if anul else f"={get_column_letter(ac)}{i}/{nal}"
        ws.cell(i, pc).number_format = "0.00%"
    ws.cell(i, 12).value = None if anul else f"=D{i}+F{i}+H{i}+J{i}"
    ws.cell(i, 14).value = None if anul else f"=IF(M{i}=\"\",\"\",L{i}/M{i})"
    ws.cell(i, 14).number_format = "0.00%"
    ws.cell(i, 15).value = None if anul else (
        '=IF(N{r}>=0.85,"Muito fácil",IF(N{r}>=0.7,"Fácil",'
        'IF(N{r}>=0.4,"Médio",IF(N{r}>=0.2,"Difícil","Muito difícil"))))').format(r=i)
    for c in range(2, 15):
        ws.cell(i, c).alignment = Alignment(horizontal="center")

# ================================================================ 3. QUESTÃO x FASE (longo)
rows = []
for sim in ("Simulado 01", "Simulado 02"):
    qall = range(1, 41) if sim == "Simulado 01" else Q2
    for qn in qall:
        anulada = (sim == "Simulado 01" and qn == 24)
        for f in FASES:
            n = None if anulada else round(dist(sim, qn)[f][LET.index(KEY[sim][qn])] * N[sim][f])
            rows.append([sim, qn, f, KEY[sim][qn], None if anulada else N[sim][f], n, None,
                         "ANULADA - sem dados no dashboard" if anulada
                         else (NOTA_Q39 if (sim == "Simulado 01" and qn == 39) else "OK")])
ws = sheet("Questão x Fase", ["Simulado", "Questão", "Fase", "Gabarito\n(chave do dashboard)",
                              "Alunos na fase", "Acertos", "% de acerto", "Situação"],
           rows, [12, 9, 10, 13, 13, 10, 12, 62], freeze="D2", flag_col=8)
for i in range(2, ws.max_row+1):
    if ws.cell(i, 6).value is not None:      # questão anulada fica sem fórmula
        ws.cell(i, 7).value = f"=IF(E{i}=0,\"\",F{i}/E{i})"
    ws.cell(i, 7).number_format = "0.00%"
    for c in range(2, 8): ws.cell(i, c).alignment = Alignment(horizontal="center")

# ================================================================ 4. DISTRIBUIÇÃO DAS RESPOSTAS
rows = []
for sim in ("Simulado 01", "Simulado 02"):
    qs = CH[sim][1]
    for qn in qs:
        d = dist(sim, qn)
        for f in FASES:
            for li, L in enumerate(LET):
                n = round(d[f][li] * N[sim][f])
                if n == 0 and d[f][li] == 0.0 and L == "E" and all(d[ff][4] == 0 for ff in FASES):
                    continue          # alternativa E inexistente (questões com 4 alternativas)
                rows.append([sim, qn, f, L, "Sim" if L == KEY[sim][qn] else "Não",
                             N[sim][f], n, None])
ws = sheet("Distribuição respostas",
           ["Simulado", "Questão", "Fase", "Alternativa", "É o gabarito?",
            "Alunos na fase", "Nº de respostas", "% das respostas"],
           rows, [12, 9, 10, 11, 13, 13, 14, 13], freeze="E2")
for i in range(2, ws.max_row+1):
    ws.cell(i, 8).value = f"=IF(F{i}=0,\"\",G{i}/F{i})"
    ws.cell(i, 8).number_format = "0.00%"
    for c in range(2, 9): ws.cell(i, c).alignment = Alignment(horizontal="center")

# ================================================================ 5. RESUMO POR FASE
rows = []
for sim, src in (("Simulado 01", D.S1_ALUNOS), ("Simulado 02", D.S2_ALUNOS)):
    for f in FASES:
        rows.append([sim, f, len(src[f]), BASE_PCT[sim]] + [None]*7)
ws = sheet("Resumo por fase",
           ["Simulado", "Fase", "Nº de alunos", "Base do %\n(questões)", "Média de acertos",
            "% médio", "Mediana", "Mínimo", "Máximo", "Desvio-padrão", "Amplitude"],
           rows, [12, 10, 12, 12, 14, 11, 11, 10, 10, 14, 12], freeze="C2")
for i in range(2, ws.max_row+1):
    sim, f = ws.cell(i,1).value, ws.cell(i,2).value
    a, b = BLOCOS[(sim, f)]
    rng = f"Alunos!$D${a}:$D${b}"
    ws.cell(i, 5).value = f"=AVERAGE({rng})"
    ws.cell(i, 6).value = f"=E{i}/D{i}"
    ws.cell(i, 7).value = f"=MEDIAN({rng})"
    ws.cell(i, 8).value = f"=MIN({rng})"
    ws.cell(i, 9).value = f"=MAX({rng})"
    ws.cell(i,10).value = f"=STDEV({rng})"
    ws.cell(i,11).value = f"=I{i}-H{i}"
    for c in (5, 7, 10): ws.cell(i, c).number_format = "0.00"
    ws.cell(i, 6).number_format = "0.00%"
    for c in range(3, 12): ws.cell(i, c).alignment = Alignment(horizontal="center")

# ================================================================ 6. COMPARATIVO
# A 11ª Fase do Simulado 01 lista "Maria Amélia Vozniak Deluca" e a do Simulado 02
# "Maria Amélia Vozniak Deluca Schneider": é a mesma pessoa, com o sobrenome cortado
# na primeira imagem. Sem a fusão ela apareceria como dois alunos distintos.
MERGE = {"Maria Amélia Vozniak Deluca": "Maria Amélia Vozniak Deluca Schneider"}
s1 = {MERGE.get(n, n): (f, a, p) for f in FASES for n, a, p in D.S1_ALUNOS[f]}
s2 = {MERGE.get(n, n): (f, a) for f in FASES for n, a in D.S2_ALUNOS[f]}
rows = []
for n in sorted(set(s1) | set(s2), key=lambda x: x.lower()):
    a = s1.get(n); b = s2.get(n)
    rows.append([n, (a or b)[0], a[1] if a else None, None, b[1] if b else None, None, None,
                 "Nos dois simulados" if a and b else
                 ("Só no Simulado 01" if a else "Só no Simulado 02")])
ws = sheet("Comparativo S01 x S02",
           ["Nome do acadêmico", "Fase", "Acertos S01\n(base 39)", "% S01",
            "Acertos S02\n(base 60)", "% S02", "Variação (p.p.)", "Presença"],
           rows, [40, 10, 13, 11, 13, 11, 15, 20], freeze="C2")
for i in range(2, ws.max_row+1):
    ws.cell(i, 4).value = f'=IF(C{i}="","",C{i}/39)'
    ws.cell(i, 6).value = f'=IF(E{i}="","",E{i}/60)'
    ws.cell(i, 7).value = f'=IF(OR(C{i}="",E{i}=""),"",(F{i}-D{i})*100)'
    ws.cell(i, 4).number_format = "0.00%"; ws.cell(i, 6).number_format = "0.00%"
    ws.cell(i, 7).number_format = "+0.00;-0.00;0.00"
    for c in range(2, 8): ws.cell(i, c).alignment = Alignment(horizontal="center")

# ================================================================ 0. LEIA-ME
ws = wb.create_sheet("Leia-me", 0)
ws.column_dimensions["A"].width = 26; ws.column_dimensions["B"].width = 112
ws["A1"] = "Simulados MED / ENAMED 2026 — dados remontados a partir dos dashboards"
ws["A1"].font = TITLE_FONT
ws.merge_cells("A1:B1")
linhas = [
 ("", ""),
 ("O que é este arquivo",
  "Os dois dashboards originais não continham dados em células: todas as abas estavam vazias e "
  "os números apareciam apenas como IMAGENS coladas (prints de tabelas dinâmicas) e como cache "
  "de gráficos. Este arquivo remonta esse conteúdo em tabelas de dados utilizáveis."),
 ("Fontes",
  "Dashboard_Simulado_01__MED__ENAMED_2026.xlsx (16 imagens; 12 com dados) · "
  "Dashboard_Simulado_02__MED__ENAMED_2026.xlsx (20 imagens; 16 com dados) · "
  "Gabarito_Simulado_1_2026.pdf · Simulado_01_2026.pdf · Simulado_02_20261.pdf"),
 ("Como foi extraído",
  "1) Nomes, acertos e %acertos dos alunos: lidos das imagens das abas '6ª/7ª/10ª/11ª Fase'. "
  "2) % de acerto por questão: lidos das imagens das abas 'Base ...' e conferidos contra o cache "
  "numérico dos gráficos das abas Q1..Qn, que traz os valores exatos. "
  "3) Distribuição de respostas por alternativa (A–E): extraída do cache dos gráficos."),
 ("Conferência", ""),
 ("  Simulado 02",
  "Fecha exatamente: para cada uma das 4 fases, a soma dos acertos por questão é idêntica à soma "
  "dos acertos dos alunos (diferença = 0). Isso valida as 240 porcentagens e os 120 totais lidos "
  "nas imagens."),
 ("  Simulado 01",
  "Fecha exatamente do mesmo modo, nas 4 fases (diferença = 0), usando a chave que o próprio "
  "dashboard aplicou. 38 das 39 questões analisadas coincidem com o gabarito oficial; a 39ª é a "
  "ressalva 1."),
 ("Ressalva 1 — Questão 39",
  "O gabarito oficial (PDF) indica D, mas todo o dashboard (gráficos, % de acerto e notas dos "
  "alunos) foi calculado com E. Pelo enunciado, E é a alternativa correta (definição de SRAG do "
  "Ministério da Saúde: síndrome gripal com dispneia, pressão persistente no tórax, SatO2 ≤94% "
  "ou cianose); D descreve critérios de agravamento em idosos. Ou seja, o dashboard está certo e "
  "o PDF do gabarito tem erro de digitação nessa questão. Esta planilha reproduz o dashboard: a "
  "coluna Gabarito traz D (oficial), mas os acertos são os que o dashboard contabilizou, com E. "
  "Se a intenção fosse mesmo D, a Q39 cairia de 14/23/22/19 acertos para 0/5/3/3 e todas as notas "
  "mudariam — por isso a divergência precisa ser decidida antes de usar estes números."),
 ("Ressalva 2 — Questão 24",
  "A Questão 24 foi anulada no Simulado 01: não tem aba, nem gráfico, nem linha nas imagens, e o "
  "%Acertos dos alunos é calculado sobre 39 questões. Não sobrou nenhum dado dela: a soma dos "
  "acertos por questão bate exatamente com a soma dos acertos dos alunos sem a Q24. Ela aparece "
  "nas abas de questões apenas como linha marcada em amarelo, sem valores."),
 ("Ressalva 3 — Gabarito do S02",
  "O PDF do Simulado 02 vem com a folha de gabarito em branco. O gabarito das 60 questões foi "
  "deduzido cruzando o cache dos gráficos com as % das imagens: em todas as 60 questões uma única "
  "alternativa reproduz a % de acerto simultaneamente nas 4 fases, e o resultado fecha com a soma "
  "de acertos dos alunos. Gabarito deduzido: " + GAB2),
 ("Ressalva 4 — nomes",
  "Os 126 nomes foram lidos duas vezes de forma independente (uma imagem por simulado) e 112 "
  "coincidem caractere a caractere, o que confirma essa leitura. Três casos exigiram intervenção: "
  "'Lucas Eduardo dos Santos Vian…' e 'Maria Eduarda Medeiros Macha…' estavam truncados na imagem "
  "da 10ª Fase do Simulado 01 e foram completados pela lista do Simulado 02; e 'Maria Amélia "
  "Vozniak Deluca' (S01) e 'Maria Amélia Vozniak Deluca Schneider' (S02) são a mesma aluna, "
  "unificadas na aba de comparativo. Os 13 nomes restantes que aparecem em um só simulado são "
  "mudanças reais de turma (a 11ª Fase perdeu 4 alunos e ganhou 6 entre as duas aplicações)."),
 ("", ""),
 ("Abas", ""),
 ("  Alunos", "Uma linha por aluno por simulado: fase, acertos, % e posição."),
 ("  Questões", "Uma linha por questão: gabarito e acertos/% por fase, % geral e dificuldade."),
 ("  Questão x Fase", "Mesma informação em formato longo, pronta para tabela dinâmica."),
 ("  Distribuição respostas", "Nº e % de alunos em cada alternativa A–E, por questão e por fase."),
 ("  Resumo por fase", "Estatísticas descritivas de cada fase em cada simulado."),
 ("  Comparativo S01 x S02", "Alunos presentes nos dois simulados e variação em pontos percentuais."),
 ("", ""),
 ("Observação",
  "Percentuais são fórmulas sobre as contagens; ao alterar um número de acertos, o resto recalcula."),
]
r = 2
for a, b in linhas:
    ws.cell(r, 1, a).font = Font(name=ARIAL, size=10, bold=not a.startswith("  ") and bool(a))
    c = ws.cell(r, 2, b)
    c.font = NOTE_FONT if a.startswith("Ressalva") else Font(name=ARIAL, size=10)
    c.alignment = Alignment(wrap_text=True, vertical="top")
    ws.cell(r, 1).alignment = Alignment(vertical="top")
    ws.row_dimensions[r].height = max(15, 13 * (len(b) // 105 + 1))
    r += 1
ws.sheet_view.showGridLines = False

del wb["Sheet"]
wb.save("Dados_Simulados_MED_ENAMED_2026.xlsx")
print("ok")
