#!/usr/bin/env python3
"""Montador canônico genérico — serve qualquer fonte já extraída para o formato
intermediário padrão (Revalida, TP, simulados nacionais, .docx ...).

Entrada intermediária (array), por questão:
  id_origem, fonte, num, enunciado, alternativas{A..E}, gabarito,
  justificativa_oficial (ou null), n_alternativas, requer_imagem,
  descartada (opcional), motivo_descarte (opcional)

Enriquecimento (array em vários `parte_*.json`), por questão:
  id_origem, area_clinica, nivel_bloom, dificuldade_editorial, tema, subtema,
  competencia_dcn_2025, tags, descartar (letra ou null), motivo_descarte,
  problema_detectado, justificativas {letra_original: texto}

Regras determinísticas (não delegadas à IA):
  - a correta é SEMPRE a letra do gabarito oficial; nunca pode ser descartada;
  - itens de 5 alternativas viram 4 renumerando A–D, com remapeamento registrado;
  - questões anuladas (`descartada`) ficam fora;
  - imagens vêm de um manifesto e entram com alt_text obrigatório.

Uso:
  python3 montar_canonico_generico.py --intermediario intermediario/revalida.json \
      --enriquecimento intermediario/enriquecimento_revalida \
      --saida canonico/revalida.canonico.json \
      [--manifesto imagens/manifesto_revalida.json] [--fonte-geracao "..."]
"""
import argparse, glob, json, os, re, sys

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(BASE, "scripts"))
from montar_canonico import AREA2UC, BLOOM, DIFIC, split_vinheta  # noqa: E402
from montar_canonico_simulados import normalizar_texto  # noqa: E402

CRIADA_EM = "2026-08-01T00:00:00Z"


