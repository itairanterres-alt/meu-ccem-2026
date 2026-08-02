#!/usr/bin/env python3
"""Converte adequacao-enamed/canonico/banco-completo.json (schema MED-UNIDAVI,
ancorado em uc_slug/fase_alvo/competencia_dcn_2025) para o formato de
`questions` + `question_versions` do treino-enamed (schema.ts: blueprintSchema
+ generatedQuestionSchema), sem rodar nenhum pipeline de IA de novo.

Todo campo que não tem correspondência determinística no banco de origem é
inferido por heurística e MARCADO em provenance.mapeamento.baixa_confianca —
nada é adivinhado silenciosamente. As questões entram como status='auto_verified':
o treino-enamed foi desenhado para expor esse status ao estudante por padrão
(ver supabase/migrations/20260722000000_auto_verified_training.sql e o toggle
"Somente revisão humana" em src/App.tsx), com o disclaimer explícito de que não
houve revisão docente — não ficam escondidas atrás de aprovação humana.
"""
import json
import re
import unicodedata
from pathlib import Path

REPO = Path(__file__).resolve().parents[2]
BANCO = REPO / "adequacao-enamed" / "canonico" / "banco-completo.json"
OUT_DIR = REPO / "adequacao-enamed" / "canonico"
OUT_IMPORT = OUT_DIR / "treino-enamed-import.json"
OUT_REPORT = OUT_DIR / "treino-enamed-import.report.json"

# ---------------------------------------------------------------------------
# Eixos da Portaria 478/2025 — mapeamento posicional, verificado contra o
# texto oficial nos dois lados (meu referencia/matriz_enamed_478_2025.json e
# o server/src/matriz-478.ts deles): mesma ordem de artigo, IDs diferentes.
# ---------------------------------------------------------------------------
AREA_MAP = {
    "enamed_area_01": "clinica_medica",
    "enamed_area_02": "cirurgia_geral",
    "enamed_area_03": "ginecologia_obstetricia",
    "enamed_area_04": "pediatria",
    "enamed_area_05": "medicina_familia_comunidade",
    "enamed_area_06": "saude_mental",
    "enamed_area_07": "saude_coletiva",
}
REDE_MAP = {
    "enamed_cenario_01": "atencao_primaria",
    "enamed_cenario_02": "urgencia_emergencia",
    "enamed_cenario_03": "materno_infantil",
    "enamed_cenario_04": "psicossocial",
    "enamed_cenario_05": "doencas_cronicas",
    "enamed_cenario_06": "reabilitacao",
}


def comp_id(enamed_id):
    return "comp_" + enamed_id.split("_")[-1]


def dom_id(enamed_id):
    return "dom_" + enamed_id.split("_")[-1]


# Extraído de server/src/blueprint-axes.ts do treino-enamed; mantido como
# literal aqui para não depender de parse de TypeScript em runtime.
SUBAREAS = {
    "clinica_medica": ["cardiovascular", "respiratorio", "digestorio", "renal_eletrolitos",
                        "endocrino_metabolico", "infectologia", "hematologia", "reumatologia",
                        "neurologia", "dermatologia", "oncologia", "geriatria",
                        "emergencias_clinicas", "intoxicacoes"],
    "cirurgia_geral": ["abdome_agudo", "trauma_cirurgico", "vascular", "urologia",
                        "coloproctologia", "cabeca_pescoco", "torax", "ortopedia",
                        "perioperatorio"],
    "ginecologia_obstetricia": ["pre_natal", "intercorrencias_obstetricas", "parto_puerperio",
                                 "ginecologia_geral", "oncologia_ginecologica",
                                 "planejamento_reprodutivo", "climaterio"],
    "pediatria": ["neonatologia", "crescimento_desenvolvimento", "infeccoes_na_infancia",
                  "respiratorio_pediatrico", "imunizacao", "urgencias_pediatricas",
                  "adolescencia", "nefrologia_pediatrica", "reumatologia_pediatrica",
                  "endocrinologia_pediatrica", "cardiologia_pediatrica", "neurologia_pediatrica",
                  "gastroenterologia_pediatrica"],
    "medicina_familia_comunidade": ["promocao_prevencao", "condicoes_cronicas",
                                     "abordagem_familiar_e_comunitaria", "saude_do_trabalhador",
                                     "cuidados_paliativos", "urgencias_na_aps"],
    "saude_mental": ["transtornos_do_humor", "transtornos_de_ansiedade", "psicoses",
                      "uso_de_substancias", "urgencia_psiquiatrica",
                      "transtornos_de_personalidade"],
    "saude_coletiva": ["epidemiologia", "bioestatistica", "vigilancia_em_saude",
                        "politicas_e_gestao_do_sus", "saude_ambiental", "etica_e_bioetica"],
}
EXACT_SUBAREA_OWNER = {s: a for a, subs in SUBAREAS.items() for s in subs}

