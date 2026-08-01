#!/usr/bin/env python3
"""Extrai as questões de três provas nacionais em PDF para JSON intermediário.

Provas (fontes/):
  1. simulado_nacional_enamed2025.pdf  — Estratégia MED, Simulado Nacional ENAMED
     2025. 24 págs, 50 questões, 5 alternativas (A–E), 2 colunas, SEM gabarito.
  2. enamed_simulado_2026_1.pdf        — FPS, Simulado ENAMED 2026.1.
     24 págs, 100 questões, 4 alternativas (A–D), 2 colunas, SEM gabarito.
  3. tpmed2025_gabarito.pdf            — TPMed 2025 (22/05), caderno COMENTADO.
     41 págs, 120 questões, 4 alternativas (A–D), 1 coluna (LaTeX),
     COM gabarito ("Alternativa Correta: (X)") e justificativa + bibliografia.

Saídas (intermediario/):
  - simulados_nacionais.json   — array com as 270 questões das três provas
  - tpmed2025_gabarito.json    — mapa questão -> letra do TPMed 2025

Também grava o texto extraído de cada PDF em fontes/<slug>.txt.

NÃO inventa conteúdo: só reestrutura o que está nos cadernos.

--------------------------------------------------------------------------
DE-COLUMNIZAÇÃO
--------------------------------------------------------------------------
Os dois cadernos em 2 colunas exigem reordenar a leitura (coluna esquerda
inteira, depois a direita) — mesma ideia de `extrair_enamed.decolumnize`.
Aqui há duas implementações, porque os dois PDFs respondem de forma oposta:

  * `linear_layout`  — usa `extract_text(extraction_mode="layout")` e acha o
    "corredor" de espaços por varredura de colunas (como no extrair_enamed),
    mas segmenta a página: blocos que ATRAVESSAM o corredor (questões que
    ocupam a largura toda) são lidos como estão, o resto é lido em 2 colunas.
    Ótimo no PDF da FPS; ruim no da Estratégia (texto justificado com espaços
    esticados destrói o corredor).

  * `linear_coord`   — reconstrói as linhas pelas coordenadas reais de cada
    run de texto (visitor_text) e separa as colunas pelo x da margem esquerda
    da 2ª coluna. Ótimo no PDF da Estratégia.

`melhor_linearizacao()` roda as duas e escolhe pela contagem de questões
completas (numeração sem buracos + conjunto de alternativas correto).
"""
import json
import os
import re
import statistics
import unicodedata
from collections import Counter

from pypdf import PdfReader

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FONTES = os.path.join(BASE, "fontes")
INTER = os.path.join(BASE, "intermediario")
OUT = os.path.join(INTER, "simulados_nacionais.json")
OUT_GAB = os.path.join(INTER, "tpmed2025_gabarito.json")


# ==========================================================================
# 1) De-columnização por LAYOUT (corredor de espaços)
# ==========================================================================
def _corredor(linhas):
    """Coluna (índice de caractere) do corredor vertical entre as 2 colunas."""
    uteis = [l for l in linhas if len(l.strip()) > 30]
    if len(uteis) < 5:
        return None
    largura = max(len(l) for l in uteis)
    melhor, melhor_n = None, 0
    for c in range(int(largura * 0.30), int(largura * 0.70)):
        n = sum(1 for l in uteis if len(l) > c + 3 and l[c - 2:c + 3].strip() == "")
        if n > melhor_n:
            melhor_n, melhor = n, c
    if melhor is None or melhor_n < 0.40 * len(uteis):
        return None  # página de coluna única (capa, instruções, questão larga)
    return melhor


