#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Extrai as questoes COMENTADAS do Teste de Progresso MED 2022 (Napisul-II)
a partir do texto cru extraido do PDF LaTeX.

Entrada : adequacao-enamed/fontes/tpmed2022_comentadas.txt
Saida   : adequacao-enamed/intermediario/tp2022.json

Dois problemas resolvidos aqui:

1) ACENTUACAO QUEBRADA
   O PDF veio de LaTeX e a extracao separou o diacritico do caractere base,
   normalmente com um espaco no meio:
       'pulm˜ ao'    -> 'pulmão'
       'cansa¸ co'   -> 'cansaço'
       'ag´ a'       -> 'agá'
       'patogˆ enese'-> 'patogênese'
       '´ ıvel'      -> 'ível'   (ı = i sem pingo, U+0131)
       'Bibliograﬁa' -> 'Bibliografia' (ligadura ﬁ, U+FB01)
   O reparo combina o diacritico com a letra seguinte usando os caracteres
   COMBINANTES do Unicode e depois normaliza em NFC.

2) FORMATO
   Questoes numeradas 'N.' no inicio da linha, alternativas 'A.'..'E.',
   depois 'Alternativa Correta: (X) <justificativa oficial>' e,
   opcionalmente, 'Bibliografia: ...'.
"""

from __future__ import annotations

import json
import re
import sys
import unicodedata
from pathlib import Path

RAIZ = Path(__file__).resolve().parents[1]
ENTRADA = RAIZ / "fontes" / "tpmed2022_comentadas.txt"
SAIDA = RAIZ / "intermediario" / "tp2022.json"

FONTE = "Teste de Progresso MED 2022 (comentado)"
PREFIXO_ID = "tp2022_q"
N_ESPERADO = 120

# --------------------------------------------------------------------------
# 1. REPARO DE ACENTUACAO
# --------------------------------------------------------------------------

# diacritico "solto" -> caractere combinante Unicode
COMBINANTE = {
    "´": "́",  # ´  agudo   -> U+0301 COMBINING ACUTE
    "˜": "̃",  # ˜  til     -> U+0303 COMBINING TILDE
    "ˆ": "̂",  # ˆ  circunf.-> U+0302 COMBINING CIRCUMFLEX
    "¸": "̧",  # ¸  cedilha -> U+0327 COMBINING CEDILLA
    "`": "̀",  # `  grave   -> U+0300 COMBINING GRAVE
    "¨": "̈",  # ¨  trema   -> U+0308 COMBINING DIAERESIS
    # variantes "espacadas" que alguns extratores emitem
    "′": "́",
    "~": "̃",
    "^": "̂",
}

DIACRITICOS = "".join(sorted(set(COMBINANTE) - {"~", "^"}))
CLASSE_DIAC = "[" + re.escape(DIACRITICOS) + "]"

LIGADURAS = {
    "ﬀ": "ff",
    "ﬁ": "fi",
    "ﬂ": "fl",
    "ﬃ": "ffi",
    "ﬄ": "ffl",
    "ﬅ": "st",
    "ﬆ": "st",
    "ı": "i",   # i sem pingo (dotless i)
    "ȷ": "j",   # j sem pingo (dotless j)
    "◦": "°",  # ◦ usado como grau/ordinal
    "’": "'",
    "”": '"',
    "“": '"',
    "—": "-",
    "–": "-",
}

# palavras MAIUSCULAS que sao token inteiro (nao sao fragmento de palavra
# quebrada pelo extrator): 'DO ´UTERO' -> 'DO ÚTERO', mas 'LAST ´ORIA' ->
# 'LASTÓRIA' e 'QUEST ˜OES' -> 'QUESTÕES'.
MAIUSCULAS_INTEIRAS = {
    "A", "AO", "AOS", "AS", "COM", "DA", "DAS", "DE", "DO", "DOS", "E",
    "EM", "NA", "NAS", "NO", "NOS", "O", "OS", "OU", "PARA", "PELA",
    "PELO", "POR", "SEM", "SOB", "SOBRE", "UM", "UMA",
}


def _nfc(base: str, diacritico: str) -> str:
    """Combina base + diacritico solto e normaliza para forma composta."""
    return unicodedata.normalize("NFC", base + COMBINANTE[diacritico])


def _repara_minusculas(texto: str) -> str:
    """'pulm˜ ao' -> 'pulmão' ; '¸ c' -> 'ç' ; '´ i' -> 'í'."""
    padrao = re.compile(CLASSE_DIAC + r"[ ]?([a-zà-öø-ÿ])")

    def sub(m: re.Match) -> str:
        return _nfc(m.group(1), m.group(0)[0])

    return padrao.sub(sub, texto)


def _repara_maiusculas(texto: str) -> str:
    """
    Trata o caso 'diacritico colado em MAIUSCULA', em que o extrator ora
    deixou um espaco espurio ANTES do diacritico ('QUEST ˜OES'), ora comeu
    o espaco de separacao ('Par´ agrafo´Unico').
    """
    padrao = re.compile(r"([^\W\d_]*)([ ]?)(" + CLASSE_DIAC + r")([A-ZÀ-ÖØ-Þ])")

    def sub(m: re.Match) -> str:
        antes, espaco, diac, letra = m.groups()
        acentuada = _nfc(letra, diac)
        if antes and antes.isupper() and antes not in MAIUSCULAS_INTEIRAS:
            # fragmento de palavra maiuscula quebrada: reune sem espaco
            return antes + acentuada
        if antes:
            # palavra anterior completa colada na acentuada: separa
            return antes + " " + acentuada
        if espaco:
            return espaco + acentuada
        anterior = m.string[m.start() - 1] if m.start() > 0 else ""
        precisa_espaco = anterior not in ("", "\n", "\t", " ", "(", "[", "“", '"', "-", "/")
        return (" " if precisa_espaco else "") + acentuada

    return padrao.sub(sub, texto)


def repara_acentuacao(texto: str) -> str:
    """Pipeline completo de reparo tipografico."""
    for origem, destino in LIGADURAS.items():
        texto = texto.replace(origem, destino)
    texto = _repara_minusculas(texto)
    texto = _repara_maiusculas(texto)
    # sobra de diacritico solto ainda grudado em letra ja acentuada
    texto = _repara_minusculas(texto)
    return unicodedata.normalize("NFC", texto)


def residuos_diacriticos(texto: str) -> list[str]:
    """Retorna trechos onde ainda restou diacritico solto (para QA)."""
    achados = []
    for m in re.finditer(CLASSE_DIAC, texto):
        ini = max(0, m.start() - 30)
        achados.append(texto[ini:m.end() + 30].replace("\n", "\\n"))
    return achados


# --------------------------------------------------------------------------
# 2. LIMPEZA DE LAYOUT (rodapes, cabecalhos, hifenizacao)
# --------------------------------------------------------------------------

RE_RODAPE = re.compile(r"^\s*\d{1,3}\s*/\s*\d{1,3}\s*$")

CABECALHOS = {
    "Núcleo de Apoio Pedagógico Interinstitucional Sul II",
    "Napisul-II",
    "Teste de Progresso 2022",
    "QUESTÕES COMENTADAS",
    "QUESTÕES COMENT ADAS",
}

SECOES = {
    "Ciências Básicas",
    "Saúde Coletiva",
    "Pediatria",
    "Ginecologia e Obstetrícia",
    "Clínica Cirúrgica",
    "Clínica Médica",
}

RE_INICIO_QUESTAO = re.compile(r"^(\d{1,3})\.\s")
RE_ALTERNATIVA = re.compile(r"^([A-E])\.\s")
RE_CORRETA = re.compile(r"^Alternativa\s+[Cc]orreta\s*:")
RE_BIBLIO = re.compile(r"^Bibliografia\s*:?")


def remove_layout(linhas: list[str]) -> list[str]:
    """Descarta rodapes de pagina, cabecalhos e titulos de secao."""
    limpas = []
    for linha in linhas:
        alvo = linha.strip()
        if not alvo:
            continue
        if RE_RODAPE.match(alvo):
            continue
        if alvo in CABECALHOS or alvo in SECOES:
            continue
        limpas.append(linha.rstrip())
    return limpas


PALAVRA = r"[^\W\d_]+(?:-[^\W\d_]+)*"


def _vocabulario(linhas: list[str]) -> set[str]:
    """Palavras vistas inteiras dentro de uma linha (sem quebra de hifen)."""
    vocab = set()
    for linha in linhas:
        for m in re.finditer(PALAVRA, linha):
            vocab.add(m.group(0).lower())
    return vocab


def remove_hifenizacao(linhas: list[str]) -> list[str]:
    """
    Junta 'hidro-\\ncarbonetos' -> 'hidrocarbonetos'.
    Preserva o hifen quando o composto hifenizado existe no proprio corpus
    ('pronto-socorro', 'recém-nascido') e a forma colada nao existe.
    """
    vocab = _vocabulario(linhas)
    saida: list[str] = []
    i = 0
    while i < len(linhas):
        atual = linhas[i]
        emendou = False
        while (
            atual.endswith("-")
            and i + 1 < len(linhas)
            and not RE_INICIO_QUESTAO.match(linhas[i + 1])
            and not RE_ALTERNATIVA.match(linhas[i + 1])
            and not RE_CORRETA.match(linhas[i + 1])
            and not RE_BIBLIO.match(linhas[i + 1])
        ):
            m_esq = re.search(PALAVRA + r"-$", atual)
            m_dir = re.match(PALAVRA, linhas[i + 1])
            if not m_esq or not m_dir:
                break
            esq = m_esq.group(0)[:-1]
            dir_ = m_dir.group(0)
            colado = (esq + dir_).lower()
            hifenizado = (esq + "-" + dir_).lower()
            if hifenizado in vocab and colado not in vocab:
                atual = atual + linhas[i + 1].lstrip()
            else:
                atual = atual[:-1] + linhas[i + 1].lstrip()
            i += 1
            emendou = True
        saida.append(atual)
        i += 1
        if emendou:
            continue
    return saida


def junta(linhas: list[str]) -> str:
    """Une linhas de um mesmo paragrafo e normaliza espacos."""
    texto = " ".join(l.strip() for l in linhas if l.strip())
    texto = re.sub(r"\s+", " ", texto)
    texto = re.sub(r"\s+([,.;:!?%)\]])", r"\1", texto)
    texto = re.sub(r"([(\[])\s+", r"\1", texto)
    return texto.strip()


# --------------------------------------------------------------------------
# 3. PARSING DAS QUESTOES
# --------------------------------------------------------------------------

LETRAS = ["A", "B", "C", "D", "E"]

CUES_IMAGEM = re.compile(
    r"(imagem\s+(radiol|abaixo|a seguir)|seguinte imagem|figura abaixo|figura a seguir"
    r"|gráfico abaixo|tabela abaixo|fotografia|conforme a figura|observad[oa] abaixo"
    r"|apresentad[oa] abaixo|demonstrou a seguinte)",
    re.IGNORECASE,
)


def blocos_de_questao(linhas: list[str]) -> list[tuple[int, list[str]]]:
    """
    Fatia o documento em blocos por questao. Usa numeracao SEQUENCIAL para
    nao confundir com referencias bibliograficas ('4. ed. - Porto Alegre').
    """
    inicios: list[tuple[int, int]] = []  # (indice_linha, numero)
    proximo = 1
    for idx, linha in enumerate(linhas):
        m = RE_INICIO_QUESTAO.match(linha)
        if m and int(m.group(1)) == proximo:
            inicios.append((idx, proximo))
            proximo += 1
    blocos = []
    for pos, (idx, num) in enumerate(inicios):
        fim = inicios[pos + 1][0] if pos + 1 < len(inicios) else len(linhas)
        blocos.append((num, linhas[idx:fim]))
    return blocos


def parseia_bloco(num: int, bloco: list[str]) -> dict:
    problemas: list[str] = []

    # indices dos marcadores
    idx_alt: dict[str, int] = {}
    esperada = 0
    idx_correta = None
    idx_biblio = None
    for i, linha in enumerate(bloco):
        if idx_correta is None:
            m = RE_ALTERNATIVA.match(linha)
            if m and esperada < len(LETRAS) and m.group(1) == LETRAS[esperada]:
                idx_alt[m.group(1)] = i
                esperada += 1
                continue
        if idx_correta is None and RE_CORRETA.match(linha):
            idx_correta = i
            continue
        if idx_correta is not None and idx_biblio is None and RE_BIBLIO.match(linha):
            idx_biblio = i

    fim_enunciado = min(idx_alt.values()) if idx_alt else (
        idx_correta if idx_correta is not None else len(bloco)
    )
    linhas_enunciado = list(bloco[:fim_enunciado])
    linhas_enunciado[0] = RE_INICIO_QUESTAO.sub("", linhas_enunciado[0], count=1)
    enunciado = junta(linhas_enunciado)

    # alternativas
    limites = sorted(idx_alt.items(), key=lambda kv: kv[1])
    alternativas: dict[str, str] = {}
    for pos, (letra, ini) in enumerate(limites):
        if pos + 1 < len(limites):
            fim = limites[pos + 1][1]
        else:
            fim = idx_correta if idx_correta is not None else len(bloco)
        trecho = list(bloco[ini:fim])
        trecho[0] = RE_ALTERNATIVA.sub("", trecho[0], count=1)
        alternativas[letra] = junta(trecho)

    faltando = [l for l in LETRAS if l not in alternativas or not alternativas[l]]
    if faltando:
        problemas.append("alternativas ausentes: " + ",".join(faltando))

    # gabarito + justificativa
    gabarito = ""
    justificativa = ""
    if idx_correta is None:
        problemas.append("sem marcador 'Alternativa Correta'")
    else:
        fim = idx_biblio if idx_biblio is not None else len(bloco)
        corpo = junta(bloco[idx_correta:fim])
        corpo = RE_CORRETA.sub("", corpo, count=1).strip()
        m = re.match(r"^\(?\s*([A-E])\s*\)?[\s.:-]*", corpo)
        if m:
            gabarito = m.group(1)
            justificativa = corpo[m.end():].strip()
        else:
            problemas.append("gabarito nao identificado")
            justificativa = corpo

    bibliografia = ""
    if idx_biblio is not None:
        bibliografia = RE_BIBLIO.sub("", junta(bloco[idx_biblio:]), count=1).strip()

    if not justificativa:
        problemas.append("sem justificativa oficial")

    return {
        "id_origem": f"{PREFIXO_ID}{num:03d}",
        "fonte": FONTE,
        "num": num,
        "enunciado": enunciado,
        "alternativas": alternativas,
        "gabarito": gabarito,
        "justificativa_oficial": justificativa,
        "bibliografia": bibliografia,
        "n_alternativas": len(alternativas),
        "requer_imagem": bool(CUES_IMAGEM.search(enunciado)),
        "_problemas": problemas,
    }


# --------------------------------------------------------------------------
# 4. EXECUCAO
# --------------------------------------------------------------------------

def main() -> int:
    bruto = ENTRADA.read_text(encoding="utf-8")
    texto = repara_acentuacao(bruto)

    resid = residuos_diacriticos(texto)
    linhas = remove_layout(texto.split("\n"))
    linhas = remove_hifenizacao(linhas)

    blocos = blocos_de_questao(linhas)
    questoes = [parseia_bloco(num, b) for num, b in blocos]

    problemas = {q["num"]: q["_problemas"] for q in questoes if q["_problemas"]}
    for q in questoes:
        q.pop("_problemas")

    SAIDA.parent.mkdir(parents=True, exist_ok=True)
    SAIDA.write_text(
        json.dumps(questoes, ensure_ascii=False, indent=2), encoding="utf-8"
    )

    # ---------------- relatorio ----------------
    com_gabarito = sum(1 for q in questoes if q["gabarito"] in LETRAS)
    com_just = sum(1 for q in questoes if len(q["justificativa_oficial"]) > 20)
    com_biblio = sum(1 for q in questoes if q["bibliografia"])
    incompletas = [q["num"] for q in questoes if q["n_alternativas"] != 5]
    com_imagem = [q["num"] for q in questoes if q["requer_imagem"]]

    print(f"Arquivo de saida ......... {SAIDA}")
    print(f"Questoes extraidas ....... {len(questoes)} (esperado {N_ESPERADO})")
    print(f"Com gabarito valido ...... {com_gabarito}")
    print(f"Com justificativa oficial. {com_just}")
    print(f"Com bibliografia ......... {com_biblio}")
    print(f"Com alternativas faltando  {len(incompletas)} {incompletas}")
    print(f"Marcadas requer_imagem ... {len(com_imagem)} {com_imagem}")
    print(f"Residuos de diacritico ... {len(resid)}")
    for r in resid[:10]:
        print("   !", r)
    if problemas:
        print("Problemas por questao:")
        for num, ps in sorted(problemas.items()):
            print(f"   q{num}: {'; '.join(ps)}")

    from collections import Counter
    print("Distribuicao do gabarito .", dict(sorted(Counter(
        q["gabarito"] for q in questoes).items())))

    if "--mostrar" in sys.argv:
        alvos = [1, 2]
        for arg in sys.argv[1:]:
            if arg.isdigit():
                alvos = [int(a) for a in sys.argv[1:] if a.isdigit()]
                break
        for q in questoes:
            if q["num"] in alvos:
                print("\n" + "=" * 78)
                print(json.dumps(q, ensure_ascii=False, indent=2))

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