# especialidade -> subarea nativa quando o nome já bate (ou quase bate).
# Cobre os 127 pares (area_portaria, especialidade) observados no banco.
ESPECIALIDADE_TO_SUBAREA = {
    # clínica médica
    "cardiologia": "cardiovascular", "emergencias_cardiovasculares": "cardiovascular",
    "pneumologia": "respiratorio", "emergencias_respiratorias": "respiratorio",
    "gastroenterologia": "digestorio", "hepatologia": "digestorio",
    "nefrologia": "renal_eletrolitos",
    "endocrinologia": "endocrino_metabolico", "emergencias_metabolicas": "endocrino_metabolico",
    "infectologia": "infectologia",
    "hematologia": "hematologia",
    "reumatologia": "reumatologia",
    "neurologia": "neurologia", "emergencias_neurologicas": "neurologia",
    "dermatologia": "dermatologia",
    "oncologia": "oncologia",
    "geriatria": "geriatria",
    "choque_e_sepse": "emergencias_clinicas", "medicina_intensiva": "emergencias_clinicas",
    "parada_cardiorrespiratoria": "emergencias_clinicas", "clinica_geral": "emergencias_clinicas",
    "intoxicacoes_e_acidentes_por_animais": "intoxicacoes", "toxicologia": "intoxicacoes",
    # cirurgia geral
    "abdome_agudo": "abdome_agudo",
    "trauma": "trauma_cirurgico", "queimados": "trauma_cirurgico",
    "atendimento_pre_hospitalar": "trauma_cirurgico",
    "cirurgia_vascular": "vascular",
    "urologia": "urologia",
    "coloproctologia": "coloproctologia",
    "otorrinolaringologia": "cabeca_pescoco",
    "cirurgia_toracica": "torax",
    "ortopedia": "ortopedia",
    "anestesiologia": "perioperatorio",
    "cirurgia_geral": "abdome_agudo",  # genérico, ver sistema_organico abaixo
    "cirurgia_pediatrica": "abdome_agudo",
    # ginecologia/obstetrícia
    "climaterio": "climaterio",
    "endocrinologia_ginecologica": "ginecologia_geral",
    "infeccoes_genitais_e_ist": "ginecologia_geral",
    "intercorrencias_obstetricas": "intercorrencias_obstetricas",
    "mastologia": "ginecologia_geral",
    "oncoginecologia": "oncologia_ginecologica",
    "parto_e_puerperio": "parto_puerperio",
    "planejamento_familiar": "planejamento_reprodutivo",
    "pre_natal": "pre_natal",
    "sangramento_uterino_anormal": "ginecologia_geral",
    "uroginecologia": "ginecologia_geral",
    "embriologia": "pre_natal", "genetica": "pre_natal",
    # pediatria
    "adolescencia": "adolescencia",
    "aleitamento_e_nutricao": "crescimento_desenvolvimento",
    "puericultura_e_crescimento": "crescimento_desenvolvimento",
    "violencia_e_maus_tratos": "crescimento_desenvolvimento",
    "cardiologia_pediatrica": "cardiologia_pediatrica",
    "endocrinologia_pediatrica": "endocrinologia_pediatrica",
    "gastroenterologia_pediatrica": "gastroenterologia_pediatrica",
    "imunizacao": "imunizacao",
    "infectologia_pediatrica": "infeccoes_na_infancia",
    "microbiologia_e_parasitologia": "infeccoes_na_infancia",  # só quando area final=pediatria
    "nefrologia_pediatrica": "nefrologia_pediatrica",
    "neonatologia": "neonatologia",
    "neurologia_pediatrica": "neurologia_pediatrica",
    "pneumologia_pediatrica": "respiratorio_pediatrico",
    "reumatologia_pediatrica": "reumatologia_pediatrica",
    "urgencia_pediatrica": "urgencias_pediatricas",
    "dermatologia_pediatrica": "infeccoes_na_infancia",
    # medicina de família e comunidade
    "abordagem_familiar_e_comunitaria": "abordagem_familiar_e_comunitaria",
    "comunicacao_clinica": "abordagem_familiar_e_comunitaria",
    "aps_organizacao_e_acesso": "abordagem_familiar_e_comunitaria",
    "cuidado_longitudinal_e_coordenacao": "condicoes_cronicas",
    "saude_do_idoso": "condicoes_cronicas",
    "seguranca_do_paciente": "condicoes_cronicas",
    "cuidados_paliativos": "cuidados_paliativos",
    "promocao_e_prevencao": "promocao_prevencao",
    "saude_do_trabalhador": "saude_do_trabalhador",
    # saúde mental
    "transtornos_do_humor": "transtornos_do_humor",
    "transtornos_ansiosos": "transtornos_de_ansiedade",
    "dependencia_quimica": "uso_de_substancias",
    "urgencia_psiquiatrica": "urgencia_psiquiatrica",
    "transtornos_alimentares": "transtornos_de_personalidade",
    "psicofarmacologia": "transtornos_do_humor",
    "raps_e_politica_de_saude_mental": "urgencia_psiquiatrica",
    "saude_mental_na_aps": "transtornos_do_humor",
    "transtornos_do_neurodesenvolvimento": "transtornos_de_personalidade",
    # saúde coletiva
    "epidemiologia": "epidemiologia",
    "bioestatistica": "bioestatistica",
    "vigilancia_em_saude": "vigilancia_em_saude",
    "politicas_publicas_e_sus": "politicas_e_gestao_do_sus",
    "gestao_em_saude": "politicas_e_gestao_do_sus",
    "saude_ambiental": "saude_ambiental",
    "etica_e_bioetica": "etica_e_bioetica",
    "metodologia_cientifica": "bioestatistica",
}

