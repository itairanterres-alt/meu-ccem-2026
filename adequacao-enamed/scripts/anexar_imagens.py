#!/usr/bin/env python3
"""Extrai as figuras reais dos PDFs de origem e as anexa às questões canônicas.

1. Varre os PDFs, separa figuras de elementos decorativos (logos/cabeçalhos são
   idênticos e se repetem em muitas páginas -> descartados por hash).
2. Salva cada figura em `imagens/` e registra em `imagens/manifesto.json`.
3. Insere `imagens_anexadas` (com `alt_text` obrigatório) na questão certa dos
   arquivos canônicos.
4. Re-audita quais questões REFERENCIAM uma figura, separando:
   - resolvidas  -> figura extraída e anexada;
   - ausentes    -> o enunciado cita figura que NÃO existe no PDF de origem.

Uso: python3 adequacao-enamed/scripts/anexar_imagens.py
"""
import hashlib, io, json, os, re
from collections import Counter

from pypdf import PdfReader
from PIL import Image

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
IMGDIR = os.path.join(BASE, "imagens")
MANIFESTO = os.path.join(IMGDIR, "manifesto.json")

DOCS = ["enamed2025_caderno1", "simulado01_2026", "simulado02_2026"]
REP_DECORATIVA = 5   # hash que aparece em >=5 páginas é logo/cabeçalho

# Vínculo figura -> questão, conferido visualmente contra o enunciado.
FIGURAS = {
    ("enamed2025_caderno1", 3): {
        "questao": 5, "canonico": "enamed", "tipo": "dermatologia",
        "legenda": "Lesão cutânea em dorso da mão, um mês após arranhadura de gato.",
        "alt_text": "Fotografia clínica de lesão cutânea: úlcera central recoberta "
                    "por crostas escuras e exsudato, circundada por nódulos e pápulas "
                    "eritemato-violáceas agrupadas, algumas com pequena pústula "
                    "central, distribuídas de forma linear ascendente sobre pele "
                    "íntegra ao redor.",
    },
    ("enamed2025_caderno1", 14): {
        "questao": 53, "canonico": "enamed", "tipo": "tomografia",
        "legenda": "Tomografia computadorizada de crânio, corte axial, sem contraste.",
        "alt_text": "Tomografia de crânio em corte axial, sem contraste, ao nível das "
                    "cisternas da base. Volumosa coleção extra-axial hiperdensa "
                    "(branca) na convexidade do hemisfério esquerdo do paciente "
                    "(à direita na imagem), com efeito de massa e apagamento dos "
                    "sulcos corticais adjacentes; cisternas da base com conteúdo "
                    "hiperdenso e leve desvio das estruturas da linha média para o "
                    "lado oposto. Reprodução em baixa resolução.",
    },
    ("enamed2025_caderno1", 25): {
        "questao": 96, "canonico": "enamed", "tipo": "dermatologia",
        "legenda": "Lesão peniana do paciente, com três meses de evolução.",
        "alt_text": "Fotografia clínica do pênis, com o prepúcio retraído "
                    "manualmente, mostrando lesão ulcerada na glande e no sulco "
                    "balanoprepucial, de bordas elevadas e endurecidas, limites bem "
                    "definidos e fundo irregular de aspecto granuloso e brilhante, "
                    "sem secreção purulenta abundante. Imagem em preto e branco.",
    },
    ("simulado02_2026", 2): {
        "questao": 2, "canonico": "simulado", "tipo": "grafico",
        "legenda": "Cobertura de indicadores de saúde materno-infantil por quintil "
                   "de riqueza, 1986–2013.",
        "alt_text": "Gráfico de pontos ligados por linhas mostrando a cobertura (%) "
                    "de quatro indicadores de saúde materno-infantil — uso de "
                    "anticoncepcionais modernos, ao menos uma consulta de pré-natal, "
                    "quatro ou mais consultas de pré-natal e primeira consulta no "
                    "primeiro trimestre — nos anos de 1986, 1996, 2006 e 2013, "
                    "segundo quintis de riqueza (Q1 mais pobres a Q5 mais ricos). "
                    "Ao longo do tempo a cobertura sobe e a distância entre os "
                    "quintis diminui, com aproximação dos mais pobres aos mais ricos.",
    },
    ("simulado02_2026", 16): {
        "questao": 41, "canonico": "simulado", "tipo": "esquema",
        "legenda": "Genograma e ecomapa elaborados pela equipe de Saúde da Família. "
                   "NASF – Núcleo Ampliado de Saúde da Família; Amb. – Ambulatório; "
                   "USF – Unidade de Saúde da Família.",
        "alt_text": "Genograma com ecomapa. No círculo do domicílio: homem de 72 "
                    "anos (quadrado) com HAS e HPB, unido a mulher de 68 anos "
                    "(círculo) com depressão; abaixo, membro de 33 anos com "
                    "drogadição e outro de 32 anos. As ligações com o de 33 anos "
                    "são linhas em ziguezague (relação conflituosa). Vínculos "
                    "externos: Ambulatório de Urologia ligado ao homem de 72 anos; "
                    "Vizinhos por linha dupla; Igreja com seta espessa junto à "
                    "mulher de 68 anos; e USF, ligada ao NASF, com seta para o "
                    "domicílio.",
    },
    ("simulado02_2026", 19): {
        "questao": 47, "canonico": "simulado", "tipo": "outro",
        "legenda": "Charge de Duke. Jornal O Tempo, edição de 21 jan. 2013.",
        "alt_text": "Charge em preto e branco: longa fila de pessoas à entrada de um "
                    "posto com a placa 'SUS'. Uma pessoa na fila pergunta: 'Mas, se "
                    "você não tem nada, por que tá na fila do SUS?'. Outra responde: "
                    "'É que, atééééé eu ser atendido, é provável que eu fique "
                    "doente!'.",
        "creditos": "Charge de Duke — Jornal O Tempo, 21 jan. 2013. "
                    "Disponível em: otempo.com.br/charges. Acesso em 30 abr. 2023.",
    },
}