def _decol_layout(linhas):
    g = _corredor(linhas)
    if g is None:
        return [l.rstrip() for l in linhas], 1

    def tipo(l):
        if len(l) > g + 3 and l[g - 2:g + 3].strip() != "":
            return "F"            # atravessa o corredor -> linha de largura total
        return "R" if l[g:].strip() else "A"   # A = só coluna esquerda (ambígua)

    # região de largura total = linhas F, esticadas para cima/baixo enquanto
    # as vizinhas forem ambíguas (parte do mesmo bloco) e não em branco.
    larga = set()
    for i, l in enumerate(linhas):
        if not l.strip() or tipo(l) != "F":
            continue
        larga.add(i)
        j = i - 1
        while j >= 0 and linhas[j].strip() and tipo(linhas[j]) != "R":
            larga.add(j)
            j -= 1
        j = i + 1
        while j < len(linhas) and linhas[j].strip() and tipo(linhas[j]) != "R":
            larga.add(j)
            j += 1

    segmentos = []
    for i, l in enumerate(linhas):
        t = "F" if i in larga else "C"
        if segmentos and segmentos[-1][0] == t:
            segmentos[-1][1].append(l)
        else:
            segmentos.append([t, [l]])

    saida = []
    for t, bloco in segmentos:
        if t == "F":
            saida += [l.rstrip() for l in bloco if l.strip()]
            continue
        esq, dir_ = [], []
        for l in bloco:
            a, b = l[:g].rstrip(), l[g:].rstrip()
            # respingo de texto justificado que passou do corredor
            if a and len(b.strip()) < 4:
                a, b = (a + " " + b.strip()).rstrip(), ""
            # o mesmo respingo, mas colado no início da coluna da direita
            b = re.sub(r"^(\s*)\S{1,4}\s{6,}(?=\S)", r"\1", b)
            if a:
                esq.append(a)
            if b.strip():
                dir_.append(b)
        saida += esq + dir_
    return saida, 2


def linear_layout(pdf):
    rd = PdfReader(pdf)
    out = []
    for i, pg in enumerate(rd.pages, 1):
        bruto = (pg.extract_text(extraction_mode="layout") or "").split("\n")
        linhas, nc = _decol_layout(bruto)
        out.append(f"----- Page {i} (cols={nc}) -----")
        out += linhas
    return "\n".join(out)


# ==========================================================================
# 2) De-columnização por COORDENADAS
# ==========================================================================
def _runs(pg):
    """Trechos de texto com sua posição (x, y) na página."""
    out = []

    def visitor(texto, cm, tm, fonte, tam):
        if not texto.strip():
            return
        y, x = round(tm[5], 1), round(tm[4], 1)
        t = texto.replace("\n", " ")
        if y == 0.0 and x == 0.0 and out:
            # run degenerado (sem matriz própria): continua o anterior, inline
            p = out[-1]
            y, x, t = p["y"], p["x"] + 0.001, t.lstrip()
        out.append({"y": y, "x": x, "t": t})

    pg.extract_text(visitor_text=visitor)
    return out


def _linhas_y(runs):
    runs = sorted(runs, key=lambda r: (-r["y"], r["x"]))
    gs = []
    for r in runs:
        if gs and abs(gs[-1][0]["y"] - r["y"]) <= 2.0:
            gs[-1].append(r)
        else:
            gs.append([r])
    for g in gs:
        g.sort(key=lambda r: r["x"])
    return gs


def _larg_char(linhas):
    """Largura média de um caractere, medida entre runs contíguos."""
    rs = []
    for g in linhas:
        for a, b in zip(g, g[1:]):
            n = len(a["t"])
            if n >= 4:
                d = (b["x"] - a["x"]) / n
                if 2.0 <= d <= 9.0:
                    rs.append(d)
    return rs


def _x_coluna2(runs, largura):
    """x da margem esquerda da 2ª coluna (None => página de coluna única)."""
    cands = sorted({r["x"] for r in runs if r["x"] >= largura * 0.42})
    melhor, melhor_n = None, 0
    for c in cands:
        n = sum(1 for r in runs if c <= r["x"] <= c + 34)
        if n > melhor_n:
            melhor_n, melhor = n, c
    if melhor is None or melhor_n < 0.12 * len(runs) or melhor_n < 6:
        return None
    return melhor


