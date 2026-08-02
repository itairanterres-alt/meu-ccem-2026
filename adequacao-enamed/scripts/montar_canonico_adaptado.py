#!/usr/bin/env python3
"""Monta as questões ADAPTADAS (reescritas) no formato canônico institucional.

Diferente de `montar_canonico_generico.py`, que importa o texto da fonte, aqui o
enunciado e as alternativas são NOVOS: o item de origem serviu de referência de
conteúdo, não de texto. A origem fica registrada em `_proveniencia` como
`inspirada_em`, nunca como texto reproduzido.

O que este script recusa (e por isso existe):
  - item que não tenha exatamente 4 alternativas A-D;
  - item sem exatamente uma correta;
  - correta fora da posição sorteada por hash (senão o banco herda o viés de
    quem escreveu — nos .docx do NAPISUL a correta estava em A em 175 de 176);
  - alternativa sem justificativa;
  - enunciado que tenha reaproveitado trecho longo do original;
  - código de área/competência/conteúdo fora da Portaria 478/2025;
  - area_clinica, bloom ou dificuldade fora do enum institucional.

Uso: python3 adequacao-enamed/scripts/montar_canonico_adaptado.py
"""
import glob
import json
import os
import re
import sys

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(BASE, "scripts"))
from montar_canonico import AREA2UC, BLOOM, DIFIC, split_vinheta  # noqa: E402

LOTES = os.path.join(BASE, "intermediario", "lotes_adaptacao")
ADAPT = os.path.join(BASE, "intermediario", "adaptacao")
MAT = os.path.join(BASE, "referencia", "matriz_enamed_478_2025.json")
SAIDA = os.path.join(BASE, "canonico", "adaptadas.canonico.json")
CRIADA_EM = "2026-08-02T00:00:00Z"
FONTE_GER = "adequacao-enamed — item adaptado (reescrito) a partir de simulado de terceiro"

# Trecho de 9 palavras repetido do original já é reprodução, não adaptação.
JANELA = 9


def corta(t, lim):
    t = (t or "").strip()
    if len(t) <= lim:
        return t or None
    return t[:lim - 1].rsplit(" ", 1)[0] + "…"


def normaliza(t):
    return re.sub(r"[^a-zà-ú0-9 ]", " ", (t or "").lower())


def sobreposicao(novo, velho):
    """Maior número de palavras consecutivas em comum. Detecta cópia disfarçada."""
    a, b = normaliza(novo).split(), set()
    vb = normaliza(velho).split()
    for i in range(len(vb) - JANELA + 1):
        b.add(" ".join(vb[i:i + JANELA]))
    for i in range(len(a) - JANELA + 1):
        if " ".join(a[i:i + JANELA]) in b:
            return True
    return False