# Itens onde o essencial da questão é o próprio eixo (ética, epidemiologia,
# vigilância, políticas de saúde, bioestatística, saúde ambiental) pesam mais
# que a área clínica em que a Portaria 478 posicionou a questão: o vocabulário
# de especialidade já É literalmente um nome de subárea de saude_coletiva ou
# de medicina_familia_comunidade noutro caso, então a área muda para onde a
# subárea de fato mora, em vez de forçar um encaixe fraco na área original.
FORCE_AREA_BY_ESPECIALIDADE = {
    "etica_e_bioetica": "saude_coletiva", "bioestatistica": "saude_coletiva",
    "vigilancia_em_saude": "saude_coletiva", "politicas_publicas_e_sus": "saude_coletiva",
    "saude_ambiental": "saude_coletiva", "epidemiologia": "saude_coletiva",
    "gestao_em_saude": "saude_coletiva",
    "saude_do_trabalhador": "medicina_familia_comunidade",
    "cuidados_paliativos": "medicina_familia_comunidade",
}

# especialidades "de ciência básica" — sem organ system implícito no próprio
# nome; usa sistema_organico como sinal secundário quando disponível.
BASIC_SCIENCE = {"anatomia", "bioquimica", "biologia_celular_e_molecular", "farmacologia",
                 "fisiologia", "imunologia", "patologia"}