def _monta(runs, cw, x0):
    """Reconstrói a linha respeitando os vãos horizontais entre os runs."""
    buf = ""
    for r in runs:
        col = int(round((r["x"] - x0) / cw))
        if col > len(buf):
            buf += " " * (col - len(buf))
        buf += r["t"]
    return re.sub(r"\s+", " ", buf).strip()


def linear_coord(pdf):
    rd = PdfReader(pdf)
    paginas = [_runs(p) for p in rd.pages]
    linhas_pg = [_linhas_y(r) for r in paginas]
    todas = [x for ls in linhas_pg for x in _larg_char(ls)]
    cw_doc = statistics.median(todas) if len(todas) >= 20 else 4.5

    out = []
    for i, (pg, runs, ls) in enumerate(zip(rd.pages, paginas, linhas_pg), 1):
        if not runs:
            out += [f"----- Page {i} (cols=1) -----", ""]
            continue
        amostra = _larg_char(ls)
        cw = statistics.median(amostra) if len(amostra) >= 8 else cw_doc
        largura = float(pg.mediabox.width)
        c2 = _x_coluna2(runs, largura)
        x0 = min(r["x"] for r in runs)
        if c2 is None:
            corpo = "\n".join(t for t in (_monta(g, cw, x0) for g in ls) if t)
            nc = 1
        else:
            g0 = c2 - 4
            longe = c2 + 0.25 * (largura - c2)
            esq, dir_ = [], []
            for g in ls:
                a = [r for r in g if r["x"] < g0]
                b = [r for r in g if r["x"] >= g0]
                # linha de largura total: a "cauda" à direita pertence à esquerda
                if a and b and min(r["x"] for r in b) > longe:
                    a, b = a + b, []
                if a:
                    esq.append(_monta(a, cw, x0))
                if b:
                    dir_.append(_monta(b, cw, c2))
            corpo = "\n".join([t for t in esq if t] + [t for t in dir_ if t])
            nc = 2
        out += [f"----- Page {i} (cols={nc}) -----", corpo]
    texto = "\n".join(out)
    return re.sub(r"(?m)^([A-E]\))(?=\S)", r"\1 ", texto)


# ==========================================================================
# 3) Normalização de texto
# ==========================================================================
ACENTO = {"´": "́", "˜": "̃", "ˆ": "̂",
          "¸": "̧", "`": "̀", "¨": "̈"}


# radicais de 1-2 letras que na verdade são palavras: "de ´ıons" = "de íons",
# nunca "deíons". Só nesses casos o í NÃO é colado à palavra anterior.
_STOP_I = {"a", "o", "e", "é", "as", "os", "da", "do", "de", "na", "no", "em",
           "um", "ao", "se", "ou", "por", "com", "que", "sem"}


def desLatex(s):
    """Remonta acentos do PDF gerado em LaTeX ('condi¸ c˜ ao' -> 'condição')."""
    s = re.sub(r"(\w)-\s*\n\s*(\w)", r"\1\2", s)          # hifenização de fim de linha
    s = s.replace("ı", "i")                                # i sem pingo (LaTeX \i)
    # 'caracter ´ ısticas' -> 'caracter´ısticas' -> 'características'
    s = re.sub(r"([A-Za-zÀ-ÿ]+)\s+(´\s*i)",
               lambda m: m.group(1) + m.group(2) if m.group(1).lower() not in _STOP_I
               else m.group(0), s)
    s = re.sub(r"([´˜ˆ¸`¨])\s+", r"\1", s)                 # espaço depois do acento
    s = re.sub(r"([´˜ˆ¸`¨])([A-Za-z])",
               lambda m: unicodedata.normalize("NFC", m.group(2) + ACENTO[m.group(1)]), s)
    return s


