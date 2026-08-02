#!/usr/bin/env python3
"""Monta o banco de OAs 2026.2 e produz o mapa de migração contra 2026.1.

Por que o mapa importa mais que o banco novo
---------------------------------------------
O slug de OA é POSICIONAL: `med_unidavi_f01_uc01_sp05_oa03` codifica a posição
da SP na fase e a ordem do OA dentro dela. Se 2026.2 inserir uma SP no meio,
remover outra, ou só reordenar objetivos, o slug antigo CONTINUA RESOLVENDO —
apontando para outro objetivo. Não dá erro. Uma questão classificada em abril
seguiria "válida" apontando para o alvo errado, e o blueprint diria que a
cobertura está boa.

Por isso o 2026.1 não é sobrescrito: os dois convivem, e cada SP/OA recebe um
veredito de migração.

Vereditos de SP:
  inalterada ....... mesmo número e mesmo título
  retitulada ....... mesmo número, título diferente
  renumerada ....... mesmo título, número diferente  <- a que corrompe silenciosamente
  nova ............. sem correspondente em 2026.1
  removida ......... existia em 2026.1 e sumiu

Vereditos de OA (dentro de SP casada):
  identico ......... texto igual, mesma posição
  deslocado ........ texto igual, posição diferente  <- idem
  reescrito ........ mesma posição, texto diferente
  novo / removido

Uso: python3 taxonomia-2026-2/scripts/montar_e_comparar.py
"""
import glob
import json
import os
import re
import unicodedata
from collections import Counter
from difflib import SequenceMatcher

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
EXTR = os.path.join(BASE, "extraido")
REF = os.path.join(BASE, "referencia", "oas_med_unidavi_2026_1.json")
OUT_BANCO = os.path.join(BASE, "oas_med_unidavi_2026_2.json")
OUT_MAPA = os.path.join(BASE, "mapa_migracao_2026_1_para_2026_2.json")

# quando o texto muda pouco, é revisão de redação; muito, é outro objetivo
LIMIAR_REESCRITA = 0.90


def norm(t):
    t = unicodedata.normalize("NFKD", (t or "").lower())
    t = "".join(c for c in t if not unicodedata.combining(c))
    return re.sub(r"[^a-z0-9]+", " ", t).strip()


def sim(a, b):
    return SequenceMatcher(None, norm(a), norm(b)).ratio()


def carregar_extraido():
    fases = {}
    for f in sorted(glob.glob(os.path.join(EXTR, "f*.json"))):
        d = json.load(open(f, encoding="utf-8"))
        fases[d["fase_slug"]] = d
    return fases


def montar_banco(fases):
    """Converte a extração por fase no formato consumido pelas skills."""
    out = {
        "versao_taxonomia": "2026.2",
        "fonte": "Manuais Docentes UNIDAVI 2026.2 — SPs 1ª a 8ª fase (por fase)",
        "data_extracao": "2026-08-02",
        "cobertura": ("fases 1 a 8 (PBL); fases 9-12 internato seguem em 2026.1 e "
                      "fora do banco (formato APC/Ten Cate, sem SPs)"),
        "aviso_migracao": (
            "O slug de OA é posicional. NÃO reaproveite slug de 2026.1 sem "
            "consultar mapa_migracao_2026_1_para_2026_2.json: SP renumerada e OA "
            "deslocado mantêm um slug válido apontando para outro objetivo."),
        "fases": {},
    }
    for fk in sorted(fases):
        d = fases[fk]
        ucs = {}
        for uc in d["ucs"]:
            ukey = f"uc{uc['uc_numero']:02d}"
            sps = {}
            for sp in uc["sps"]:
                skey = f"sp{sp['numero']:02d}"
                slug = f"med_unidavi_{fk}_{ukey}_{skey}"
                sps[skey] = {
                    "slug": slug,
                    "numero": sp["numero"],
                    "titulo": sp["titulo"],
                    "objetivos_aprendizagem": [
                        {"slug": f"{slug}_oa{o['numero']:02d}",
                         "numero": o["numero"], "texto": o["texto"]}
                        for o in sp.get("objetivos_aprendizagem", [])
                    ],
                }
                if sp.get("sem_oas_no_manual"):
                    sps[skey]["sem_oas_no_manual"] = True
            ucs[ukey] = {"sps": sps}
        out["fases"][fk] = ucs
    return out


