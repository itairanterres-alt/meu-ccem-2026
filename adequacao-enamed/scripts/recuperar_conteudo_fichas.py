#!/usr/bin/env python3
"""Recupera a classificação escrita pelo PRÓPRIO AUTOR nas fichas NAPISUL/ABEM.

Cada bloco de questão dos .docx tem:
    ÁREA DO CONHECIMENTO – CONTEÚDO - AUTOR:
    Clínica Médica - Reumatologia (reconhecimento dos subtipos de artrite) - Gabriel ...
    ENUNCIADO E ALTERNATIVAS: ...
    <enunciado>

Isso é especificidade fina de origem — melhor que qualquer inferência.

ATENÇÃO ao alinhamento: um dos arquivos tem 87 questões e só 86 cabeçalhos, então
numerar cabeçalhos em sequência desalinharia tudo a partir do faltante. O casamento
é feito pelo TEXTO DO ENUNCIADO que segue o cabeçalho, contra
`intermediario/questoes_docx.json` — assim cada classificação vai para a questão certa.

Saída: intermediario/conteudo_fichas.json
"""
import json, os, re, zipfile
import xml.etree.ElementTree as ET
from difflib import SequenceMatcher

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
W = "{http://schemas.openxmlformats.org/wordprocessingml/2006/main}"
OUT = os.path.join(BASE, "intermediario", "conteudo_fichas.json")
EXTR = os.path.join(BASE, "intermediario", "questoes_docx.json")

ARQUIVOS = [
    ("questoes_clm.docx", "Questoes CLM (TPMed 2023 - Clinica Medica)"),
    ("clinica_medica_napisul2_2026.docx",
     "Clinica Medica - questoes selecionadas - NAPISUL 2 2026"),
]
CAB = re.compile(r"ÁREA\s+DO\s+CONHECIMENTO", re.I)
ROTULO = re.compile(r"^(ENUNCIADO|RESPOSTA|COMENT|REFER|INSTITUI|ÁREA)", re.I)
SEP = re.compile(r"\s*[–—-]\s*|\s*/\s*")


def norm(s):
    s = re.sub(r"[^a-z0-9]+", " ", (s or "").lower())
    return re.sub(r"\s+", " ", s).strip()


def parece_nome(t):
    """Nome de pessoa: >=2 palavras, todas iniciando maiúsculas, sem número,
    parêntese, barra ou vocabulário clínico."""
    if not t or re.search(r"\d|\(|\)|/|,", t):
        return False
    ws = t.split()
    if not (2 <= len(ws) <= 6):
        return False
    maiusc = sum(1 for w in ws if w[:1].isupper())
    conectivos = {"de", "da", "do", "dos", "das", "e"}
    reais = [w for w in ws if w.lower() not in conectivos]
    return maiusc >= len(reais) and len(reais) >= 2


def paragrafos(caminho):
    x = ET.fromstring(zipfile.ZipFile(caminho).read("word/document.xml"))
    return [t for t in ("".join(n.text or "" for n in p.iter(f"{W}t")).strip()
                        for p in x.iter(f"{W}p")) if t]


def separar(valor):
    partes = [p.strip() for p in SEP.split(valor) if p.strip()]
    if not partes:
        return None, None, None
    autor = partes[-1] if len(partes) > 1 and parece_nome(partes[-1]) else None
    if autor:
        partes = partes[:-1]
    area = partes[0] if partes else None
    conteudo = " / ".join(partes[1:]) if len(partes) > 1 else None
    return area, conteudo, autor


def main():
    extr = json.load(open(EXTR, encoding="utf-8"))
    por_fonte = {}
    for r in extr:
        por_fonte.setdefault(r["fonte"], []).append(r)

    registros, sem_par = [], 0
    for arq, fonte in ARQUIVOS:
        caminho = os.path.join(BASE, "fontes", arq)
        if not os.path.exists(caminho):
            print(f"  !! ausente: {arq}")
            continue
        pars = paragrafos(caminho)
        candidatos = por_fonte.get(fonte, [])
        achados = 0
        for i, p in enumerate(pars):
            if not CAB.search(p):
                continue
            # valor da classificação = próximo parágrafo que não seja rótulo
            valor = next((pars[j] for j in range(i + 1, min(i + 4, len(pars)))
                          if not ROTULO.match(pars[j])), None)
            if not valor:
                continue
            # enunciado = primeiro parágrafo longo após 'ENUNCIADO E ALTERNATIVAS'
            enun = None
            for j in range(i + 1, min(i + 12, len(pars))):
                if re.match(r"^ENUNCIADO", pars[j], re.I):
                    for k in range(j, min(j + 4, len(pars))):
                        cand = re.sub(r"^ENUNCIADO[^:]*:\s*", "", pars[k], flags=re.I)
                        if len(cand) > 60:
                            enun = cand
                            break
                    break
            if not enun:
                continue
            alvo = norm(enun)[:160]
            melhor, escore = None, 0.0
            for r in candidatos:
                s = SequenceMatcher(None, alvo, norm(r["enunciado"])[:160]).ratio()
                if s > escore:
                    melhor, escore = r, s
            if not melhor or escore < 0.75:
                sem_par += 1
                continue
            area, conteudo, autor = separar(valor)
            achados += 1
            registros.append({
                "id_origem": melhor["id_origem"],
                "fonte": fonte,
                "casamento_escore": round(escore, 3),
                "bruto": valor,
                "area_declarada": area,
                "conteudo_declarado": conteudo,
                "autor_declarado": autor,
            })
        print(f"  {arq}: {achados} classificações casadas com a questão certa")

    # um id só pode receber uma classificação
    vistos, unicos = set(), []
    for r in sorted(registros, key=lambda x: -x["casamento_escore"]):
        if r["id_origem"] in vistos:
            continue
        vistos.add(r["id_origem"])
        unicos.append(r)
    unicos.sort(key=lambda r: r["id_origem"])

    json.dump(unicos, open(OUT, "w"), ensure_ascii=False, indent=2)
    comc = sum(1 for r in unicos if r["conteudo_declarado"])
    coma = sum(1 for r in unicos if r["autor_declarado"])
    print(f"\nTotal casado: {len(unicos)} | com conteúdo específico: {comc} "
          f"| com autor: {coma} | sem par confiável: {sem_par}")
    print("Amostras:")
    for r in unicos[:6]:
        print(f"  {r['id_origem']} ({r['casamento_escore']}): área={r['area_declarada']!r} "
              f"conteúdo={str(r['conteudo_declarado'])[:55]!r} autor={str(r['autor_declarado'])[:25]!r}")
    print(f"\nGravado: {OUT}")


if __name__ == "__main__":
    main()
