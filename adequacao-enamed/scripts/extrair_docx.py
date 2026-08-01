#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Extrai questoes de multipla escolha dos .docx do modelo NAPISUL / Teste de Progresso
(ABEM) baixados em adequacao-enamed/fontes/ e gera
adequacao-enamed/intermediario/questoes_docx.json.

Sem dependencias externas: zipfile + xml.etree.ElementTree sobre word/document.xml.

Estrutura de cada bloco no .docx (modelo de ficha NAPISUL):

    Nucleo de Apoio Pedagogico Interinstitucional II - NAPISUL II
    TESTE DE PROGRESSO
    INSTITUICAO (SIGLA):            <valor>
    AREA DO CONHECIMENTO - CONTEUDO - AUTOR:  <valor>
    ENUNCIADO E ALTERNATIVAS: Resposta correta em negrito
        <enunciado>
        <alternativas>              (a)/A)/(A)/ sem letra, como lista numerada)
    RESPOSTA CORRETA:               <letra> ou <texto da alternativa>
    COMENTARIOS SOBRE A RESPOSTA ...: <justificativa oficial>
    REFERENCIAS BIBLIOGRAFICAS:     <referencias>

O separador de questao usado e o marcador "ENUNCIADO E ALTERNATIVAS".
"""

import base64
import json
import os
import re
import unicodedata
import zipfile
import xml.etree.ElementTree as ET

W = '{http://schemas.openxmlformats.org/wordprocessingml/2006/main}'
A = '{http://schemas.openxmlformats.org/drawingml/2006/main}'
R = '{http://schemas.openxmlformats.org/officeDocument/2006/relationships}'

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FONTES = os.path.join(BASE, 'fontes')
IMGDIR = os.path.join(BASE, 'imagens', 'docx')
OUTDIR = os.path.join(BASE, 'intermediario')

# arquivo -> (slug, nome legivel)
ARQUIVOS = [
    ('questoes_clm.docx', 'questoes_clm', 'Questoes CLM (TPMed 2023 - Clinica Medica)'),
    ('clinica_medica_napisul2_2026.docx', 'clm_napisul2_2026',
     'Clinica Medica - questoes selecionadas - NAPISUL 2 2026'),
    ('questoes_teste_progresso_2023.docx', 'tp_2023',
     'Questoes teste de progresso 2023 (UNIDAVI)'),
]

LETRAS = ['A', 'B', 'C', 'D', 'E']
MARC_ENUNCIADO = 'ENUNCIADO E ALTERNATIVAS'
MARC_RESPOSTA = 'RESPOSTA CORRETA'
MARC_COMENT = 'COMENT'
MARC_REFS = 'REFER'


# --------------------------------------------------------------------------- #
# leitura do docx
# --------------------------------------------------------------------------- #
def norm(s):
    """maiusculiza e remove acentos, para comparar marcadores."""
    s = unicodedata.normalize('NFKD', s or '')
    s = ''.join(c for c in s if not unicodedata.combining(c))
    return s.upper().strip()


def _negrito(run):
    b = run.find(W + 'rPr/' + W + 'b')
    if b is None:
        return False
    return b.get(W + 'val') not in ('0', 'false', 'none')


def ler_paragrafos(path):
    """Retorna lista de dicts {texto, negrito(mascara), lista, imagem}."""
    z = zipfile.ZipFile(path)
    root = ET.fromstring(z.read('word/document.xml'))
    out = []
    for p in root.iter(W + 'p'):
        texto, mascara = '', []
        for r in p.iter(W + 'r'):
            t = ''.join(x.text or '' for x in r.iter(W + 't'))
            if not t:
                continue
            texto += t
            mascara += [_negrito(r)] * len(t)
        # normaliza espacos das bordas mantendo a mascara alinhada
        i, j = 0, len(texto)
        while i < j and texto[i].isspace():
            i += 1
        while j > i and texto[j - 1].isspace():
            j -= 1
        out.append({'texto': texto[i:j], 'negrito': mascara[i:j],
                    'lista': p.find(W + 'pPr/' + W + 'numPr') is not None,
                    'imagem': p.find('.//' + A + 'blip') is not None})
    return out


def extrair_imagens(path, slug):
    """Salva word/media/* em imagens/docx/<slug>/. Retorna lista de nomes."""
    z = zipfile.ZipFile(path)
    medias = [n for n in z.namelist() if n.startswith('word/media/')]
    if not medias:
        return []
    destino = os.path.join(IMGDIR, slug)
    os.makedirs(destino, exist_ok=True)
    nomes = []
    for n in medias:
        nome = os.path.basename(n)
        with open(os.path.join(destino, nome), 'wb') as fh:
            fh.write(z.read(n))
        nomes.append(nome)
    return nomes


# --------------------------------------------------------------------------- #
# alternativas
# --------------------------------------------------------------------------- #
def _marcador(letra, modo):
    """
    Regex de um marcador de alternativa.

    modo 'estrito': o marcador comeca a linha (caso normal, uma alternativa
        por paragrafo) e aceita ')' '.' '-' ':' como delimitador.
    modo 'frouxo': o marcador pode estar colado ao texto anterior (alternativas
        concatenadas num unico paragrafo) mas so aceita ')', para nao casar com
        o 'a.' final de palavras como "psoriasica.".
    """
    par = '[' + letra + letra.lower() + ']'
    if modo == 'estrito':
        # o marcador nao pode estar colado a uma letra/digito (evita casar com
        # o "a." final de "psoriasica."), mas pode vir apos pontuacao: "...?(a)"
        return re.compile(r'(?:^|(?<=[^0-9A-Za-z\u00c0-\u024f]))\(?\s*' + par +
                          r'\s*[\)\.\-–:]\s*')
    return re.compile(r'\(?\s*' + par + r'\s*\)\s*')


def _varrer(texto, modo):
    """Ancora no ultimo 'D' (ou 'C') plausivel e caminha para tras e p/ frente."""
    for ancora in ('D', 'C'):
        cands = list(_marcador(ancora, modo).finditer(texto))
        for m_anc in reversed(cands):
            posicoes = {ancora: (m_anc.start(), m_anc.end())}
            ok = True
            limite = m_anc.start()
            for letra in reversed(LETRAS[:LETRAS.index(ancora)]):
                anteriores = list(_marcador(letra, modo).finditer(texto, 0, limite))
                if not anteriores:
                    # aceita a sequencia sem 'A' (alternativa A sem marcador no
                    # texto, ex.: "<texto A>B) <texto B>"); nunca sem 'B'
                    ok = (letra == 'A' and 'B' in posicoes)
                    break
                m = anteriores[-1]
                posicoes[letra] = (m.start(), m.end())
                limite = m.start()
            if not ok:
                continue
            limite = m_anc.end()
            for letra in LETRAS[LETRAS.index(ancora) + 1:]:
                m = (_marcador(letra, modo).search(texto, limite) or
                     _marcador(letra, 'frouxo').search(texto, limite))
                if not m:
                    break
                posicoes[letra] = (m.start(), m.end())
                limite = m.end()
            encontrados = [(l, posicoes[l][0], posicoes[l][1])
                           for l in LETRAS if l in posicoes]
            if len(encontrados) >= 3:
                return encontrados
    return []


def achar_marcadores(texto):
    """
    Retorna lista [(letra, ini, fim)] ou [] se nao encontrar pelo menos A-C.
    Roda os dois modos e fica com o que reconhecer mais alternativas
    (empate: modo estrito, que erra menos).
    """
    est = _varrer(texto, 'estrito')
    fro = _varrer(texto, 'frouxo')
    if len(fro) > len(est):
        return fro
    return est


def limpar(s):
    s = re.sub(r'\s+', ' ', s or '').strip()
    return s.strip(' .;')


def _grupos_de_lista(linhas):
    """Retorna [(ini, fim)] dos blocos contiguos de itens de lista."""
    grupos, atual = [], None
    for i, p in enumerate(linhas):
        if p['lista']:
            if atual is None:
                atual = [i, i + 1]
            else:
                atual[1] = i + 1
        elif atual is not None:
            grupos.append(tuple(atual))
            atual = None
    if atual is not None:
        grupos.append(tuple(atual))
    return grupos


def separar_enunciado_alternativas(paragrafos):
    """
    paragrafos: trecho entre o marcador ENUNCIADO e RESPOSTA CORRETA.
    Retorna (enunciado, {letra: texto|None}, n_alternativas, {letra: frac_negrito}).
    """
    linhas = [p for p in paragrafos if p['texto']]
    texto = '\n'.join(p['texto'] for p in linhas)
    mascara = []
    for k, p in enumerate(linhas):
        if k:
            mascara.append(False)
        mascara += p['negrito']

    def frac_negrito(ini, fim):
        trecho = mascara[ini:fim]
        util = [b for b, c in zip(trecho, texto[ini:fim]) if not c.isspace()]
        return (sum(util) / len(util)) if util else 0.0

    # 1) marcadores literais: a) A) (A) a. ... inclusive concatenados
    marcs = achar_marcadores(texto)
    if marcs:
        if marcs[0][0] != 'A':
            # alternativa A sem marcador: comeca no inicio da linha do marcador B
            ini_linha = texto.rfind('\n', 0, marcs[0][1]) + 1
            marcs = [('A', ini_linha, ini_linha)] + marcs
        alts, negr = {}, {}
        for i, (letra, ini, fim) in enumerate(marcs):
            prox = marcs[i + 1][1] if i + 1 < len(marcs) else len(texto)
            alts[letra] = limpar(texto[fim:prox])
            negr[letra] = frac_negrito(fim, prox)
        enunciado = re.sub(r'\(?\s*[Aa]\s*[\)\.\-–:]\s*$', '',
                           limpar(texto[:marcs[0][1]])).strip()
        return limpar(enunciado), alts, len(marcs), negr

    # 2) alternativas como itens de lista numerada (sem letra no texto).
    #    Usa o ULTIMO bloco contiguo de itens de lista com 3 a 5 itens, pois
    #    listas anteriores costumam ser exames/achados do proprio enunciado.
    grupos = [g for g in _grupos_de_lista(linhas) if 3 <= (g[1] - g[0]) <= 5]
    if grupos:
        ini, fim = grupos[-1]
        itens = linhas[ini:fim]
        alts = {LETRAS[i]: limpar(p['texto']) for i, p in enumerate(itens)}
        negr = {}
        for i, p in enumerate(itens):
            util = [b for b, c in zip(p['negrito'], p['texto']) if not c.isspace()]
            negr[LETRAS[i]] = (sum(util) / len(util)) if util else 0.0
        enunciado = ' '.join(p['texto'] for p in linhas[:ini])
        return limpar(enunciado), alts, len(itens), negr

    # 3) nao ha alternativas identificaveis
    return limpar(texto), {}, 0, {}


# --------------------------------------------------------------------------- #
# gabarito
# --------------------------------------------------------------------------- #
def resolver_gabarito(bruto, alternativas, negrito):
    """
    bruto: texto que segue 'RESPOSTA CORRETA:'.
    1) letra explicita  2) texto igual/parecido ao de uma alternativa
    3) alternativa marcada em negrito (o modelo pede "resposta correta em negrito")
    """
    t = limpar(bruto or '')
    for _ in range(3):
        t = re.sub(r'^(RESPOSTA\s+CORRETA|GABARITO|CORRETA|CORRETO|LETRA|ALTERNATIVA)'
                   r'\s*[:\-–]?\s*', '', t, flags=re.IGNORECASE).strip()
    t = t.strip('“”"\'`\u00ab\u00bb ').strip()
    t = re.sub(r'^(LETRA|ALTERNATIVA)\s+', '', t, flags=re.IGNORECASE).strip()

    # 1) letra explicita ("A", "A)", "(A)", "A) texto da alternativa")
    m = re.match(r'^\(?\s*([A-Ea-e])\s*[\)\.\-–:]?\s*(?:$|\s)', t)
    if m and (len(t) <= 3 or re.match(r'^\(?\s*[A-Ea-e]\s*[\)\.\-–:]', t)):
        return m.group(1).upper()

    # 2) casamento com o texto de uma alternativa
    if t:
        import difflib
        alvo = norm(t)
        melhor, escore = None, 0.0
        for letra, txt in alternativas.items():
            if not txt:
                continue
            a = norm(txt)
            r = difflib.SequenceMatcher(None, a[:200], alvo[:200]).ratio()
            if a.startswith(alvo[:50]) or alvo.startswith(a[:50]):
                r = max(r, 0.9)
            if r > escore:
                melhor, escore = letra, r
        if escore >= 0.75:
            return melhor

    # 3) negrito
    if negrito:
        marcadas = [l for l, f in negrito.items() if f >= 0.6 and alternativas.get(l)]
        if len(marcadas) == 1:
            return marcadas[0]
    return None


# --------------------------------------------------------------------------- #
# parser de um arquivo
# --------------------------------------------------------------------------- #
def extrair_arquivo(nome_arq, slug, fonte):
    path = os.path.join(FONTES, nome_arq)
    ps = ler_paragrafos(path)
    inicios = [i for i, p in enumerate(ps)
               if norm(p['texto']).startswith(MARC_ENUNCIADO)]
    questoes = []
    for k, i in enumerate(inicios):
        fim = inicios[k + 1] if k + 1 < len(inicios) else len(ps)
        bloco = ps[i + 1:fim]

        # o proprio paragrafo do marcador pode trazer texto extra apos ':'
        resto_marcador = ps[i]['texto'].split(':', 1)
        cabeca = resto_marcador[1].strip() if len(resto_marcador) > 1 else ''
        if norm(re.sub(r'\s+', ' ', cabeca)).startswith('RESPOSTA CORRETA EM NEGRITO'):
            cabeca = ''

        def acha(marc, desde=0):
            for j in range(desde, len(bloco)):
                if norm(bloco[j]['texto']).startswith(marc):
                    return j
            return None

        j_resp = acha(MARC_RESPOSTA)
        j_com = acha(MARC_COMENT, (j_resp or 0))
        j_ref = acha(MARC_REFS, (j_com if j_com is not None else (j_resp or 0)))

        corte_enunciado = j_resp if j_resp is not None else (
            j_com if j_com is not None else (j_ref if j_ref is not None else len(bloco)))
        trecho = bloco[:corte_enunciado]
        if cabeca:
            trecho = [{'texto': cabeca, 'negrito': [False] * len(cabeca),
                       'lista': False, 'imagem': False}] + trecho

        enunciado, alts, n_alt, negr = separar_enunciado_alternativas(trecho)

        # ---- resposta correta -------------------------------------------- #
        bruto = ''
        if j_resp is not None:
            partes = bloco[j_resp]['texto'].split(':', 1)
            if len(partes) > 1 and partes[1].strip():
                bruto = partes[1].strip()
            else:
                lim = j_com if j_com is not None else len(bloco)
                seguintes = [b['texto'] for b in bloco[j_resp + 1:lim] if b['texto']]
                bruto = seguintes[0] if seguintes else ''
        gabarito = resolver_gabarito(bruto, alts, negr)

        # ---- justificativa ------------------------------------------------ #
        justificativa = None
        if j_com is not None:
            lim = j_ref if (j_ref is not None and j_ref > j_com) else len(bloco)
            partes = bloco[j_com]['texto'].split(':', 1)
            pedacos = []
            if len(partes) > 1 and partes[1].strip():
                pedacos.append(partes[1].strip())
            pedacos += [b['texto'] for b in bloco[j_com + 1:lim] if b['texto']]
            texto = ' '.join(pedacos).strip()
            texto = re.sub(r'^COMENTARIOS?\s*[-:]\s*', '', texto, flags=re.IGNORECASE)
            justificativa = limpar(texto) or None

        requer_imagem = any(b['imagem'] for b in bloco[:corte_enunciado])

        questoes.append({
            'id_origem': '%s_q%03d' % (slug, k + 1),
            'fonte': fonte,
            'num': k + 1,
            'enunciado': enunciado,
            'alternativas': {l: alts.get(l) for l in LETRAS},
            'gabarito': gabarito,
            'justificativa_oficial': justificativa,
            'n_alternativas': n_alt,
            'requer_imagem': requer_imagem,
        })
    return questoes


# arquivo de metodologia (NAO e banco de questoes; so extraimos as imagens)
METODOLOGIA = ('resumo_tp_elaboracao_questoes.docx', 'resumo_tp_metodologia')


def main():
    os.makedirs(OUTDIR, exist_ok=True)
    imgs_met = extrair_imagens(os.path.join(FONTES, METODOLOGIA[0]), METODOLOGIA[1])
    todas = []
    relatorio = []
    for nome_arq, slug, fonte in ARQUIVOS:
        imgs = extrair_imagens(os.path.join(FONTES, nome_arq), slug)
        qs = extrair_arquivo(nome_arq, slug, fonte)
        todas += qs
        com_gab = sum(1 for q in qs if q['gabarito'])
        faltando = [q for q in qs if q['n_alternativas'] < 4]
        relatorio.append((nome_arq, slug, len(qs), com_gab, faltando, imgs, qs))

    with open(os.path.join(OUTDIR, 'questoes_docx.json'), 'w', encoding='utf-8') as fh:
        json.dump(todas, fh, ensure_ascii=False, indent=2)

    print('=' * 78)
    for nome_arq, slug, n, com_gab, faltando, imgs, qs in relatorio:
        print('ARQUIVO: %s  (slug=%s)' % (nome_arq, slug))
        print('  questoes ............ %d' % n)
        print('  com gabarito ........ %d  (sem: %d)' % (com_gab, n - com_gab))
        print('  alternativas < 4 .... %d  -> %s' %
              (len(faltando), [q['num'] for q in faltando]))
        print('  com >= 5 alternativas %d' % sum(1 for q in qs if q['n_alternativas'] >= 5))
        print('  requer imagem ....... %d  -> %s' %
              (sum(1 for q in qs if q['requer_imagem']),
               [q['num'] for q in qs if q['requer_imagem']]))
        print('  imagens embutidas ... %d %s' % (len(imgs), imgs))
        nums = [q['num'] for q in qs]
        print('  numeracao continua .. %s (1..%d)' %
              (nums == list(range(1, n + 1)), n))
        amostra = next((q for q in qs if q['n_alternativas'] >= 4 and q['gabarito']), qs[0])
        print('  --- amostra (q%d) ---' % amostra['num'])
        print('  enunciado: %s' % amostra['enunciado'][:400])
        for l in LETRAS:
            if amostra['alternativas'][l]:
                print('     %s) %s' % (l, amostra['alternativas'][l][:160]))
        print('     gabarito: %s' % amostra['gabarito'])
        print('     justificativa: %s' % (amostra['justificativa_oficial'] or '')[:220])
        print('-' * 78)
    print('ARQUIVO: %s  (slug=%s)' % METODOLOGIA)
    print('  material de METODOLOGIA (recomendacoes de elaboracao de itens)')
    print('  -> nao e banco de questoes; nenhuma questao extraida')
    print('  imagens embutidas ... %d %s (logo do cabecalho)' %
          (len(imgs_met), imgs_met))
    print('-' * 78)
    print('TOTAL GERAL: %d questoes -> %s' %
          (len(todas), os.path.join(OUTDIR, 'questoes_docx.json')))


if __name__ == '__main__':
    main()