def norm(s):
    s = s.replace("\xad", "").replace("​", "")
    s = re.sub(r"\s+", " ", s).strip()
    return s


CURTAS = set("""a o e é as os da de do di na no em um uma uns ao aos às à das dos nas nos
por para per com sem sob sobre se sua seu suas seus que qual quais quem cujo mais mas
menos já há até pelo pela pelos pelas ou nem foi ser sao são tem têm ter teve era eram
esta este isso essa esse aquele lhe nao não sim tal via ano anos dia dias mg ml kg dl
bpm mmhg irpm anti pos pre pós pré caso qual""".split())


def _e_palavra(frag, vocab):
    f = frag.lower()
    return f in vocab or f in CURTAS


def corrigir_quebras(registros):
    """Junta palavras partidas pela extração ('caracter ísticas' -> 'características').
    Usa o vocabulário do próprio corpus: só junta se a forma unida existir no
    corpus e pelo menos um dos fragmentos NÃO for palavra."""
    def campos(r):
        yield ("enunciado", None)
        for L in "ABCDE":
            if r["alternativas"].get(L):
                yield ("alternativas", L)

    def get(r, c, L):
        return r["alternativas"][L] if L else r[c]

    def put(r, c, L, v):
        if L:
            r["alternativas"][L] = v
        else:
            r[c] = v

    corpus = " ".join(get(r, c, L) for r in registros for c, L in campos(r))
    cnt = Counter(w.lower() for w in re.findall(r"[A-Za-zÀ-ÿ]{4,}", corpus))
    vocab = {w for w, n in cnt.items() if n >= 2}

    padrao = re.compile(r"\b([A-Za-zÀ-ÿ]+)\s([A-Za-zÀ-ÿ]+)\b")
    juncoes = []

    def sub(m):
        a, b = m.group(1), m.group(2)
        unido = a + b
        if (unido.lower() in vocab and len(unido) >= 5
                and not (_e_palavra(a, vocab) and _e_palavra(b, vocab))):
            juncoes.append(f"{a} {b} -> {unido}")
            return unido
        return m.group(0)

    for r in registros:
        for c, L in list(campos(r)):
            t = get(r, c, L)
            novo = padrao.sub(sub, t)
            novo = re.sub(r"(?<=[a-zà-ÿ])\s+-\s*(?=[a-zà-ÿ])", "-", novo)
            if novo != t:
                put(r, c, L, novo.strip())
    return juncoes


# `requer_imagem`: só referência EXPLÍCITA a um elemento gráfico mostrado.
# Deliberadamente fora da lista: "quadro" (quadro clínico) e qualquer coisa
# que casaria com "configura" (o \b de "figura" já impede).
_GRAF = (r"(?:figura|imagem|imagens|gr[áa]fico|gr[áa]ficos|charge|fotografia|foto|"
         r"ilustra[çc][ãa]o|esquema|fluxograma|partograma|genograma|tra[çc]ado|"
         r"eletrocardiograma|ecg|radiografia|tomografia|ultrassonografia|"
         r"ecocardiograma|ressonância|exame de imagem)")
_DEIT = (r"(?:a seguir|abaixo|ao lado|apresentad\w+|mostrad\w+|ilustrad\w+|"
         r"exibid\w+|seguinte|acima|a\s?baixo)")
IMG_HINT = re.compile(
    rf"\b{_GRAF}\b[^.?!]{{0,60}}?\b{_DEIT}\b"
    rf"|\b{_DEIT}\b[^.?!]{{0,30}}?\b{_GRAF}\b"
    rf"|\b(?:observe|analise|considere|conforme|de acordo com|com base n\w+)\b"
    rf"[^.?!]{{0,25}}?\b{_GRAF}\b"
    rf"|\bachado abaixo\b|\bcom a imagem\b",
    re.I)