def comparar(novo, velho):
    linhas = []
    for fk in sorted(set(novo["fases"]) | set(velho["fases"])):
        fn, fv = novo["fases"].get(fk, {}), velho["fases"].get(fk, {})
        for uk in sorted(set(fn) | set(fv)):
            spn = fn.get(uk, {}).get("sps", {})
            spv = fv.get(uk, {}).get("sps", {})
            usados = set()

            for sk, sp in sorted(spn.items()):
                antigo = spv.get(sk)
                if antigo and sim(sp["titulo"], antigo["titulo"]) >= LIMIAR_REESCRITA:
                    veredito, par = "inalterada", antigo
                else:
                    # procura o mesmo título noutra posição: é a renumeração,
                    # o caso que mantém slug válido apontando para outra coisa
                    cand = max(((k, v) for k, v in spv.items() if k not in usados),
                               key=lambda kv: sim(sp["titulo"], kv[1]["titulo"]),
                               default=None)
                    if cand and sim(sp["titulo"], cand[1]["titulo"]) >= LIMIAR_REESCRITA:
                        veredito, par = "renumerada", cand[1]
                    elif antigo:
                        veredito, par = "retitulada", antigo
                    else:
                        veredito, par = "nova", None
                if par:
                    usados.add(f"sp{par['numero']:02d}")

                oas = []
                if par:
                    velhos = par["objetivos_aprendizagem"]
                    for o in sp["objetivos_aprendizagem"]:
                        mesmo_pos = next((v for v in velhos
                                          if v["numero"] == o["numero"]), None)
                        igual_txt = next((v for v in velhos
                                          if sim(o["texto"], v["texto"]) >= 0.98), None)
                        if mesmo_pos and sim(o["texto"], mesmo_pos["texto"]) >= 0.98:
                            v_oa = "identico"
                        elif igual_txt:
                            v_oa = "deslocado"
                        elif mesmo_pos:
                            v_oa = ("reescrito"
                                    if sim(o["texto"], mesmo_pos["texto"]) >= 0.55
                                    else "substituido")
                        else:
                            v_oa = "novo"
                        oas.append({
                            "slug_2026_2": o["slug"],
                            "slug_2026_1_mesma_posicao": (mesmo_pos or {}).get("slug"),
                            "veredito": v_oa,
                            "texto_2026_2": o["texto"],
                            "texto_2026_1_mesma_posicao": (mesmo_pos or {}).get("texto"),
                        })
                    for v in velhos:
                        if not any(sim(v["texto"], o["texto"]) >= 0.55
                                   for o in sp["objetivos_aprendizagem"]):
                            oas.append({"slug_2026_2": None,
                                        "slug_2026_1_mesma_posicao": v["slug"],
                                        "veredito": "removido",
                                        "texto_2026_2": None,
                                        "texto_2026_1_mesma_posicao": v["texto"]})

                linhas.append({
                    "fase": fk, "uc": uk,
                    "slug_2026_2": sp["slug"],
                    "titulo_2026_2": sp["titulo"],
                    "slug_2026_1": par["slug"] if par else None,
                    "titulo_2026_1": par["titulo"] if par else None,
                    "veredito_sp": veredito,
                    "reaproveitar_slug_antigo": veredito == "inalterada",
                    "objetivos": oas,
                })

            for sk, sp in sorted(spv.items()):
                if sk in usados:
                    continue
                if not any(l["slug_2026_1"] == sp["slug"] for l in linhas):
                    linhas.append({
                        "fase": fk, "uc": uk,
                        "slug_2026_2": None, "titulo_2026_2": None,
                        "slug_2026_1": sp["slug"], "titulo_2026_1": sp["titulo"],
                        "veredito_sp": "removida",
                        "reaproveitar_slug_antigo": False,
                        "objetivos": [],
                    })
    return linhas


def main():
    fases = carregar_extraido()
    print(f"fases extraídas: {len(fases)} {sorted(fases)}")
    truncadas = [k for k, v in fases.items() if v.get("conteudo_truncado")]
    if truncadas:
        print(f"  !! conteúdo truncado em: {truncadas} — não publicar assim")
    if len(fases) < 8:
        print(f"  !! faltam {8 - len(fases)} fases; apuração parcial")

    banco = montar_banco(fases)
    json.dump(banco, open(OUT_BANCO, "w"), ensure_ascii=False, indent=2)
    nsp = sum(len(uc["sps"]) for f in banco["fases"].values() for uc in f.values())
    noa = sum(len(sp["objetivos_aprendizagem"]) for f in banco["fases"].values()
              for uc in f.values() for sp in uc["sps"].values())
    nuc = sum(len(f) for f in banco["fases"].values())
    print(f"\n2026.2: {len(banco['fases'])} fases | {nuc} UCs | {nsp} SPs | {noa} OAs")

    velho = json.load(open(REF, encoding="utf-8"))
    vsp = sum(len(uc["sps"]) for f in velho["fases"].values() for uc in f.values())
    voa = sum(len(sp["objetivos_aprendizagem"]) for f in velho["fases"].values()
              for uc in f.values() for sp in uc["sps"].values())
    print(f"2026.1: {len(velho['fases'])} fases | "
          f"{sum(len(f) for f in velho['fases'].values())} UCs | {vsp} SPs | {voa} OAs")

    mapa = comparar(banco, velho)
    json.dump({"gerado_em": "2026-08-02", "de": "2026.1", "para": "2026.2",
               "limiar_similaridade_titulo": LIMIAR_REESCRITA,
               "sps": mapa}, open(OUT_MAPA, "w"), ensure_ascii=False, indent=2)

    print("\n=== VEREDITO DAS SPs ===")
    for k, v in Counter(l["veredito_sp"] for l in mapa).most_common():
        print(f"  {k:<14} {v}")
    print("\n=== VEREDITO DOS OAs ===")
    todos = [o for l in mapa for o in l["objetivos"]]
    for k, v in Counter(o["veredito"] for o in todos).most_common():
        print(f"  {k:<14} {v}")

    perigo = [l for l in mapa if l["veredito_sp"] == "renumerada"]
    desloc = [o for o in todos if o["veredito"] == "deslocado"]
    print(f"\n=== RISCO DE CORRUPÇÃO SILENCIOSA ===")
    print(f"  SPs renumeradas (slug antigo resolve para outra SP): {len(perigo)}")
    for l in perigo[:10]:
        print(f"    {l['slug_2026_1']} -> {l['slug_2026_2']}  {l['titulo_2026_2'][:50]}")
    print(f"  OAs deslocados (slug antigo resolve para outro OA): {len(desloc)}")
    seguro = sum(1 for l in mapa if l["reaproveitar_slug_antigo"])
    print(f"\n  SPs cujo slug pode ser reaproveitado sem revisão: {seguro}/{len(mapa)}")
    print(f"\nGravado: {OUT_BANCO}\n         {OUT_MAPA}")


if __name__ == "__main__":
    main()
