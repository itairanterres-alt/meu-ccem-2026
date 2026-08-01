#!/usr/bin/env python3
"""Aplica a ancoragem na Matriz de Referência do Enamed (Portaria 478/2025).

Preenche `classificacao_fina.matriz_enamed_478_2025` de cada questão com:
    {area, competencias[], conteudos[], cenario, justificativa}
usando os códigos oficiais extraídos da norma.

O campo foi originalmente declarado no schema como string (eu supunha um código
único por questão). A norma, porém, tem QUATRO eixos independentes — área,
competências, cenários e conteúdos — então o campo vira objeto. A alteração é
feita aqui, no schema de referência, mantendo-o opcional.

Uso: python3 adequacao-enamed/scripts/aplicar_matriz.py
"""
import glob, json, os
from collections import Counter

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MAT = os.path.join(BASE, "referencia", "matriz_enamed_478_2025.json")
DIR = os.path.join(BASE, "intermediario", "matriz")
SCHEMA = os.path.join(BASE, "referencia", "schema_questao_med_unidavi.json")
COMPANHEIRO = os.path.join(BASE, "canonico", "classificacao-fina.json")


def ajustar_schema():
    sch = json.load(open(SCHEMA, encoding="utf-8"))
    cf = sch["properties"].get("classificacao_fina")
    if not cf:
        return False
    atual = cf["properties"].get("matriz_enamed_478_2025", {})
    if atual.get("type") == ["object", "null"]:
        return False
    cf["properties"]["matriz_enamed_478_2025"] = {
        "type": ["object", "null"],
        "additionalProperties": False,
        "description": ("Ancoragem na Matriz de Referência Comum (Portaria Inep "
                        "nº 478/2025). São quatro eixos independentes da norma, "
                        "não um código único."),
        "properties": {
            "area": {"type": "string", "description": "Art. 3º — uma das 7 áreas."},
            "competencias": {"type": "array", "items": {"type": "string"},
                             "minItems": 1, "maxItems": 3,
                             "description": "Art. 6º — competências avaliadas."},
            "conteudos": {"type": "array", "items": {"type": "string"},
                          "minItems": 1, "maxItems": 3,
                          "description": "Art. 8º — conteúdos exigidos."},
            "cenario": {"type": ["string", "null"],
                        "description": "Art. 7º — rede/ponto de atenção do caso."},
            "justificativa": {"type": ["string", "null"], "maxLength": 300},
        },
        "required": ["area", "competencias", "conteudos"],
    }
    json.dump(sch, open(SCHEMA, "w"), ensure_ascii=False, indent=2)
    return True


def main():
    m = json.load(open(MAT, encoding="utf-8"))
    validos = ({a["id"] for a in m["areas_art3"]},
               {c["id"] for c in m["competencias_art6"]},
               {c["id"] for c in m["conteudos_art8"]},
               {c["id"] for c in m["cenarios_art7"]})
    AR, CO, CT, CE = validos

    anc = {}
    for f in sorted(glob.glob(os.path.join(DIR, "parte_*.json"))):
        for it in json.load(open(f, encoding="utf-8")):
            anc[it["id_origem"]] = it
    print(f"ancoragens carregadas: {len(anc)}")
    if ajustar_schema():
        print("schema: matriz_enamed_478_2025 passa de string para objeto (4 eixos)")

    aplicadas, sem, invalidas = 0, [], []
    for caminho in sorted(glob.glob(os.path.join(BASE, "canonico", "*.canonico.json"))):
        qs = json.load(open(caminho, encoding="utf-8"))
        for q in qs:
            p = q["_proveniencia"]
            idg = p.get("id_origem") or f"enamed2025_q{p['questao_original']:03d}"
            a = anc.get(idg)
            if not a:
                sem.append(idg)
                continue
            if (a["area_enamed"] not in AR
                    or any(c not in CO for c in a["competencias_enamed"])
                    or any(c not in CT for c in a["conteudos_enamed"])
                    or (a.get("cenario_enamed") and a["cenario_enamed"] not in CE)):
                invalidas.append(idg)
                continue
            q.setdefault("classificacao_fina", {})["matriz_enamed_478_2025"] = {
                "area": a["area_enamed"],
                "competencias": a["competencias_enamed"],
                "conteudos": a["conteudos_enamed"],
                "cenario": a.get("cenario_enamed"),
                "justificativa": a.get("justificativa_ancoragem"),
            }
            aplicadas += 1
        json.dump(qs, open(caminho, "w"), ensure_ascii=False, indent=2)

    # espelha no companheiro
    if os.path.exists(COMPANHEIRO):
        comp = json.load(open(COMPANHEIRO, encoding="utf-8"))
        for c in comp:
            a = anc.get(c["id_origem"])
            if a:
                c["matriz_enamed_478_2025"] = {
                    "area": a["area_enamed"], "competencias": a["competencias_enamed"],
                    "conteudos": a["conteudos_enamed"], "cenario": a.get("cenario_enamed"),
                    "justificativa": a.get("justificativa_ancoragem")}
        json.dump(comp, open(COMPANHEIRO, "w"), ensure_ascii=False, indent=2)

    print(f"aplicadas: {aplicadas} | sem ancoragem: {len(sem)} | inválidas: {len(invalidas)}")
    if sem[:5]:
        print("  sem:", sem[:5])
    if invalidas[:5]:
        print("  inválidas:", invalidas[:5])

    nomes = {a["id"]: a["nome"] for a in m["areas_art3"]}
    tit_c = {c["id"]: c["titulo_curto"] for c in m["competencias_art6"]}
    tit_t = {c["id"]: c["titulo_curto"] for c in m["conteudos_art8"]}
    desc_e = {c["id"]: c["descricao"] for c in m["cenarios_art7"]}
    vals = [v for v in anc.values()]

    print("\n=== ÁREAS (Art. 3º) ===")
    for k, v in Counter(nomes[x["area_enamed"]] for x in vals).most_common():
        print(f"  {k:<34} {v}")
    print("\n=== COMPETÊNCIAS mais avaliadas (Art. 6º, principal) ===")
    for k, v in Counter(tit_c[x["competencias_enamed"][0]] for x in vals).most_common(8):
        print(f"  {k[:60]:<60} {v}")
    print("\n=== CONTEÚDOS mais cobrados (Art. 8º, principal) ===")
    for k, v in Counter(tit_t[x["conteudos_enamed"][0]] for x in vals).most_common(8):
        print(f"  {k[:60]:<60} {v}")
    print("\n=== CENÁRIOS (Art. 7º) ===")
    for k, v in Counter((desc_e[x["cenario_enamed"]][:52] if x.get("cenario_enamed")
                         else "(sem cenário)") for x in vals).most_common():
        print(f"  {k:<54} {v}")

    # cobertura: eixos da norma sem nenhuma questão
    usados_c = {c for x in vals for c in x["competencias_enamed"]}
    usados_t = {c for x in vals for c in x["conteudos_enamed"]}
    print("\n=== LACUNAS ===")
    print("  competências sem questão:",
          [tit_c[c["id"]] for c in m["competencias_art6"] if c["id"] not in usados_c] or "nenhuma")
    print("  conteúdos sem questão:",
          [tit_t[c["id"]] for c in m["conteudos_art8"] if c["id"] not in usados_t] or "nenhum")


if __name__ == "__main__":
    main()