# ==========================================================================
# 4) Provas
# ==========================================================================
PROVAS = [
    {
        "slug": "simulado_nacional_enamed2025",
        "rotulo": "Simulado Nacional ENAMED 2025 — Estratégia MED",
        "total": 50,
        "letras": "ABCDE",
        # "1.  (Estratégia MED 2025 – Prof. Fulano) ..."
        "re_q": r"(?m)^[ \t]*(\d{1,3})\.\s+(?=\(Estrat[ée]gia)",
        "re_alt": r"(?m)^[ \t]*([A-E])\)\s",
        "re_cab": r"^\s*\(Estrat[ée]gia[^)]*\)\s*",
        "ruido": (r"^(ENAMED|CADERNO DE QUEST[ÕO]ES|PREENCHA SEU GABARITO|"
                  r"med\.estrategia\.com|Estrat[ée]gia MED\b.*|@estrategiamed|"
                  r"t\.me/estrategiamed.*|/estrategiamed|INSTRU[ÇC][ÕO]ES|"
                  r"CL[ÍI]NICA M[ÉE]DICA|CIRURGIA|PEDIATRIA|GINECOLOGIA E OBSTETR[ÍI]CIA|"
                  r"MEDICINA (DA FAM[ÍI]LIA|PREVENTIVA).*|SA[ÚU]DE COLETIVA|"
                  r"----- Page.*|\d{1,3})$"),
    },
    {
        "slug": "enamed_simulado_2026_1",
        "rotulo": "Simulado ENAMED 2026.1 — Faculdade Pernambucana de Saúde (FPS)",
        "total": 100,
        "letras": "ABCD",
        "re_q": r"(?m)^[ \t]*Q\s?UEST[ÃA]O\s+(\d{1,3})\b",
        "re_alt": r"(?m)^[ \t]*([A-D])\)\s",
        "re_cab": None,
        "ruido": (r"^(FACULDADE PERNAMBUCANA DE SA[ÚU]DE|FPS\..*|Simulado ENAMED|"
                  r"20\d\d\.\d|\d\d/\d\d/20\d\d|LEIA COM ATEN[ÇC][ÃA]O|"
                  r"NOME:.*|CURSO/PERIODO:.*|SALA:.*|CPF:.*|----- Page.*|\d{1,3})$"),
    },
]

TPMED = {
    "slug": "tpmed2025_gabarito",
    "rotulo": "TPMed 2025 (22/05) — caderno comentado",
    "total": 120,
    "letras": "ABCD",
}


def blocos(texto, re_q, total):
    """Divide o texto linearizado em blocos por número de questão."""
    partes = re.split(re_q, texto)
    d = {}
    for i in range(1, len(partes) - 1, 2):
        n = int(partes[i])
        if 1 <= n <= total and n not in d:
            d[n] = partes[i + 1]
    return d


def parse_alternativas(corpo, re_alt, letras):
    """Devolve (enunciado, {letra: texto}) a partir do corpo da questão."""
    marcas = list(re.finditer(re_alt, corpo))
    # descarta marcas fora de ordem (respingo de outra coluna)
    seq, esperado = [], 0
    for m in marcas:
        L = m.group(1)
        if esperado < len(letras) and L == letras[esperado]:
            seq.append(m)
            esperado += 1
    if not seq:
        return norm(corpo), {}
    enun = corpo[:seq[0].start()]
    alts = {}
    for k, m in enumerate(seq):
        fim = seq[k + 1].start() if k + 1 < len(seq) else len(corpo)
        alts[m.group(1)] = norm(corpo[m.end():fim])
    return norm(enun), alts


def limpar(texto, ruido):
    rx = re.compile(ruido, re.I)
    return "\n".join(l for l in texto.split("\n") if not rx.match(l.strip()))


def qualidade(texto, prova):
    """Nº de questões achadas com o conjunto completo de alternativas."""
    d = blocos(texto, prova["re_q"], prova["total"])
    ok = 0
    for corpo in d.values():
        _, alts = parse_alternativas(corpo, prova["re_alt"], prova["letras"])
        if all(alts.get(L) for L in prova["letras"]):
            ok += 1
    return ok


