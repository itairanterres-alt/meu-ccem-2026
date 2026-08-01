#!/usr/bin/env python3
"""Lê os gabaritos definitivos do Revalida (INEP) e os aplica às questões já
extraídas em `intermediario/revalida.json`.

Formato da fonte (texto do PDF do INEP):
    GABARITO DEFINITIVO
    Questão 1 2 3 ... 20
    Gabarito B D - B ... C
    Questão 21 ...
    Gabarito ...
O traço ('-' ou o caractere de rasura U+0336) marca questão ANULADA.

Questões anuladas são marcadas `descartada: true` e ficam fora do banco.
"""
import json, os, re

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ALVO = os.path.join(BASE, "intermediario", "revalida.json")
FONTES = {
    "Revalida 2023.2 — Prova Objetiva": "revalida2023_2_gabarito.txt",
    "Revalida 2024.1 — Prova Objetiva": "revalida2024_1_gabarito.txt",
}
LETRAS = set("ABCDE")


def ler_gabarito(caminho):
    """Devolve {num: letra|None}. None = anulada."""
    txt = open(caminho, encoding="utf-8").read()
    # remove combinantes de rasura, mantendo o token como marca de anulada
    txt = txt.replace("̶", "-").replace("̵", "-")
    linhas = [l.strip() for l in txt.split("\n") if l.strip()]
    gab = {}
    for i, l in enumerate(linhas):
        if not l.lower().startswith("questão"):
            continue
        nums = [int(x) for x in re.findall(r"\d+", l)]
        # a linha seguinte que começa com 'Gabarito'
        prox = next((linhas[j] for j in range(i + 1, min(i + 3, len(linhas)))
                     if linhas[j].lower().startswith("gabarito")), None)
        if not prox or not nums:
            continue
        corpo = prox.split(None, 1)[1] if len(prox.split(None, 1)) > 1 else ""
        toks = corpo.split()
        if len(toks) != len(nums):
            raise ValueError(f"{caminho}: {len(toks)} respostas para "
                             f"{len(nums)} questões na faixa {nums[0]}-{nums[-1]}")
        for n, t in zip(nums, toks):
            gab[n] = t if t in LETRAS else None
    return gab


def main():
    regs = json.load(open(ALVO, encoding="utf-8"))
    gabs = {}
    for fonte, arq in FONTES.items():
        caminho = os.path.join(BASE, "fontes", arq)
        gabs[fonte] = ler_gabarito(caminho)
        validas = sum(1 for v in gabs[fonte].values() if v)
        anuladas = sorted(n for n, v in gabs[fonte].items() if not v)
        print(f"{fonte}: {len(gabs[fonte])} questões no gabarito | "
              f"válidas {validas} | anuladas {len(anuladas)} -> {anuladas}")

    faltando, aplicadas = [], 0
    for r in regs:
        g = gabs.get(r["fonte"], {})
        if r["num"] not in g:
            faltando.append(r["id_origem"])
            continue
        letra = g[r["num"]]
        r["gabarito"] = letra
        r["descartada"] = letra is None
        r["motivo_descarte"] = None if letra else "anulada no gabarito oficial do INEP"
        if letra:
            aplicadas += 1
            if not r["alternativas"].get(letra):
                faltando.append(f"{r['id_origem']} (gabarito {letra} sem alternativa)")
    json.dump(regs, open(ALVO, "w"), ensure_ascii=False, indent=2)

    print(f"\nGabarito aplicado: {aplicadas}/{len(regs)} questões válidas")
    print(f"Anuladas (fora do banco): {sum(1 for r in regs if r.get('descartada'))}")
    if faltando:
        print(f"!! PROBLEMAS ({len(faltando)}): {faltando[:10]}")
    from collections import Counter
    dist = Counter(r["gabarito"] for r in regs if r.get("gabarito"))
    print("Distribuição do gabarito:", dict(sorted(dist.items())))


if __name__ == "__main__":
    main()