SISTEMA_ORGANICO_NORM = {
    "respiratorio": "respiratorio", "sistema respiratório": "respiratorio", "sistema_respiratorio": "respiratorio",
    "digestorio": "digestorio", "sistema digestório": "digestorio",
    "cardiovascular": "cardiovascular", "sistema cardiovascular materno-placentário": "cardiovascular",
    "endocrino_metabolico": "endocrino_metabolico", "endocrino": "endocrino_metabolico",
    "sistema_endocrino": "endocrino_metabolico", "sistema endócrino": "endocrino_metabolico",
    "nervoso": "neurologia",
    "tegumentar": "dermatologia", "sistema_tegumentar_e_mamario": "dermatologia", "mama": "dermatologia",
    "psiquico": None,  # área diferente, tratado à parte
    "hematopoetico": "hematologia", "hematopoietico": "hematologia",
    "imune": "reumatologia", "sistema imunológico": "reumatologia", "imunologico": "reumatologia",
    "osteomuscular": "reumatologia", "musculoesqueletico": "reumatologia",
    "geniturinario": "renal_eletrolitos", "sistema_genitourinario": "renal_eletrolitos",
    "urinario": "renal_eletrolitos", "renal_urinario": "renal_eletrolitos",
    "genito_urinario": "renal_eletrolitos", "renal_e_hidroeletrolitico": "renal_eletrolitos",
    "genitourinario": "renal_eletrolitos",
    "reprodutor": "ginecologia_geral", "reprodutor_feminino": "ginecologia_geral",
    "sistema reprodutor feminino": "ginecologia_geral",
    "otorrinolaringologico": "cabeca_pescoco",
    "sistema vascular e renal": "cardiovascular",
    "sistema visual": None,
}
# subárea de fallback por área quando nenhum sinal secundário resolve.
FALLBACK_SUBAREA = {
    "clinica_medica": "emergencias_clinicas",
    "cirurgia_geral": "perioperatorio",
    "ginecologia_obstetricia": "ginecologia_geral",
    "pediatria": "crescimento_desenvolvimento",
    "medicina_familia_comunidade": "abordagem_familiar_e_comunitaria",
    "saude_mental": "transtornos_do_humor",
    "saude_coletiva": "politicas_e_gestao_do_sus",
}

CONTEXTO_CARE_SETTING = {
    "atencao_primaria": "aps",
    "ambulatorial_especializado": "ambulatorio",
    "urgencia_emergencia": "emergencia",
    "internacao_hospitalar": "enfermaria",
    "domiciliar": "aps",
    "terapia_intensiva": "enfermaria",
}
DIFICULDADE_MAP = {"facil": "baixa", "medio": "intermediaria", "dificil": "alta"}

FONTE_META = {
    "adequacao-enamed (ENAMED 2025 Caderno 01) — extração + adequação assistida":
        {"issuer": "INEP/MEC", "title": "ENAMED 2025 — Caderno 01", "year": 2025, "kind": "official_enamed"},
    "adequacao-enamed (Revalida INEP 2023.2 e 2024.1) — extração + adequação assistida":
        {"issuer": "INEP/MEC", "title": "Revalida — Prova Objetiva", "year": 2024, "kind": "official_revalida"},
    "adequacao-enamed (Simulados MED/ENAMED 2026) — extração + adequação assistida":
        {"issuer": "MED-UNIDAVI", "title": "Simulados MED/ENAMED 2026", "year": 2026, "kind": "institutional_reference"},
    "adequacao-enamed (TPMed 2025 comentado) — extração + adequação assistida":
        {"issuer": "TPMed", "title": "Teste de Progresso Médico 2025", "year": 2025, "kind": "public_progress_test"},
    "adequacao-enamed (Teste de Progresso MED 2022 comentado) — extração + adequação assistida":
        {"issuer": "TPMed", "title": "Teste de Progresso Médico 2022", "year": 2022, "kind": "public_progress_test"},
    "adequacao-enamed (bancos institucionais .docx) — extração + adequação assistida":
        {"issuer": "MED-UNIDAVI / NAPISUL", "title": "Bancos institucionais de questões", "year": 2026, "kind": "institutional_reference"},
    "adequacao-enamed — item adaptado (reescrito) a partir de simulado de terceiro":
        {"issuer": "MED-UNIDAVI", "title": "Item autoral, reescrito a partir de objeto de conhecimento de simulado de terceiro (texto não reproduzido)", "year": 2026, "kind": "institutional_reference"},
}


