#!/usr/bin/env python3
"""Une todos os `canonico/*.canonico.json` num único arquivo de importação.

Gera dois artefatos:
  - `canonico/banco-completo.json`  -> só campos do schema (sem `_proveniencia`),
    pronto para carga no banco do Capi Treino ENAMED;
  - `canonico/banco-completo.stats.json` -> números por fonte, área, fase,
    dificuldade e posição do gabarito, para conferência rápida.

A procedência de cada questão continua nos arquivos por fonte — nada se perde.
"""
import json, glob, os
from collections import Counter

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CANON = os.path.join(BASE, "canonico")
OUT = os.path.join(CANON, "banco-completo.json")
STATS = os.path.join(CANON, "banco-completo.stats.json")


def main():
    todas, proc = [], []
    for caminho in sorted(glob.glob(os.path.join(CANON, "*.canonico.json"))):
        for q in json.load(open(caminho, encoding="utf-8")):
            p = q.get("_proveniencia", {})
            proc.append(p)
            todas.append({k: v for k, v in q.items() if k != "_proveniencia"})

    json.dump(todas, open(OUT, "w"), ensure_ascii=False, indent=2)

    stats = {
        "total": len(todas),
        "por_fonte": dict(Counter(p.get("fonte") for p in proc)),
        "por_area": dict(Counter(q["area_clinica"] for q in todas)),
        "por_fase": dict(sorted(Counter(q["fase_alvo"] for q in todas).items())),
        "por_dificuldade": dict(Counter(q["dificuldade_editorial"] for q in todas)),
        "por_bloom": dict(Counter(q["nivel_bloom"] for q in todas)),
        "posicao_gabarito": dict(sorted(Counter(
            a["letra"] for q in todas for a in q["alternativas"] if a["correta"]).items())),
        "convertidas_5_para_4": sum(1 for p in proc if p.get("convertida_5_para_4")),
        "posicao_redistribuida": sum(1 for p in proc if p.get("posicao_correta_redistribuida")),
        "com_imagem": sum(1 for q in todas if q.get("imagens_anexadas")),
        "com_defeito_sinalizado": sum(1 for p in proc if p.get("problema_detectado")),
        "citam_figura_ausente": sum(1 for p in proc
                                    if p.get("imagem_status") == "ausente_na_origem"),
        "com_justificativa_oficial_na_origem": sum(
            1 for p in proc if p.get("justificativa_oficial_fonte")),
        # Distinção que importa para a curadoria: a maior parte do banco tem
        # gabarito OFICIAL da prova de origem. Os itens adaptados são autorais —
        # o original serviu de referência de conteúdo e não tinha chave oficial,
        # então a resposta é responsabilidade de quem escreveu o item novo.
        "itens_adaptados_autorais": sum(1 for p in proc if p.get("item_adaptado")),
        "com_gabarito_oficial_da_origem": sum(1 for p in proc
                                              if not p.get("item_adaptado")),
        "adaptados_que_corrigiram_defeito": sum(
            1 for p in proc if p.get("defeito_corrigido_na_adaptacao")),
    }
    json.dump(stats, open(STATS, "w"), ensure_ascii=False, indent=2)

    # validação final do arquivo consolidado
    try:
        import jsonschema
        sch = json.load(open(os.path.join(BASE, "referencia",
                          "schema_questao_med_unidavi.json"), encoding="utf-8"))
        V = jsonschema.Draft202012Validator(sch)
        inval = sum(1 for q in todas if list(V.iter_errors(q)))
        print(f"Validação do banco consolidado: {len(todas)-inval}/{len(todas)} OK")
    except ImportError:
        pass

    # integridade: exatamente uma correta por questão
    ruins = [i for i, q in enumerate(todas)
             if sum(1 for a in q["alternativas"] if a["correta"]) != 1
             or len(q["alternativas"]) != 4]
    print(f"Integridade (4 alternativas, 1 correta): {len(todas)-len(ruins)}/{len(todas)}")

    for k, v in stats.items():
        print(f"  {k}: {v}")
    print(f"\nGravado: {OUT}\n         {STATS}")


if __name__ == "__main__":
    main()