def montar(orig, ad, validos):
    idg = orig["id_origem"]
    AR, CO, CT, CE = validos
    erro = lambda m: ValueError(f"{idg}: {m}")

    area = ad.get("area_clinica")
    if area not in AREA2UC:
        raise erro(f"area_clinica inválida: {area!r}")
    # O enum institucional usa a taxonomia de Bloom original ("conhecimento");
    # a revisada chama o mesmo nível de "lembrar". Mesmo degrau, nome diferente.
    bloom = {"lembrar": "conhecimento"}.get(ad.get("nivel_bloom"), ad.get("nivel_bloom"))
    if bloom not in BLOOM:
        raise erro(f"nivel_bloom inválido: {ad.get('nivel_bloom')!r}")
    if ad.get("dificuldade_editorial") not in DIFIC:
        raise erro(f"dificuldade inválida: {ad.get('dificuldade_editorial')!r}")
    fase, uc = AREA2UC[area]

    alts = ad.get("alternativas") or []
    if len(alts) != 4:
        raise erro(f"{len(alts)} alternativas (esperado 4)")
    if [a.get("letra") for a in alts] != ["A", "B", "C", "D"]:
        raise erro(f"letras fora de ordem: {[a.get('letra') for a in alts]}")
    corretas = [a["letra"] for a in alts if a.get("correta")]
    if len(corretas) != 1:
        raise erro(f"{len(corretas)} alternativas marcadas como corretas")
    alvo = orig["posicao_correta_alvo"]
    if corretas[0] != alvo:
        raise erro(f"correta em {corretas[0]}, mas a posição sorteada é {alvo}")
    for a in alts:
        if not (a.get("texto") or "").strip():
            raise erro(f"alternativa {a.get('letra')} sem texto")
        if len((a.get("justificativa") or "").strip()) < 40:
            raise erro(f"alternativa {a['letra']} sem justificativa consistente")

    # A vinheta pode vir em `texto_base` com só o comando no `enunciado` — é o
    # formato pedido para casos longos. Portanto o tamanho mínimo e a checagem
    # de cópia valem sobre o TEXTO INTEIRO do item, não sobre o enunciado isolado.
    enun_novo = (ad.get("enunciado") or "").strip()
    base_novo = (ad.get("texto_base") or "").strip()
    if not enun_novo:
        raise erro("sem enunciado")
    if len(base_novo) + len(enun_novo) < 80:
        raise erro("texto curto demais para um item de prova")
    # Cruza TODO campo novo contra TODO campo velho: uma alternativa nova também
    # pode copiar da vinheta original, não só da alternativa correspondente.
    velhos = [orig["enunciado_origem"]] + list((orig["alternativas_origem"] or {}).values())
    novos = [("enunciado", enun_novo), ("texto_base", base_novo)]
    novos += [(f"alternativa {a['letra']}", a["texto"]) for a in alts]
    for rotulo, txt in novos:
        if not txt:
            continue
        for velho in velhos:
            if sobreposicao(txt, velho):
                raise erro(f"{rotulo} repete {JANELA}+ palavras seguidas do "
                           "original — é reprodução, não adaptação")

    m = ad.get("matriz_enamed_478_2025") or {}
    if m.get("area") not in AR:
        raise erro(f"área da matriz inválida: {m.get('area')!r}")
    if not m.get("competencias") or any(c not in CO for c in m["competencias"]):
        raise erro(f"competências da matriz inválidas: {m.get('competencias')!r}")
    if not m.get("conteudos") or any(c not in CT for c in m["conteudos"]):
        raise erro(f"conteúdos da matriz inválidos: {m.get('conteudos')!r}")
    if m.get("cenario") and m["cenario"] not in CE:
        raise erro(f"cenário da matriz inválido: {m['cenario']!r}")

    if base_novo:
        texto_base, enunciado = base_novo, enun_novo
    else:
        texto_base, enunciado = split_vinheta(enun_novo)

    fonte = orig["fonte"]
    return {
        "tipo": "questao",
        "fase_alvo": fase,
        "uc_slug": uc,
        "tema": ad["tema"],
        "subtema": ad.get("subtema"),
        "sp_referencia": None,
        "cenario_origem": ["preparacao_enamed"],
        "competencia_dcn_2025": ad["competencia_dcn_2025"],
        "nivel_bloom": bloom,
        "area_clinica": area,
        "dificuldade_editorial": ad["dificuldade_editorial"],
        "tags": ad.get("tags", []),
        "texto_base": texto_base,
        "enunciado": enunciado,
        "alternativas": [{"letra": a["letra"], "texto": a["texto"].strip(),
                          "correta": bool(a.get("correta")),
                          "justificativa": a["justificativa"].strip()} for a in alts],
        "referencia": ("Item original da MED-UNIDAVI, escrito sobre o mesmo objeto "
                       f"de conhecimento de questão do {fonte}. Texto não reproduzido."),
        "fonte_geracao": FONTE_GER,
        "status_curadoria": "pendente",
        "disponibilidade": "disponivel",
        "meses_desde_ultimo_uso": None,
        "versao": 1,
        "uso_em_avaliacoes": {"total_avaliativo": 0, "ultima_avaliacao_em": None,
                              "historico": []},
        "performance": {"n_respostas_treino": 0, "n_respostas_avaliativo": 0,
                        "taxa_acerto_treino": None, "taxa_acerto_avaliativo": None,
                        "dificuldade_tri_b": None, "discriminacao_tri_a": None},
        "auditoria": {"criada_por": FONTE_GER, "criada_em": CRIADA_EM,
                      "curada_por": None, "curada_em": None, "edicoes": []},
        "classificacao_fina": {
            "especialidade": ad["especialidade"],
            "especialidade_secundaria": ad.get("especialidade_secundaria"),
            "objeto_conhecimento": ad["objeto_conhecimento"],
            "sistema_organico": ad.get("sistema_organico"),
            "contexto_atencao": ad.get("contexto_atencao"),
            "conteudo_declarado_origem": None,
            "autor_declarado_origem": None,
            "matriz_enamed_478_2025": {
                "area": m["area"], "competencias": m["competencias"],
                "conteudos": m["conteudos"], "cenario": m.get("cenario"),
                # o schema limita a 300; é rótulo descritivo, corta no espaço
                "justificativa": corta(m.get("justificativa"), 300),
            },
        },
        "_proveniencia": {
            "fonte": f"{fonte} (adaptado)",
            "id_origem": f"adap_{idg}",
            "questao_original": None,
            "item_adaptado": True,
            "inspirada_em": {
                "id_origem": idg,
                "fonte": fonte,
                "chave_por_consenso": orig["chave_consenso"],
                "consenso": orig["consenso"],
                "confianca_minima_juizes": orig["confianca_min"],
                "defeitos_do_item_original": orig["problemas_apontados"],
                "aviso": ("Sem gabarito oficial. A resposta do item de origem foi "
                          "reconstruída por consenso de três juízes independentes e "
                          "serviu apenas para orientar o conteúdo; o item aqui é "
                          "novo e sua chave é a do item novo."),
            },
            "defeito_corrigido_na_adaptacao": ad.get("defeito_corrigido"),
            "nota_adaptacao": ad.get("nota_adaptacao"),
            "posicao_correta_sorteada": alvo,
            "requer_imagem": False,
            "imagem_status": "nao_requer",
        },
    }