def strip_accents(s):
    return "".join(c for c in unicodedata.normalize("NFD", s or "") if unicodedata.category(c) != "Mn")


def norm(s):
    return strip_accents((s or "").strip().lower())


VIGNETTE_RE = re.compile(
    r"\b(\d{1,3}\s*anos|rec[eé]m[- ]nascid|neonat|lactente|"
    r"gestante|pu[eé]rpera|grávida|"
    r"trazid[oa]\s+a[oó]|é\s+levad[oa]|procura\s+a|admitid[oa]\s+n[oa]|"
    r"paciente\s+d[oe]|homem\s+de|mulher\s+de|crian[çc]a\s+de)\b",
    re.IGNORECASE,
)
GESTANTE_RE = re.compile(r"gestante|pu[eé]rpera|gr[aá]vida|semanas? de gesta", re.IGNORECASE)
RN_RE = re.compile(r"rec[eé]m[- ]nascid|neonat", re.IGNORECASE)
IDOSO_RE = re.compile(r"idos[oa]", re.IGNORECASE)
ADOLESC_RE = re.compile(r"adolescente", re.IGNORECASE)
CRIANCA_RE = re.compile(r"crian[çc]a|lactente|escolar de \d|pr[eé]-escolar", re.IGNORECASE)

PREVENCAO_KW = ["prevenc", "rastre", "vacin", "imuniza", "promoc", "triagem"]
ENCAMINHAMENTO_KW = ["encaminh", "referenci", "contrarreferenc"]
INVESTIGACAO_KW = ["exame complementar", "investigac", "propedeutic", "solicitar exame",
                   "solicitacao de exame", "interpretacao de exame", "melhor exame"]
CONDUTA_KW = ["conduta", "tratamento", "terapeutic", "manejo", "prescric", "tratar"]
DIAGNOSTICO_KW = ["diagnostic", "hipotese diagnostica"]


def infer_item_format(stem):
    return "vinheta_clinica" if VIGNETTE_RE.search(stem) else "enunciado_direto"


def infer_ciclo_vida(stem, area, especialidade):
    if not VIGNETTE_RE.search(stem):
        return "nao_se_aplica", False
    if GESTANTE_RE.search(stem):
        return "gestante_puerpera", True
    if RN_RE.search(stem) or especialidade == "neonatologia":
        return "recem_nascido", True
    if IDOSO_RE.search(stem) or especialidade == "geriatria":
        return "idoso", True
    if ADOLESC_RE.search(stem) or especialidade == "adolescencia":
        return "adolescente", True
    if CRIANCA_RE.search(stem) or area == "pediatria":
        return "crianca", area == "pediatria"  # confiança alta só se a área já é pediatria
    return "adulto", False  # default sem sinal explícito — confiança baixa


def infer_decision_type(texto):
    t = norm(texto)
    for kw in ENCAMINHAMENTO_KW:
        if kw in t:
            return "encaminhamento", True
    for kw in PREVENCAO_KW:
        if kw in t:
            return "prevencao", True
    for kw in INVESTIGACAO_KW:
        if kw in t:
            return "investigacao", True
    for kw in CONDUTA_KW:
        if kw in t:
            return "conduta", True
    for kw in DIAGNOSTICO_KW:
        if kw in t:
            return "diagnostico", True
    return "conduta", False  # default — confiança baixa, precisa revisão humana


