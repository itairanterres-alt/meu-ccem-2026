#!/usr/bin/env python3
"""Monta as questões canônicas dos Simulados MED-ENAMED 2026.

Converte os itens de 5 alternativas para 4 (A-D) de forma DETERMINÍSTICA:
  - a alternativa a descartar vem da decisão editorial (`descartar`), que o
    validador impede de ser a correta;
  - as 4 mantidas preservam a ordem original e são renumeradas A, B, C, D;
  - a nova letra da correta é recalculada e a correspondência
    (original -> nova) fica registrada em `_proveniencia.remapeamento`.

Entrada : intermediario/simulados2026.json
          intermediario/enriquecimento_sim/parte_*.json
Saída   : canonico/simulados2026.canonico.json
"""
import json, os, glob, re, sys

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(BASE, "scripts"))
from montar_canonico import AREA2UC, BLOOM, DIFIC, split_vinheta  # noqa: E402

EXTR = os.path.join(BASE, "intermediario", "simulados2026.json")
ENR_DIR = os.path.join(BASE, "intermediario", "enriquecimento_sim")
OUT = os.path.join(BASE, "canonico", "simulados2026.canonico.json")
CRIADA_EM = "2026-08-01T00:00:00Z"
FONTE = "adequacao-enamed (Simulados MED/ENAMED 2026) — extração + adequação assistida"


def normalizar_texto(t):
    """Padronização cosmética das alternativas fora de padrão."""
    t = re.sub(r"\s+", " ", (t or "")).strip()
    t = re.sub(r"[;,]\s*$", ".", t)          # "asma;" -> "asma."
    if t and t[-1] not in ".?!:":
        t += "."
    return t


def montar(rec, e):
    idg = rec["id_origem"]
    area = e["area_clinica"]
    if area not in AREA2UC:
        raise ValueError(f"{idg}: area_clinica inválida: {area}")
    if e["nivel_bloom"] not in BLOOM:
        raise ValueError(f"{idg}: bloom inválido: {e['nivel_bloom']}")
    if e["dificuldade_editorial"] not in DIFIC:
        raise ValueError(f"{idg}: dificuldade inválida: {e['dificuldade_editorial']}")
    fase, uc = AREA2UC[area]

    presentes = [L for L in "ABCDE" if rec["alternativas"].get(L)]
    gab = rec["gabarito"]
    if gab not in presentes:
        raise ValueError(f"{idg}: gabarito {gab} não está entre as alternativas")

    descartar = e.get("descartar")
    if len(presentes) == 5:
        if not descartar:
            raise ValueError(f"{idg}: 5 alternativas sem 'descartar'")
        if descartar == gab:
            raise ValueError(f"{idg}: tentou descartar a CORRETA ({gab})")
        if descartar not in presentes:
            raise ValueError(f"{idg}: 'descartar'={descartar} inexistente")
        mantidas = [L for L in presentes if L != descartar]
    else:
        if descartar:
            raise ValueError(f"{idg}: item já tem 4 alternativas, nada a descartar")
        mantidas = presentes
    if len(mantidas) != 4:
        raise ValueError(f"{idg}: {len(mantidas)} alternativas após conversão")

    novas = "ABCD"
    remap = {orig: novas[i] for i, orig in enumerate(mantidas)}
    nova_correta = remap[gab]

    justs = e["justificativas"]
    faltam = [L for L in mantidas if not (justs.get(L) or "").strip()]
    if faltam:
        raise ValueError(f"{idg}: sem justificativa para {faltam}")

    alts = [{
        "letra": remap[orig],
        "texto": normalizar_texto(rec["alternativas"][orig]),
        "correta": (orig == gab),
        "justificativa": justs[orig].strip(),
    } for orig in mantidas]

    texto_base, enunciado = split_vinheta(rec["enunciado"])
    convertida = len(presentes) == 5
    return {
        "tipo": "questao",
        "fase_alvo": fase,
        "uc_slug": uc,
        "tema": e["tema"],
        "subtema": e.get("subtema"),
        "sp_referencia": None,
        "cenario_origem": ["preparacao_enamed"],
        "competencia_dcn_2025": e["competencia_dcn_2025"],
        "nivel_bloom": e["nivel_bloom"],
        "area_clinica": area,
        "dificuldade_editorial": e["dificuldade_editorial"],
        "tags": e.get("tags", []),
        "texto_base": texto_base,
        "enunciado": enunciado,
        "alternativas": alts,
        "referencia": f"{rec['fonte']}, questão {rec['num']}; gabarito oficial do simulado.",
        "fonte_geracao": FONTE,
        "status_curadoria": "pendente",
        "disponibilidade": "disponivel",
        "meses_desde_ultimo_uso": None,
        "versao": 1,
        "uso_em_avaliacoes": {"total_avaliativo": 0, "ultima_avaliacao_em": None, "historico": []},
        "performance": {"n_respostas_treino": 0, "n_respostas_avaliativo": 0,
                         "taxa_acerto_treino": None, "taxa_acerto_avaliativo": None,
                         "dificuldade_tri_b": None, "discriminacao_tri_a": None},
        "auditoria": {"criada_por": FONTE, "criada_em": CRIADA_EM,
                       "curada_por": None, "curada_em": None, "edicoes": []},
        "_proveniencia": {
            "fonte": rec["fonte"],
            "id_origem": idg,
            "questao_original": rec["num"],
            "requer_imagem": rec["requer_imagem"],
            "convertida_5_para_4": convertida,
            "alternativa_descartada": ({
                "letra_original": descartar,
                "texto": rec["alternativas"][descartar],
                "motivo": e.get("motivo_descarte"),
            } if convertida else None),
            "remapeamento": remap,
            "gabarito_original": gab,
            "gabarito_novo": nova_correta,
            "problema_detectado": e.get("problema_detectado"),
        },
    }


