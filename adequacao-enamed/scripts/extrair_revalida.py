#!/usr/bin/env python3
"""Extrai as questões objetivas das provas do Revalida (INEP) para JSON.

Entradas (texto extraído do PDF com pypdf, coluna única):
  - fontes/revalida2023_2_pv_objetiva.txt   (Revalida 2023.2 — 100 questões)
  - fontes/revalida2024_1_pv_objetiva.txt   (Revalida 2024.1 — 100 questões)

Saída:
  - intermediario/revalida.json   (array único, as duas provas juntas)

Notas de formato da fonte:
  * O cabeçalho da questão é a linha `QUESTÃO <n>` sozinha (pode vir com espaço
    à esquerda — acontece na questão 46 da prova 2024.1).
  * As alternativas NÃO têm parêntese nem ponto: é a letra maiúscula sozinha no
    início da linha, seguida de espaço (`^[A-E]\\s+\\S`). Como o enunciado em
    português tem MUITAS linhas que começam com "A ..." / "B ..." (artigo,
    sigla, continuação de frase), a detecção é feita de trás para frente:
    acha-se o último `D`, depois o último `C` antes dele, e assim por diante.
  * Ao final de cada caderno há o "QUESTIONÁRIO DE PERCEPÇÃO SOBRE A PROVA"
    (PERGUNTA 1..6, com alternativa E). NÃO é conteúdo: é cortado fora.
  * NÃO existe gabarito publicado para estas provas -> `gabarito: null`.

NÃO inventa conteúdo: só reestrutura o que está no caderno.
"""
import json
import os
import re

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(BASE, "intermediario", "revalida.json")

PROVAS = [
    {
        "arquivo": "revalida2023_2_pv_objetiva.txt",
        "prefixo": "revalida2023_2",
        "fonte": "Revalida 2023.2 — Prova Objetiva",
        "esperado": 100,
    },
    {
        "arquivo": "revalida2024_1_pv_objetiva.txt",
        "prefixo": "revalida2024_1",
        "fonte": "Revalida 2024.1 — Prova Objetiva",
        "esperado": 100,
    },
]

LETRAS = "ABCDE"

RE_CABECALHO = re.compile(r"^\s*QUEST[ÃA]O\s+(\d+)\s*$")
RE_ALTERNATIVA = re.compile(r"^([A-E])\s+(\S.*)$")
# O corte do questionário de percepção precisa ser ancorado na LINHA em caixa
# alta ("QUESTIONÁRIO DE PERCEPÇÃO SOBRE A PROVA"), porque a mesma expressão
# aparece na página de instruções, no topo do caderno, em caixa mista.
RE_FIM_PROVA = re.compile(
    r"^\s*QUESTION[ÁA]RIO\s+DE\s+PERCEP[ÇC][ÃA]O.*$|^\s*PERGUNTA\s+1\s*$", re.M)

# Resíduos de layout que o pypdf traz como linha isolada.
RE_LIXO = [
    re.compile(r"^\s*\d{1,3}\s*$"),                       # número de página solto
    re.compile(r"^\s*[ÁA]REA\s+LIVRE\s*$", re.I),         # marca de página em branco
    re.compile(r"^\s*\d{4}\s+(PRIMEIRA|SEGUNDA)\s+EDI[ÇC][ÃA]O\s*$", re.I),  # cabeçalho corrente
    re.compile(r"^\s*REVALIDA\s*$", re.I),
]

# Referência EXPLÍCITA a material gráfico que não vem no texto.
# `\bfigura\b` não casa "configura"; "quadro" só conta quando não é "quadro clínico".
RE_IMAGEM = re.compile(
    r"\b(figuras?|imagens?|imagem|gr[áa]ficos?|tabelas?|fotografias?|foto|"
    r"esquemas?|fluxogramas?|ilustra[çc][ãa]o|radiografias?|"
    r"eletrocardiograma|tomografia\s+(?:a\s+seguir|abaixo)|"
    r"quadro\s+(?:a\s+seguir|abaixo|apresentad))\b",
    re.I,
)


def limpar_linhas(linhas):
    """Remove resíduos de layout preservando a ordem/estrutura de linhas."""
    return [ln for ln in linhas if not any(r.match(ln) for r in RE_LIXO)]


def norm(texto):
    """Junta linhas num texto único, normalizando espaços."""
    texto = texto.replace("\xad", "")          # soft hyphen
    texto = texto.replace(" ", " ")       # nbsp
    texto = re.sub(r"\s+", " ", texto)
    return texto.strip()


def localizar_alternativas(linhas):
    """Acha os índices das alternativas varrendo DE TRÁS PARA FRENTE.

    Retorna dict {letra: indice} com pelo menos A..D, ou {} se não achar.
    Isso evita o falso positivo clássico: linhas do enunciado que começam com
    "A ", "B ", "O " etc. Só é aceita como alternativa a última ocorrência de
    cada letra que respeite a ordem A < B < C < D (< E).
    """
    ocorrencias = {L: [] for L in LETRAS}
    for i, ln in enumerate(linhas):
        m = RE_ALTERNATIVA.match(ln)
        if m:
            ocorrencias[m.group(1)].append(i)

    if not ocorrencias["D"]:
        return {}

    idx = {"D": ocorrencias["D"][-1]}
    # E é opcional e vem DEPOIS de D (não usada nas provas do Revalida, mas
    # o parser aceita caso uma edição futura tenha 5 alternativas).
    posteriores_e = [i for i in ocorrencias["E"] if i > idx["D"]]
    if posteriores_e:
        idx["E"] = posteriores_e[0]

    limite = idx["D"]
    for L in ("C", "B", "A"):
        anteriores = [i for i in ocorrencias[L] if i < limite]
        if not anteriores:
            return {}
        idx[L] = anteriores[-1]
        limite = idx[L]
    return idx


