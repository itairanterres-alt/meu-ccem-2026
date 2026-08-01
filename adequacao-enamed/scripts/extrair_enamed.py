#!/usr/bin/env python3
"""Extrai as 100 questões do caderno ENAMED 2025 (texto de PDF em 2 colunas)
para JSON intermediário estruturado, casando com o gabarito oficial.

Entrada:
  - fontes/enamed2025_caderno1.txt   (texto extraído do PDF, 2 colunas com gutter)
  - gabarito embutido abaixo (transcrito de fontes/enamed2025_gabarito_caderno1.md)

Saída:
  - intermediario/enamed2025_caderno1.json

NÃO inventa conteúdo: só reestrutura o que está no caderno + gabarito oficial.
Questões Anuladas/Excluídas são marcadas `descartada=True` e não entram no banco.
Questões cujo enunciado depende de imagem (figura/ECG/exame de imagem) são
marcadas `requer_imagem=True` para curadoria.
"""
import re, json, os, sys

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(BASE, "fontes", "enamed2025_caderno1.txt")
OUT = os.path.join(BASE, "intermediario", "enamed2025_caderno1.json")

# Gabarito oficial definitivo (Caderno 01). None = anulada/excluída.
GAB = {
    1:"A",2:None,3:"A",4:"D",5:"C",6:"B",7:None,8:"B",9:None,10:None,
    11:None,12:"D",13:"C",14:"B",15:"A",16:"B",17:"D",18:"D",19:"D",20:"C",
    21:"A",22:"A",23:"B",24:"D",25:"A",26:"C",27:"D",28:"B",29:"A",30:"C",
    31:"B",32:"D",33:"C",34:"B",35:"D",36:"C",37:"D",38:"D",39:"D",40:None,
    41:"C",42:"D",43:None,44:"B",45:"B",46:"C",47:"C",48:"D",49:"B",50:"C",
    51:"C",52:"A",53:"C",54:"C",55:"A",56:"D",57:"D",58:"A",59:"B",60:"C",
    61:"A",62:"B",63:"B",64:"D",65:"A",66:"A",67:"C",68:"B",69:"C",70:"B",
    71:"B",72:"A",73:"C",74:"A",75:"A",76:None,77:"B",78:"D",79:"B",80:"A",
    81:"D",82:"D",83:"B",84:"C",85:"B",86:"D",87:"B",88:None,89:"A",90:"C",
    91:"B",92:"A",93:"C",94:"A",95:"B",96:"D",97:"C",98:"C",99:"A",100:None,
}

IMG_HINT = re.compile(r"figura|imagem|eletrocardiograma|ecg|radiograf|tomograf|"
                      r"abaixo|a seguir apresentad|conforme (o|a) (figura|imagem|"
                      r"gráfico|quadro|esquema)|observe|ilustra", re.I)


DEFAULT_GUTTER = 76  # fallback quando o corredor é fraco (páginas cheias)


def detect_gutter(page_lines):
    """Encontra a coluna do 'corredor' vertical de espaços entre as 2 colunas.
    Procura um canal de 3 colunas de espaço presente na maioria das linhas de
    conteúdo; se o sinal for fraco, usa DEFAULT_GUTTER (a página é 2-colunas se
    houver linhas longas o bastante para transbordar o corredor)."""
    content = [ln for ln in page_lines if len(ln.strip()) > 40]
    if len(content) < 5:
        return None
    long_lines = [ln for ln in content if len(ln) > DEFAULT_GUTTER + 8]
    if len(long_lines) < 3:
        return None  # coluna única (capa, instruções)
    best_c, best_score = None, -1
    for c in range(58, 90):
        # canal de 3 colunas de espaço
        score = sum(1 for ln in long_lines
                    if len(ln) > c + 1 and ln[c - 1:c + 2] == "   ")
        if score > best_score:
            best_score, best_c = score, c
    if best_c is not None and best_score >= 0.5 * len(long_lines):
        return best_c
    return DEFAULT_GUTTER


