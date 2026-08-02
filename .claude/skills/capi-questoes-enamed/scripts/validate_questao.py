#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
validate_questao.py — Validador executável de questões ENAMED MED-UNIDAVI (v2.0)
================================================================================

Verifica uma questão (ou lote) contra:
  1. o JSON Schema institucional (Draft 2020-12)
  2. os itens objetiváveis do checklist da Skill capi-questoes-enamed
  3. a existência real do uc_slug na taxonomia
  4. a existência real de sp_referencia / oa_referencia no banco de OAs vigente
  5. a conformidade de forma com o perfil empírico do ENAMED
     (references/perfil_estilo_enamed.md, medido sobre o Caderno 1 de 2025, n=90)

Filosofia ERRO vs AVISO
-----------------------
  ERRO  — defeito objetivo, mecânico, sem ambiguidade. Bloqueia a emissão.
  AVISO — sinal forte que exige olho humano, cujo veredito depende de contexto.

O que mudou na v2.0 (e por quê)
-------------------------------
* **Degradação silenciosa corrigida.** A v1 procurava as referências pelo nome
  literal com o semestre embutido (`taxonomia_med_unidavi_2026_1.json`). Ao
  atualizar a referência para 2026_2 — exatamente o que a virada de semestre
  exige — o arquivo deixava de ser encontrado, a checagem de uc_slug era
  desligada **sem aviso nenhum**, e uma questão com UC inventada passava com
  "OK (sem erros, sem avisos)" e exit code 0. Agora a resolução é por glob,
  a referência efetivamente usada é impressa no relatório, e referência ausente
  é ERRO por padrão (`--sem-referencias` para assumir o risco explicitamente).
* **Enunciado por completamento deixa de ser penalizado.** 60% dos itens do
  ENAMED 2025 não terminam em "?". O aviso SEM_INTERROGACAO da v1 empurrava a
  geração para o lado minoritário do padrão real. No lugar dele entram checagens
  próprias do completamento (minúscula inicial, ponto final, concordância).
* **Ancoragem em OA verificada.** A v1 validava o *padrão* do slug, nunca a
  *existência* do objetivo. Entre 2026.1 e 2026.2, 102 das 104 SPs em posição
  comum trocaram de título — um slug bem-formado pode apontar para uma SP morta.
* **Checagens de lote.** Concentração do gabarito, monocultura de formato e
  duplicidade só aparecem no conjunto; a v1 olhava uma questão por vez.

Códigos de saída
----------------
  0  nenhum ERRO      1  ao menos um ERRO      2  erro de uso / referência ausente

Uso
---
  python validate_questao.py questao.json
  python validate_questao.py --json lote.json
  python validate_questao.py --sem-referencias questao.json
  cat questao.json | python validate_questao.py -
