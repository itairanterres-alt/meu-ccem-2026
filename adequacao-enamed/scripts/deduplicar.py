#!/usr/bin/env python3
"""Marca questões repetidas entre fontes, para o banco não ter o mesmo item duas vezes.

Casos reais encontrados: o Simulado 02 institucional reaproveitou 16 questões do
Revalida, e o TPMed 2025 repete 3 do TP 2022.

Critério de qual cópia FICA (prioridade decrescente):
  1. prova oficial nacional com gabarito oficial (ENAMED, Revalida);
  2. caderno comentado com justificativa do autor (TP 2022, TPMed 2025);
  3. simulado institucional;
  4. banco em .docx.
A cópia perdedora recebe `descartada: true` e `duplicata_de` apontando para a que
ficou — nada é apagado, só fica fora do banco.

Uso: python3 adequacao-enamed/scripts/deduplicar.py [--aplicar]
Sem --aplicar apenas relata.
"""
import argparse, hashlib, json, os, re

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
INTER = os.path.join(BASE, "intermediario")

# menor número = maior prioridade para PERMANECER no banco
PRIORIDADE = [
    (r"ENAMED 2025 — Caderno", 1),
    (r"Revalida", 1),
    # entre cadernos comentados (ambos com justificativa oficial), fica o mais
    # recente: está mais alinhado ao ENAMED vigente
    (r"TPMed 2025|caderno comentado", 2),
    (r"Teste de Progresso MED 2022", 3),
    (r"Simulado Nacional|Simulado ENAMED", 4),
    (r"Simulado 0[12] — MED/ENAMED", 5),
    (r"NAPISUL|CLM|UNIDAVI", 6),
]
ARQUIVOS = ["enamed2025_caderno1.json", "revalida.json", "tp2022.json",
            "simulados_nacionais.json", "simulados2026.json", "questoes_docx.json"]


def prioridade(fonte):
    for pad, p in PRIORIDADE:
        if re.search(pad, fonte or "", re.I):
            return p
    return 9


def chave(enun):
    s = re.sub(r"[^a-z0-9]+", " ", (enun or "").lower())
    s = re.sub(r"\s+", " ", s).strip()
    return hashlib.md5(s[:400].encode()).hexdigest()[:12]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--aplicar", action="store_true")
    a = ap.parse_args()

    dados, grupos = {}, {}
    for arq in ARQUIVOS:
        caminho = os.path.join(INTER, arq)
        if not os.path.exists(caminho):
            continue
        regs = json.load(open(caminho, encoding="utf-8"))
        dados[arq] = regs
        for r in regs:
            if r.get("descartada"):
                continue
            k = chave(r.get("enunciado"))
            ident = r.get("id_origem") or f"{arq}#{r.get('num')}"
            grupos.setdefault(k, []).append({
                "arquivo": arq, "id": ident, "fonte": r.get("fonte"),
                "prio": prioridade(r.get("fonte")), "num": r.get("num"),
                "tem_gabarito": bool(r.get("gabarito")),
                "tem_just": bool(r.get("justificativa_oficial")),
            })

    marcados = 0
    for k, itens in grupos.items():
        if len(itens) < 2:
            continue
        # fica: maior prioridade; desempate por ter gabarito, depois justificativa
        itens.sort(key=lambda x: (x["prio"], not x["tem_gabarito"], not x["tem_just"]))
        fica, perdem = itens[0], itens[1:]
        print(f"\ndupla: fica {fica['id']} ({fica['fonte']})")
        for p in perdem:
            print(f"   sai  {p['id']} ({p['fonte']})")
            marcados += 1
            if a.aplicar:
                for r in dados[p["arquivo"]]:
                    if (r.get("id_origem") or f"{p['arquivo']}#{r.get('num')}") == p["id"]:
                        r["descartada"] = True
                        r["motivo_descarte"] = "duplicata de outra fonte"
                        r["duplicata_de"] = fica["id"]
                        break

    if a.aplicar:
        for arq, regs in dados.items():
            json.dump(regs, open(os.path.join(INTER, arq), "w"),
                      ensure_ascii=False, indent=2)
        print(f"\nAplicado: {marcados} questões marcadas como duplicata.")
    else:
        print(f"\n(simulação) {marcados} questões seriam marcadas. Use --aplicar.")


if __name__ == "__main__":
    main()
