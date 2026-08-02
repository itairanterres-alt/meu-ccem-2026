#!/usr/bin/env python3
"""Acrescenta as subespecialidades pediátricas que faltavam e reclassifica.

A lista de pediatria de `especialidades.json` cobria puericultura, neonatologia,
infecto, pneumo, gastro, cardio e neuro — mas não nefrologia, endocrinologia,
reumatologia, dermatologia nem hemato-oncologia pediátricas. Quem escreveu ou
classificou as questões contornou a falta de dois jeitos: usando o termo adulto
(`nefrologia` numa questão de área `pediatria`) ou empurrando para o rótulo
genérico mais próximo (`puericultura_e_crescimento` para dermatite atópica,
`adolescencia` para doença de Graves).

Nos dois casos a questão fica invisível para um blueprint por sub-área: quem
procurar "glomerulonefrite" não acha, porque está arquivada em infectologia.

Também cruzo `cirurgia_pediatrica` para a lista de pediatria e `queimados` para
urgência: são as duas únicas especialidades que apareceram fora da lista da
própria área, e em ambas o rótulo já existia noutra área.

As reclassificações são EXPLÍCITAS, uma a uma — não por regex sobre o tema.
Classificação de questão é decisão clínica; heurística de texto erraria em
casos como cetoacidose (que é emergência antes de ser endocrinologia).

Uso: python3 adequacao-enamed/scripts/ampliar_vocabulario.py
"""
import glob
import json
import os

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
VOC = os.path.join(BASE, "referencia", "especialidades.json")
CANON = os.path.join(BASE, "canonico")
COMP = os.path.join(CANON, "classificacao-fina.json")

NOVAS = {
    "pediatria": ["nefrologia_pediatrica", "endocrinologia_pediatrica",
                  "reumatologia_pediatrica", "dermatologia_pediatrica",
                  "hematologia_e_oncologia_pediatrica", "cirurgia_pediatrica"],
    "urgencia_emergencia": ["queimados"],
}

# id_origem -> (especialidade, especialidade_secundaria ou False p/ não mexer)
RECLASSIFICAR = {
    # --- nefrologia pediátrica ---
    # estavam em infectologia porque a origem é pós-estreptocócica; o objeto
    # avaliado é a lesão glomerular, não a infecção que a precedeu.
    "adap_enamed_simulado_2026_1_q004": ("nefrologia_pediatrica", False),
    "tpmed2025_gabarito_q024": ("nefrologia_pediatrica", "infectologia_pediatrica"),
    "tpmed2025_gabarito_q032": ("nefrologia_pediatrica", "infectologia_pediatrica"),

    # --- reumatologia pediátrica ---
    # vasculite por IgA (Henoch-Schönlein) e febre reumática estavam espalhadas
    # entre puericultura, urgência e infectologia.
    "revalida2023_2_q043": ("reumatologia_pediatrica", "urgencia_pediatrica"),
    "revalida2024_1_q078": ("reumatologia_pediatrica", "urgencia_pediatrica"),
    "adap_simulado_nacional_enamed2025_q035": ("reumatologia_pediatrica",
                                               "urgencia_pediatrica"),
    "enamed2025_q037": ("reumatologia_pediatrica", "cardiologia_pediatrica"),
    # Kawasaki é vasculite; a cardiologia entra pela complicação coronariana,
    # não pelo diagnóstico. Troca discutível — vale conferir na curadoria.
    "revalida2024_1_q048": ("reumatologia_pediatrica", "cardiologia_pediatrica"),

    # --- endocrinologia pediátrica ---
    "tp2022_q043": ("endocrinologia_pediatrica", "puericultura_e_crescimento"),
    "tpmed2025_gabarito_q026": ("endocrinologia_pediatrica", "adolescencia"),
    "tpmed2025_gabarito_q039": ("endocrinologia_pediatrica", "adolescencia"),
    # aqui a primária continua correta; só a secundária usava o termo adulto
    "adap_simulado_nacional_enamed2025_q032": (None, "endocrinologia_pediatrica"),
    # cetoacidose é emergência antes de ser endocrinologia: primária fica
    "tpmed2025_gabarito_q038": (None, "endocrinologia_pediatrica"),

    # --- dermatologia pediátrica ---
    "revalida2024_1_q073": ("dermatologia_pediatrica", "puericultura_e_crescimento"),
    "tp2022_q041": ("dermatologia_pediatrica", "puericultura_e_crescimento"),
    "revalida2024_1_q033": (None, "dermatologia_pediatrica"),
    "questoes_clm_q068": (None, "dermatologia_pediatrica"),

    # --- hemato-oncologia pediátrica ---
    # neutropenia febril continua urgência; hemofilia continua neonatologia
    "revalida2023_2_q053": (None, "hematologia_e_oncologia_pediatrica"),
    "tp2022_q058": (None, "hematologia_e_oncologia_pediatrica"),
}


