#!/usr/bin/env python3
"""
Triagem de questões endocrinológicas nos bancos baixados.

Normaliza os bancos heterogêneos (MedQA, MedQA4, MedMCQA, USMLE, NephSAP)
num esquema único e pontua cada item pela relevância para cada sessão do
12º CCEM, usando um léxico de domínio.

Saída: pool_triado.json — matéria-prima em inglês, etiquetada por sessão,
para curadoria e tradução humana/assistida ao padrão ABDC.

Uso:  python3 question-banks/tools/triagem_endocrino.py
"""

import json
import csv
import re
import os
from collections import defaultdict

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(BASE, "pool_triado.json")

# ---------------------------------------------------------------- léxico
# Cada sessão do CCEM 2026 -> termos que sinalizam pertinência.
# Termos "fortes" (peso 3) são quase-exclusivos do tema; "fracos" (peso 1)
# apenas sugerem. Um item precisa de score >= 3 para entrar no pool.
LEXICO = {
    "mini-glicemia": {
        "forte": ["continuous glucose monitor", "flash glucose", "glucose sensor",
                  "time in range", "self-monitoring of blood glucose", "cgm"],
        "fraco": ["glucometer", "capillary glucose", "hba1c", "glycated hemoglobin",
                  "fructosamine", "glycemic monitoring"],
    },
    "simp1-dm2": {
        "forte": ["type 2 diabetes", "type ii diabetes", "sglt2", "sglt-2",
                  "glp-1", "glp1", "dpp-4", "dpp4", "metformin", "sulfonylurea",
                  "glipizide", "glyburide", "glimepiride", "pioglitazone",
                  "empagliflozin", "dapagliflozin", "canagliflozin", "sitagliptin",
                  "liraglutide", "dulaglutide", "tirzepatide", "acarbose"],
        "fraco": ["insulin resistance", "hyperglycemia", "diabetic nephropathy",
                  "diabetic retinopathy", "diabetic neuropathy", "prediabetes",
                  "impaired glucose tolerance", "hyperosmolar"],
    },
    "simp2-dm1": {
        "forte": ["type 1 diabetes", "type i diabetes", "diabetic ketoacidosis",
                  "insulin pump", "teplizumab", "islet autoantibod", "c-peptide",
                  "gad antibod", "latent autoimmune diabetes"],
        "fraco": ["ketoacidosis", "basal bolus", "insulin glargine", "insulin lispro",
                  "honeymoon phase", "hypoglycemia unawareness"],
    },
    "simp3-cdt": {
        "forte": ["thyroid carcinoma", "thyroid cancer", "papillary thyroid",
                  "follicular thyroid", "medullary thyroid", "thyroglobulin",
                  "radioactive iodine", "radioiodine", "thyroidectomy",
                  "thyroid nodule", "fine-needle aspiration of the thyroid",
                  "bethesda"],
        "fraco": ["calcitonin", "neck ultrasound", "cervical lymph node",
                  "hurthle cell", "anaplastic"],
    },
    "mini-cdt-resposta": {
        "forte": ["thyroglobulin", "radioiodine", "thyroid cancer recurrence",
                  "structural incomplete response", "biochemical incomplete"],
        "fraco": ["tsh suppression", "levothyroxine suppressive", "whole body scan"],
    },
    "simp4-hipofise": {
        "forte": ["pituitary adenoma", "prolactinoma", "hyperprolactinemia",
                  "acromegaly", "cushing disease", "transsphenoidal",
                  "growth hormone excess", "hypopituitarism", "sheehan",
                  "diabetes insipidus", "cabergoline", "bromocriptine",
                  "octreotide", "empty sella", "craniopharyngioma"],
        "fraco": ["prolactin", "insulin-like growth factor", "igf-1", "sella",
                  "bitemporal hemianopsia", "pituitary stalk", "vasopressin"],
    },
    "simp5-modismos": {
        "forte": ["creatine supplement", "branched-chain amino acid",
                  "whey protein", "dietary supplement", "anabolic steroid",
                  "performance-enhancing"],
        "fraco": ["vitamin d supplement", "multivitamin", "herbal", "ergogenic",
                  "unnecessary testing", "overdiagnosis", "informed consent"],
    },
    "simp6-gonadas": {
        "forte": ["polycystic ovary", "pcos", "hypogonadism", "testosterone therapy",
                  "testosterone replacement", "menopausal hormone therapy",
                  "premature ovarian", "klinefelter", "turner syndrome",
                  "kallmann", "erectile dysfunction", "gynecomastia",
                  "hirsutism", "amenorrhea"],
        "fraco": ["estradiol", "menopause", "perimenopause", "oligomenorrhea",
                  "luteinizing hormone", "follicle-stimulating hormone",
                  "infertility", "spermatogenesis", "hot flashes"],
    },
    "mini-transgenero": {
        "forte": ["transgender", "gender-affirming", "gender dysphoria",
                  "cross-sex hormone"],
        "fraco": ["feminizing hormone", "masculinizing hormone"],
    },
    "simp7-osseo": {
        "forte": ["osteoporosis", "bisphosphonate", "alendronate", "denosumab",
                  "teriparatide", "zoledronic", "hypoparathyroidism",
                  "hyperparathyroidism", "parathyroid", "hypocalcemia",
                  "hypercalcemia", "paget disease of bone", "osteomalacia",
                  "rickets", "bone mineral density", "dexa", "fragility fracture"],
        "fraco": ["parathyroid hormone", "calcium supplement", "vitamin d deficiency",
                  "alkaline phosphatase", "t-score", "osteopenia"],
    },
    "simp8-adrenal": {
        "forte": ["cushing syndrome", "adrenal adenoma", "adrenal incidentaloma",
                  "pheochromocytoma", "primary aldosteronism", "hyperaldosteronism",
                  "conn syndrome", "addison disease", "adrenal insufficiency",
                  "congenital adrenal hyperplasia", "dexamethasone suppression",
                  "adrenal vein sampling", "aldosterone-renin", "metanephrine"],
        "fraco": ["cortisol", "aldosterone", "acth", "hypokalemia and hypertension",
                  "adrenal crisis", "hydrocortisone", "fludrocortisone"],
    },
    "simp9-pediatrica": {
        "forte": ["short stature", "growth hormone deficiency", "precocious puberty",
                  "delayed puberty", "constitutional delay", "childhood obesity",
                  "aromatase inhibitor for", "congenital hypothyroidism",
                  "neonatal screening", "bone age"],
        "fraco": ["growth chart", "growth velocity", "tanner stage", "adolescent",
                  "pubertal", "somatropin"],
    },
    "simp10-obesidade": {
        "forte": ["bariatric surgery", "roux-en-y", "sleeve gastrectomy",
                  "semaglutide", "orlistat", "weight-loss medication",
                  "anti-obesity", "obesity management", "body mass index of"],
        "fraco": ["obesity", "weight loss", "lean body mass", "metabolic syndrome",
                  "waist circumference", "lifestyle intervention"],
    },
    "mini-ia": {
        "forte": ["artificial intelligence", "machine learning", "large language model",
                  "clinical decision support", "deep learning"],
        "fraco": ["algorithm", "predictive model", "sensitivity and specificity of the model"],
    },
}

