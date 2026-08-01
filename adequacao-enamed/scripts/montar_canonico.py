#!/usr/bin/env python3
"""Monta as questões canônicas (schema_questao_med_unidavi.json) a partir de:
  - intermediario/enamed2025_caderno1.json  (extração fiel: enunciado + A-D + gabarito)
  - intermediario/enriquecimento/parte_*.json  (classificação + justificativas, por num)

Regras determinísticas (não dependem de IA):
  - alternativa `correta` = a letra do gabarito OFICIAL (não a opinião do enriquecedor)
  - fase_alvo + uc_slug derivados de area_clinica (mapa abaixo)
  - envelope institucional (status pendente, versao, auditoria, etc.)

Saída: canonico/enamed2025_caderno1.canonico.json  (array validado)
"""
import json, os, glob, sys

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
EXTR = os.path.join(BASE, "intermediario", "enamed2025_caderno1.json")
ENR_DIR = os.path.join(BASE, "intermediario", "enriquecimento")
OUT = os.path.join(BASE, "canonico", "enamed2025_caderno1.canonico.json")
CRIADA_EM = "2026-08-01T00:00:00Z"
FONTE = "adequacao-enamed (ENAMED 2025 Caderno 01) — extração + adequação assistida"

# area_clinica -> (fase_alvo, uc_slug). ENAMED é exame de saída: mapeia a área
# clínica à UC do ciclo clínico/internato onde o tema é ensinado na MED-UNIDAVI.
AREA2UC = {
    "clinica_medica": (12, "med_unidavi_f12_uc01_clinica_medica"),
    "cirurgia": (11, "med_unidavi_f11_uc01_clinica_cirurgica"),
    "ginecologia_obstetricia": (10, "med_unidavi_f10_uc01_saude_mulher"),
    "pediatria": (9, "med_unidavi_f09_uc01_saude_crianca"),
    "medicina_familia_comunidade": (12, "med_unidavi_f12_uc02_saude_familia_comunidade"),
    "saude_mental": (6, "med_unidavi_f06_uc01_problemas_mentais_comportamento"),
    "urgencia_emergencia": (8, "med_unidavi_f08_uc01_emergencias"),
    "ciclo_basico": (2, "med_unidavi_f02_uc02_mecanismos_agressao_defesa"),
}
BLOOM = {"conhecimento","compreensao","aplicacao","analise","sintese","avaliacao"}
DIFIC = {"facil","medio","dificil"}


def carregar_enriquecimento():
    enr = {}
    for f in sorted(glob.glob(os.path.join(ENR_DIR, "parte_*.json"))):
        for item in json.load(open(f, encoding="utf-8")):
            enr[int(item["num"])] = item
    return enr


import re as _re


def split_vinheta(enun, limite=1000):
    """Se o enunciado (vinheta + comando) passa do limite do schema, separa a
    vinheta clínica para `texto_base` e mantém o comando final em `enunciado`
    (modelagem canônica: texto_base = caso, enunciado = pergunta)."""
    if len(enun) <= limite:
        return None, enun
    sents = _re.split(r"(?<=[.:?])\s+", enun.strip())
    comando = sents[-1].strip()
    base = " ".join(sents[:-1]).strip()
    # se o comando sozinho ainda estoura (frase única gigante), puxa mais para a base
    while len(comando) > limite and len(sents) > 2:
        sents = sents[:-1]
        comando = sents[-1].strip()
        base = " ".join(sents[:-1]).strip()
    if not base or len(comando) < 10:
        # fallback: corta no último ponto antes do limite
        corte = enun.rfind(". ", 0, limite)
        if corte > 50:
            base, comando = enun[:corte + 1].strip(), enun[corte + 2:].strip()
    return (base or None), comando


def montar(rec, e):
    num = rec["num"]
    area = e["area_clinica"]
    if area not in AREA2UC:
        raise ValueError(f"Q{num}: area_clinica inválida: {area}")
    fase, uc = AREA2UC[area]
    gab = rec["gabarito"]
    alts = []
    for L in "ABCD":
        just = e["justificativas"].get(L, "").strip()
        alts.append({
            "letra": L,
            "texto": rec["alternativas"][L],
            "correta": (L == gab),
            "justificativa": just,
        })
    assert e["nivel_bloom"] in BLOOM, f"Q{num} bloom {e['nivel_bloom']}"
    assert e["dificuldade_editorial"] in DIFIC, f"Q{num} dif {e['dificuldade_editorial']}"
    texto_base, enunciado = split_vinheta(rec["enunciado"])
    q = {
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
        "referencia": "ENAMED 2025 — Caderno 01 (Portaria INEP nº 478/2025), questão "
                      f"{num}; gabarito oficial definitivo.",
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
        "_proveniencia": {"fonte": rec["fonte"], "questao_original": num,
                           "requer_imagem": rec["requer_imagem"]},
    }
    return q


def main():
    extr = {r["num"]: r for r in json.load(open(EXTR, encoding="utf-8")) if not r["descartada"]}
    enr = carregar_enriquecimento()
    faltando = sorted(set(extr) - set(enr))
    montadas, erros = [], []
    for num in sorted(extr):
        if num not in enr:
            continue
        try:
            montadas.append(montar(extr[num], enr[num]))
        except Exception as ex:
            erros.append(str(ex))
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    json.dump(montadas, open(OUT, "w"), ensure_ascii=False, indent=2)
    print(f"Canônicas montadas: {len(montadas)}/{len(extr)}")
    if faltando:
        print(f"Sem enriquecimento ({len(faltando)}): {faltando}")
    for e in erros:
        print("  ! erro:", e)
    print(f"Gravado: {OUT}")

    # validação (jsonschema se disponível)
    try:
        import jsonschema
        sch = json.load(open(os.path.join(BASE, "referencia",
                          "schema_questao_med_unidavi.json"), encoding="utf-8"))
        inval = 0
        for q in montadas:
            try:
                jsonschema.validate({k: v for k, v in q.items() if k != "_proveniencia"}, sch)
            except jsonschema.ValidationError as ve:
                inval += 1
                if inval <= 5:
                    print(f"  VALID! Q{q['_proveniencia']['questao_original']}: {ve.message[:120]}")
        print(f"Validação schema: {len(montadas)-inval}/{len(montadas)} OK")
    except ImportError:
        print("(jsonschema não instalado — validação estrutural só no assembler)")


if __name__ == "__main__":
    main()
