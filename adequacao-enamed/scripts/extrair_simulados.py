#!/usr/bin/env python3
"""Extrai as questões dos Simulados MED-ENAMED 2026 (01 e 02) para JSON
intermediário, casando com os gabaritos oficiais.

Os simulados têm 5 alternativas (A-E). A extração é FIEL: preserva as cinco.
A conversão para 4 (A-D) acontece depois, no montador canônico, a partir da
decisão editorial de qual distrator descartar (nunca a correta).

Entrada : fontes/simulado0{1,2}_2026.txt  (texto extraído do PDF via pypdf)
Saída   : intermediario/simulados2026.json
"""
import re, json, os

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(BASE, "intermediario", "simulados2026.json")

GAB = {
    "simulado01_2026": list("EEEDABDEEBCAECEBCEEB" "ABDAEDEDDCAAACABBEDB"),
    "simulado02_2026": list("DBCCCDCBDADCBABBACCB" "ACDCBADABBACADABAABC"
                             "CDCBABBCADCCEEBDEDBC"),
}
TOTAL = {"simulado01_2026": 40, "simulado02_2026": 60}
ROTULO = {"simulado01_2026": "Simulado 01 — MED/ENAMED 2026",
          "simulado02_2026": "Simulado 02 — MED/ENAMED 2026"}

RUIDO = re.compile(
    r"^\s*(SIMULADO\s*\d+|Enamed\s*2026|FORMAÇÃO ESPECÍFICA|Gabarito|"
    r"Acadêmico\s*\(a\).*|Fase:.*|LEIA COM ATENÇÃO.*|\d+\s*)\s*$", re.I)
IMG_HINT = re.compile(r"genograma|figura|imagem|gráfico|conforme (o|a) "
                      r"(figura|imagem|gráfico|quadro)|a seguir apresentad|"
                      r"considere o (genograma|gráfico|quadro)", re.I)


def limpar(bloco):
    linhas = [ln for ln in bloco.split("\n") if not RUIDO.match(ln)]
    return "\n".join(linhas)


def norm(s):
    s = re.sub(r"\s+", " ", s.replace("\xad", "")).strip()
    return s


def parse_alternativas(corpo):
    """Retorna (enunciado, {A..E}) — alternativas podem estar inline."""
    m = re.search(r"(?m)^\s*A\)", corpo) or re.search(r"\bA\)", corpo)
    if not m:
        return norm(corpo), {}
    enun = corpo[:m.start()]
    rest = corpo[m.start():]
    alts = {}
    pat = re.compile(r"\b([A-E])\)\s*(.*?)(?=\b[A-E]\)|$)", re.S)
    for mm in pat.finditer(rest):
        L = mm.group(1)
        if L not in alts:            # 1ª ocorrência vence
            alts[L] = norm(mm.group(2))
    return norm(enun), alts


def extrair(nome):
    txt = open(os.path.join(BASE, "fontes", nome + ".txt"), encoding="utf-8").read()
    partes = re.split(r"Quest[ãa]o\s+0*(\d{1,2})\b", txt, flags=re.I)
    vistos, registros = set(), []
    pendente = None  # nº cujo cabeçalho veio sem corpo (erro de rótulo na prova)
    anomalias = []
    for i in range(1, len(partes) - 1, 2):
        num = int(partes[i])
        corpo = limpar(partes[i + 1])
        enun, alts = parse_alternativas(corpo)
        vazio = len([v for v in alts.values() if v]) < 2

        if vazio:
            # cabeçalho sem corpo: pode ser stub da folha de gabarito (fim do
            # PDF) ou rótulo duplicado — guarda para o próximo bloco.
            if 1 <= num <= TOTAL[nome] and num not in vistos:
                pendente = num
            continue

        if num in vistos or not (1 <= num <= TOTAL[nome]):
            # nº repetido/inválido logo após um cabeçalho órfão: o corpo é dele
            if pendente is not None:
                anomalias.append(f"Q{pendente}: rótulo duplicado na prova "
                                 f"('Questão {num}' repetido antes do enunciado)")
                num = pendente
                pendente = None
            else:
                continue
        else:
            pendente = None
        vistos.add(num)
        gab = GAB[nome][num - 1]
        registros.append({
            "id_origem": f"{nome}_q{num:02d}",
            "num": num,
            "fonte": ROTULO[nome],
            "enunciado": enun,
            "alternativas": {L: alts.get(L) for L in "ABCDE"},
            "gabarito": gab,
            "n_alternativas": len([L for L in "ABCDE" if alts.get(L)]),
            "requer_imagem": bool(IMG_HINT.search(enun)),
        })
    registros.sort(key=lambda r: r["num"])
    return registros, anomalias


def main():
    todos, resumo = [], []
    for nome in ("simulado01_2026", "simulado02_2026"):
        regs, anoms = extrair(nome)
        faltando = [n for n in range(1, TOTAL[nome] + 1)
                    if n not in {r["num"] for r in regs}]
        anomalas = [r["num"] for r in regs if r["n_alternativas"] not in (4, 5)]
        sem_gab = [r["num"] for r in regs
                   if r["gabarito"] not in ("A", "B", "C", "D", "E")]
        gab_fora = [r["num"] for r in regs
                    if not r["alternativas"].get(r["gabarito"])]
        resumo.append((nome, len(regs), TOTAL[nome], faltando, anomalas,
                       sem_gab, gab_fora,
                       [r["num"] for r in regs if r["requer_imagem"]], anoms))
        todos += regs
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    json.dump(todos, open(OUT, "w"), ensure_ascii=False, indent=2)

    for (nome, n, tot, falt, anom, sg, gf, img, anoms) in resumo:
        print(f"\n{nome}: {n}/{tot} questões")
        if falt: print(f"  !! não encontradas: {falt}")
        if anom: print(f"  fora do padrão 5 alternativas: {anom}")
        if sg:   print(f"  !! gabarito inválido: {sg}")
        if gf:   print(f"  !! gabarito aponta alternativa vazia: {gf}")
        if img:  print(f"  dependem de imagem: {img}")
        for a in anoms: print(f"  corrigido -> {a}")
    print(f"\nTotal: {len(todos)} questões -> {OUT}")


if __name__ == "__main__":
    main()
