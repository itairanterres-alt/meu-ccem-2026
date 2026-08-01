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


def ler_paragrafos(path):
    """Retorna lista de dicts {texto, lista, imagem} na ordem do documento."""
    z = zipfile.ZipFile(path)
    root = ET.fromstring(z.read('word/document.xml'))
    out = []
    for p in root.iter(W + 'p'):
        texto = ''.join(t.text or '' for t in p.iter(W + 't'))
        lista = p.find(W + 'pPr/' + W + 'numPr') is not None
        imagem = p.find('.//' + A + 'blip') is not None
        out.append({'texto': texto.strip(), 'lista': lista, 'imagem': imagem})
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
def _marcador(letra):
    """Regex de um marcador de alternativa: a) A) (a) (A) a. A. a- ..."""
    return re.compile(r'\(?\s*[' + letra + letra.lower() + r']\s*[\)\.\-–:]\s*')


def achar_marcadores(texto):
    """
    Localiza os marcadores A..E ancorando no ultimo 'D' plausivel e caminhando
    para tras (C, B, A) e depois para frente (E). Isso evita casar com um 'A.'
    solto dentro do enunciado.

    Retorna lista [(letra, ini, fim)] ou [] se nao encontrar pelo menos A-C.
    """
    for ancora in ('D', 'C'):
        cands = [m for m in _marcador(ancora).finditer(texto)]
        for m_anc in reversed(cands):
            posicoes = {ancora: (m_anc.start(), m_anc.end())}
            ok = True
            # para tras
            limite = m_anc.start()
            for letra in reversed(LETRAS[:LETRAS.index(ancora)]):
                anteriores = [m for m in _marcador(letra).finditer(texto, 0, limite)]
                if not anteriores:
                    ok = False
                    break
                m = anteriores[-1]
                posicoes[letra] = (m.start(), m.end())
                limite = m.start()
            if not ok:
                continue
            # para frente
            limite = m_anc.end()
            for letra in LETRAS[LETRAS.index(ancora) + 1:]:
                m = _marcador(letra).search(texto, limite)
                if not m:
                    break
                posicoes[letra] = (m.start(), m.end())
                limite = m.end()
            encontrados = [(l, posicoes[l][0], posicoes[l][1])
                           for l in LETRAS if l in posicoes]
            if len(encontrados) >= 3:
                return encontrados
    return []


def limpar(s):
    s = re.sub(r'\s+', ' ', s or '').strip()
    return s.strip(' .;')


def separar_enunciado_alternativas(paragrafos):
    """
    paragrafos: lista de dicts (apenas o trecho entre ENUNCIADO e RESPOSTA).
    Retorna (enunciado, {letra: texto|None}, n_alternativas).
    """
    linhas = [p for p in paragrafos if p['texto']]
    texto = '\n'.join(p['texto'] for p in linhas)

    # 1) marcadores literais (a) / A) / (A) / a. ... inclusive concatenados
    marcs = achar_marcadores(texto)
    if marcs:
        enunciado = limpar(texto[:marcs[0][1] - (marcs[0][2] - marcs[0][1])]
                           if False else texto[:marcs[0][1]])
        # recorta o proprio marcador do fim do enunciado
        enunciado = limpar(texto[:marcs[0][1]])
        enunciado = re.sub(r'\(?\s*[Aa]\s*[\)\.\-–:]\s*$', '', enunciado).strip()
        alts = {}
        for i, (letra, ini, fim) in enumerate(marcs):
            prox = marcs[i + 1][1] if i + 1 < len(marcs) else len(texto)
            alts[letra] = limpar(texto[fim:prox])
        return limpar(enunciado), alts, len(marcs)

    # 2) alternativas como itens de lista numerada (sem letra no texto)
    idx_lista = [i for i, p in enumerate(linhas) if p['lista']]
    if len(idx_lista) >= 3:
        primeiro = idx_lista[0]
        itens = [linhas[i]['texto'] for i in idx_lista][:5]
        enunciado = ' '.join(p['texto'] for p in linhas[:primeiro])
        alts = {LETRAS[i]: limpar(t) for i, t in enumerate(itens)}
        return limpar(enunciado), alts, len(itens)

    # 3) nao ha alternativas identificaveis
    return limpar(texto), {}, 0


# --------------------------------------------------------------------------- #
# gabarito
# --------------------------------------------------------------------------- #
def resolver_gabarito(bruto, alternativas):
    """bruto: texto que segue 'RESPOSTA CORRETA:'."""
    if not bruto:
        return None
    t = limpar(bruto)
    m = re.match(r'^(?:LETRA\s*|ALTERNATIVA\s*)?\(?\s*([A-Ea-e])\s*[\)\.\-–:]?\s*$',
                 t, re.IGNORECASE)
    if m:
        return m.group(1).upper()
    # texto da alternativa correta -> casa com a alternativa mais parecida
    alvo = norm(t)
    if alvo:
        for letra, txt in alternativas.items():
            if not txt:
                continue
            a, b = norm(txt), alvo
            if a == b or a.startswith(b[:60]) or b.startswith(a[:60]):
                return letra
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
        if norm(cabeca).startswith('RESPOSTA CORRETA EM NEGRITO'):
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
            trecho = [{'texto': cabeca, 'lista': False, 'imagem': False}] + trecho

        enunciado, alts, n_alt = separar_enunciado_alternativas(trecho)

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
        gabarito = resolver_gabarito(bruto, alts)

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


def main():
    os.makedirs(OUTDIR, exist_ok=True)
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
    print('TOTAL GERAL: %d questoes -> %s' %
          (len(todas), os.path.join(OUTDIR, 'questoes_docx.json')))


if __name__ == '__main__':
    main()