def main():
    extr = {r["id_origem"]: r for r in json.load(open(EXTR, encoding="utf-8"))
            if not r.get("descartada")}
    enr = {}
    for f in sorted(glob.glob(os.path.join(ENR_DIR, "parte_*.json"))):
        for item in json.load(open(f, encoding="utf-8")):
            enr[item["id_origem"]] = item

    montadas, erros = [], []
    for idg in sorted(extr):
        if idg not in enr:
            continue
        try:
            montadas.append(montar(extr[idg], enr[idg]))
        except Exception as ex:
            erros.append(str(ex))
    faltando = sorted(set(extr) - set(enr))

    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    json.dump(montadas, open(OUT, "w"), ensure_ascii=False, indent=2)
    conv = sum(1 for q in montadas if q["_proveniencia"]["convertida_5_para_4"])
    print(f"Canônicas montadas: {len(montadas)}/{len(extr)}  (convertidas 5->4: {conv})")
    if faltando:
        print(f"Sem enriquecimento ({len(faltando)}): {faltando[:10]}")
    for e in erros:
        print("  ! ERRO:", e)

    try:
        import jsonschema
        sch = json.load(open(os.path.join(BASE, "referencia",
                          "schema_questao_med_unidavi.json"), encoding="utf-8"))
        V = jsonschema.Draft202012Validator(sch)
        inval = 0
        for q in montadas:
            inst = {k: v for k, v in q.items() if k != "_proveniencia"}
            errs = list(V.iter_errors(inst))
            if errs:
                inval += 1
                if inval <= 8:
                    print(f"  VALID! {q['_proveniencia']['id_origem']}: "
                          f"{errs[0].json_path} :: {errs[0].message[:110]}")
        print(f"Validação schema: {len(montadas)-inval}/{len(montadas)} OK")
    except ImportError:
        print("(jsonschema indisponível)")
    print(f"Gravado: {OUT}")


if __name__ == "__main__":
    main()
