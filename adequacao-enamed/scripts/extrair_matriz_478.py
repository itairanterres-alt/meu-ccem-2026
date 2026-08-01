#!/usr/bin/env python3
"""Extrai a Matriz de Referência Comum (Portaria Inep nº 478/2025) do PDF oficial.

Estrutura da norma:
  Art. 3º  — 7 áreas de formação médica
  Art. 6º  — 15 competências avaliadas
  Art. 7º  — 6 cenários (redes e pontos de atenção)
  Art. 8º  — 21 conteúdos cujo domínio é requisito

O texto é lido VERBATIM do PDF (nada é transcrito à mão) e só depois recebe
títulos curtos, para uso em telas e relatórios.

Saída: referencia/matriz_enamed_478_2025.json
"""
import json, os, re

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TXT = os.path.join(BASE, "referencia", "portaria_478_2025_matriz_enamed.txt")
OUT = os.path.join(BASE, "referencia", "matriz_enamed_478_2025.json")

ROMANOS = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X",
           "XI", "XII", "XIII", "XIV", "XV", "XVI", "XVII", "XVIII", "XIX",
           "XX", "XXI"]

# títulos curtos (rótulo de tela); o texto oficial vem do PDF
TIT_COMP = {
    "I": "Singularidade, diversidade e equidade no cuidado",
    "II": "Hipóteses diagnósticas e plano propedêutico",
    "III": "Solicitação e interpretação de exames complementares",
    "IV": "Plano terapêutico individual, colaborativo e interprofissional",
    "V": "Urgências e emergências traumáticas e não traumáticas",
    "VI": "Procedimentos médicos clínicos e cirúrgicos",
    "VII": "Necessidades de saúde de grupos e intervenção coletiva",
    "VIII": "Educação em saúde, promoção, prevenção e vigilância",
    "IX": "Princípios e políticas do SUS, redes e referência/contrarreferência",
    "X": "Comunicação com pessoas, famílias, comunidade e equipe",
    "XI": "Trabalho em equipe e conduta profissional",
    "XII": "Registro em prontuário e documentos médicos",
    "XIII": "Ética, deontologia e sigilo médico",
    "XIV": "Autorreflexão e educação permanente",
    "XV": "Tecnologias de informação e comunicação na prática médica",
}
TIT_CONT = {
    "I": "Bases moleculares e celulares; estrutura e função",
    "II": "Processos fisiológicos nas fases do ciclo de vida",
    "III": "Determinantes sociais e culturais do processo saúde-doença",
    "IV": "Ética, bioética, relação médico-paciente e segurança de dados",
    "V": "Direitos humanos e inclusão",
    "VI": "Semiologia médica",
    "VII": "Habilidades de comunicação",
    "VIII": "Registro e documentação médica",
    "IX": "Propedêutica e diagnóstico",
    "X": "Terapêutica",
    "XI": "Prognóstico e prevenção",
    "XII": "Reabilitação física e psicossocial",
    "XIII": "Promoção e educação em saúde",
    "XIV": "Políticas de saúde e SUS",
    "XV": "Planejamento e gestão de serviços de saúde",
    "XVI": "Epidemiologia, indicadores e sistemas de informação",
    "XVII": "Vigilância em saúde e controle de doenças e agravos",
    "XVIII": "Saúde ambiental e ocupacional",
    "XIX": "Liderança colaborativa e trabalho interprofissional",
    "XX": "Metodologia científica e medicina baseada em evidências",
    "XXI": "Tecnologias de comunicação e informação na formação e no cuidado",
}

RUIDO = re.compile(r"\d{2}/\d{2}/\d{4}, \d{2}:\d{2}.*|https?://\S+|"
                   r"PORTARIA Nº 478.*Imprensa Nacional|\d/4\s*$")


def limpar(t):
    t = "\n".join(l for l in t.split("\n") if not RUIDO.search(l))
    t = t.replace("ﬁ", "fi").replace("ﬂ", "fl")
    return re.sub(r"\s+", " ", t).strip()


def bloco(txt, ini, fim):
    a = txt.index(ini)
    b = txt.index(fim, a)
    return txt[a:b]


