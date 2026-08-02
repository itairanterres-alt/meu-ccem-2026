#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
banco.py — ferramentas de manutenção do banco de questões MED-UNIDAVI
=====================================================================

Um script com subcomandos, deliberadamente. A auditoria da fábrica mostrou que o
problema não era o tamanho, e sim a **mesma decisão reimplementada em cada
caminho**: 6 detectores de `requer_imagem` com 15% de discordância, 3 critérios de
deduplicação, 4 montadores gravando tags sem normalizar. Cada função aqui existe
uma vez só, e todo caminho passa por ela.

Subcomandos
-----------
  id        Atribui `id_questao` estável (UUIDv5) e detecta colisões/duplicatas.
  migrar    Converte um acervo externo para o envelope canônico.
  tags      Normaliza o vocabulário de tags e relata as grafias concorrentes.
  refs      Confere as cópias do schema e carimba a versão da régua.

Exemplos
--------
  python banco.py id banco-completo.json --escrever
  python banco.py migrar seed.json --perfil sessao-questoes -o migrado.json
  python banco.py tags banco-completo.json --escrever
  python banco.py refs
"""

import argparse
import glob
import hashlib
import json
import os
import re
import sys
import unicodedata
import uuid
from collections import Counter, defaultdict

_HERE = os.path.dirname(os.path.abspath(__file__))
_REFS = os.path.join(_HERE, "..", "references")

# Namespace fixo do projeto. NÃO altere: mudar isto reescreve a identidade de todo
# o banco e quebra qualquer referência externa já emitida.
NS_MED_UNIDAVI = uuid.UUID("6f3a1c8e-4d2b-5e7a-9c1f-0b8d2e4a6c31")


# ---------------------------------------------------------------------------
# Normalização — uma implementação, usada por todos os subcomandos
# ---------------------------------------------------------------------------
def sem_acento(s):
    return "".join(c for c in unicodedata.normalize("NFD", s or "")
                   if unicodedata.category(c) != "Mn")


def normalizar_texto(s):
    """Forma canônica para comparação: minúsculo, sem acento, sem pontuação."""
    return " ".join(re.sub(r"[^a-z0-9]+", " ", sem_acento(s or "").lower()).split())


def normalizar_tag(t):
    """Uma convenção só: minúsculo, sem acento, palavras unidas por underscore.

    A auditoria encontrou 2.754 tags distintas para 914 questões, com 299 conceitos
    grafados de mais de um jeito (`atenção primária` / `atencao_primaria` /
    `atencao primaria` / `atencao-primaria`), afetando 73% das questões. A origem
    era `e.get("tags", [])` gravado sem normalizar em quatro montadores diferentes.
    """
    return re.sub(r"_+", "_", re.sub(r"[^a-z0-9]+", "_", sem_acento(t or "").lower())).strip("_")


def corpo_da_questao(q):
    """O texto que define a identidade do item: vinheta + comando + alternativas."""
    partes = [q.get("texto_base") or "", q.get("enunciado") or ""]
    partes += [a.get("texto", "") for a in sorted(q.get("alternativas", []),
                                                  key=lambda a: a.get("letra", ""))]
    return normalizar_texto(" ".join(partes))


def id_questao(q):
    """UUIDv5 determinístico sobre o corpo normalizado.

    Duas questões com o mesmo enunciado e as mesmas alternativas recebem o mesmo
    id, em qualquer acervo e em qualquer execução. É isso que permite (a) propagar
    a correção de um docente entre acervos e (b) detectar reingestão — as 40
    duplicatas do seed do app entraram por um segundo caminho de importação
    justamente porque não havia chave com que compará-las.
    """
    return str(uuid.uuid5(NS_MED_UNIDAVI, corpo_da_questao(q)))


def carregar(caminho):
    with open(caminho, encoding="utf-8") as f:
        d = json.load(f)
    if isinstance(d, dict) and isinstance(d.get("questoes"), list):
        return d["questoes"]
    return d if isinstance(d, list) else [d]


def gravar(caminho, questoes):
    with open(caminho, "w", encoding="utf-8") as f:
        json.dump(questoes, f, ensure_ascii=False, indent=1)


# ---------------------------------------------------------------------------
# id
# ---------------------------------------------------------------------------
def cmd_id(args):
    qs = carregar(args.arquivo)
    ids = [id_questao(q) for q in qs]
    grupos = defaultdict(list)
    for i, k in enumerate(ids):
        grupos[k].append(i)
    dups = {k: v for k, v in grupos.items() if len(v) > 1}

    print(f"questões: {len(qs)} | ids únicos: {len(grupos)} | grupos duplicados: {len(dups)}")
    for k, idx in list(dups.items())[:20]:
        print(f"  {k[:8]}… → posições {[i + 1 for i in idx]}")
        print(f"      {(qs[idx[0]].get('enunciado') or '')[:100]}")

    if args.escrever:
        for q, k in zip(qs, ids):
            q["id_questao"] = k
        destino = args.saida or args.arquivo
        gravar(destino, qs)
        print(f"\nid_questao gravado em {destino}")
    else:
        print("\n(simulação — use --escrever para gravar)")
    return 1 if dups and args.falhar_se_duplicado else 0


# ---------------------------------------------------------------------------
# migrar
# ---------------------------------------------------------------------------
ENVELOPE = {
    "tipo": "questao",
    "status_curadoria": "pendente",
    "disponibilidade": "disponivel",
    "versao": 1,
    "uso_em_avaliacoes": {"total_avaliativo": 0, "total_treino": 0, "historico": []},
    "performance": {"n_respostas_avaliativo": 0, "n_respostas_treino": 0,
                    "taxa_acerto_avaliativo": None, "taxa_acerto_treino": None,
                    "dificuldade_tri_b": None, "discriminacao_tri_a": None},
    "imagens_anexadas": [],
    "meses_desde_ultimo_uso": None,
}

# Campos que existem no acervo de origem mas não no schema canônico, e para onde vão.
PERFIS = {
    "sessao-questoes": {
        "descarta": ["_proveniencia"],
        "renomeia": {"oa_slugs": "oa_referencia"},
        "origem": "importada_prova_real",
        "fonte": "sessao-questoes (seed do app de sessões) — migrado ao envelope canônico",
    },
}


def _area_por_uc():
    """Mapa uc_slug → area_clinica, lido da taxonomia. Fonte autoritativa.

    Preencher `area_clinica` a partir da taxonomia é dedução, não invenção — o
    campo já está declarado lá, por UC. Já `tema`, `nivel_bloom` e
    `competencia_dcn_2025` exigem julgamento sobre o conteúdo do item: a migração
    os deixa em aberto e os contabiliza, em vez de fabricar valor plausível.
    """
    achados = sorted(glob.glob(os.path.join(_REFS, "taxonomia_med_unidavi_*.json")))
    if not achados:
        return {}
    with open(achados[-1], encoding="utf-8") as f:
        tax = json.load(f)
    return {uc["slug"]: uc.get("area_clinica_principal")
            for fase in tax.get("fases", []) for uc in fase.get("ucs", [])
            if uc.get("slug")}


def cmd_migrar(args):
    perfil = PERFIS.get(args.perfil)
    if not perfil:
        print(f"perfil desconhecido: {args.perfil}. Disponíveis: {list(PERFIS)}", file=sys.stderr)
        return 2
    qs = carregar(args.arquivo)
    area_por_uc = _area_por_uc()
    saida, notas = [], Counter()
    for q in qs:
        n = dict(q)
        for c in perfil["descarta"]:
            if c in n:
                notas[f"campo descartado: {c}"] += 1
                n.pop(c)
        for de, para in perfil["renomeia"].items():
            if de in n:
                n[para] = n.pop(de)
                notas[f"campo renomeado: {de} → {para}"] += 1
        for k, v in ENVELOPE.items():
            n.setdefault(k, json.loads(json.dumps(v)))
        n.setdefault("origem", perfil["origem"])
        n.setdefault("fonte_geracao", perfil["fonte"])
        n.setdefault("auditoria", {"criada_por": perfil["fonte"], "criada_em": args.data,
                                   "edicoes": []})
        # derivável da taxonomia (dedução, não invenção)
        if not n.get("area_clinica"):
            a = area_por_uc.get(n.get("uc_slug"))
            if a:
                n["area_clinica"] = a
                notas["area_clinica deduzida da taxonomia"] += 1

        # exigem julgamento sobre o conteúdo — ficam em aberto e são contabilizados
        pendentes = [c for c in ("tema", "nivel_bloom", "competencia_dcn_2025",
                                 "area_clinica", "dificuldade_editorial")
                     if not n.get(c)]
        for c in pendentes:
            notas[f"PENDENTE de classificação: {c}"] += 1
        n["_pendencias_classificacao"] = pendentes
        n["id_questao"] = id_questao(n)
        saida.append(n)

    print(f"migradas: {len(saida)}")
    for k, v in notas.most_common():
        print(f"   {v:5d}  {k}")
    prontas = sum(1 for q in saida if not q["_pendencias_classificacao"])
    print(f"\n   prontas para validar: {prontas} de {len(saida)}")
    if prontas < len(saida):
        print("   As demais precisam de um passo de classificação (tema, Bloom, competência DCN).")
        print("   A migração NÃO inventa esses valores — é o que separa migrar de fabricar.")
    ids = Counter(q["id_questao"] for q in saida)
    dup = sum(1 for v in ids.values() if v > 1)
    if dup:
        print(f"\n   ATENÇÃO: {dup} id(s) repetido(s) — reingestão pelo mesmo conteúdo.")
    if args.saida:
        gravar(args.saida, saida)
        print(f"\ngravado em {args.saida}")
        print("Próximo passo: rodar validate_questao.py sobre o arquivo migrado.")
    return 0


# ---------------------------------------------------------------------------
# tags
# ---------------------------------------------------------------------------
def cmd_tags(args):
    qs = carregar(args.arquivo)
    familias = defaultdict(Counter)
    for q in qs:
        for t in (q.get("tags") or []):
            familias[normalizar_tag(t)][t] += 1
    concorrentes = {k: v for k, v in familias.items() if len(v) > 1}
    afetadas = sum(1 for q in qs
                   if any(len(familias[normalizar_tag(t)]) > 1 for t in (q.get("tags") or [])))
    print(f"tags distintas: {sum(len(v) for v in familias.values())} | "
          f"conceitos: {len(familias)}")
    print(f"conceitos com grafia concorrente: {len(concorrentes)}")
    print(f"questões afetadas: {afetadas} de {len(qs)} ({100 * afetadas / max(1, len(qs)):.0f}%)")
    for k, v in sorted(concorrentes.items(), key=lambda x: -sum(x[1].values()))[:15]:
        print(f"   {k}: {dict(v)}")
    if args.escrever:
        for q in qs:
            if q.get("tags"):
                q["tags"] = sorted({normalizar_tag(t) for t in q["tags"] if normalizar_tag(t)})
        destino = args.saida or args.arquivo
        gravar(destino, qs)
        print(f"\ntags normalizadas em {destino}")
    else:
        print("\n(simulação — use --escrever para gravar)")
    if args.vocabulario:
        vocab = sorted(familias)
        with open(args.vocabulario, "w", encoding="utf-8") as f:
            json.dump({"gerado_de": os.path.basename(args.arquivo),
                       "total": len(vocab), "tags": vocab}, f, ensure_ascii=False, indent=1)
        print(f"vocabulário controlado ({len(vocab)} termos) em {args.vocabulario}")
    return 0


# ---------------------------------------------------------------------------
# refs
# ---------------------------------------------------------------------------
def cmd_refs(args):
    """Confere as cópias do schema e carimba a versão da régua.

    A auditoria encontrou três cópias do schema no repositório, já divergentes, e
    dois estágios do pipeline que **reescrevem** o schema em disco com definições
    incompatíveis do mesmo campo. Enquanto isso existir, "o banco valida" não
    significa nada — a régua é escrita pelo medido.
    """
    canonico = os.path.join(_REFS, "schema_questao_med_unidavi.json")
    if not os.path.isfile(canonico):
        print("ERRO: schema canônico não encontrado.", file=sys.stderr)
        return 2
    with open(canonico, encoding="utf-8") as f:
        base = json.load(f)
    h = hashlib.sha256(json.dumps(base, sort_keys=True, ensure_ascii=False).encode()).hexdigest()
    versao = "(sem VERSION)"
    vpath = os.path.join(_REFS, "VERSION")
    if os.path.isfile(vpath):
        versao = open(vpath, encoding="utf-8").read().strip()

    print(f"schema canônico : {os.path.relpath(canonico)}")
    print(f"  propriedades  : {len(base.get('properties', {}))}")
    print(f"  sha256        : {h[:16]}…")
    print(f"  versão skill  : {versao}")
    print(f"\nCarimbo da régua para registrar junto de qualquer medição de qualidade:")
    print(f"  capi-questoes-enamed {versao} · schema {h[:12]}")

    if args.comparar:
        print("\nComparando com outras cópias:")
        for outro in args.comparar:
            if not os.path.isfile(outro):
                print(f"  {outro}: NÃO ENCONTRADO")
                continue
            with open(outro, encoding="utf-8") as f:
                o = json.load(f)
            pa, pb = set(base.get("properties", {})), set(o.get("properties", {}))
            ho = hashlib.sha256(json.dumps(o, sort_keys=True, ensure_ascii=False).encode()).hexdigest()
            estado = "IDÊNTICA" if ho == h else "DIVERGENTE"
            print(f"  {outro}: {estado} ({len(pb)} propriedades)")
            if pa - pb:
                print(f"      falta lá : {sorted(pa - pb)}")
            if pb - pa:
                print(f"      só lá    : {sorted(pb - pa)}")
        return 0
    return 0


def main():
    ap = argparse.ArgumentParser(description=__doc__,
                                 formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = ap.add_subparsers(dest="cmd", required=True)

    p = sub.add_parser("id", help="atribui id_questao estável e detecta duplicatas")
    p.add_argument("arquivo")
    p.add_argument("-o", "--saida")
    p.add_argument("--escrever", action="store_true")
    p.add_argument("--falhar-se-duplicado", action="store_true")
    p.set_defaults(func=cmd_id)

    p = sub.add_parser("migrar", help="converte acervo externo para o envelope canônico")
    p.add_argument("arquivo")
    p.add_argument("--perfil", required=True, choices=sorted(PERFIS))
    p.add_argument("-o", "--saida")
    p.add_argument("--data", default="2026-08-02", help="timestamp de auditoria.criada_em")
    p.set_defaults(func=cmd_migrar)

    p = sub.add_parser("tags", help="normaliza o vocabulário de tags")
    p.add_argument("arquivo")
    p.add_argument("-o", "--saida")
    p.add_argument("--escrever", action="store_true")
    p.add_argument("--vocabulario", help="grava o vocabulário controlado neste caminho")
    p.set_defaults(func=cmd_tags)

    p = sub.add_parser("refs", help="confere as cópias do schema e carimba a régua")
    p.add_argument("--comparar", nargs="*", help="outras cópias do schema a comparar")
    p.set_defaults(func=cmd_refs)

    args = ap.parse_args()
    return args.func(args)


if __name__ == "__main__":
    sys.exit(main())