def ident(q):
    p = q["_proveniencia"]
    return p.get("id_origem") or f"enamed2025_q{p.get('questao_original'):03d}"


def main():
    voc = json.load(open(VOC, encoding="utf-8"))
    listas = voc["especialidades_por_area"]
    add = 0
    for area, termos in NOVAS.items():
        for t in termos:
            if t not in listas[area]:
                listas[area].append(t)
                add += 1
        listas[area].sort()
    voc["metadata"]["revisao_2026_08"] = (
        "Acrescentadas as subespecialidades pediátricas ausentes (nefrologia, "
        "endocrinologia, reumatologia, dermatologia e hemato-oncologia) e "
        "cruzadas `cirurgia_pediatrica` e `queimados`, que já existiam noutras "
        "áreas. Sem esses termos, questões de glomerulonefrite ficavam "
        "arquivadas em infectologia e dermatite atópica em puericultura, "
        "invisíveis para um blueprint por sub-área.")
    json.dump(voc, open(VOC, "w"), ensure_ascii=False, indent=2)
    print(f"vocabulário: {add} termos acrescentados")

    aplicadas, vistos = 0, set()
    for caminho in sorted(glob.glob(os.path.join(CANON, "*.canonico.json"))):
        qs = json.load(open(caminho, encoding="utf-8"))
        mudou = False
        for q in qs:
            r = RECLASSIFICAR.get(ident(q))
            if not r:
                continue
            cf = q.get("classificacao_fina")
            if not cf:
                continue
            nova, sec = r
            antes = (cf.get("especialidade"), cf.get("especialidade_secundaria"))
            if nova:
                cf["especialidade"] = nova
            if sec is not False:
                cf["especialidade_secundaria"] = sec
            depois = (cf["especialidade"], cf.get("especialidade_secundaria"))
            if antes != depois:
                print(f"  {ident(q):<42} {antes[0]}/{antes[1] or '-'}"
                      f"  ->  {depois[0]}/{depois[1] or '-'}")
                aplicadas += 1
                mudou = True
            vistos.add(ident(q))
        if mudou:
            json.dump(qs, open(caminho, "w"), ensure_ascii=False, indent=2)

    faltou = set(RECLASSIFICAR) - vistos
    if faltou:
        print(f"  !! id não encontrado no banco: {sorted(faltou)}")

    # espelha no companheiro
    if os.path.exists(COMP):
        comp = json.load(open(COMP, encoding="utf-8"))
        for c in comp:
            r = RECLASSIFICAR.get(c["id_origem"])
            if not r:
                continue
            nova, sec = r
            if nova:
                c["especialidade"] = nova
            if sec is not False:
                c["especialidade_secundaria"] = sec
        json.dump(comp, open(COMP, "w"), ensure_ascii=False, indent=2)

    # confere que ninguém ficou fora do vocabulário da própria área
    fora = []
    for caminho in sorted(glob.glob(os.path.join(CANON, "*.canonico.json"))):
        for q in json.load(open(caminho, encoding="utf-8")):
            cf = q.get("classificacao_fina") or {}
            e = cf.get("especialidade")
            if e and e not in listas.get(q["area_clinica"], []):
                fora.append((ident(q), q["area_clinica"], e))
    print(f"\nreclassificadas: {aplicadas}")
    print(f"fora do vocabulário da própria área: {len(fora)} {fora[:5]}")


if __name__ == "__main__":
    main()
