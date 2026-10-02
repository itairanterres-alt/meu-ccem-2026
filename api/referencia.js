/* ============================================================
   Meu CCEM 2026 — "Encontrar o artigo citado" (Fase 1)
   ------------------------------------------------------------
   POST /api/referencia { imagem? | texto?, userId }

   1. Lê a referência (da foto, ou do texto corrigido pelo
      congressista) com o modelo mais barato.
   2. Procura no PubMed (E-utilities, gratuito) por PMID, DOI,
      autor+ano+volume+página, título…
   3. Classifica: "confirmada" (identificadores batem), "possivel"
      ou "nao_localizado".
   4. Para os candidatos: resumo (PubMed) e acesso aberto (Unpaywall:
      "PDF disponível" só quando há link efetivo).

   CONTATO_TECNICO_EMAIL (Vercel) identifica o app no PubMed e no
   Unpaywall, como os dois serviços pedem. Sem ele, o PubMed funciona
   e a verificação de PDF aberto fica desligada.
   NCBI_API_KEY (opcional) aumenta o limite de consultas ao PubMed.
   ============================================================ */
const C = require('./_comum');

const LIMITE_DIA = 30;
const DIA = 86400000;
const EMAIL = process.env.CONTATO_TECNICO_EMAIL || '';
const NCBI_KEY = process.env.NCBI_API_KEY || '';
const EUTILS = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/';

const SISTEMA = `
Você extrai referências bibliográficas de slides ou de texto, para busca no PubMed.
Devolva em JSON:
- "encontrada": true só se houver uma referência bibliográfica identificável.
- "texto_lido": a referência como aparece (copiada; se houver várias, a principal).
- "primeiro_autor": sobrenome do primeiro autor (só o sobrenome, sem iniciais).
- "revista": nome ou abreviatura da revista como aparece.
- "ano", "volume", "pagina" (primeira página), "doi", "pmid", "titulo": se visíveis; senão "".
Não complete nem corrija com memória própria: copie apenas o que está escrito. Se a foto não tiver referência, "encontrada": false.
Esta instrução existe para que o app encontre o artigo exato que o palestrante citou.
`.trim();

const ESQUEMA = {
  type: 'object',
  properties: {
    encontrada: { type: 'boolean' }, texto_lido: { type: 'string' }, primeiro_autor: { type: 'string' },
    revista: { type: 'string' }, ano: { type: 'string' }, volume: { type: 'string' }, pagina: { type: 'string' },
    doi: { type: 'string' }, pmid: { type: 'string' }, titulo: { type: 'string' },
  },
  required: ['encontrada', 'texto_lido', 'primeiro_autor', 'revista', 'ano', 'volume', 'pagina', 'doi', 'pmid', 'titulo'],
  additionalProperties: false,
};

const espera = ms => new Promise(r => setTimeout(r, ms));
async function eutils(rota, params) {
  const q = new URLSearchParams({ ...params, tool: 'meu-ccem-2026' });
  if (EMAIL) q.set('email', EMAIL);
  if (NCBI_KEY) q.set('api_key', NCBI_KEY);
  for (let tentativa = 0; tentativa < 3; tentativa++) {
    const r = await fetch(EUTILS + rota + '?' + q, { signal: AbortSignal.timeout(8000) });
    if (r.status === 429) { await espera(400 * (tentativa + 1)); continue; }   // limite do NCBI: 3 consultas/s sem chave
    if (!r.ok) throw new Error('pubmed ' + r.status);
    return rota.startsWith('efetch') ? r.text() : r.json();
  }
  throw new Error('pubmed 429');
}

