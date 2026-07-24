#!/usr/bin/env python3
"""Extrai questões+gabarito dos .docx ENAMED para o schema de `questoes`.
Calibração da Porta B — junta os dois arquivos pelo número da questão.
NÃO inventa conteúdo: só reestrutura o que está nos documentos."""
import re, json, sys, os

NIVEL = {"fácil": "facil", "média": "media", "difícil": "dificil"}

def split_questoes(txt):
    """Retorna dict num -> {nivel, corpo_lines}."""
    linhas = txt.split("\n")
    out, cur, num = {}, None, None
    for ln in linhas:
        m = re.match(r"QUEST[ÃA]O\s+(\d+)\s*\(N[íi]vel:\s*([A-Za-zÁ-ú]+)\)", ln)
        if m:
            num = int(m.group(1))
            cur = {"nivel": NIVEL.get(m.group(2).strip().lower()), "linhas": []}
            out[num] = cur
        elif cur is not None:
            cur["linhas"].append(ln)
    return out

def parse_alternativas(linhas):
    """Do bloco de uma questão: enunciado (junção até a 1a alt) + A-D."""
    alts, enun, cur_letter = {}, [], None
    for ln in linhas:
        m = re.match(r"\(([A-D])\)\s*(.*)", ln.strip())
        if m:
            cur_letter = m.group(1)
            alts[cur_letter] = m.group(2).strip()
        elif cur_letter:
            if ln.strip():
                alts[cur_letter] += " " + ln.strip()
        else:
            if ln.strip():
                enun.append(ln.strip())
    return " ".join(enun).strip(), alts

def parse_gabarito(txt):
    """num -> {gabarito, justificativa_geral, just:{A..D}}."""
    blocos = re.split(r"QUEST[ÃA]O\s+(\d+)\s*\(N[íi]vel:[^)]*\)", txt)
    # blocos = [pre, num1, corpo1, num2, corpo2, ...]
    out = {}
    for i in range(1, len(blocos), 2):
        num = int(blocos[i]); corpo = blocos[i + 1]
        gm = re.search(r"Resposta correta:\s*\(([A-D])\)", corpo)
        jg = re.search(r"Justificativa geral:\s*(.*?)(?:\n\s*An[áa]lise|\Z)", corpo, re.S)
        justs = {}
        for L in "ABCD":
            jm = re.search(
                rf"\({L}\)\s*(?:CORRETA|incorreta)\s*[—-]\s*(.*?)(?=\n\s*\([A-D]\)\s*(?:CORRETA|incorreta)|\Z)",
                corpo, re.S)
            if jm:
                justs[L] = re.sub(r"\s+", " ", jm.group(1)).strip()
        out[num] = {
            "gabarito": gm.group(1) if gm else None,
            "justificativa_geral": re.sub(r"\s+", " ", jg.group(1)).strip() if jg else None,
            "just": justs,
        }
    return out

def cabecalho(txt):
    ls = [l for l in txt.split("\n") if l.strip()]
    uc = ls[0].strip() if ls else ""
    sp = ls[1].strip() if len(ls) > 1 else ""
    return uc, sp

def montar(q_file, g_file, fase):
    q_txt = open(q_file).read(); g_txt = open(g_file).read()
    uc, sp = cabecalho(q_txt)
    qs = split_questoes(q_txt); gb = parse_gabarito(g_txt)
    registros = []
    for num in sorted(qs):
        enun, alts = parse_alternativas(qs[num]["linhas"])
        g = gb.get(num, {})
        registros.append({
            "num": num,
            "enunciado": enun,
            "vinheta": None,
            "alt_a": alts.get("A"), "alt_b": alts.get("B"),
            "alt_c": alts.get("C"), "alt_d": alts.get("D"),
            "gabarito": g.get("gabarito"),
            "just_a": g.get("just", {}).get("A"),
            "just_b": g.get("just", {}).get("B"),
            "just_c": g.get("just", {}).get("C"),
            "just_d": g.get("just", {}).get("D"),
            "justificativa_geral": g.get("justificativa_geral"),
            "nivel": qs[num]["nivel"],
            "fase": fase, "uc": uc, "sp": sp,
            "oa_tags": [],  # ausente na origem
        })
    return registros

def validar(registros):
    """Aplica as mesmas regras da Porta A (§6)."""
    erros = []
    for r in registros:
        rid = f"{r['sp'][:12]} Q{r['num']}"
        for k in ("enunciado", "alt_a", "alt_b", "alt_c", "alt_d",
                  "gabarito", "just_a", "just_b", "just_c", "just_d"):
            if not r.get(k):
                erros.append(f"{rid}: campo obrigatório vazio -> {k}")
        if r["gabarito"] not in ("A", "B", "C", "D"):
            erros.append(f"{rid}: gabarito inválido -> {r['gabarito']}")
    return erros

if __name__ == "__main__":
    base = sys.argv[1]
    fase = 4
    conjuntos = [
        ("20444a0f-UC1_SP1_Questoes_ENAMED.txt", "92112a6c-UC1_SP1_Gabarito_ENAMED.txt"),
        ("0a47cb98-UC1_SP2_Questoes_ENAMED.txt", "81e5b914-UC1_SP2_Gabarito_ENAMED.txt"),
    ]
    todos = []
    for qf, gf in conjuntos:
        todos += montar(os.path.join(base, qf), os.path.join(base, gf), fase)
    erros = validar(todos)
    print(f"Total de questões extraídas: {len(todos)}")
    print(f"Erros de validação (regras da Porta A): {len(erros)}")
    for e in erros:
        print("  !", e)
    # amostra
    print("\n--- amostra: SP1 Q1 ---")
    print(json.dumps(todos[0], ensure_ascii=False, indent=2))
    out = sys.argv[2] if len(sys.argv) > 2 else None
    if out:
        json.dump(todos, open(out, "w"), ensure_ascii=False, indent=2)
        print(f"\nGravado: {out}")
