#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
validate_questao.py — Validador executável de questões ENAMED MED-UNIDAVI
=========================================================================

Verifica uma questão (ou lote) contra:
  1. o JSON Schema institucional (Draft 2020-12) — schema_questao_med_unidavi.json
  2. os itens objetiváveis do checklist §7 da Skill capi-questoes-enamed
  3. (opcional) a existência real do uc_slug na taxonomia_med_unidavi_2026_1.json

Filosofia ERRO vs AVISO
-----------------------
Nem tudo que a Skill "proíbe" é detectável sem julgamento. O script separa:

  ERRO  — defeito objetivo, mecânico, sem ambiguidade. Bloqueia a emissão.
          (schema inválido; não são 4 alternativas; não há exatamente 1 correta;
           a correta não está na letra A; "nenhuma/todas das anteriores";
           construção negativa ou verbo de instrução no enunciado;
           uc_slug inexistente / fase incoerente quando a taxonomia é fornecida)

  AVISO — sinal forte que EXIGE olho humano, mas cujo veredito depende de
          contexto (um "nunca" pode ser fisiologicamente correto; uma correta
          um pouco mais longa pode ser legítima). Não bloqueia; sinaliza.
          (termos vagos/absolutos; extensão da correta fora de ±30%;
           pista da resposta no enunciado ou na vinheta; teto de nível da fase;
           enunciado sem "?"; ordem das alternativas)

Os itens do checklist que a Skill marca como [parcial-script] (teste recíproco,
ancoragem na fonte) NÃO são plenamente verificáveis por máquina — o script cobre
a fração objetivável (pista textual, teto de nível) e deixa o resto para o curador.

Códigos de saída
----------------
  0  nenhuma questão com ERRO (avisos podem existir)
  1  ao menos uma questão com ERRO
  2  erro de uso / arquivo / schema não encontrado

Uso
---
  python validate_questao.py questao.json
  python validate_questao.py q1.json q2.json q3.json
  cat questao.json | python validate_questao.py -
  python validate_questao.py --schema PATH --taxonomia PATH questao.json
  python validate_questao.py --json questao.json      # relatório em JSON