def melhor_linearizacao(pdf, prova):
    cands = [("layout", linear_layout(pdf)), ("coord", linear_coord(pdf))]
    pontuado = [(qualidade(t, prova), nome, t) for nome, t in cands]
    pontuado.sort(key=lambda x: -x[0])
    return pontuado[0][2], pontuado[0][1], {n: q for q, n, _ in pontuado}


def extrair_caderno(prova):
    pdf = os.path.join(FONTES, prova["slug"] + ".pdf")
    texto, metodo, scores = melhor_linearizacao(pdf, prova)
    # quebra de linha no hífen: nos dois cadernos o hífen é sempre real
    # ("pronto-\nsocorro", "apresenta-\nse") — mantém o hífen, tira a quebra.
    texto = re.sub(r"([A-Za-zÀ-ÿ])-\s*\n\s*([A-Za-zÀ-ÿ])", r"\1-\2", texto)
    with open(os.path.join(FONTES, prova["slug"] + ".txt"), "w", encoding="utf-8") as f:
        f.write(texto)

    corpo_limpo = limpar(texto, prova["ruido"])
    d = blocos(corpo_limpo, prova["re_q"], prova["total"])
    registros = []
    for n in sorted(d):
        enun, alts = parse_alternativas(d[n], prova["re_alt"], prova["letras"])
        if prova["re_cab"]:
            enun = re.sub(prova["re_cab"], "", enun)
        registros.append({
            "id_origem": f"{prova['slug']}_q{n:03d}",
            "fonte": prova["rotulo"],
            "num": n,
            "enunciado": norm(enun),
            "alternativas": {L: alts.get(L) for L in "ABCDE"},
            "gabarito": None,          # o caderno não traz gabarito
            "justificativa_oficial": None,
            "n_alternativas": len(prova["letras"]),
            "requer_imagem": bool(IMG_HINT.search(enun)),
        })
    return registros, metodo, scores


# ---------------------------------------------------------------- TPMed ---
RE_TP_Q = r"(?m)^\s*(\d{1,3})\.\s"
RE_TP_ALT = r"(?m)^\s*([A-D])\.\s"
RE_TP_GAB = re.compile(r"Alternativa\s*Correta\s*:?\s*\(?([A-D])\)?", re.I)


def extrair_tpmed():
    slug = TPMED["slug"]
    rd = PdfReader(os.path.join(FONTES, slug + ".pdf"))
    partes = []
    for i, pg in enumerate(rd.pages, 1):
        partes.append(f"----- Page {i} -----")
        partes.append(pg.extract_text() or "")     # 1 coluna: modo simples
    texto = desLatex("\n".join(partes))
    with open(os.path.join(FONTES, slug + ".txt"), "w", encoding="utf-8") as f:
        f.write(texto)

    texto = "\n".join(l for l in texto.split("\n")
                      if not re.match(r"^\s*(----- Page.*|\d{1,3}\s*/\s*\d{1,3})\s*$", l))

    d = blocos(texto, RE_TP_Q, TPMED["total"])
    registros, gabarito = [], {}
    for n in sorted(d):
        corpo = d[n]
        m = RE_TP_GAB.search(corpo)
        questao = corpo[:m.start()] if m else corpo
        enun, alts = parse_alternativas(questao, RE_TP_ALT, "ABCD")
        just = None
        if m:
            resto = corpo[m.end():]
            resto = re.split(r"Bibliografia\s*:", resto)[0]
            just = norm(resto) or None
        letra = m.group(1).upper() if m else None
        gabarito[n] = letra
        registros.append({
            "id_origem": f"{slug}_q{n:03d}",
            "fonte": TPMED["rotulo"],
            "num": n,
            "enunciado": norm(enun),
            "alternativas": {L: alts.get(L) for L in "ABCDE"},
            "gabarito": letra,
            "justificativa_oficial": just,
            "n_alternativas": 4,
            "requer_imagem": bool(IMG_HINT.search(enun)),
        })
    return registros, gabarito