"""

import argparse
import glob
import json
import os
import re
import sys
import unicodedata
from collections import Counter

_HERE = os.path.dirname(os.path.abspath(__file__))


def _find_reference(pattern, override):
    """Acha uma referência por glob. Havendo mais de uma, usa a de nome mais alto
    (oas_..._2026_2 > oas_..._2026_1), que é a convenção de versão do projeto."""
    if override:
        return override if os.path.isfile(override) else None
    achados = []
    for b in (os.path.join(_HERE, "..", "references"),
              os.path.join(_HERE, "references"), _HERE, os.getcwd()):
        achados.extend(glob.glob(os.path.join(b, pattern)))
    if not achados:
        return None
    return sorted(achados, key=lambda p: os.path.basename(p))[-1]


def _strip_accents(s):
    return "".join(c for c in unicodedata.normalize("NFD", s)
                   if unicodedata.category(c) != "Mn")


def _norm(s):
    return _strip_accents(s or "").lower()


def _words(s):
    return re.findall(r"[a-zA-ZáàâãéêíóôõúüçÁÀÂÃÉÊÍÓÔÕÚÜÇ]+", s or "")


def _wordcount(s):
    return len(_words(s or ""))


def _has_term(text, term):
    return re.search(r"\b" + re.escape(_norm(term)) + r"\b", _norm(text)) is not None


TERMOS_VAGOS = [
    "pode", "poderia", "talvez", "possivelmente",
    "geralmente", "frequentemente", "raramente", "tipicamente",
    "as vezes", "eventualmente", "costuma", "costumam",
    "sempre", "nunca", "todos", "todas", "nenhum", "nenhuma",
    "somente", "apenas", "qualquer",
]
NEG_ENUNCIADO = ["exceto", "incorreto", "incorreta", "falso", "falsa"]
NEG_FRASES = [r"\bnao\s+e\s+correto\b", r"\bnao\s+e\s+correta\b",
              r"\bnao\s+e\s+verdadeir", r"\bnao\s+e\s+adequad", r"\bnao\s+corresponde\b"]
VERBOS_INSTRUCAO = ["assinale", "indique", "aponte", "marque", "selecione"]
FRASES_ANTERIORES = [r"nenhuma das anteriores", r"todas as anteriores",
                     r"nenhuma das (op|alternativ)", r"todas as (op|alternativ)",
                     r"nenhuma das acima", r"todas as acima"]
TETO_NIVEL_TERMOS = [
    "pril", "sartana", "sartano", "olol", "dipino", "statina",
    "metformina", "insulina glargina", "levotiroxina", "omeprazol",
    "corticoide", "corticosteroide", "antibiotico", "antibioticoterapia",
    "conduta", "manejo", "tratamento de primeira linha", "primeira linha",
    "prescrever", "prescricao", "dose de ataque", "posologia",
    "encaminhar para", "internacao", "alta hospitalar",
    "diagnostico diferencial", "hipotese diagnostica principal",
    "cutoff", "ponto de corte diagnostico",
]
STOPWORDS = set(_norm(w) for w in [
    "a", "o", "as", "os", "um", "uma", "uns", "umas", "de", "do", "da", "dos", "das",
    "em", "no", "na", "nos", "nas", "por", "para", "com", "sem", "sob", "sobre", "ao",
    "aos", "e", "ou", "que", "qual", "quais", "se", "the", "del", "este", "esta",
    "esse", "essa", "aquele", "aquela", "seu", "sua", "seus", "suas", "seguinte",
    "seguintes", "paciente", "anos", "apresenta", "refere", "comparece", "quadro",
    "caso", "alternativa", "enunciado", "mais", "menos", "entre", "como", "pela",
    "pelo", "pelas", "pelos", "apos", "antes", "durante", "ainda", "ser", "estar",
    "tem", "ter", "foi", "era", "sao", "nao", "sim", "numa", "num",
])


class Report:
    def __init__(self, idx, ident):
        self.idx, self.ident = idx, ident
        self.errors, self.warnings = [], []

    def err(self, code, msg):
        self.errors.append((code, msg))

    def warn(self, code, msg):
        self.warnings.append((code, msg))

    @property
    def ok(self):
        return not self.errors


def load_schema_validator(schema_path):
    from jsonschema import Draft202012Validator, FormatChecker
    with open(schema_path, encoding="utf-8") as f:
        return Draft202012Validator(json.load(f), format_checker=FormatChecker())


def check_schema(q, rep, validator):
    for e in sorted(validator.iter_errors(q), key=lambda e: list(e.path)):
        loc = "/".join(str(p) for p in e.path) or "(raiz)"
        rep.err("SCHEMA", f"[{loc}] {e.message}")


def check_abdc(q, rep):
    alts = q.get("alternativas")
    if not isinstance(alts, list) or len(alts) != 4:
        rep.err("ABDC", "A questão deve ter exatamente 4 alternativas "
                        "(100% dos 90 itens do ENAMED 2025 Caderno 1 têm 4).")
        return
    letras = [a.get("letra") for a in alts]
    if set(letras) != {"A", "B", "C", "D"}:
        rep.err("ABDC", f"As letras devem ser exatamente A, B, C, D (encontrado: {letras}).")
    if letras != ["A", "B", "C", "D"]:
        rep.warn("ORDEM", f"Alternativas fora da ordem A,B,C,D no array ({letras}). Reordene.")
    if len([a for a in alts if a.get("correta") is True]) != 1:
        rep.err("CORRETA", "Deve haver exatamente 1 alternativa correta.")


def check_anteriores(q, rep):
    for a in q.get("alternativas", []):
        t = _norm(a.get("texto", ""))
        if any(re.search(p, t) for p in FRASES_ANTERIORES):
            rep.err("ANTERIORES",
                    f"Alternativa {a.get('letra')} usa 'nenhuma/todas das anteriores' — proibido.")


def _comando(enunciado):
    """Isola a frase de comando (lead-in) do resto do enunciado.

    Importa porque, no padrão ENAMED, a vinheta e o comando vivem no mesmo campo.
    Procurar termos proibidos no bloco inteiro produz falso positivo em massa:
    'exceto' é preposição corriqueira na descrição clínica ("exame físico sem
    particularidades, exceto por espessamento da artéria temporal") e só é defeito
    quando estrutura o comando ("...os seguintes efeitos, exceto:"). Numa auditoria
    de 914 itens reais, 7 dos 9 flagrantes de NEGATIVO eram desse tipo.
    """
    e = (enunciado or "").strip()
    partes = re.split(r"(?<=[.;?])\s+", e)
    return partes[-1] if partes else e


# "falso-positivo" e "falso-negativo" são vocabulário epidemiológico padrão,
# não construção negativa de item.
FALSO_LEGITIMO = re.compile(r"\bfals[oa]s?[\s-]+(positiv|negativ)", re.I)


def check_enunciado(q, rep):
    enun = q.get("enunciado", "") or ""
    cmd = _comando(enun)
    cmd_limpo = FALSO_LEGITIMO.sub(" ", cmd)
    for term in NEG_ENUNCIADO:
        if _has_term(cmd_limpo, term):
            rep.err("NEGATIVO", f"Construção negativa proibida no comando: '{term}'. "
                                "(0% dos itens do ENAMED 2025 usam EXCETO/incorreto.)")
    if any(re.search(p, _norm(cmd_limpo)) for p in NEG_FRASES):
        rep.err("NEGATIVO", "Comando usa negação do tipo 'não é correto/verdadeiro/adequado'.")
    for v in VERBOS_INSTRUCAO:
        if _has_term(cmd, v):
            rep.err("INSTRUCAO",
                    f"Verbo de instrução proibido no comando: '{v}'. Nota de proveniência: o "
                    "ENAMED usa 'assinale' em 6% dos itens; a Skill o proíbe por opção pedagógica "
                    "declarada (cover-the-options do NBME), não por conformidade com o ENAMED.")
    if re.search(r"\bNÃO\b|\bNAO\b", cmd):
        rep.warn("NAO_MAIUSCULO", "Comando tem 'NÃO' em maiúsculas — típico de item negativo.")
    # 'exceto' fora do comando é prosa clínica normal, mas vale um olhar se abre lista
    corpo = enun[: len(enun) - len(cmd)]
    if re.search(r",\s*exceto\s*:?\s*$", _norm(corpo)):
        rep.warn("EXCETO_NO_CORPO",
                 "O corpo do enunciado termina em 'exceto' — confirme que não é um item "
                 "negativo com a lista quebrada em outro parágrafo.")


def check_completamento(q, rep):
    """Regras próprias do item por completamento — o formato de 60% do ENAMED.

    Risco específico do português: se as alternativas não concordam entre si em
    gênero/número, a concordância com o fecho do enunciado entrega a resposta.
    É a falha 'grammatical cue' do NBME, inexistente em enunciado interrogativo.
    """
    enun = (q.get("enunciado") or "").rstrip()
    alts = q.get("alternativas", [])
    if not enun or len(alts) != 4 or enun.endswith("?"):
        return
    if enun.endswith(":"):
        rep.warn("ENUNCIADO_ABERTO",
                 "Enunciado termina em ':' — construção tipicamente não-fechada. Nenhum dos 90 "
                 "itens do ENAMED 2025 termina assim. Use pergunta direta ou completamento.")
        return
    textos = [a.get("texto", "") or "" for a in alts]
    maiusc = [a.get("letra") for a, t in zip(alts, textos) if t[:1].isupper()]
    if maiusc:
        rep.warn("COMPLETAMENTO_MAIUSCULA",
                 f"Item por completamento com alternativa(s) iniciando em maiúscula: {maiusc}. "
                 "No ENAMED a alternativa continua a frase do enunciado: minúscula e ponto final.")
    if not all(t.rstrip().endswith((".", ";")) for t in textos if t):
        rep.warn("COMPLETAMENTO_SEM_PONTO",
                 "Alternativas de item por completamento devem fechar a frase (ponto final).")
    primeiras = [(_norm(t).split() or [""])[0] for t in textos]
    artigos = {p for p in primeiras if p in {"o", "a", "os", "as", "um", "uma"}}
    if len(artigos) > 1:
        rep.warn("CONCORDANCIA",
                 f"Alternativas iniciam com artigos de gênero/número diferentes ({sorted(artigos)}). "
                 "Em item por completamento isso pode entregar a resposta por concordância com o "
                 "fecho do enunciado (grammatical cue, NBME).")


def check_termos_vagos(q, rep):
    campos = [("enunciado", q.get("enunciado", ""))]
    campos += [(f"alternativa {a.get('letra')}", a.get("texto", ""))
               for a in q.get("alternativas", [])]
    achados = {}
    for nome, txt in campos:
        for term in TERMOS_VAGOS:
            if _has_term(txt, term):
                achados.setdefault(term, []).append(nome)
    for term, onde in achados.items():
        rep.warn("TERMO_VAGO", f"Termo vago/absoluto '{term}' em: {', '.join(onde)}. "
                               "Reveja se é âncora indevida ou uso legítimo.")


def check_extensao(q, rep):
    alts = q.get("alternativas", [])
    corretas = [a for a in alts if a.get("correta") is True]
    if len(corretas) != 1 or len(alts) != 4:
        return
    correta = corretas[0]
    wcs = [_wordcount(a.get("texto", "")) for a in alts if a is not correta]
    wc_corr = _wordcount(correta.get("texto", ""))
    media = sum(wcs) / len(wcs) if wcs else 0
    if media == 0 or (media < 3 and wc_corr < 3):
        return
    razao = wc_corr / media
    if razao > 1.30 or razao < 0.70:
        rep.warn("EXTENSAO",
                 f"Extensão da correta destoa: {wc_corr} palavras vs média {media:.1f} dos "
                 f"distratores (razão {razao:.2f}; alvo 0.70–1.30). No ENAMED 2025 a razão mediana "
                 "é 1.00, mas 21% dos itens caem fora da faixa — por isso é aviso, não erro. "
                 "Se a correta está mais longa, mova a explicação causal para a justificativa.")


def _content_words(s):
    return [w for w in (_norm(x) for x in _words(s)) if len(w) >= 4 and w not in STOPWORDS]


def check_pista(q, rep):
    alts = q.get("alternativas", [])
    corretas = [a for a in alts if a.get("correta") is True]
    if len(corretas) != 1:
        return
    correta = corretas[0]
    cw = set(_content_words(correta.get("texto", "")))
    for a in alts:
        if a is not correta:
            cw -= set(_content_words(a.get("texto", "")))
    if not cw:
        return
    inter = cw & set(_content_words(q.get("enunciado", "")))
    if inter:
        rep.warn("PISTA_ENUNCIADO",
                 f"Palavra(s) de conteúdo exclusivas da correta também no enunciado: "
                 f"{sorted(inter)}. Pode entregar a resposta por reconhecimento.")
    tb = q.get("texto_base")
    if isinstance(tb, str) and tb.strip():
        inter_tb = cw & set(_content_words(tb))
        if inter_tb:
            rep.warn("PISTA_VINHETA",
                     f"Palavra(s) de conteúdo da correta também na vinheta: {sorted(inter_tb)}. "
                     "A vinheta descreve o caso; não sinaliza a resposta.")


def check_teto_nivel(q, rep):
    fase = q.get("fase_alvo")
    if not isinstance(fase, int) or fase > 4:
        return
    nb = _norm(" ".join([q.get("enunciado", "") or "", q.get("texto_base") or ""] +
                        [a.get("texto", "") for a in q.get("alternativas", [])]))
    achados = [t for t in TETO_NIVEL_TERMOS
               if (_norm(t) in nb if " " in _norm(t)
                   else re.search(r"\b\w*" + re.escape(_norm(t)) + r"\w*\b", nb))]
    if achados:
        rep.warn("TETO_NIVEL",
                 f"Fase {fase} (ciclo básico) com termo(s) de nível clínico/farmacológico: "
                 f"{sorted(set(achados))}. Confirme que não é desnivelamento.")


def load_taxonomia_index(path):
    with open(path, encoding="utf-8") as f:
        tax = json.load(f)
    return {uc["slug"]: fase.get("fase")
            for fase in tax.get("fases", [])
            for uc in fase.get("ucs", []) if uc.get("slug")}


def load_oa_index(path):
    with open(path, encoding="utf-8") as f:
        banco = json.load(f)
    sps, oas = set(), set()
    for fase in banco.get("fases", {}).values():
        for uc in fase.values():
            for sp in uc.get("sps", {}).values():
                if sp.get("slug"):
                    sps.add(sp["slug"])
                for oa in sp.get("objetivos_aprendizagem", []):
                    if oa.get("slug"):
                        oas.add(oa["slug"])
    return sps, oas, banco.get("fonte", "(sem rótulo)")


def check_taxonomia(q, rep, uc_to_fase):
    slug = q.get("uc_slug")
    if slug not in uc_to_fase:
        rep.err("UC_INEXISTENTE", f"uc_slug '{slug}' não existe na taxonomia. "
                                  "Texto livre em campo canônico é falha grave.")
        return
    if q.get("fase_alvo") != uc_to_fase[slug]:
        rep.err("FASE_INCOERENTE",
                f"fase_alvo={q.get('fase_alvo')} não bate com a fase da UC "
                f"na taxonomia (fase {uc_to_fase[slug]}).")


def check_ancoragem_oa(q, rep, sps, oas):
    sp = q.get("sp_referencia")
    if isinstance(sp, str) and sp.strip() and sp not in sps:
        rep.err("SP_INEXISTENTE",
                f"sp_referencia '{sp}' não existe no banco de OAs vigente — a SP pode ter sido "
                "reescrita ou removida na virada de semestre.")
    oa = q.get("oa_referencia")
    for o in (oa if isinstance(oa, list) else ([oa] if isinstance(oa, str) and oa.strip() else [])):
        if o not in oas:
            rep.err("OA_INEXISTENTE", f"oa_referencia '{o}' não existe no banco de OAs vigente.")


def check_lote(questoes):
    """Defeitos que só existem no conjunto. Devolve [(nivel, code, msg)]."""
    out = []
    n = len(questoes)
    if n < 2:
        return out

    pos = Counter(a.get("letra") for q in questoes
                  for a in q.get("alternativas", []) if a.get("correta") is True)
    if pos and n >= 4 and max(pos.values()) == n:
        letra = max(pos, key=pos.get)
        out.append(("aviso", "GABARITO_CONCENTRADO",
                    f"Todas as {n} questões têm a correta na letra {letra}. Se essa é a convenção "
                    "de banco, a aleatorização na emissão vira ponto único de falha: se ela não "
                    f"rodar, o lote inteiro sai com gabarito {letra}. No ENAMED 2025 a distribuição "
                    "é uniforme (A21/B24/C23/D22)."))

    compl = sum(1 for q in questoes
                if (q.get("enunciado") or "").rstrip()
                and not (q.get("enunciado") or "").rstrip().endswith(("?", ":")))
    if compl == 0:
        out.append(("aviso", "MONOCULTURA_FORMATO",
                    f"Nenhuma das {n} questões usa enunciado por completamento, que é o formato de "
                    "60% dos itens do ENAMED 2025 (54/90). Um lote 100% interrogativo treina o "
                    "aluno no formato minoritário da prova."))
    elif compl == n:
        out.append(("aviso", "MONOCULTURA_FORMATO",
                    f"Todas as {n} questões usam completamento. O ENAMED mistura (60/40)."))

    vistos = {}
    for i, q in enumerate(questoes, 1):
        chave = _norm(" ".join(_words(q.get("enunciado", ""))[:25]))
        if chave and chave in vistos:
            out.append(("aviso", "DUPLICIDADE",
                        f"Questões #{vistos[chave]} e #{i} abrem com o mesmo enunciado — "
                        "possível duplicata no lote."))
        vistos[chave] = i
    return out


def validate_one(q, idx, validator, uc_to_fase, oa_idx):
    rep = Report(idx, q.get("tema") or q.get("uc_slug") or f"questão {idx}"
                 if isinstance(q, dict) else f"questão {idx}")
    if not isinstance(q, dict):
        rep.err("TIPO", "Item não é um objeto JSON.")
        return rep
    check_schema(q, rep, validator)
    check_abdc(q, rep)
    check_anteriores(q, rep)
    check_enunciado(q, rep)
    check_completamento(q, rep)
    check_termos_vagos(q, rep)
    check_extensao(q, rep)
    check_pista(q, rep)
    check_teto_nivel(q, rep)
    if uc_to_fase is not None:
        check_taxonomia(q, rep, uc_to_fase)
    if oa_idx is not None:
        check_ancoragem_oa(q, rep, *oa_idx)
    return rep


def extract_questions(payload):
    if isinstance(payload, dict) and isinstance(payload.get("questoes"), list):
        return payload["questoes"]
    return payload if isinstance(payload, list) else [payload]


def load_payloads(paths):
    items = []
    if not paths or paths == ["-"]:
        return [("stdin", q) for q in extract_questions(json.loads(sys.stdin.read()))]
    for p in paths:
        payload = (json.loads(sys.stdin.read()) if p == "-"
                   else json.load(open(p, encoding="utf-8")))
        items += [(os.path.basename(p), q) for q in extract_questions(payload)]
    return items


def print_human(reports, lote, procedencia):
    RED, YEL, GRN, RST = "\033[31m", "\033[33m", "\033[32m", "\033[0m"
    tty = sys.stdout.isatty()

    def c(col, s):
        return f"{col}{s}{RST}" if tty else s

    print("Referências em uso:")
    for k, v in procedencia.items():
        print(f"  {k}: {v}")
    print()
    n_err = sum(1 for _, r in reports if r.errors)
    for origem, r in reports:
        head = f"[{origem}] #{r.idx} · {r.ident}"
        if r.ok and not r.warnings:
            print(c(GRN, f"✓ {head} — OK (sem erros, sem avisos)"))
        elif r.ok:
            print(c(YEL, f"⚠ {head} — sem erros, {len(r.warnings)} aviso(s)"))
        else:
            print(c(RED, f"✗ {head} — {len(r.errors)} ERRO(s), {len(r.warnings)} aviso(s)"))
        for code, msg in r.errors:
            print(c(RED, f"    ERRO  [{code}] ") + msg)
        for code, msg in r.warnings:
            print(c(YEL, f"    aviso [{code}] ") + msg)
    if lote:
        print("\n— Checagens de lote —")
        for nivel, code, msg in lote:
            print(c(RED if nivel == "ERRO" else YEL, f"    {nivel:5s} [{code}] ") + msg)
    print()
    print(c(GRN if n_err == 0 else RED,
            f"{len(reports)} questão(ões) · {n_err} com ERRO · {len(reports) - n_err} sem erro"))


def main():
    ap = argparse.ArgumentParser(
        description="Valida questões ENAMED MED-UNIDAVI contra schema, taxonomia, "
                    "banco de OAs e o perfil empírico do ENAMED.")
    ap.add_argument("arquivos", nargs="*", default=["-"])
    ap.add_argument("--schema")
    ap.add_argument("--taxonomia")
    ap.add_argument("--oas", help="banco de OAs (oas_med_unidavi_*.json)")
    ap.add_argument("--sem-referencias", action="store_true",
                    help="roda sem taxonomia/banco de OAs, assumindo o risco explicitamente "
                         "(o padrão é falhar, para não degradar em silêncio)")
    ap.add_argument("--json", action="store_true")
    args = ap.parse_args()

    procedencia, faltando = {}, []

    schema_path = _find_reference("schema_questao_med_unidavi.json", args.schema)
    if not schema_path:
        print("ERRO: schema_questao_med_unidavi.json não encontrado.", file=sys.stderr)
        return 2
    try:
        validator = load_schema_validator(schema_path)
    except Exception as e:
        print(f"ERRO ao carregar o schema: {e}", file=sys.stderr)
        return 2
    procedencia["schema"] = os.path.basename(schema_path)

    uc_to_fase = None
    tax_path = _find_reference("taxonomia_med_unidavi_*.json", args.taxonomia)
    if tax_path:
        try:
            uc_to_fase = load_taxonomia_index(tax_path)
            procedencia["taxonomia"] = f"{os.path.basename(tax_path)} ({len(uc_to_fase)} UCs)"
        except Exception as e:
            faltando.append(f"taxonomia ilegível ({e})")
    else:
        faltando.append("taxonomia_med_unidavi_*.json")

    oa_idx = None
    oa_path = _find_reference("oas_med_unidavi_*.json", args.oas)
    if oa_path:
        try:
            sps, oas, fonte = load_oa_index(oa_path)
            oa_idx = (sps, oas)
            procedencia["banco_de_oas"] = (f"{os.path.basename(oa_path)} "
                                           f"({len(sps)} SPs, {len(oas)} OAs) — {fonte}")
        except Exception as e:
            faltando.append(f"banco de OAs ilegível ({e})")
    else:
        faltando.append("oas_med_unidavi_*.json")

    if faltando:
        msg = ("Referência institucional ausente: " + ", ".join(faltando) +
               ".\nSem ela a checagem correspondente NÃO roda — e uma questão com UC ou OA "
               "inexistente passaria como válida.")
        if not args.sem_referencias:
            print("ERRO: " + msg + "\nUse --sem-referencias para rodar assim mesmo.",
                  file=sys.stderr)
            return 2
        print("AVISO: " + msg, file=sys.stderr)
        for f in faltando:
            procedencia["AUSENTE"] = f + " (checagem desligada)"

    try:
        items = load_payloads(args.arquivos)
    except FileNotFoundError as e:
        print(f"ERRO: arquivo não encontrado: {e}", file=sys.stderr)
        return 2
    except json.JSONDecodeError as e:
        print(f"ERRO: JSON inválido: {e}", file=sys.stderr)
        return 2

    reports = [(o, validate_one(q, i, validator, uc_to_fase, oa_idx))
               for i, (o, q) in enumerate(items, start=1)]
    lote = check_lote([q for _, q in items])

    if args.json:
        print(json.dumps({
            "referencias": procedencia,
            "questoes": [{"origem": o, "idx": r.idx, "ident": r.ident, "ok": r.ok,
                          "erros": [{"code": c, "msg": m} for c, m in r.errors],
                          "avisos": [{"code": c, "msg": m} for c, m in r.warnings]}
                         for o, r in reports],
            "lote": [{"nivel": n, "code": c, "msg": m} for n, c, m in lote],
        }, ensure_ascii=False, indent=2))
    else:
        print_human(reports, lote, procedencia)

    if any(r.errors for _, r in reports) or any(n == "ERRO" for n, _, _ in lote):
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