const norm = s => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
const limpaTermo = s => String(s || '').replace(/["\[\]()]/g, ' ').trim();

async function buscar(termo) {
  const d = await eutils('esearch.fcgi', { db: 'pubmed', term: termo, retmode: 'json', retmax: '5' });
  return (d.esearchresult && d.esearchresult.idlist) || [];
}

/* Estratégias, da mais específica para a mais ampla; para na primeira que encontra. */
async function candidatos(ref) {
  const pmid = (ref.pmid.match(/\d{5,9}/) || [])[0];
  if (pmid) return { ids: [pmid], via: 'pmid' };
  const doi = (ref.doi.match(/10\.\d{4,9}\/\S+/) || [])[0];
  if (doi) { const ids = await buscar(`${doi.replace(/[.,;]$/, '')}[doi]`); if (ids.length) return { ids, via: 'doi' }; }
  const au = limpaTermo(ref.primeiro_autor), ano = (ref.ano.match(/(19|20)\d{2}/) || [])[0] || '';
  const vol = (ref.volume.match(/\d+/) || [])[0] || '', pg = (ref.pagina.match(/[A-Za-z]?\d+/) || [])[0] || '';
  const tentativas = [];
  if (au && ano && vol && pg) tentativas.push(`${au}[1au] AND ${ano}[dp] AND ${vol}[vi] AND ${pg}[pg]`);
  if (au && ano && vol) tentativas.push(`${au}[1au] AND ${ano}[dp] AND ${vol}[vi]`);
  if (ref.titulo) tentativas.push(`${limpaTermo(ref.titulo)}[ti]${ano ? ` AND ${ano}[dp]` : ''}`);
  if (au && ano && ref.revista) tentativas.push(`${au}[1au] AND ${ano}[dp] AND ${limpaTermo(ref.revista)}[ta]`);
  for (const t of tentativas) { const ids = await buscar(t); if (ids.length) return { ids, via: 'busca' }; }
  return { ids: [], via: '' };
}

/* Quantos identificadores da referência lida batem com o artigo. */
function avaliar(ref, a) {
  const doiRef = (ref.doi.match(/10\.\d{4,9}\/\S+/) || [''])[0].replace(/[.,;]$/, '').toLowerCase();
  if (ref.pmid && ref.pmid.includes(a.pmid)) return 'confirmada';
  if (doiRef && a.doi && doiRef === a.doi.toLowerCase()) return 'confirmada';
  const autorOk = !!ref.primeiro_autor && norm(a.autores[0] || '').startsWith(norm(ref.primeiro_autor));
  const anoOk = !!ref.ano && String(a.ano) === (ref.ano.match(/(19|20)\d{2}/) || [''])[0];
  const volOk = !!ref.volume && String(a.volume) === (ref.volume.match(/\d+/) || [''])[0];
  const pgOk = !!ref.pagina && norm(a.paginas).split(' ')[0] === norm((ref.pagina.match(/[A-Za-z]?\d+/) || [''])[0]);
  const titOk = !!ref.titulo && norm(a.titulo).includes(norm(ref.titulo).slice(0, 40));
  if (autorOk && anoOk && volOk && pgOk) return 'confirmada';
  const pontos = [autorOk, anoOk, volOk, pgOk, titOk].filter(Boolean).length;
  return pontos >= 2 ? 'possivel' : 'fraca';
}

async function resumos(ids) {
  if (!ids.length) return {};
  const xml = await eutils('efetch.fcgi', { db: 'pubmed', id: ids.join(','), retmode: 'xml', rettype: 'abstract' });
  const saida = {};
  for (const bloco of xml.split('<PubmedArticle>').slice(1)) {
    const pmid = (bloco.match(/<PMID[^>]*>(\d+)<\/PMID>/) || [])[1];
    const partes = [...bloco.matchAll(/<AbstractText([^>]*)>([\s\S]*?)<\/AbstractText>/g)].map(m => {
      const rotulo = (m[1].match(/Label="([^"]+)"/) || [])[1];
      const txt = m[2].replace(/<[^>]+>/g, '').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#x[0-9a-f]+;/gi, ' ').trim();
      return rotulo ? `${rotulo}: ${txt}` : txt;
    });
    if (pmid) saida[pmid] = C.texto(partes.join('\n'), 4000);
  }
  return saida;
}

async function acessoAberto(doi) {
  if (!EMAIL || !doi) return null;
  try {
    const r = await fetch(`https://api.unpaywall.org/v2/${encodeURIComponent(doi)}?email=${encodeURIComponent(EMAIL)}`, { signal: AbortSignal.timeout(6000) });
    if (!r.ok) return null;
    const d = await r.json();
    const b = d.best_oa_location || {};
    return { pdf: b.url_for_pdf || '', url: b.url || '' };
  } catch (e) { return null; }
}

function limparRef(r) {
  const t = (v, n) => C.texto(v, n);
  return { encontrada: !!r.encontrada, texto_lido: t(r.texto_lido, 600), primeiro_autor: t(r.primeiro_autor, 80), revista: t(r.revista, 150),
           ano: t(r.ano, 10), volume: t(r.volume, 20), pagina: t(r.pagina, 20), doi: t(r.doi, 200), pmid: t(r.pmid, 20), titulo: t(r.titulo, 300) };
}

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return res.status(405).json({ erro: 'metodo' }); }
  if (!process.env.ANTHROPIC_API_KEY) return res.status(503).json({ erro: 'indisponivel' });
  const corpo = C.lerCorpo(req);
  if (!corpo) return res.status(400).json({ erro: 'pedido' });
  const textoRef = C.texto(corpo.texto, 800);
  if (!textoRef && !C.imagemValida(corpo.imagem)) return res.status(400).json({ erro: 'vazio' });
  if (!C.dentroDoLimite('ref:' + C.quemPede(req, corpo), LIMITE_DIA, DIA)) return res.status(429).json({ erro: 'limite' });

  try {
    // 1. Ler a referência
    const conteudo = textoRef
      ? [{ type: 'text', text: `Referência digitada pelo congressista:\n${textoRef}` }]
      : [{ type: 'image', source: { type: 'base64', media_type: 'image/jpeg', data: corpo.imagem } }, { type: 'text', text: 'Extraia a referência bibliográfica visível neste slide.' }];
    let lido;
    try {
      lido = await C.chamarEstruturado({ funcao: 'referencia', modelo: C.HAIKU, sistema: SISTEMA, conteudo, esquema: ESQUEMA, maxTokens: 600 });
    } catch (e) {
      if (!(e instanceof C.Anthropic.BadRequestError)) throw e;
      lido = await C.chamarEstruturado({ funcao: 'referencia', modelo: C.SONNET, sistema: SISTEMA, conteudo, esquema: ESQUEMA, maxTokens: 600, esforco: 'low' });
    }
    const ref = limparRef(lido.recusa ? {} : lido);
    if (textoRef && !ref.texto_lido) ref.texto_lido = textoRef;
    if (!ref.encontrada && !textoRef) return res.status(200).json({ lido: '', nivel: 'sem_referencia', candidatos: [] });

    // 2. PubMed
    let busca;
    try { busca = await candidatos(ref); }
    catch (e) { console.error('referencia: pubmed indisponivel'); return res.status(200).json({ lido: ref.texto_lido, nivel: 'erro_pubmed', candidatos: [] }); }
    if (!busca.ids.length) return res.status(200).json({ lido: ref.texto_lido, nivel: 'nao_localizado', candidatos: [] });

    const sum = await eutils('esummary.fcgi', { db: 'pubmed', id: busca.ids.slice(0, 5).join(','), retmode: 'json' });
    let lista = busca.ids.slice(0, 5).map(id => sum.result && sum.result[id]).filter(Boolean).map(d => {
      const ids = Object.fromEntries((d.articleids || []).map(i => [i.idtype, i.value]));
      return {
        pmid: String(d.uid), titulo: C.texto(d.title, 400).replace(/\.$/, ''), autores: (d.authors || []).map(a => a.name).slice(0, 6),
        revista: C.texto(d.source, 150), ano: (String(d.pubdate || '').match(/\d{4}/) || [''])[0], volume: C.texto(d.volume, 20),
        paginas: C.texto(d.pages, 30), doi: ids.doi || '', pmcid: ids.pmc || '',
      };
    });
    lista.forEach(a => { a.correspondencia = busca.via === 'pmid' || busca.via === 'doi' ? 'confirmada' : avaliar(ref, a); });
    const confirmados = lista.filter(a => a.correspondencia === 'confirmada');
    const possiveis = lista.filter(a => a.correspondencia === 'possivel');
    const nivel = confirmados.length ? 'confirmada' : possiveis.length ? 'possivel' : 'nao_localizado';
    lista = (confirmados.length ? confirmados.slice(0, 1) : possiveis.slice(0, 3));

    // 3. Resumo e acesso aberto dos que serão mostrados
    const abs = await resumos(lista.map(a => a.pmid)).catch(() => ({}));
    const oa = await Promise.all(lista.map(a => acessoAberto(a.doi)));
    lista.forEach((a, i) => {
      a.resumo = abs[a.pmid] || '';
      a.links = {
        pubmed: `https://pubmed.ncbi.nlm.nih.gov/${a.pmid}/`,
        revista: a.doi ? `https://doi.org/${a.doi}` : '',
        pmc: a.pmcid ? `https://pmc.ncbi.nlm.nih.gov/articles/${a.pmcid}/` : '',
        pdf: (oa[i] && oa[i].pdf) || '',
        aberto: (oa[i] && oa[i].url) || '',
      };
    });
    return res.status(200).json({ lido: ref.texto_lido, nivel, candidatos: lista });
  } catch (e) {
    return C.responderErro(res, e, 'referencia');
  }
};