PESO = {"forte": 3, "fraco": 1}
SCORE_MIN = 3


def pontuar(texto):
    """Retorna {sessao: score} para o texto dado."""
    t = texto.lower()
    scores = {}
    for sessao, grupos in LEXICO.items():
        s = 0
        achados = []
        for nivel, termos in grupos.items():
            for termo in termos:
                if termo in t:
                    s += PESO[nivel]
                    achados.append(termo)
        if s:
            scores[sessao] = (s, achados)
    return scores


# ------------------------------------------------------------ carregadores
def norm_opts(options):
    """Normaliza options (dict A..E ou str repr de dict) para lista ordenada."""
    if isinstance(options, str):
        try:
            import ast
            options = ast.literal_eval(options)
        except Exception:
            return []
    if isinstance(options, dict):
        return [options[k] for k in sorted(options.keys())]
    if isinstance(options, list):
        return options
    return []


def ler_jsonl(caminho, fonte):
    itens = []
    with open(caminho, encoding="utf-8") as f:
        for i, linha in enumerate(f):
            linha = linha.strip()
            if not linha:
                continue
            try:
                d = json.loads(linha)
            except json.JSONDecodeError:
                continue
            q = d.get("question", "")
            ctx = d.get("context", "")
            enunciado = (ctx + "\n" + q).strip() if ctx else q
            opts = norm_opts(d.get("options"))
            if not enunciado or len(opts) < 2:
                continue
            itens.append({
                "fonte": fonte,
                "id": f"{fonte}#{d.get('ID', i)}",
                "enunciado": enunciado,
                "opcoes": opts,
                "gabarito": d.get("answer_idx", ""),
                "resposta": d.get("answer", ""),
                "meta": d.get("meta_info", ""),
            })
    return itens