def montar(rec, e, imagens, fonte_geracao, cenario):
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
        raise ValueError(f"{idg}: gabarito {gab!r} não está entre as alternativas")

    descartar = e.get("descartar")
    if len(presentes) > 4:
        if not descartar:
            raise ValueError(f"{idg}: {len(presentes)} alternativas sem 'descartar'")
        if descartar == gab:
            raise ValueError(f"{idg}: tentou descartar a CORRETA ({gab})")
        if descartar not in presentes:
            raise ValueError(f"{idg}: 'descartar'={descartar} inexistente")
        mantidas = [L for L in presentes if L != descartar]
    else:
        if descartar:
            raise ValueError(f"{idg}: já tem 4 alternativas, nada a descartar")
        mantidas = presentes
    if len(mantidas) != 4:
        raise ValueError(f"{idg}: {len(mantidas)} alternativas após conversão")

    remap = {orig: "ABCD"[i] for i, orig in enumerate(mantidas)}
    justs = e["justificativas"]
    faltam = [L for L in mantidas if not (justs.get(L) or "").strip()]
    if faltam:
        raise ValueError(f"{idg}: sem justificativa para {faltam}")

    alts = [{
        "letra": remap[o],
        "texto": normalizar_texto(rec["alternativas"][o]),
        "correta": (o == gab),
        "justificativa": justs[o].strip(),
    } for o in mantidas]

    texto_base, enunciado = split_vinheta(rec["enunciado"])
    q = {
        "tipo": "questao",
        "fase_alvo": fase,
        "uc_slug": uc,
        "tema": e["tema"],
        "subtema": e.get("subtema"),
        "sp_referencia": None,
        "cenario_origem": [cenario],
        "competencia_dcn_2025": e["competencia_dcn_2025"],
        "nivel_bloom": e["nivel_bloom"],
        "area_clinica": area,
        "dificuldade_editorial": e["dificuldade_editorial"],
        "tags": e.get("tags", []),
        "texto_base": texto_base,
        "enunciado": enunciado,
        "alternativas": alts,
        "referencia": f"{rec['fonte']}, questão {rec['num']}; gabarito oficial.",
        "fonte_geracao": fonte_geracao,
        "status_curadoria": "pendente",
        "disponibilidade": "disponivel",
        "meses_desde_ultimo_uso": None,
        "versao": 1,
        "uso_em_avaliacoes": {"total_avaliativo": 0, "ultima_avaliacao_em": None,
                               "historico": []},
        "performance": {"n_respostas_treino": 0, "n_respostas_avaliativo": 0,
                         "taxa_acerto_treino": None, "taxa_acerto_avaliativo": None,
                         "dificuldade_tri_b": None, "discriminacao_tri_a": None},
        "auditoria": {"criada_por": fonte_geracao, "criada_em": CRIADA_EM,
                       "curada_por": None, "curada_em": None, "edicoes": []},
        "_proveniencia": {
            "fonte": rec["fonte"],
            "id_origem": idg,
            "questao_original": rec["num"],
            "convertida_5_para_4": len(presentes) > 4,
            "alternativa_descartada": ({
                "letra_original": descartar,
                "texto": rec["alternativas"][descartar],
                "motivo": e.get("motivo_descarte"),
            } if len(presentes) > 4 else None),
            "remapeamento": remap,
            "gabarito_original": gab,
            "gabarito_novo": remap[gab],
            "problema_detectado": e.get("problema_detectado"),
            "justificativa_oficial_fonte": rec.get("justificativa_oficial"),
        },
    }

    img = imagens.get(idg)
    if img:
        item = {
            "id_imagem": img["id_imagem"],
            "posicao": "texto_base" if texto_base else "enunciado",
            "ordem": 1,
            "tipo": img["tipo"],
            "legenda": img.get("legenda"),
            "alt_text": img["alt_text"],
        }
        if img.get("creditos"):
            item["creditos_imagem"] = img["creditos"]
        q["imagens_anexadas"] = [item]
        q["_proveniencia"]["imagem_status"] = "anexada"
    else:
        q["_proveniencia"]["imagem_status"] = (
            "ausente_na_origem" if rec.get("requer_imagem") else "nao_requer")
    q["_proveniencia"]["requer_imagem"] = bool(rec.get("requer_imagem") or img)
    return q


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--intermediario", required=True)
    ap.add_argument("--enriquecimento", required=True)
    ap.add_argument("--saida", required=True)
    ap.add_argument("--manifesto", default=None)
    ap.add_argument("--fonte-geracao", default="adequacao-enamed — extração + adequação assistida")
    ap.add_argument("--cenario", default="preparacao_enamed")
    a = ap.parse_args()

    cam = lambda p: p if os.path.isabs(p) else os.path.join(BASE, p)
    regs = [r for r in json.load(open(cam(a.intermediario), encoding="utf-8"))
            if not r.get("descartada")]
    enr = {}
    for f in sorted(glob.glob(os.path.join(cam(a.enriquecimento), "parte_*.json"))):
        for item in json.load(open(f, encoding="utf-8")):
            enr[item["id_origem"]] = item
    imagens = {}
    if a.manifesto and os.path.exists(cam(a.manifesto)):
        for m in json.load(open(cam(a.manifesto), encoding="utf-8")):
            imagens[m["id_origem_questao"]] = m

    montadas, erros = [], []
    for r in regs:
        e = enr.get(r["id_origem"])
        if not e:
            continue
        try:
            montadas.append(montar(r, e, imagens, a.fonte_geracao, a.cenario))
        except Exception as ex:
            erros.append(str(ex))

    saida = cam(a.saida)
    os.makedirs(os.path.dirname(saida), exist_ok=True)
    json.dump(montadas, open(saida, "w"), ensure_ascii=False, indent=2)
    sem_enr = [r["id_origem"] for r in regs if r["id_origem"] not in enr]
    conv = sum(1 for q in montadas if q["_proveniencia"]["convertida_5_para_4"])
    comimg = sum(1 for q in montadas if q.get("imagens_anexadas"))
    print(f"Canônicas: {len(montadas)}/{len(regs)} | convertidas 5->4: {conv} "
          f"| com imagem: {comimg}")
    if sem_enr:
        print(f"Sem enriquecimento ({len(sem_enr)}): {sem_enr[:8]}")
    for e in erros[:10]:
        print("  ! ERRO:", e)
    if len(erros) > 10:
        print(f"  ... e mais {len(erros)-10} erros")

    try:
        import jsonschema
        sch = json.load(open(os.path.join(BASE, "referencia",
                          "schema_questao_med_unidavi.json"), encoding="utf-8"))
        V = jsonschema.Draft202012Validator(sch)
        inval = 0
        for q in montadas:
            errs = list(V.iter_errors({k: v for k, v in q.items()
                                       if k != "_proveniencia"}))
            if errs:
                inval += 1
                if inval <= 6:
                    print(f"  VALID! {q['_proveniencia']['id_origem']}: "
                          f"{errs[0].json_path} :: {errs[0].message[:110]}")
        print(f"Validação schema: {len(montadas)-inval}/{len(montadas)} OK")
    except ImportError:
        pass
    print(f"Gravado: {saida}")


if __name__ == "__main__":
    main()
