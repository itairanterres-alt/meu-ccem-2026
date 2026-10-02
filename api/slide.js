/* ============================================================
   Meu CCEM 2026 — "Perguntar sobre este slide" (Fase 1)
   ------------------------------------------------------------
   POST /api/slide { acao, imagem, pergunta?, sessaoId?, historico?,
                     artigo?, aprofundar?, userId }

   Ações (sempre por toque do congressista, nunca automáticas):
     explicar · raciocinio · concluir · leitura_critica · tabela ·
     fluxograma · transcrever · perguntas · livre   → Claude Sonnet
     organizar (título, texto e palavras-chave p/ busca) → Claude Haiku

   Toda explicação vem em três blocos — No slide / Explicação
   adicional / Limites da interpretação — e a fonte é declarada pelo
   servidor (só a foto, ou a foto e o resumo do artigo no PubMed).
   A foto é processada em memória e descartada; nada é gravado.
   ============================================================ */
const C = require('./_comum');

const DADOS = C.carregarDados();
const LIMITE_EXPLICACOES_DIA = 15;
const LIMITE_ORGANIZAR_DIA = 40;
const DIA = 86400000;

const ACOES = {
  explicar:        'Explique o gráfico ou a tabela do slide: o que cada eixo, grupo, linha ou coluna representa, como ler e qual o resultado principal.',
  raciocinio:      'Explique o raciocínio por trás do slide: fisiopatologia, mecanismo ou lógica clínica que sustenta o que está apresentado.',
  concluir:        'Diga o que este resultado permite concluir e, com o mesmo peso, o que ele NÃO permite concluir.',
  leitura_critica: 'Faça a leitura crítica do estudo mostrado: tipo de estudo, população, intervenção/comparador, desfecho primário ou secundário, desfecho duro ou substituto. Traduza o efeito em números absolutos mostrando a conta passo a passo (ex.: HR 0,80 → redução relativa de 20%; se houver risco basal no slide, redução absoluta e NNT = 1/RAR). Se faltar o risco basal, diga que não dá para calcular NNT. Liste as limitações visíveis.',
  tabela:          'Transforme a tabela do slide em texto organizado: uma linha por item em "itens", preservando critérios, classificações, valores e unidades exatamente como aparecem.',
  fluxograma:      'Reconstrua o fluxograma/algoritmo do slide como passo a passo em "itens", na ordem das decisões, preservando condições, pontos de corte e ressalvas. Não complete etapas que não aparecem.',
  transcrever:     'Transcreva o texto do slide em "texto_extraido" (integral, na ordem de leitura) e explique cada sigla em "siglas". Em "explicacao", só uma frase de contexto.',
  perguntas:       'Sugira em "itens" 2 ou 3 perguntas objetivas e respeitosas que o congressista poderia fazer ao palestrante sobre este slide no momento do debate.',
  livre:           'Responda à pergunta do congressista sobre este slide.',
};

const SISTEMA = `
Você é o Assistente CCEM, do app Meu CCEM 2026 (12º Congresso Catarinense de Endocrinologia e Metabologia, SBEM-SC, Joinville). Quem usa são endocrinologistas, residentes e estudantes de medicina, durante o congresso. Você recebe a FOTO de um slide e uma tarefa.

Formato da resposta (JSON):
- "titulo": título curto e descritivo do slide (até 80 caracteres), para o congressista achar a foto depois.
- "no_slide": o que está efetivamente visível na imagem e é relevante para a tarefa. Só o que foi lido. Se algo estiver ilegível, diga.
- "explicacao": a explicação adicional — conceitos necessários para compreender o slide. Deixe claro que não está no slide.
- "limites": o que NÃO pode ser concluído apenas com este slide (ex.: um gráfico não revela o desenho do estudo, o tamanho da amostra ou o seguimento, se não aparecem).
- "itens": lista quando a tarefa pedir (passos, linhas de tabela, perguntas); senão, vazia.
- "siglas": siglas do slide e seu significado, quando úteis; senão, vazia.
- "referencia": a referência bibliográfica SOMENTE se estiver visível no slide, copiada como aparece; senão, "".
- "palavras_chave": 3 a 8 termos para busca (português e, se o slide estiver em inglês, também os termos originais).
- "texto_extraido": o texto do slide (até 1.200 caracteres; integral apenas na tarefa de transcrição).

Regras:
- Português do Brasil, linguagem técnica médica, direta. Sem emojis.
- Nunca invente números, desfechos, autores, doses ou referências. Se não estiver no slide, não afirme como se estivesse.
- Contas sempre explícitas, passo a passo, com os números lidos no slide.
- Seja breve: "explicacao" com até 120 palavras, salvo quando pedirem para aprofundar.
- Não discuta caso clínico real de paciente nem dê conduta individual; um caso didático do slide pode ser explicado como conteúdo.
- Se a foto não for um slide ou estiver ilegível, diga isso em "no_slide" e deixe o resto vazio.
- Se receber o resumo de um artigo do PubMed, use-o para contextualizar e diga quando algo vem do resumo, não do slide. Você não leu o texto integral do artigo.
`.trim();

