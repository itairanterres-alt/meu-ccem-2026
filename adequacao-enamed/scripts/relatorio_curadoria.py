#!/usr/bin/env python3
"""Gera o relatório de curadoria (Markdown) das questões adequadas.

Destaca, para cada item: enunciado final, as 4 alternativas com a correta
marcada, e — nos itens convertidos de 5 para 4 — QUAL alternativa saiu e por
quê, além de defeitos detectados na prova de origem.

Saída: canonico/RELATORIO-CURADORIA.md
"""
import json, os, glob

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(BASE, "canonico", "RELATORIO-CURADORIA.md")
ARQS = [
    ("ENAMED 2025 — Caderno 01", "enamed2025_caderno1.canonico.json"),
    ("Simulados MED/ENAMED 2026", "simulados2026.canonico.json"),
]


def bloco(q, i):
    p = q["_proveniencia"]
    orig = p.get("questao_original")
    L = []
    L.append(f"### {i}. {q['tema']}  \n"
             f"`{q['uc_slug']}` · fase {q['fase_alvo']} · {q['area_clinica']} · "
             f"{q['dificuldade_editorial']} · Bloom: {q['nivel_bloom']}  \n"
             f"*Origem: {p['fonte']}, questão {orig}*")
    flags = []
    if p.get("convertida_5_para_4"):
        flags.append("**convertida 5→4**")
    if p.get("requer_imagem"):
        flags.append("⚠️ **depende de imagem** (anexar na curadoria)")
    if p.get("problema_detectado"):
        flags.append(f"⚠️ **defeito na origem:** {p['problema_detectado']}")
    if flags:
        L.append("> " + "  \n> ".join(flags))
    if q.get("texto_base"):
        L.append(f"**Caso:** {q['texto_base']}")
    L.append(f"**Enunciado:** {q['enunciado']}")
    for a in q["alternativas"]:
        marca = " ✅" if a["correta"] else ""
        L.append(f"- **({a['letra']})**{marca} {a['texto']}  \n"
                 f"  <sub>{a['justificativa']}</sub>")
    d = p.get("alternativa_descartada")
    if d:
        L.append(f"**Alternativa descartada** — era a ({d['letra_original']}): "
                 f"*{d['texto']}*  \n"
                 f"Motivo: {d.get('motivo') or '—'}")
        remap = p.get("remapeamento", {})
        mapa = ", ".join(f"{k}→{v}" for k, v in remap.items())
        L.append(f"<sub>Renumeração: {mapa} · gabarito "
                 f"{p['gabarito_original']} → {p['gabarito_novo']}</sub>")
    return "\n\n".join(L)


def main():
    partes = ["# Relatório de curadoria — questões adequadas ao banco\n",
              "Todas com `status_curadoria: pendente`. As justificativas foram "
              "redigidas por IA e **precisam de revisão docente**; a alternativa "
              "correta é sempre a do gabarito oficial da prova de origem.\n"]
    total = 0
    for titulo, arq in ARQS:
        caminho = os.path.join(BASE, "canonico", arq)
        if not os.path.exists(caminho):
            continue
        qs = json.load(open(caminho, encoding="utf-8"))
        conv = sum(1 for q in qs if q["_proveniencia"].get("convertida_5_para_4"))
        img = sum(1 for q in qs if q["_proveniencia"].get("requer_imagem"))
        defe = sum(1 for q in qs if q["_proveniencia"].get("problema_detectado"))
        partes.append(f"\n---\n\n## {titulo}\n\n"
                      f"{len(qs)} questões · convertidas 5→4: {conv} · "
                      f"dependem de imagem: {img} · com defeito sinalizado: {defe}\n")
        for i, q in enumerate(qs, 1):
            partes.append(bloco(q, i))
            total += 1
    partes.append(f"\n---\n\n**Total: {total} questões para curadoria.**\n")
    open(OUT, "w", encoding="utf-8").write("\n\n".join(partes))
    print(f"Relatório com {total} questões -> {OUT}")


if __name__ == "__main__":
    main()
