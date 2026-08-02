#!/usr/bin/env python3
"""Monta os lotes de ADAPTAÇÃO das questões que sobreviveram ao consenso.

Por que adaptar em vez de importar literalmente
-----------------------------------------------
Duas razões independentes, e cada uma bastaria:

1. Autoria de terceiros. O Simulado Nacional é material comercial da Estratégia
   MED e os simulados FPS são de outra instituição. Importar o texto literal para
   o banco institucional é reprodução de obra alheia. Adaptar — mesmo objeto de
   conhecimento, caso clínico reescrito, alternativas refeitas — produz item
   próprio da UNIDAVI.

2. Qualidade do item. Essas 150 chegaram sem chave oficial; a resposta que
   temos é consenso de três juízes, não gabarito. Reescrever obriga a explicitar
   a justificativa de cada alternativa, que é o que o schema institucional exige
   e o que a curadoria vai conferir.

O que entra em cada lote: o item de origem (enunciado, alternativas, chave de
consenso), a classificação fina já atribuída e a ancoragem na matriz da Portaria
478/2025 — para que o item adaptado nasça no mesmo eixo do original.

Saída: intermediario/lotes_adaptacao/lote_XX.json
"""
import hashlib
import json
import os
from collections import Counter

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
APUR = os.path.join(BASE, "intermediario", "consenso", "apuracao.json")
LOTES = os.path.join(BASE, "intermediario", "lotes_consenso")
FINA = os.path.join(BASE, "canonico", "classificacao-fina.json")
OUT = os.path.join(BASE, "intermediario", "lotes_adaptacao")
TAM = 12


def main():
    apur = json.load(open(APUR, encoding="utf-8"))
    sobrev = [r for r in apur if r["decisao"].startswith("aprovada")]
    if not sobrev:
        print("nenhuma questão sobreviveu ao consenso — nada a adaptar")
        return

    universo = {}
    for n in range(1, 6):
        f = os.path.join(LOTES, f"lote_{n:02d}.json")
        if os.path.exists(f):
            for q in json.load(open(f, encoding="utf-8")):
                universo[q["id_origem"]] = q

    # a classificação fina cobre o banco canônico; estas 150 nunca entraram nele,
    # então o campo pode não existir — o adaptador infere quando faltar.
    fina = {}
    if os.path.exists(FINA):
        fina = {c["id_origem"]: c for c in json.load(open(FINA, encoding="utf-8"))}

    itens = []
    for r in sobrev:
        q = universo.get(r["id_origem"])
        if not q:
            continue
        itens.append({
            "id_origem": r["id_origem"],
            "fonte": r["fonte"],
            "enunciado_origem": q.get("enunciado"),
            "alternativas_origem": q.get("alternativas"),
            "chave_consenso": r["chave_consenso"],
            "consenso": r["motivo"],
            "confianca_min": r["confianca_min"],
            "problemas_apontados": r["problemas_apontados"],
            "classificacao_fina": fina.get(r["id_origem"]),
            # Posição da correta fixada por hash do id: quem reescreve não escolhe
            # onde pôr a resposta. Sem isso o banco herda o viés de quem escreve —
            # nos .docx do NAPISUL, 175 de 176 questões tinham a correta em A.
            "posicao_correta_alvo": "ABCD"[
                int(hashlib.md5(r["id_origem"].encode()).hexdigest(), 16) % 4],
        })

    os.makedirs(OUT, exist_ok=True)
    for antigo in os.listdir(OUT):
        os.remove(os.path.join(OUT, antigo))
    n = 0
    for i in range(0, len(itens), TAM):
        n += 1
        json.dump(itens[i:i + TAM],
                  open(os.path.join(OUT, f"lote_{n:02d}.json"), "w"),
                  ensure_ascii=False, indent=2)

    print(f"a adaptar: {len(itens)} questões em {n} lotes de até {TAM}")
    print("  por fonte:", dict(Counter(x["fonte"] for x in itens).most_common()))
    print("  com defeito técnico apontado:",
          sum(1 for x in itens if x["problemas_apontados"]))
    print("  com 5 alternativas (viram A-D na adaptação):",
          sum(1 for x in itens if len(x["alternativas_origem"] or []) == 5))
    print(f"\nGravado em: {OUT}")


if __name__ == "__main__":
    main()