# ==========================================================================
# 5) Main / verificação
# ==========================================================================
def relatorio(nome, regs, total, letras):
    achados = {r["num"] for r in regs}
    buracos = [n for n in range(1, total + 1) if n not in achados]
    incompletas = [r["num"] for r in regs
                   if not all(r["alternativas"].get(L) for L in letras)]
    imgs = [r["num"] for r in regs if r["requer_imagem"]]
    print(f"\n=== {nome}")
    print(f"  extraídas ............ {len(regs)}/{total}")
    print(f"  numeração máxima ..... {max(achados) if achados else 0}")
    print(f"  buracos na numeração . {buracos if buracos else 'nenhum'}")
    print(f"  alternativas faltando  {len(incompletas)} {incompletas if incompletas else ''}")
    print(f"  gabarito ............. "
          f"{sum(1 for r in regs if r['gabarito'])}/{len(regs)} questões")
    print(f"  requer_imagem ........ {len(imgs)} {imgs}")
    return buracos, incompletas


def amostra(regs, n=None):
    r = next((x for x in regs if x["num"] == n), regs[0]) if n else regs[0]
    print(f"\n  --- amostra {r['id_origem']} ---")
    print(f"  enunciado: {r['enunciado'][:320]}...")
    for L in "ABCDE":
        v = r["alternativas"].get(L)
        if v:
            print(f"    {L}) {v[:110]}")
    print(f"  gabarito={r['gabarito']}  n_alt={r['n_alternativas']}  "
          f"img={r['requer_imagem']}")


def main():
    os.makedirs(INTER, exist_ok=True)
    todos, problemas = [], []

    for prova in PROVAS:
        regs, metodo, scores = extrair_caderno(prova)
        juncoes = corrigir_quebras(regs)
        b, i = relatorio(prova["rotulo"], regs, prova["total"], prova["letras"])
        print(f"  de-columnização ...... '{metodo}' (scores {scores})")
        if juncoes:
            print(f"  palavras remontadas .. {len(juncoes)}")
        amostra(regs)
        if b or i:
            problemas.append((prova["slug"], b, i))
        todos += regs

    tp, gab = extrair_tpmed()
    juncoes = corrigir_quebras(tp)
    b, i = relatorio(TPMED["rotulo"], tp, TPMED["total"], "ABCD")
    if juncoes:
        print(f"  palavras remontadas .. {len(juncoes)}")
    amostra(tp)
    if b or i:
        problemas.append((TPMED["slug"], b, i))
    todos += tp

    with open(OUT, "w", encoding="utf-8") as f:
        json.dump(todos, f, ensure_ascii=False, indent=2)
    with open(OUT_GAB, "w", encoding="utf-8") as f:
        json.dump({
            "fonte": TPMED["rotulo"],
            "arquivo": TPMED["slug"] + ".pdf",
            "observacao": ("O PDF NÃO é uma folha de gabarito solta: é o caderno "
                           "comentado completo (enunciado + 4 alternativas + "
                           "'Alternativa Correta: (X)' + justificativa + bibliografia). "
                           "As 120 questões estão em simulados_nacionais.json."),
            "total": len(gab),
            "gabarito": {str(k): v for k, v in sorted(gab.items())},
        }, f, ensure_ascii=False, indent=2)

    print(f"\nTOTAL: {len(todos)} questões -> {OUT}")
    print(f"Gabarito TPMed 2025 ({len(gab)} itens) -> {OUT_GAB}")
    if problemas:
        print("\n!! PENDÊNCIAS:")
        for slug, b, i in problemas:
            print(f"   {slug}: buracos={b} alternativas_incompletas={i}")
    else:
        print("\nSem buracos de numeração e sem alternativas faltando.")


if __name__ == "__main__":
    main()