def parse_bloco(linhas):
    """linhas = corpo da questão (depois de 'QUESTÃO n'). -> (enunciado, alts)"""
    idx = localizar_alternativas(linhas)
    if not idx:
        return norm("\n".join(linhas)), {}

    ordenados = sorted(idx.items(), key=lambda kv: kv[1])
    inicio = ordenados[0][1]
    enunciado = norm("\n".join(linhas[:inicio]))

    alts = {}
    for pos, (letra, i) in enumerate(ordenados):
        fim = ordenados[pos + 1][1] if pos + 1 < len(ordenados) else len(linhas)
        corpo = RE_ALTERNATIVA.match(linhas[i]).group(2)
        corpo = "\n".join([corpo] + linhas[i + 1:fim])
        alts[letra] = norm(corpo)
    return enunciado, alts


def extrair_prova(prova):
    caminho = os.path.join(BASE, "fontes", prova["arquivo"])
    bruto = open(caminho, encoding="utf-8").read()

    # corta o questionário de percepção (PERGUNTA 1..6) do fim do caderno
    cortes = list(RE_FIM_PROVA.finditer(bruto))
    if cortes:
        bruto = bruto[:cortes[0].start()]

    linhas = limpar_linhas([ln.rstrip() for ln in bruto.split("\n")])

    # índices dos cabeçalhos QUESTÃO n
    cabecalhos = []
    for i, ln in enumerate(linhas):
        m = RE_CABECALHO.match(ln)
        if m:
            cabecalhos.append((i, int(m.group(1))))

    registros = []
    vistos = set()
    for pos, (i, num) in enumerate(cabecalhos):
        fim = cabecalhos[pos + 1][0] if pos + 1 < len(cabecalhos) else len(linhas)
        if num in vistos:
            continue
        vistos.add(num)
        enunciado, alts = parse_bloco(linhas[i + 1:fim])
        letras = [L for L in LETRAS if alts.get(L)]
        registros.append({
            "id_origem": f"{prova['prefixo']}_q{num:03d}",
            "fonte": prova["fonte"],
            "num": num,
            "enunciado": enunciado,
            "alternativas": {L: alts.get(L) for L in LETRAS},
            "gabarito": None,
            "justificativa_oficial": None,
            "n_alternativas": len(letras),
            "requer_imagem": bool(RE_IMAGEM.search(enunciado)),
        })

    registros.sort(key=lambda r: r["num"])
    return registros, vistos


def main():
    todos = []
    relatorio = []
    for prova in PROVAS:
        registros, vistos = extrair_prova(prova)
        todos.extend(registros)

        faltando = [n for n in range(1, prova["esperado"] + 1) if n not in vistos]
        extras = sorted(n for n in vistos if n > prova["esperado"] or n < 1)
        sem_enunciado = [r["num"] for r in registros if not r["enunciado"]]
        incompletas = [r["num"] for r in registros
                       if any(r["alternativas"][L] in (None, "") for L in "ABCD")]
        dist = {}
        for r in registros:
            dist[r["n_alternativas"]] = dist.get(r["n_alternativas"], 0) + 1

        relatorio.append({
            "fonte": prova["fonte"],
            "total": len(registros),
            "esperado": prova["esperado"],
            "faltando": faltando,
            "extras": extras,
            "sem_enunciado": sem_enunciado,
            "alternativas_faltando": incompletas,
            "dist_n_alternativas": dict(sorted(dist.items())),
            "requer_imagem": [r["num"] for r in registros if r["requer_imagem"]],
        })

    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    with open(OUT, "w", encoding="utf-8") as fh:
        json.dump(todos, fh, ensure_ascii=False, indent=2)

    print("=" * 72)
    for rel in relatorio:
        print(f"\n{rel['fonte']}")
        print(f"  extraídas ............... {rel['total']}/{rel['esperado']}")
        print(f"  não encontradas ......... {rel['faltando'] or 'nenhuma'}")
        print(f"  numeração inesperada .... {rel['extras'] or 'nenhuma'}")
        print(f"  enunciado vazio ......... {rel['sem_enunciado'] or 'nenhuma'}")
        print(f"  alternativa A-D faltando  {rel['alternativas_faltando'] or 'nenhuma'}")
        print(f"  n_alternativas .......... {rel['dist_n_alternativas']}")
        print(f"  requer_imagem ({len(rel['requer_imagem'])}) ...... {rel['requer_imagem']}")
    print("\n" + "=" * 72)
    print(f"TOTAL no arquivo: {len(todos)} questões -> {OUT}")

    # amostra para conferência visual
    amostras = [todos[0], todos[len(todos) // 2]]
    for r in amostras:
        print("\n" + "-" * 72)
        print(f"[{r['id_origem']}] {r['fonte']} | questão {r['num']} | "
              f"n_alt={r['n_alternativas']} | requer_imagem={r['requer_imagem']}")
        print(f"ENUNCIADO: {r['enunciado']}")
        for L in LETRAS:
            if r["alternativas"][L] is not None:
                print(f"  {L}) {r['alternativas'][L]}")
        print(f"gabarito={r['gabarito']} justificativa_oficial={r['justificativa_oficial']}")


if __name__ == "__main__":
    main()