Aceita, em cada arquivo/stdin: um objeto-questão, um array de questões,
ou um objeto {"questoes": [...]}.
"""

import argparse
import json
import os
import re
import sys
import unicodedata

# ----------------------------------------------------------------------------
# Localização automática das referências (layout: skill/scripts/ e skill/references/)
# ----------------------------------------------------------------------------
_HERE = os.path.dirname(os.path.abspath(__file__))

def _find_reference(filename, override):
    """Procura um arquivo de referência em ordem: override -> ../references/ -> ./ -> cwd."""
    if override:
        return override
    candidates = [
        os.path.join(_HERE, "..", "references", filename),
        os.path.join(_HERE, "references", filename),
        os.path.join(_HERE, filename),
        os.path.join(os.getcwd(), filename),
    ]
    for c in candidates:
        if os.path.isfile(c):
            return c
    return None


# ----------------------------------------------------------------------------
# Utilidades de texto
# ----------------------------------------------------------------------------
def _strip_accents(s):
    return "".join(
        c for c in unicodedata.normalize("NFD", s) if unicodedata.category(c) != "Mn"
    )

def _norm(s):
    """minúsculo, sem acento — para casar termos independentemente de acentuação."""
    return _strip_accents(s or "").lower()

def _words(s):
    return re.findall(r"[a-zA-ZáàâãéêíóôõúüçÁÀÂÃÉÊÍÓÔÕÚÜÇ]+", s or "")

def _wordcount(s):
    return len(_words(s or ""))

def _has_term(text, term):
    """casa `term` como palavra inteira, sem acento, case-insensitive."""
    pat = r"\b" + re.escape(_norm(term)) + r"\b"
    return re.search(pat, _norm(text)) is not None


# ----------------------------------------------------------------------------
# Listas de termos (do §7 da Skill)
# ----------------------------------------------------------------------------
# Vagos / palavras-dica / absolutos -> AVISO (contexto pode legitimar)
TERMOS_VAGOS = [
    "pode", "poderia", "talvez", "possivelmente",
    "geralmente", "frequentemente", "raramente", "tipicamente",
    "as vezes", "eventualmente", "costuma", "costumam",
    "sempre", "nunca", "todos", "todas", "nenhum", "nenhuma",
    "somente", "apenas", "qualquer",
]

# Construções que quebram o item por design -> ERRO (no enunciado)
NEG_ENUNCIADO = ["exceto", "incorreto", "incorreta", "falso", "falsa"]
NEG_FRASES = [
    r"\bnao\s+e\s+correto\b", r"\bnao\s+e\s+correta\b",
    r"\bnao\s+e\s+verdadeir", r"\bnao\s+e\s+adequad",
    r"\bnao\s+corresponde\b",
]
VERBOS_INSTRUCAO = ["assinale", "indique", "aponte", "marque", "selecione"]

# "das anteriores/opções" em alternativa -> ERRO
FRASES_ANTERIORES = [
    r"nenhuma das anteriores", r"todas as anteriores",
    r"nenhuma das (op|alternativ)", r"todas as (op|alternativ)",
    r"nenhuma das acima", r"todas as acima",
]

# Teto de nível: termos que sinalizam ciclo clínico em questão de fase 1-4 -> AVISO
# (heurística modesta e deliberadamente conservadora)
TETO_NIVEL_TERMOS = [
    # sufixos/classes de fármaco
    "pril", "sartana", "sartano", "olol", "dipino", "statina",
    "metformina", "insulina glargina", "levotiroxina", "omeprazol",
    "corticoide", "corticosteroide", "antibiotico", "antibioticoterapia",
    # conduta / manejo
    "conduta", "manejo", "tratamento de primeira linha", "primeira linha",
    "prescrever", "prescricao", "dose de ataque", "posologia",
    "encaminhar para", "internacao", "alta hospitalar",
    # decisão diagnóstica clínica
    "diagnostico diferencial", "hipotese diagnostica principal",
    "cutoff", "ponto de corte diagnostico",
]

# stopwords PT para o teste de "pista" (overlap de palavra de conteúdo)
STOPWORDS = set(_norm(w) for w in [
    "a","o","as","os","um","uma","uns","umas","de","do","da","dos","das",
    "em","no","na","nos","nas","por","para","com","sem","sob","sobre","ao",
    "aos","e","ou","que","qual","quais","se","um","the","de","del",
    "este","esta","esse","essa","aquele","aquela","seu","sua","seus","suas",
    "seguinte","seguintes","paciente","anos","apresenta","refere","comparece",
    "quadro","caso","alternativa","enunciado","mais","menos","entre","como",
    "pela","pelo","pelas","pelos","seu","sua","apos","antes","durante","ainda",
    "ser","estar","tem","ter","foi","era","sao","e","nao","sim","numa","num",
])


# ----------------------------------------------------------------------------
# Coletor de achados por questão
# ----------------------------------------------------------------------------
class Report:
    def __init__(self, idx, ident):
        self.idx = idx
        self.ident = ident
        self.errors = []
        self.warnings = []

    def err(self, code, msg):
        self.errors.append((code, msg))

    def warn(self, code, msg):
        self.warnings.append((code, msg))

    @property
    def ok(self):
        return not self.errors


# ----------------------------------------------------------------------------
# Validação de schema
# ----------------------------------------------------------------------------
def load_schema_validator(schema_path):
    import jsonschema
    from jsonschema import Draft202012Validator
    from jsonschema import FormatChecker
    with open(schema_path, "r", encoding="utf-8") as f:
        schema = json.load(f)
    # FormatChecker valida date/date-time se os validadores estiverem instalados;
    # é best-effort e não quebra se faltar biblioteca de formato.
    return Draft202012Validator(schema, format_checker=FormatChecker())


def check_schema(q, rep, validator):
    errs = sorted(validator.iter_errors(q), key=lambda e: list(e.path))
    for e in errs:
        loc = "/".join(str(p) for p in e.path) or "(raiz)"
        rep.err("SCHEMA", f"[{loc}] {e.message}")


# ----------------------------------------------------------------------------
# Validações ENAMED (checklist §7 objetivável)
# ----------------------------------------------------------------------------
def check_abdc(q, rep):
    alts = q.get("alternativas")
    if not isinstance(alts, list) or len(alts) != 4:
        rep.err("ABDC", "A questão deve ter exatamente 4 alternativas.")
        return
    letras = [a.get("letra") for a in alts]
    if set(letras) != {"A", "B", "C", "D"}:
        rep.err("ABDC", f"As letras devem ser exatamente A, B, C, D (encontrado: {letras}).")
    if letras != ["A", "B", "C", "D"]:
        rep.warn("ORDEM", f"Alternativas fora da ordem A,B,C,D no array (encontrado: {letras}). "
                          "A curadoria lê de cima para baixo; reordene.")
    corretas = [a for a in alts if a.get("correta") is True]
    if len(corretas) != 1:
        rep.err("CORRETA", f"Deve haver exatamente 1 alternativa correta (encontrado: {len(corretas)}).")
        return
    letra_correta = corretas[0].get("letra")
    if letra_correta != "A":
        rep.err("CORRETA_A",
                f"A alternativa correta deve estar registrada na letra A (está em {letra_correta}). "
                "Convenção de banco — a emissão embaralha a posição na prova.")


def check_anteriores(q, rep):
    for a in q.get("alternativas", []):
        t = _norm(a.get("texto", ""))
        for pat in FRASES_ANTERIORES:
            if re.search(pat, t):
                rep.err("ANTERIORES",
                        f"Alternativa {a.get('letra')} usa 'nenhuma/todas das anteriores/opções' — proibido (§7).")
                break


def check_enunciado(q, rep):
    enun = q.get("enunciado", "") or ""
    n = _norm(enun)
    for term in NEG_ENUNCIADO:
        if _has_term(enun, term):
            rep.err("NEGATIVO", f"Enunciado contém construção negativa proibida: '{term}' (§7).")
    for pat in NEG_FRASES:
        if re.search(pat, n):
            rep.err("NEGATIVO", "Enunciado usa negação do tipo 'não é correto/verdadeiro/adequado' (§7).")
            break
    for v in VERBOS_INSTRUCAO:
        if _has_term(enun, v):
            rep.err("INSTRUCAO", f"Enunciado usa verbo de instrução proibido: '{v}' (§7).")
    # AVISOS
    if re.search(r"\bNÃO\b|\bNAO\b", enun):
        rep.warn("NAO_MAIUSCULO", "Enunciado tem 'NÃO' em maiúsculas — típico de item negativo. Confirme que não é negação disfarçada.")
    if not enun.rstrip().endswith("?"):
        rep.warn("SEM_INTERROGACAO",
                 "Enunciado não termina em '?'. O padrão é frase interrogativa direta e fechada "
                 "(enunciados terminando em ':' costumam ser não-fechados).")


def check_termos_vagos(q, rep):
    campos = [("enunciado", q.get("enunciado", ""))]
    for a in q.get("alternativas", []):
        campos.append((f"alternativa {a.get('letra')}", a.get("texto", "")))
    achados = {}
    for nome, txt in campos:
        for term in TERMOS_VAGOS:
            if _has_term(txt, term):
                achados.setdefault(term, []).append(nome)
    for term, onde in achados.items():
        rep.warn("TERMO_VAGO",
                 f"Termo vago/absoluto '{term}' em: {', '.join(onde)}. "
                 "Reveja se é âncora indevida (palavra-dica) ou uso legítimo.")


def check_extensao(q, rep):
    alts = q.get("alternativas", [])
    corretas = [a for a in alts if a.get("correta") is True]
    if len(corretas) != 1 or len(alts) != 4:
        return  # já reportado em ABDC
    correta = corretas[0]
    distratores = [a for a in alts if a is not correta]
    wc_corr = _wordcount(correta.get("texto", ""))
    wcs = [_wordcount(a.get("texto", "")) for a in distratores]
    media = sum(wcs) / len(wcs) if wcs else 0
    if media == 0:
        return
    # Piso: em alternativas curtas (termos únicos / nomes de estrutura, fármaco,
    # diagnóstico), a pista de extensão não se aplica — ±30% sobre 1-2 palavras é ruído.
    if media < 3 and wc_corr < 3:
        return
    razao = wc_corr / media
    if razao > 1.30 or razao < 0.70:
        rep.warn("EXTENSAO",
                 f"Extensão da correta destoa: {wc_corr} palavras vs média {media:.1f} dos distratores "
                 f"(razão {razao:.2f}; alvo 0.70–1.30). "
                 "Se a correta está mais longa, mova a explicação causal para a justificativa (§7).")


def _content_words(s):
    return [w for w in (_norm(x) for x in _words(s)) if len(w) >= 4 and w not in STOPWORDS]


def check_pista(q, rep):
    alts = q.get("alternativas", [])
    corretas = [a for a in alts if a.get("correta") is True]
    if len(corretas) != 1:
        return
    correta = corretas[0]
    correta_txt = correta.get("texto", "")
    cw_correta = set(_content_words(correta_txt))
    # Palavras que também aparecem nos distratores são categoria compartilhada,
    # não pista discriminante — removê-las evita falso positivo.
    cw_distratores = set()
    for a in alts:
        if a is not correta:
            cw_distratores |= set(_content_words(a.get("texto", "")))
    cw_correta = cw_correta - cw_distratores
    if not cw_correta:
        return
    # pista no enunciado
    cw_enun = set(_content_words(q.get("enunciado", "")))
    inter_enun = cw_correta & cw_enun
    if inter_enun:
        rep.warn("PISTA_ENUNCIADO",
                 f"Palavra(s) de conteúdo da correta também no enunciado: {sorted(inter_enun)}. "
                 "Pode entregar a resposta por reconhecimento (test-wiseness).")
    # pista na vinheta
    tb = q.get("texto_base")
    if isinstance(tb, str) and tb.strip():
        cw_tb = set(_content_words(tb))
        inter_tb = cw_correta & cw_tb
        if inter_tb:
            rep.warn("PISTA_VINHETA",
                     f"Palavra(s) de conteúdo da correta também na vinheta: {sorted(inter_tb)}. "
                     "A vinheta não pode sinalizar a resposta (§5).")


def check_teto_nivel(q, rep):
    fase = q.get("fase_alvo")
    if not isinstance(fase, int) or fase > 4:
        return
    blob = " ".join([
        q.get("enunciado", "") or "",
        q.get("texto_base") or "",
        " ".join(a.get("texto", "") for a in q.get("alternativas", [])),
    ])
    nb = _norm(blob)
    achados = []
    for term in TETO_NIVEL_TERMOS:
        tn = _norm(term)
        # sufixos de fármaco casam por substring de palavra; frases casam direto
        if " " in tn:
            if tn in nb:
                achados.append(term)
        else:
            if re.search(r"\b\w*" + re.escape(tn) + r"\w*\b", nb):
                achados.append(term)
    if achados:
        rep.warn("TETO_NIVEL",
                 f"Fase {fase} (ciclo básico) com termo(s) de nível clínico/farmacológico: "
                 f"{sorted(set(achados))}. Confirme que não é desnivelamento (§3/§0.2) — "
                 "ciclo básico não ancora em fármaco específico, conduta ou cutoff de decisão.")


# ----------------------------------------------------------------------------
# Validação contra a taxonomia (opcional, mas forte)
# ----------------------------------------------------------------------------
def load_taxonomia_index(tax_path):
    with open(tax_path, "r", encoding="utf-8") as f:
        tax = json.load(f)
    uc_to_fase = {}
    for fase in tax.get("fases", []):
        fnum = fase.get("fase")
        for uc in fase.get("ucs", []):
            slug = uc.get("slug")
            if slug:
                uc_to_fase[slug] = fnum
    return uc_to_fase


def check_taxonomia(q, rep, uc_to_fase):
    slug = q.get("uc_slug")
    if slug not in uc_to_fase:
        rep.err("UC_INEXISTENTE",
                f"uc_slug '{slug}' não existe na taxonomia. "
                "Texto livre em campo canônico é falha grave (§15).")
        return
    fase_uc = uc_to_fase[slug]
    fase_alvo = q.get("fase_alvo")
    if fase_alvo != fase_uc:
        rep.err("FASE_INCOERENTE",
                f"fase_alvo={fase_alvo} não bate com a fase da UC na taxonomia (fase {fase_uc}).")


# ----------------------------------------------------------------------------
# Orquestração
# ----------------------------------------------------------------------------
def validate_one(q, idx, validator, uc_to_fase):
    ident = q.get("tema") or q.get("uc_slug") or f"questão {idx}"
    rep = Report(idx, ident)
    if not isinstance(q, dict):
        rep.err("TIPO", "Item não é um objeto JSON.")
        return rep
    check_schema(q, rep, validator)
    check_abdc(q, rep)
    check_anteriores(q, rep)
    check_enunciado(q, rep)
    check_termos_vagos(q, rep)
    check_extensao(q, rep)
    check_pista(q, rep)
    check_teto_nivel(q, rep)
    if uc_to_fase is not None:
        check_taxonomia(q, rep, uc_to_fase)
    return rep


def extract_questions(payload):
    """Normaliza entrada: objeto único, lista, ou {'questoes':[...]}."""
    if isinstance(payload, dict) and "questoes" in payload and isinstance(payload["questoes"], list):
        return payload["questoes"]
    if isinstance(payload, list):
        return payload
    return [payload]


def load_payloads(paths):
    """Carrega de arquivos ou stdin ('-'). Retorna lista de (origem, questão)."""
    items = []
    if not paths or paths == ["-"]:
        raw = sys.stdin.read()
        payload = json.loads(raw)
        for i, q in enumerate(extract_questions(payload)):
            items.append(("stdin", q))
        return items
    for p in paths:
        if p == "-":
            payload = json.loads(sys.stdin.read())
        else:
            with open(p, "r", encoding="utf-8") as f:
                payload = json.load(f)
        for q in extract_questions(payload):
            items.append((os.path.basename(p), q))
    return items


def print_human(reports):
    RED, YEL, GRN, DIM, RST = "\033[31m", "\033[33m", "\033[32m", "\033[2m", "\033[0m"
    use_color = sys.stdout.isatty()
    def c(color, s):
        return f"{color}{s}{RST}" if use_color else s

    n_err = sum(1 for _, r in reports if r.errors)
    total = len(reports)
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
    print()
    resumo = f"{total} questão(ões) · {n_err} com ERRO · {total - n_err} sem erro"
    print(c(GRN if n_err == 0 else RED, resumo))


def build_json_output(reports):
    out = []
    for origem, r in reports:
        out.append({
            "origem": origem, "idx": r.idx, "ident": r.ident,
            "ok": r.ok,
            "erros": [{"code": c, "msg": m} for c, m in r.errors],
            "avisos": [{"code": c, "msg": m} for c, m in r.warnings],
        })
    return out


def main():
    ap = argparse.ArgumentParser(
        description="Valida questões ENAMED MED-UNIDAVI contra o schema e o checklist §7.")
    ap.add_argument("arquivos", nargs="*", default=["-"],
                    help="arquivo(s) .json de questão, ou '-' para stdin")
    ap.add_argument("--schema", help="caminho do schema_questao_med_unidavi.json")
    ap.add_argument("--taxonomia", help="caminho do taxonomia_med_unidavi_2026_1.json "
                                        "(ativa checagem de existência do uc_slug)")
    ap.add_argument("--json", action="store_true", help="saída em JSON")
    args = ap.parse_args()

    schema_path = _find_reference("schema_questao_med_unidavi.json", args.schema)
    if not schema_path:
        print("ERRO: schema_questao_med_unidavi.json não encontrado. "
              "Passe --schema PATH ou coloque-o em ../references/.", file=sys.stderr)
        return 2
    try:
        validator = load_schema_validator(schema_path)
    except Exception as e:
        print(f"ERRO ao carregar o schema: {e}", file=sys.stderr)
        return 2

    uc_to_fase = None
    tax_path = _find_reference("taxonomia_med_unidavi_2026_1.json", args.taxonomia)
    if tax_path:
        try:
            uc_to_fase = load_taxonomia_index(tax_path)
        except Exception as e:
            print(f"aviso: não foi possível carregar a taxonomia ({e}); "
                  "checagem de uc_slug desativada.", file=sys.stderr)

    try:
        items = load_payloads(args.arquivos)
    except FileNotFoundError as e:
        print(f"ERRO: arquivo não encontrado: {e}", file=sys.stderr)
        return 2
    except json.JSONDecodeError as e:
        print(f"ERRO: JSON inválido: {e}", file=sys.stderr)
        return 2

    reports = []
    for i, (origem, q) in enumerate(items, start=1):
        reports.append((origem, validate_one(q, i, validator, uc_to_fase)))

    if args.json:
        print(json.dumps(build_json_output(reports), ensure_ascii=False, indent=2))
    else:
        print_human(reports)

    return 1 if any(r.errors for _, r in reports) else 0


if __name__ == "__main__":
    sys.exit(main())