const ESQUEMA = {
  type: 'object',
  properties: {
    titulo: { type: 'string' },
    no_slide: { type: 'string' },
    explicacao: { type: 'string' },
    limites: { type: 'string' },
    itens: { type: 'array', items: { type: 'string' } },
    siglas: { type: 'array', items: { type: 'object', properties: { sigla: { type: 'string' }, significado: { type: 'string' } }, required: ['sigla', 'significado'], additionalProperties: false } },
    referencia: { type: 'string' },
    palavras_chave: { type: 'array', items: { type: 'string' } },
    texto_extraido: { type: 'string' },
  },
  required: ['titulo', 'no_slide', 'explicacao', 'limites', 'itens', 'siglas', 'referencia', 'palavras_chave', 'texto_extraido'],
  additionalProperties: false,
};

const SISTEMA_ORGANIZAR = `
Você indexa fotos de slides de um congresso médico de endocrinologia para busca posterior.
Devolva em JSON: "titulo" (até 80 caracteres, descritivo), "texto_extraido" (texto legível do slide, até 1.200 caracteres), "palavras_chave" (3 a 8 termos, em português e nos termos originais se o slide estiver em inglês) e "referencia" (a referência bibliográfica só se estiver visível; senão "").
Não interprete nem explique. Não invente o que não estiver legível. Se não for um slide, "titulo" = "Foto sem texto legível".
Esta orientação existe para que a busca no caderno do congressista encontre a foto depois; seja fiel ao que está escrito.
`.trim();

const ESQUEMA_ORGANIZAR = {
  type: 'object',
  properties: {
    titulo: { type: 'string' },
    texto_extraido: { type: 'string' },
    palavras_chave: { type: 'array', items: { type: 'string' } },
    referencia: { type: 'string' },
  },
  required: ['titulo', 'texto_extraido', 'palavras_chave', 'referencia'],
  additionalProperties: false,
};

function lista(v, maxItens, maxTam) { return (Array.isArray(v) ? v : []).map(x => C.texto(x, maxTam)).filter(Boolean).slice(0, maxItens); }

