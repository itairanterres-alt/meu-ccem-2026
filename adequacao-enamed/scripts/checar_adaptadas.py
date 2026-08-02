#!/usr/bin/env python3
"""Confere as questões adaptadas antes de entrarem no banco.

Três perguntas que o montador não responde:

1. Alguma adaptada reproduz texto do original? O montador já barra 9 palavras
   seguidas; aqui a régua é mais fina — mede a MAIOR sequência comum de cada
   item contra o seu original, para ver se alguém passou raspando.

2. Duas adaptadas viraram a mesma questão? Doze redatores trabalharam em
   paralelo, sem se ver. Se dois itens de origem tratavam do mesmo assunto, os
   dois itens novos podem ter convergido.

3. Alguma adaptada repete objeto de conhecimento já coberto pelas 770 do banco?
   Não é defeito — repetição de tema é normal e até desejável num banco de
   treino — mas precisa ser visível para o blueprint não ficar torto.

Uso: python3 adequacao-enamed/scripts/checar_adaptadas.py
"""
import glob
import json
import os
import re
from collections import Counter

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
LOTES = os.path.join(BASE, "intermediario", "lotes_adaptacao")
ADAPT = os.path.join(BASE, "canonico", "adaptadas.canonico.json")
BANCO = os.path.join(BASE, "canonico", "banco-completo.json")


def toks(t):
    return re.sub(r"[^a-zà-ú0-9 ]", " ", (t or "").lower()).split()


def maior_comum(a, b):
    """Maior sequência de palavras comum aos dois textos."""
    A, B = toks(a), toks(b)
    if not A or not B:
        return 0
    prev = [0] * (len(B) + 1)
    melhor = 0
    for i in range(1, len(A) + 1):
        cur = [0] * (len(B) + 1)
        for j in range(1, len(B) + 1):
            if A[i - 1] == B[j - 1]:
                cur[j] = prev[j - 1] + 1
                melhor = max(melhor, cur[j])
        prev = cur
    return melhor


def campos_de(q):
    """Campos separados. Concatenar criaria emendas inexistentes no texto e
    inventaria sobreposições no ponto de junção — foi o que aconteceu na
    primeira versão desta checagem."""
    return [t for t in ([q.get("texto_base"), q.get("enunciado")]
                        + [a["texto"] for a in q["alternativas"]]) if t]


def main():
    orig = {}
    for f in sorted(glob.glob(os.path.join(LOTES, "lote_*.json"))):
        for q in json.load(open(f, encoding="utf-8")):
            orig[q["id_origem"]] = q
    ad = json.load(open(ADAPT, encoding="utf-8"))
    print(f"adaptadas: {len(ad)}")

    print("\n=== 1. SOBREPOSIÇÃO COM O ORIGINAL (maior sequência de palavras) ===")
    picos = []
    for q in ad:
        idg = q["_proveniencia"]["inspirada_em"]["id_origem"]
        o = orig[idg]
        velhos = [o["enunciado_origem"]] + list((o["alternativas_origem"] or {}).values())
        picos.append((max(maior_comum(n, v) for n in campos_de(q) for v in velhos), idg))
    picos.sort(reverse=True)
    dist = Counter(p for p, _ in picos)
    print("  distribuição:", dict(sorted(dist.items())))
    print(f"  máximo: {picos[0][0]} palavras ({picos[0][1]})")
    print("  10 maiores:", [f"{p}:{i.split('_')[-1]}" for p, i in picos[:10]])

    print("\n=== 2. ADAPTADAS QUE CONVERGIRAM ENTRE SI ===")
    pares = []
    for i in range(len(ad)):
        for j in range(i + 1, len(ad)):
            if ad[i]["tema"] == ad[j]["tema"]:
                pares.append((ad[i]["tema"],
                              ad[i]["_proveniencia"]["id_origem"],
                              ad[j]["_proveniencia"]["id_origem"]))
    if pares:
        for t, a, b in pares[:12]:
            print(f"  mesmo tema {t!r}: {a} x {b}")
        print(f"  total de pares com tema idêntico: {len(pares)}")
    else:
        print("  nenhum par com tema idêntico")

    print("\n=== 3. COBERTURA FRENTE AO BANCO EXISTENTE ===")
    if os.path.exists(BANCO):
        banco = json.load(open(BANCO, encoding="utf-8"))
        temas_banco = {q.get("tema") for q in banco}
        novos = [q["tema"] for q in ad if q["tema"] not in temas_banco]
        print(f"  banco atual: {len(banco)} questões, {len(temas_banco)} temas")
        print(f"  adaptadas com tema INÉDITO no banco: {len(novos)} de {len(ad)}")
        print(f"  exemplos: {novos[:8]}")

    print("\n=== COMPOSIÇÃO DAS ADAPTADAS ===")
    for campo in ("area_clinica", "dificuldade_editorial", "nivel_bloom"):
        print(f"  {campo}: {dict(Counter(q[campo] for q in ad).most_common())}")
    pos = Counter(a["letra"] for q in ad for a in q["alternativas"] if a["correta"])
    print(f"  posição da correta: {dict(sorted(pos.items()))}")
    corr = sum(1 for q in ad if q["_proveniencia"].get("defeito_corrigido_na_adaptacao"))
    print(f"  itens com defeito do original corrigido: {corr}")


if __name__ == "__main__":
    main()