RE_Q = re.compile(r"Question:\s*(.*?)\s*\nOptions:\s*(.*)", re.S)
RE_OPT = re.compile(r"\(([A-E])\)\s*([^\n]*)")


def ler_ontotune(caminho, fonte):
    """Formato instruction/input/output do OntoTune."""
    itens = []
    with open(caminho, encoding="utf-8") as f:
        dados = json.load(f)
    for i, d in enumerate(dados):
        m = RE_Q.search(d.get("input", ""))
        if not m:
            continue
        enunciado = m.group(1).strip()
        opts = [o[1].strip() for o in RE_OPT.findall(m.group(2))]
        if not enunciado or len(opts) < 2:
            continue
        itens.append({
            "fonte": fonte,
            "id": f"{fonte}#{i}",
            "enunciado": enunciado,
            "opcoes": opts,
            "gabarito": (d.get("output") or "").strip()[:3],
            "resposta": (d.get("output") or "").strip(),
            "meta": "",
        })
    return itens


def main():
    fontes = []
    caminhos = [
        ("MedQA/train.jsonl", "MedQA-train", ler_jsonl),
        ("MedQA/dev.jsonl", "MedQA-dev", ler_jsonl),
        ("MedQA/test.jsonl", "MedQA-test", ler_jsonl),
        ("MedQA4/train.jsonl", "MedQA4-train", ler_jsonl),
        ("MedQA4/test.jsonl", "MedQA4-test", ler_jsonl),
        ("NephSAP/nephsap_acl.jsonl", "NephSAP", ler_jsonl),
        ("MedMCQA/medmcqa-test.json", "MedMCQA", ler_ontotune),
        ("USMLE/usmle-step1.json", "USMLE-step1", ler_ontotune),
        ("USMLE/usmle-step2.json", "USMLE-step2", ler_ontotune),
        ("USMLE/usmle-step3.json", "USMLE-step3", ler_ontotune),
    ]

    todos = []
    for rel, nome, leitor in caminhos:
        p = os.path.join(BASE, rel)
        if not os.path.exists(p):
            print(f"  [pulado] {rel} não encontrado")
            continue
        itens = leitor(p, nome)
        todos.extend(itens)
        fontes.append((nome, len(itens)))
        print(f"  {nome:16s} {len(itens):6d} itens")

    print(f"\nTotal normalizado: {len(todos)} itens\n")

    # deduplicação por enunciado normalizado
    vistos = set()
    unicos = []
    for it in todos:
        chave = re.sub(r"\W+", "", it["enunciado"].lower())[:200]
        if chave in vistos:
            continue
        vistos.add(chave)
        unicos.append(it)
    print(f"Após deduplicação: {len(unicos)} itens\n")

    pool = defaultdict(list)
    for it in unicos:
        texto = it["enunciado"] + " " + " ".join(it["opcoes"])
        scores = pontuar(texto)
        if not scores:
            continue
        # sessão de maior score leva o item
        melhor = max(scores.items(), key=lambda kv: kv[1][0])
        sessao, (score, achados) = melhor
        if score < SCORE_MIN:
            continue
        it2 = dict(it)
        it2["score"] = score
        it2["termos"] = sorted(set(achados))
        it2["outras_sessoes"] = [s for s in scores if s != sessao]
        pool[sessao].append(it2)

    for s in pool:
        pool[s].sort(key=lambda x: -x["score"])

    print("Pool triado por sessão do CCEM:")
    total = 0
    for sessao in LEXICO:
        n = len(pool.get(sessao, []))
        total += n
        print(f"  {sessao:20s} {n:5d}")
    print(f"  {'TOTAL':20s} {total:5d}")

    with open(OUT, "w", encoding="utf-8") as f:
        json.dump(dict(pool), f, ensure_ascii=False, indent=1)
    print(f"\nEscrito: {OUT}")


if __name__ == "__main__":
    main()