def resolve_area_subarea(area_portaria, especialidade, sistema_organico):
    esp = especialidade or ""
    warnings = []
    area = FORCE_AREA_BY_ESPECIALIDADE.get(esp, area_portaria)
    if esp in EXACT_SUBAREA_OWNER:
        subarea = esp
        area = EXACT_SUBAREA_OWNER[esp]
        return area, subarea, warnings
    if esp in BASIC_SCIENCE:
        sub = SISTEMA_ORGANICO_NORM.get(norm(sistema_organico))
        if sub and sub in SUBAREAS.get(area, []):
            warnings.append("subarea_via_sistema_organico")
            return area, sub, warnings
        warnings.append("subarea_fallback_ciencia_basica_sem_sistema_organico")
        return area, FALLBACK_SUBAREA[area], warnings
    sub = ESPECIALIDADE_TO_SUBAREA.get(esp)
    if sub and sub in SUBAREAS.get(area, []):
        return area, sub, warnings
    warnings.append(f"especialidade_sem_mapeamento_confiavel:{esp}")
    return area, FALLBACK_SUBAREA[area], warnings


def build_source_evidence(q, fonte_meta):
    correta = next(a for a in q["alternativas"] if a["correta"])
    excerpt = (correta.get("justificativa") or "").strip()
    if len(excerpt) > 500:
        excerpt = excerpt[:497] + "..."
    elif len(excerpt) < 20:
        excerpt = (excerpt + " " + (q.get("tema") or "")).strip()[:500]
    locator = q.get("sp_referencia") or f"uc {q.get('uc_slug')}, fase {q.get('fase_alvo')}"
    return {
        "title": fonte_meta["title"],
        "issuer": fonte_meta["issuer"],
        "year": fonte_meta["year"],
        "locator": str(locator)[:200] or "referência interna",
        "excerpt": excerpt,
    }