def main():
    orig = {}
    for f in sorted(glob.glob(os.path.join(LOTES, "lote_*.json"))):
        for q in json.load(open(f, encoding="utf-8")):
            orig[q["id_origem"]] = q

    ad = {}
    for f in sorted(glob.glob(os.path.join(ADAPT, "lote_*.json"))):
        for q in json.load(open(f, encoding="utf-8")):
            ad[q["id_origem"]] = q
    print(f"origem: {len(orig)} | adaptadas recebidas: {len(ad)}")

    m = json.load(open(MAT, encoding="utf-8"))
    validos = ({a["id"] for a in m["areas_art3"]},
               {c["id"] for c in m["competencias_art6"]},
               {c["id"] for c in m["conteudos_art8"]},
               {c["id"] for c in m["cenarios_art7"]})

    montadas, erros = [], []
    for idg, o in sorted(orig.items()):
        a = ad.get(idg)
        if not a:
            continue
        try:
            montadas.append(montar(o, a, validos))
        except Exception as ex:
            erros.append(str(ex))

    os.makedirs(os.path.dirname(SAIDA), exist_ok=True)
    json.dump(montadas, open(SAIDA, "w"), ensure_ascii=False, indent=2)
    faltam = [i for i in orig if i not in ad]
    print(f"canônicas adaptadas: {len(montadas)}/{len(orig)} | rejeitadas: {len(erros)}"
          + (f" | sem adaptação: {len(faltam)}" if faltam else ""))
    for e in erros[:15]:
        print("  ! REJEITADA:", e)
    if len(erros) > 15:
        print(f"  ... e mais {len(erros) - 15}")

    try:
        import jsonschema
        sch = json.load(open(os.path.join(BASE, "referencia",
                                          "schema_questao_med_unidavi.json"),
                             encoding="utf-8"))
        V = jsonschema.Draft202012Validator(sch)
        inval = 0
        for q in montadas:
            errs = list(V.iter_errors({k: v for k, v in q.items()
                                       if k != "_proveniencia"}))
            if errs:
                inval += 1
                if inval <= 8:
                    print(f"  SCHEMA! {q['_proveniencia']['id_origem']}: "
                          f"{errs[0].json_path} :: {errs[0].message[:120]}")
        print(f"validação de schema: {len(montadas) - inval}/{len(montadas)} OK")
    except ImportError:
        pass
    print(f"Gravado: {SAIDA}")


if __name__ == "__main__":
    main()