# Referência explícita a material visual no enunciado. Precisa ser restritivo:
# 'quadro clínico', 'figuras de autoridade' e 'configura-se' NÃO são imagens
# (em 'configura', 'figura' não está em fronteira de palavra).
REF_VISUAL = re.compile(
    r"\bfigura\s+(a\s+seguir|abaixo|acima|\d)|"
    r"\b(na|da|à|conforme\s+a|segundo\s+a)\s+figura\b|"
    r"\bfotografia|\bcharge\b|\bgenograma\b|\becomapa\b|"
    r"\b(imagem|gráfico|grafico|esquema|tabela|fluxograma)\s+(a\s+seguir|abaixo|acima)|"
    r"\bobserve\s+(a|o)\s+(imagem|figura|gráfico|charge|esquema)|"
    r"\b(gráfico|imagem|figura)\s+(a\s+seguir\s+)?(demonstra|apresenta|mostra)|"
    r"\ba\s+seguir\s+apresentad", re.I)


def inventariar():
    """Devolve {(doc, pagina): bytes} apenas das figuras (não decorativas)."""
    todas = []
    for doc in DOCS:
        caminho = os.path.join(BASE, "fontes", doc + ".pdf")
        if not os.path.exists(caminho):
            continue
        r = PdfReader(caminho)
        for pi, pg in enumerate(r.pages, 1):
            for im in pg.images:
                todas.append({"doc": doc, "pagina": pi, "data": im.data,
                              "hash": hashlib.md5(im.data).hexdigest()[:10]})
    reps = Counter(i["hash"] for i in todas)
    return todas, reps


def main():
    os.makedirs(IMGDIR, exist_ok=True)
    todas, reps = inventariar()
    decorativas = {h for h, n in reps.items() if n >= REP_DECORATIVA}

    manifesto, salvas = [], {}
    for chave, meta in FIGURAS.items():
        doc, pagina = chave
        cands = [i for i in todas
                 if i["doc"] == doc and i["pagina"] == pagina
                 and i["hash"] not in decorativas]
        # a figura é a maior imagem não decorativa da página
        cands.sort(key=lambda i: len(i["data"]), reverse=True)
        if not cands:
            print(f"  !! nenhuma figura em {doc} p{pagina}")
            continue
        img_bytes = cands[0]["data"]
        img = Image.open(io.BytesIO(img_bytes))
        if img.mode not in ("RGB", "L"):
            img = img.convert("RGB")
        id_imagem = f"med_unidavi_img_{doc}_q{meta['questao']:02d}"
        arquivo = f"{id_imagem}.png"
        img.save(os.path.join(IMGDIR, arquivo))
        registro = {
            "id_imagem": id_imagem, "arquivo": arquivo,
            "origem_documento": doc, "origem_pagina": pagina,
            "questao_origem": meta["questao"], "canonico": meta["canonico"],
            "largura": img.width, "altura": img.height,
            "tipo": meta["tipo"], "legenda": meta["legenda"],
            "alt_text": meta["alt_text"],
            "creditos": meta.get("creditos"),
        }
        manifesto.append(registro)
        chave_q = (f"{doc}_q{meta['questao']:02d}" if meta["canonico"] == "simulado"
                   else ("enamed", meta["questao"]))
        salvas[chave_q] = registro
        print(f"  figura -> {arquivo}  ({img.width}x{img.height})  "
              f"[{meta['canonico']} q{meta['questao']}]")

    json.dump(manifesto, open(MANIFESTO, "w"), ensure_ascii=False, indent=2)

    # --- anexa nos canônicos e re-audita as referências visuais ---
    alvos = [("enamed", "enamed2025_caderno1.canonico.json"),
             ("simulado", "simulados2026.canonico.json")]
    resolvidas, ausentes = [], []
    for tag, arq in alvos:
        caminho = os.path.join(BASE, "canonico", arq)
        if not os.path.exists(caminho):
            continue
        qs = json.load(open(caminho, encoding="utf-8"))
        for q in qs:
            p = q["_proveniencia"]
            num = p["questao_original"]
            chave_q = p["id_origem"] if tag == "simulado" else ("enamed", num)
            reg = salvas.get(chave_q)
            texto = (q.get("texto_base") or "") + " " + q["enunciado"]
            cita = bool(REF_VISUAL.search(texto))
            if reg:
                item = {
                    "id_imagem": reg["id_imagem"],
                    "posicao": "texto_base" if q.get("texto_base") else "enunciado",
                    "ordem": 1,
                    "tipo": reg["tipo"],
                    "legenda": reg["legenda"],
                    "alt_text": reg["alt_text"],
                }
                if reg.get("creditos"):
                    item["creditos_imagem"] = reg["creditos"]
                q["imagens_anexadas"] = [item]
                p["imagem_status"] = "anexada"
                resolvidas.append(p.get("id_origem") or f"enamed q{num}")
            else:
                p["imagem_status"] = "ausente_na_origem" if cita else "nao_requer"
                if cita:
                    ausentes.append(p.get("id_origem") or f"enamed q{num}")
            p["requer_imagem"] = cita or bool(reg)
        json.dump(qs, open(caminho, "w"), ensure_ascii=False, indent=2)

    print(f"\nImagens anexadas ({len(resolvidas)}): {resolvidas}")
    print(f"Citam figura AUSENTE do PDF de origem ({len(ausentes)}): {ausentes}")
    print(f"Manifesto: {MANIFESTO}")


if __name__ == "__main__":
    main()