def itens(corpo, total, sep_ponto=True):
    """Fatia uma lista 'I. ... II. ...' ou 'I - ... II - ...' em `total` itens."""
    achados = {}
    for i, r in enumerate(ROMANOS[:total]):
        pad = rf"(?:^|\s){re.escape(r)}\s*[\.\-–]\s+"
        m = re.search(pad, corpo)
        if not m:
            continue
        prox = None
        if i + 1 < total:
            pad2 = rf"(?:^|\s){re.escape(ROMANOS[i+1])}\s*[\.\-–]\s+"
            m2 = re.search(pad2, corpo[m.end():])
            prox = m.end() + m2.start() if m2 else None
        achados[r] = limpar(corpo[m.end(): prox if prox else len(corpo)])
    return achados


def main():
    bruto = open(TXT, encoding="utf-8").read()
    txt = limpar(bruto)

    areas = itens(bloco(txt, "Art. 3º", "Art. 4º"), 7)
    comps = itens(bloco(txt, "Art. 6º", "Art. 7º"), 15)
    cenarios = itens(bloco(txt, "Art. 7º", "Art. 8º"), 6)
    conteudos = itens(bloco(txt, "Art. 8º", "Art. 9º"), 21)

    matriz = {
        "metadata": {
            "nome": "Matriz de Referência Comum para a Avaliação da Formação Médica",
            "norma": "Portaria Inep nº 478, de 18 de julho de 2025",
            "publicacao": "DOU 21/07/2025, Edição 135, Seção 1, Página 40",
            "vigencia": "1º de agosto de 2025",
            "fonte": "referencia/portaria_478_2025_matriz_enamed.pdf (texto extraído do PDF oficial)",
            "observacao_contagem": (
                "A norma traz 15 competências (Art. 6º) e 21 conteúdos (Art. 8º). "
                "A taxonomia institucional menciona '20 competências ENAMED' — número "
                "que não corresponde a esta Portaria e deve ser corrigido lá."),
            "aviso": (
                "A Portaria NÃO lista objetos de conhecimento por especialidade: ela "
                "define áreas, competências, cenários e conteúdos. A camada "
                "`especialidade`/`objeto_conhecimento` do banco continua sendo "
                "complementar, não substituída por esta matriz."),
        },
        "areas_art3": [{"id": f"enamed_area_{i+1:02d}", "numero_romano": r,
                        "nome": re.sub(r"[;.]\s*(e)?\s*$", "", areas.get(r) or "").strip()}
                       for i, r in enumerate(ROMANOS[:7])],
        "competencias_art6": [{"id": f"enamed_comp_{i+1:02d}", "numero_romano": r,
                               "titulo_curto": TIT_COMP[r],
                               "texto_oficial": comps.get(r)}
                              for i, r in enumerate(ROMANOS[:15])],
        "cenarios_art7": [{"id": f"enamed_cenario_{i+1:02d}", "numero_romano": r,
                           "descricao": cenarios.get(r)}
                          for i, r in enumerate(ROMANOS[:6])],
        "conteudos_art8": [{"id": f"enamed_cont_{i+1:02d}", "numero_romano": r,
                            "titulo_curto": TIT_CONT[r],
                            "texto_oficial": conteudos.get(r)}
                           for i, r in enumerate(ROMANOS[:21])],
    }
    json.dump(matriz, open(OUT, "w"), ensure_ascii=False, indent=2)

    for chave, lst in (("áreas", matriz["areas_art3"]),
                       ("competências", matriz["competencias_art6"]),
                       ("cenários", matriz["cenarios_art7"]),
                       ("conteúdos", matriz["conteudos_art8"])):
        vazios = [x for x in lst if not (x.get("nome") or x.get("texto_oficial")
                                         or x.get("descricao"))]
        print(f"{chave}: {len(lst)} itens | sem texto: {len(vazios)}")
    print("\nÁreas:", [a["nome"] for a in matriz["areas_art3"]])
    print("\nCompetência I:", matriz["competencias_art6"][0]["texto_oficial"][:150])
    print("Conteúdo XVI:", matriz["conteudos_art8"][15]["texto_oficial"][:120])
    print("Cenário I:", matriz["cenarios_art7"][0]["descricao"][:100])
    print(f"\nGravado: {OUT}")


if __name__ == "__main__":
    main()