def convert(q):
    warnings = []
    cf = q.get("classificacao_fina", {}) or {}
    matriz = cf.get("matriz_enamed_478_2025", {}) or {}
    area_portaria = AREA_MAP.get(matriz.get("area"))
    if not area_portaria:
        warnings.append("sem_area_portaria_478")
        return None, None, warnings

    area, subarea, w = resolve_area_subarea(area_portaria, cf.get("especialidade"), cf.get("sistema_organico"))
    warnings += w

    competencias = matriz.get("competencias") or []
    conteudos = matriz.get("conteudos") or []
    competencia = comp_id(competencias[0]) if competencias else None
    dominio = dom_id(conteudos[0]) if conteudos else None
    if not competencia or not dominio:
        warnings.append("sem_competencia_ou_dominio_478")
        return None, None, warnings

    cenario = matriz.get("cenario")
    rede_atencao = REDE_MAP.get(cenario)
    if not rede_atencao:
        # ~13% do banco não recebeu classificação de cenário/rede na etapa
        # original — lacuna de curadoria anterior, não deste conversor. Em vez
        # de descartar questões boas por um campo de metadado, cai para
        # contexto_atencao (presente em 100% dos itens), sinalizando baixa
        # confiança para revisão humana em vez de excluir.
        contexto_fallback = cf.get("contexto_atencao")
        rede_atencao = {
            "urgencia_emergencia": "urgencia_emergencia",
            "atencao_primaria": "atencao_primaria",
            "terapia_intensiva": "urgencia_emergencia",
            "domiciliar": "doencas_cronicas",
            "ambulatorial_especializado": "doencas_cronicas",
            "internacao_hospitalar": "doencas_cronicas",
        }.get(contexto_fallback)
        if not rede_atencao:
            if area == "saude_mental":
                rede_atencao = "psicossocial"
            elif area == "ginecologia_obstetricia" and cf.get("especialidade") in (
                "parto_e_puerperio", "intercorrencias_obstetricas"):
                rede_atencao = "materno_infantil"
            else:
                rede_atencao = "atencao_primaria"
        warnings.append(f"rede_atencao_fallback:{contexto_fallback}")

    texto_base = (q.get("texto_base") or "").strip()
    enunciado = (q.get("enunciado") or "").strip()
    stem = f"{texto_base}\n\n{enunciado}".strip() if texto_base else enunciado
    if len(stem) < 40:
        warnings.append("stem_curto_apos_concatenacao")
        return None, None, warnings

    item_format = infer_item_format(stem)
    ciclo_vida, ciclo_conf = infer_ciclo_vida(stem, area, cf.get("especialidade"))
    if not ciclo_conf:
        warnings.append(f"ciclo_vida_heuristico:{ciclo_vida}")

    contexto = cf.get("contexto_atencao")
    care_setting = CONTEXTO_CARE_SETTING.get(contexto)
    if area == "ginecologia_obstetricia" and subarea == "parto_puerperio":
        care_setting = "maternidade"
    elif cf.get("especialidade") == "anestesiologia":
        care_setting = "centro_cirurgico"
    if not care_setting:
        care_setting = "ambulatorio" if area != "cirurgia_geral" else "centro_cirurgico"
        warnings.append(f"care_setting_fallback:{contexto}")

    decision_type, dec_conf = infer_decision_type(
        " ".join(filter(None, [q.get("tema"), cf.get("objeto_conhecimento"), enunciado]))
    )
    if not dec_conf:
        warnings.append(f"decision_type_heuristico:{decision_type}")

    dificuldade_editorial = q.get("dificuldade_editorial")
    difficulty = DIFICULDADE_MAP.get(dificuldade_editorial, "intermediaria")

    alternatives = []
    correct = None
    for alt in q["alternativas"]:
        letra = alt["letra"]
        rationale = (alt.get("justificativa") or "").strip()
        if len(rationale) < 10:
            warnings.append(f"rationale_curta:{letra}")
            return None, None, warnings
        alternatives.append({"id": letra, "text": alt["texto"].strip(), "rationale": rationale})
        if alt["correta"]:
            correct = letra
    if correct is None or len(alternatives) != 4:
        warnings.append("gabarito_invalido")
        return None, None, warnings

    correta_alt = next(a for a in alternatives if a["id"] == correct)
    pearl = correta_alt["rationale"]
    if len(pearl) < 15:
        warnings.append("pearl_curto")
        return None, None, warnings

    fonte_meta = FONTE_META.get(q.get("fonte_geracao"))
    if not fonte_meta:
        warnings.append("fonte_geracao_desconhecida")
        return None, None, warnings
    source_evidence = build_source_evidence(q, fonte_meta)

    body = {
        "area": area,
        "topic": (q.get("tema") or "Tema não informado")[:200],
        "item_format": item_format,
        "stem": stem,
        "alternatives": alternatives,
        "correct": correct,
        "pearl": pearl,
        "source": fonte_meta["title"],
        "source_claim": (q.get("referencia") or f"Fonte: {fonte_meta['title']}")[:2000],
        "source_evidence": source_evidence,
    }

    learning_objective = cf.get("objeto_conhecimento") or q.get("tema") or "Objetivo não informado"
    blueprint = {
        "area": area,
        "subarea": subarea,
        "ciclo_vida": ciclo_vida,
        "rede_atencao": rede_atencao,
        "competencia": competencia,
        "dominio": dominio,
        "topic": (q.get("tema") or "Tema não informado")[:200],
        "competency": (q.get("competencia_dcn_2025") if isinstance(q.get("competencia_dcn_2025"), str)
                       else ", ".join(q.get("competencia_dcn_2025") or []) or "Não informado")[:500] or "Não informado",
        "scenario": (cf.get("contexto_atencao") or "Não informado"),
        "decision_type": decision_type,
        "care_setting": care_setting,
        "item_format": item_format,
        "learning_objective": str(learning_objective)[:1000],
        "source_context": (q.get("texto_base") or None),
        "difficulty": difficulty,
    }

    provenance = {
        "blueprint": blueprint,
        "origem": "adequacao-enamed / MED-UNIDAVI — importação direta de banco pré-classificado",
        "source_policy": "publishable",
        "disclaimer": (
            "Verificação automática — não houve revisão humana docente. Este item vem "
            "da curadoria/adequação assistida do banco MED-UNIDAVI (não do pipeline de "
            "geração/revisão automática do treino-enamed em si): gabarito auditado na "
            "fonte original, justificativa própria em cada alternativa. A classificação "
            "no blueprint (área/subárea/ciclo de vida/tipo de decisão/cenário de cuidado) "
            "foi feita por regras determinísticas e heurísticas de texto a partir dessa "
            "curadoria. Revisão humana editorial (review_question) continua disponível "
            "para promover a 'human_reviewed'."
        ),
        "mapeamento": {
            "baixa_confianca": warnings,
        },
        "origem_unidavi": {
            "uc_slug": q.get("uc_slug"),
            "fase_alvo": q.get("fase_alvo"),
            "sp_referencia": q.get("sp_referencia"),
            "competencia_dcn_2025": q.get("competencia_dcn_2025"),
            "nivel_bloom": q.get("nivel_bloom"),
            "status_curadoria": q.get("status_curadoria"),
            "referencia": q.get("referencia"),
            "fonte_geracao": q.get("fonte_geracao"),
            "classificacao_fina": cf,
            "versao": q.get("versao"),
        },
        "estimated_cost_usd": 0,
    }

    question_row = {"status": "auto_verified", "current_version": 1}
    question_version_row = {"version": 1, "body": body, "provenance": provenance}
    return question_row, question_version_row, warnings