def decolumnize(text):
    """Reconstrói a ordem de leitura (coluna esquerda inteira, depois direita)."""
    pages = re.split(r"-{5,} Page .*?-{5,}", text)
    out = []
    for pg in pages:
        lines = pg.split("\n")
        g = detect_gutter(lines)
        if g is None:
            out.append(pg)  # página de coluna única / capa
            continue
        left = "\n".join(ln[:g].rstrip() for ln in lines)
        right = "\n".join(ln[g:].rstrip() for ln in lines)
        out.append(left + "\n" + right)
    return "\n".join(out)


def norm(s):
    s = s.replace("\xad", "")
    s = re.sub(r"\s+", " ", s).strip()
    # remove marcas de layout que vazam do PDF (área de rascunho, nº de página).
    # Podem aparecer no MEIO do texto quando a de-columnização junta as colunas.
    s = re.sub(r"\s*[ÁA]REA\s+(LIVRE|DE\s+RASCUNHO)\s*\d*\s*", " ", s, flags=re.I)
    s = re.sub(r"\s+\d{1,3}$", "", s)  # nº de página solto ao final
    return s.strip()


def parse_alternativas(block):
    """block = texto após 'QUESTÃO n'. Retorna (enunciado, {A..D})."""
    m = re.search(r"\(A\)", block)
    if not m:
        return norm(block), {}
    enun = block[:m.start()]
    rest = block[m.start():]
    alts = {}
    # captura (A)..(D) até a próxima marca ou fim
    pat = re.compile(r"\(([A-D])\)\s*(.*?)(?=\([A-D]\)|$)", re.S)
    for mm in pat.finditer(rest):
        alts[mm.group(1)] = norm(mm.group(2))
    return norm(enun), alts


def main():
    raw = open(SRC, encoding="utf-8").read()
    linear = decolumnize(raw)
    # isola o corpo das 100 questões (ignora percepção da prova ao final)
    parts = re.split(r"QUEST[ÃA]O\s+(\d+)", linear)
    # parts = [pre, '1', corpo1, '2', corpo2, ...]
    registros = []
    seen = set()
    for i in range(1, len(parts) - 1, 2):
        num = int(parts[i])
        if num in seen or num < 1 or num > 100:
            continue
        corpo = parts[i + 1]
        # corta lixo de rodapé/percepção que porventura tenha vazado
        corpo = re.split(r"QUESTION[ÁA]RIO|PERCEP[ÇC][ÃA]O DA PROVA", corpo)[0]
        enun, alts = parse_alternativas(corpo)
        seen.add(num)
        gab = GAB.get(num)
        letras = sorted(alts.keys())
        rec = {
            "num": num,
            "fonte": "ENAMED 2025 — Caderno 01",
            "enunciado": enun,
            "alternativas": {L: alts.get(L) for L in "ABCD"},
            "gabarito": gab,
            "descartada": gab is None,
            "motivo_descarte": None if gab else "anulada/excluída no gabarito oficial",
            "requer_imagem": bool(IMG_HINT.search(enun)),
            "alternativas_completas": letras == ["A", "B", "C", "D"],
        }
        registros.append(rec)
    registros.sort(key=lambda r: r["num"])

    validas = [r for r in registros if not r["descartada"]]
    incompletas = [r for r in validas if not r["alternativas_completas"]]

    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    json.dump(registros, open(OUT, "w"), ensure_ascii=False, indent=2)

    print(f"Questões parseadas: {len(registros)}/100")
    print(f"Válidas (com gabarito): {len(validas)}")
    print(f"Descartadas (anuladas/excluídas): {len(registros)-len(validas)}")
    print(f"Válidas com alternativas incompletas (revisar): {len(incompletas)} -> "
          f"{[r['num'] for r in incompletas]}")
    print(f"Válidas que referenciam imagem (curadoria): "
          f"{[r['num'] for r in validas if r['requer_imagem']]}")
    faltando = [n for n in range(1, 101) if n not in seen]
    if faltando:
        print(f"!! Questões NÃO encontradas no texto: {faltando}")
    print(f"\nGravado: {OUT}")


if __name__ == "__main__":
    main()