function limparResposta(r) {
  return {
    titulo: C.texto(r.titulo, 100),
    no_slide: C.texto(r.no_slide, 3000),
    explicacao: C.texto(r.explicacao, 5000),
    limites: C.texto(r.limites, 2000),
    itens: lista(r.itens, 30, 600),
    siglas: (Array.isArray(r.siglas) ? r.siglas : []).slice(0, 30)
      .map(s => ({ sigla: C.texto(s && s.sigla, 40), significado: C.texto(s && s.significado, 300) })).filter(s => s.sigla),
    referencia: C.texto(r.referencia, 500),
    palavras_chave: lista(r.palavras_chave, 10, 60),
    texto_extraido: C.texto(r.texto_extraido, 6000),
  };
}

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return res.status(405).json({ erro: 'metodo' }); }
  if (!process.env.ANTHROPIC_API_KEY) return res.status(503).json({ erro: 'indisponivel' });

  const corpo = C.lerCorpo(req);
  if (!corpo) return res.status(400).json({ erro: 'pedido' });
  const acao = corpo.acao;
  if (acao !== 'organizar' && !ACOES[acao]) return res.status(400).json({ erro: 'acao' });
  if (!C.imagemValida(corpo.imagem)) return res.status(413).json({ erro: 'imagem' });
  if (acao === 'livre' && !C.texto(corpo.pergunta, 1000)) return res.status(400).json({ erro: 'vazio' });

  const quem = C.quemPede(req, corpo);
  const imagem = { type: 'image', source: { type: 'base64', media_type: 'image/jpeg', data: corpo.imagem } };

  try {
    // ── Organizar para busca: extração simples, no modelo mais barato
    if (acao === 'organizar') {
      if (!C.dentroDoLimite('org:' + quem, LIMITE_ORGANIZAR_DIA, DIA)) return res.status(429).json({ erro: 'limite' });
      const conteudo = [imagem, { type: 'text', text: 'Indexe este slide.' }];
      let r;
      try {
        r = await C.chamarEstruturado({ funcao: 'organizar', modelo: C.HAIKU, sistema: SISTEMA_ORGANIZAR, conteudo, esquema: ESQUEMA_ORGANIZAR, maxTokens: 900 });
      } catch (e) {
        // Se o modelo barato recusar o formato, tenta uma vez no principal.
        if (!(e instanceof C.Anthropic.BadRequestError)) throw e;
        r = await C.chamarEstruturado({ funcao: 'organizar', modelo: C.SONNET, sistema: SISTEMA_ORGANIZAR, conteudo, esquema: ESQUEMA_ORGANIZAR, maxTokens: 900, esforco: 'low' });
      }
      if (r.recusa) return res.status(200).json({ titulo: 'Foto', texto_extraido: '', palavras_chave: [], referencia: '' });
      return res.status(200).json({
        titulo: C.texto(r.titulo, 100), texto_extraido: C.texto(r.texto_extraido, 1500),
        palavras_chave: lista(r.palavras_chave, 10, 60), referencia: C.texto(r.referencia, 500),
      });
    }

    // ── Perguntas e explicações sobre o slide
    if (!C.dentroDoLimite('slide:' + quem, LIMITE_EXPLICACOES_DIA, DIA)) return res.status(429).json({ erro: 'limite' });
    const sessao = Object.prototype.hasOwnProperty.call(DADOS.SESSOES, corpo.sessaoId) ? DADOS.SESSOES[corpo.sessaoId] : null;
    let pedido = `Tarefa: ${ACOES[acao]}`;
    if (acao === 'livre') pedido += `\nPergunta: ${C.texto(corpo.pergunta, 1000)}`;
    if (corpo.aprofundar) pedido += '\nO congressista pediu para APROFUNDAR: "explicacao" pode ter até 350 palavras; acrescente o que a resposta anterior não cobriu.';
    if (sessao) pedido += `\nContexto: foto tirada na sessão "${sessao.badge} · ${sessao.titulo}".${sessao.tipo === 'satelite' ? ' É uma sessão satélite patrocinada.' : ''}`;
    const hist = (Array.isArray(corpo.historico) ? corpo.historico : []).slice(-4)
      .map(h => `- Pergunta anterior: ${C.texto(h && h.pergunta, 300)}\n  Resposta anterior: ${C.texto(h && h.resposta, 1500)}`).join('\n');
    if (hist) pedido += `\nJá conversado sobre este slide:\n${hist}`;
    const art = corpo.artigo && typeof corpo.artigo === 'object' ? corpo.artigo : null;
    const resumo = art ? C.texto(art.resumo, 4000) : '';
    if (resumo) pedido += `\nResumo do artigo citado (PubMed — ${C.texto(art.titulo, 300)}, ${C.texto(art.revista, 100)} ${C.texto(art.ano, 10)}):\n${resumo}`;

    const r = await C.chamarEstruturado({
      funcao: 'slide:' + acao, modelo: C.SONNET, sistema: SISTEMA, esquema: ESQUEMA, esforco: 'low',
      maxTokens: corpo.aprofundar || acao === 'transcrever' || acao === 'leitura_critica' ? 4000 : 2500,
      conteudo: [imagem, { type: 'text', text: pedido }],
    });
    if (r.recusa) return res.status(200).json({ recusa: true, ...limparResposta({ no_slide: 'Não posso ajudar com esse pedido sobre esta imagem.' }), fonte: '' });
    const fonte = resumo
      ? 'Baseado nesta foto e no resumo do artigo no PubMed. O texto integral do artigo não foi lido.'
      : 'Baseado apenas nesta foto.';
    return res.status(200).json({ ...limparResposta(r), fonte });
  } catch (e) {
    return C.responderErro(res, e, 'slide');
  }
};
