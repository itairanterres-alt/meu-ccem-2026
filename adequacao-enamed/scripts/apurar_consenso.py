#!/usr/bin/env python3
"""Apura o consenso de três juízes independentes sobre as 150 questões sem gabarito.

As questões do Simulado Nacional (Estratégia MED) e dos simulados FPS chegaram sem
chave oficial. O gabarito que o professor enviou para o Simulado Nacional foi
verificado e NÃO é o desta prova (12/50 de acerto, nenhuma letra E em prova A-E),
então foi rejeitado. Sem chave, a alternativa é reconstruí-la por consenso.

Três rodadas independentes julgaram os mesmos 150 itens; a rodada 3 usou método
distinto (eliminação alternativa por alternativa) para reduzir erro correlacionado.

REGRAS DE DECISÃO (fixadas antes de ver os resultados):
  3/3 iguais ......... adotada como chave institucional POR CONSENSO (não oficial)
  2/3 iguais ......... só entra se a divergente for de confiança baixa; sinalizada
  sem maioria ........ descartada
  qualquer juiz com resposta nula ("não dá para decidir") ....... descartada

Saída: intermediario/consenso/apuracao.json  +  relatório no stdout.
"""
import glob
import json
import os
from collections import Counter

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DIR = os.path.join(BASE, "intermediario", "consenso")
LOTES = os.path.join(BASE, "intermediario", "lotes_consenso")
OUT = os.path.join(DIR, "apuracao.json")

RODADAS = (1, 2, 3)


def carregar_rodada(n):
    votos, arquivos = {}, sorted(glob.glob(os.path.join(DIR, f"rodada{n}_lote_*.json")))
    for f in arquivos:
        for v in json.load(open(f, encoding="utf-8")):
            votos[v["id_origem"]] = v
    return votos, len(arquivos)


def main():
    universo = {}
    for f in sorted(glob.glob(os.path.join(LOTES, "lote_*.json"))):
        for q in json.load(open(f, encoding="utf-8")):
            universo[q["id_origem"]] = q
    print(f"universo: {len(universo)} questões sem gabarito oficial")

    rodadas, faltando = {}, []
    for n in RODADAS:
        votos, nlotes = carregar_rodada(n)
        rodadas[n] = votos
        ausentes = [i for i in universo if i not in votos]
        print(f"  rodada {n}: {nlotes}/5 lotes, {len(votos)} votos"
              + (f", {len(ausentes)} sem voto" if ausentes else ""))
        faltando += ausentes
    if faltando:
        print(f"\n!! {len(set(faltando))} questões ainda sem as três rodadas — "
              "apuração parcial, não aplicar ao banco ainda.")

    resultado, motivos = [], Counter()
    for idg, q in sorted(universo.items()):
        vs = [rodadas[n].get(idg) for n in RODADAS]
        if any(v is None for v in vs):
            continue  # rodada incompleta; não conta como descarte
        letras = [v.get("resposta") for v in vs]
        conf = [(v.get("confianca") or "").lower() for v in vs]
        probs = [v.get("problema_do_item") for v in vs if v.get("problema_do_item")]

        if any(l is None for l in letras):
            decisao, chave, motivo = "descartada", None, "juiz declarou indecidível"
        else:
            cont = Counter(letras)
            top, n_top = cont.most_common(1)[0]
            if n_top == 3:
                decisao, chave, motivo = "aprovada", top, "3/3"
            elif n_top == 2:
                i_div = next(i for i, l in enumerate(letras) if l != top)
                if conf[i_div] == "baixa":
                    decisao, chave = "aprovada_com_ressalva", top
                    motivo = f"2/3 (divergente r{RODADAS[i_div]} de confiança baixa)"
                else:
                    decisao, chave = "descartada", None
                    motivo = (f"2/3, mas a divergente (r{RODADAS[i_div]}) tem "
                              f"confiança {conf[i_div] or '?'}")
            else:
                decisao, chave, motivo = "descartada", None, "três respostas distintas"

        motivos[f"{decisao}: {motivo.split('(')[0].strip()}"] += 1
        resultado.append({
            "id_origem": idg,
            "fonte": q.get("fonte"),
            "n_alternativas": len(q.get("alternativas", [])),
            "decisao": decisao,
            "chave_consenso": chave,
            "motivo": motivo,
            "votos": [{"rodada": n, "resposta": v.get("resposta"),
                       "confianca": v.get("confianca")}
                      for n, v in zip(RODADAS, vs)],
            "confianca_min": (min(conf, key=lambda c: {"alta": 2, "média": 1, "media": 1,
                                                       "baixa": 0}.get(c, 0))
                              if all(conf) else None),
            "problemas_apontados": probs or None,
        })

    json.dump(resultado, open(OUT, "w"), ensure_ascii=False, indent=2)

    apr = [r for r in resultado if r["decisao"] == "aprovada"]
    res = [r for r in resultado if r["decisao"] == "aprovada_com_ressalva"]
    des = [r for r in resultado if r["decisao"] == "descartada"]
    print(f"\n=== APURAÇÃO ({len(resultado)} com as três rodadas) ===")
    print(f"  aprovadas 3/3 ................. {len(apr)}")
    print(f"  aprovadas 2/3 com ressalva .... {len(res)}")
    print(f"  descartadas ................... {len(des)}")
    print("\nmotivos:")
    for k, v in motivos.most_common():
        print(f"  {k:<52} {v}")

    print("\npor fonte:")
    for fonte in sorted({r["fonte"] for r in resultado}):
        d = [r for r in resultado if r["fonte"] == fonte]
        ok = sum(1 for r in d if r["decisao"].startswith("aprovada"))
        print(f"  {str(fonte)[:52]:<52} {ok}/{len(d)} sobrevivem")

    sobrev = apr + res
    print("\nentre as sobreviventes, confiança mínima entre os três juízes:",
          dict(Counter(r["confianca_min"] for r in sobrev).most_common()))
    comp = sum(1 for r in sobrev if r["problemas_apontados"])
    print(f"sobreviventes com defeito técnico apontado por algum juiz: {comp} "
          "(vão sinalizadas para conferência prioritária)")
    print(f"\nGravado: {OUT}")


if __name__ == "__main__":
    main()