def main():
    banco = json.loads(BANCO.read_text())
    resultados = []
    excluidos = []
    contagem_avisos = {}
    for i, q in enumerate(banco):
        question_row, version_row, warnings = convert(q)
        for w in warnings:
            key = w.split(":")[0]
            contagem_avisos[key] = contagem_avisos.get(key, 0) + 1
        if question_row is None:
            excluidos.append({"indice": i, "tema": q.get("tema"), "motivos": warnings})
            continue
        resultados.append({
            "origem_indice": i,
            "question": question_row,
            "question_version": version_row,
            "avisos_baixa_confianca": warnings,
        })

    OUT_IMPORT.write_text(json.dumps(resultados, ensure_ascii=False, indent=2))

    baixa_confianca_por_campo = {}
    for r in resultados:
        for w in r["avisos_baixa_confianca"]:
            key = w.split(":")[0]
            baixa_confianca_por_campo[key] = baixa_confianca_por_campo.get(key, 0) + 1

    report = {
        "total_origem": len(banco),
        "convertidos": len(resultados),
        "excluidos": len(excluidos),
        "excluidos_detalhe": excluidos,
        "avisos_baixa_confianca_por_tipo": baixa_confianca_por_campo,
        "sem_avisos": sum(1 for r in resultados if not r["avisos_baixa_confianca"]),
    }
    OUT_REPORT.write_text(json.dumps(report, ensure_ascii=False, indent=2))

    print(f"Convertidos: {len(resultados)} / {len(banco)}")
    print(f"Excluídos: {len(excluidos)}")
    print("Avisos de baixa confiança por tipo:")
    for k, v in sorted(baixa_confianca_por_campo.items(), key=lambda x: -x[1]):
        print(f"  {k}: {v}")
    print(f"Itens sem nenhum aviso: {report['sem_avisos']}")


if __name__ == "__main__":
    main()
