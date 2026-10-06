/* ============================================================
   Meu CCEM 2026 — Assistente CCEM (função serverless do Vercel)
   ------------------------------------------------------------
   POST /api/assistente  { texto, imagem?, sessaoId?, agora?, historico?, userId }

   - A chave vem de ANTHROPIC_API_KEY (cadastrada no Vercel, só em
     Preview). Nunca escrever chave neste arquivo: o repositório é
     público. Sem a chave, responde 503 e o app mostra "Assistente em
     fase de testes — disponível em breve".
   - Modelo: ANTHROPIC_MODEL, padrão claude-sonnet-5-5.
   - Privacidade: a foto e a pergunta são processadas em memória e
     descartadas. Nada é gravado: nem disco, nem Blob, nem log. Os
     logs de erro registram só o tipo do erro, nunca o conteúdo.
   - Limite: ~20 chamadas por usuário por hora (em memória; cada
     instância do Vercel tem o seu contador, então é aproximado).
   - Tempo máximo de 20 s por chamada.
   ============================================================ */
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const Anthropic = require('@anthropic-ai/sdk');
const { registrarUso } = require('./_comum');
const { exigirSessao } = require('./_acesso');

const MODELO = process.env.ANTHROPIC_MODEL || 'claude-sonnet-5-5';
const TEMPO_MAXIMO_MS = 20000;
const LIMITE_POR_HORA = 20;
const MAX_TEXTO = 2000;
const MAX_IMAGEM_BASE64 = 2500000;   // ~1,8 MB de JPEG; a foto chega reduzida a 1600 px
const MAX_HISTORICO = 6;
const SECRETARIA = 'Não tenho essa informação — fale com a secretaria: WhatsApp (47) 99130-3330.';

/* ── Programa: lido de v4/ccem-data.js, a mesma fonte do app ──── */
function carregarDados() {
  const codigo = fs.readFileSync(path.join(process.cwd(), 'v4', 'ccem-data.js'), 'utf8');
  const janela = { location: { search: '', hash: '' } };
  const contexto = { window: janela, URLSearchParams, Date, console: { log() {}, warn() {}, error() {} } };
  vm.createContext(contexto);
  vm.runInContext(codigo, contexto, { filename: 'ccem-data.js' });
  return janela;
}
const DADOS = carregarDados();

function textoDoPrograma() {
  const linhas = [];
  for (const dia of DADOS.DIAS) {
    linhas.push(`\n## ${dia === DADOS.DIAS[0] ? 'Sexta-feira, 23/10/2026' : 'Sábado, 24/10/2026'}`);
    for (const item of DADOS.PROGRAMA[dia] || []) {
      if (item.tipo === 'intervalo') { linhas.push(`- ${item.label} (${item.dur})`); continue; }
      const s = DADOS.SESSOES[item.id];
      if (!s) continue;
      let l = `- [${s.id}] ${s.inicio}–${s.fim} · ${s.badge} · ${s.titulo}`;
      if (s.moderador) l += ` · moderação: ${s.moderador}`;
      if (s.aDefinir) l += ' · programação a definir';
      if (!s.navegavel) l += ' · (sem página no app)';
      linhas.push(l);
      for (const f of s.falas || []) {
        const origem = DADOS.SPEAKER_BIOS[f.palestrante] ? ` (${DADOS.SPEAKER_BIOS[f.palestrante].role})` : '';
        linhas.push(`    · ${f.titulo ? f.titulo + ' — ' : ''}${f.palestrante}${origem}${f.aConfirmar ? ' (a confirmar)' : ''}`);
      }
      if (s.temas && s.temas.length) linhas.push(`    temas: ${s.temas.join(', ')}`);
    }
  }
  return linhas.join('\n');
}
const IDS_SESSOES = Object.keys(DADOS.SESSOES).filter(id => DADOS.SESSOES[id].navegavel);

/* ── FAQ do congresso ─────────────────────────────────────────
   Fonte: www.ccem2026.com.br (Informações Gerais, Local, Inscrições,
   Turismo e Contato), conferido em 01/10/2026. O que não está
   publicado fica como pendente e o assistente NÃO responde: manda
   para a secretaria. */
const FAQ = `
- Local: Expoville — Centro de Eventos de Joinville. Rua XV de Novembro, 4315, Glória, Joinville/SC. Às margens da BR-101. Ambientes climatizados.
- Datas: 23 e 24 de outubro de 2026 (sexta e sábado).
- Solenidade de abertura: sexta, 23/10, às 08h00.
- Secretaria do evento: sexta 23/10 das 07h30 às 18h30; sábado 24/10 das 07h30 às 18h00.
- Certificado de participação: disponível no site www.ccem2026.com.br a partir de 05/11/2026, com acesso pelo CPF, para os inscritos que estiveram presentes no evento. Formato digital (PDF).
- Certificado de trabalho científico: só o autor-relator cadastrado na submissão tem acesso.
- Declaração de comparecimento: pedir na secretaria do evento ou pelo e-mail contato@ccem2026.com.br.
- Crachá: indispensável para entrar no local do evento; é exigido por seguranças e recepcionistas.
- Objetos pessoais: a guarda é responsabilidade do congressista; não deixar bolsas e pastas nas dependências durante os intervalos.
- Fumar: proibido nas dependências do evento.
- Organização: Promotes Eventos. E-mail contato@ccem2026.com.br. WhatsApp (47) 99130-3330. Telefone (47) 3285-8510.
- Inscrição: as inscrições antecipadas pelo site vão até 15/10/2026. Valores no local: sócio quite SBEM, SBD, ABESO ou ABRASSO R$ 520,00; médico não sócio ou sócio não quite R$ 920,00; residente ou pós-graduando R$ 345,00; acadêmico de graduação em medicina R$ 290,00. Residentes, pós-graduandos e acadêmicos precisam comprovar a categoria (documentos por e-mail para contato@ccem2026.com.br). A inscrição dá direito às atividades científicas e à área de exposição.
- Transferência de titularidade da inscrição: até 10 dias antes do evento, por escrito, dentro da mesma categoria.
- Hotéis com tarifa negociada (diárias com café da manhã, valores sujeitos a disponibilidade), todos a cerca de 7 km do evento: Blue Tree Towers Joinville (individual R$ 377, duplo R$ 429); Bourbon Convention Hotel Joinville (R$ 412 / R$ 449); Alven Hotel by Slaviero (R$ 365 / R$ 436); Ibis Joinville (R$ 399 / R$ 464). Reservas: Alleanza Viagens e Turismo, WhatsApp (48) 99123-2909, cristine@alleanza.tur.br.
- Telefones úteis em Joinville: Aeroporto Lauro Carneiro de Loyola (JOI) (47) 3417-4000; Rodoviária Harold Nielson (47) 3433-2991; Central de Atendimento ao Turista (47) 3433-5007; SAMU 192; Bombeiros 193; Polícia Militar 190; Guarda Municipal 153 ou (47) 3431-1500.
- App Meu CCEM: marcações, notas e fotos do Caderno ficam só no aparelho e funcionam sem internet. Para anotar: "Anotar" na tela da sessão ou "Nova nota" no Caderno; "Resumir com IA" é opcional. Para ler ou imprimir as notas: botão "Exportar / imprimir" no Caderno (escolher "Salvar como PDF"). Para trocar de aparelho ou guardar depois do congresso: botão "Backup" no Caderno, que gera um arquivo restaurável. Para lembrar de uma sessão: marcar e tocar em "Adicionar ao calendário". O app fica disponível até 31/12/2026.
- Instalar o app na tela inicial do celular (abre pelo ícone, em tela cheia, e funciona sem internet). iPhone: no Safari, tocar em Compartilhar (quadrado com seta, na barra de baixo) → "Adicionar à Tela de Início" → "Adicionar". Android: no Chrome, menu ⋮ (canto superior direito) → "Instalar app" ou "Adicionar à tela inicial". Também há o item "Instalar o app na tela inicial" na tela Info do app, com o passo a passo. Atenção no iPhone: o app instalado tem memória separada do Safari e começa vazio; quem já marcou sessões ou fez notas deve antes tocar em "Backup" no Caderno, baixar o arquivo e, no app instalado, usar Backup → Restaurar. Por isso, o ideal é instalar antes de começar a usar.
- Trabalhos científicos (e-pôster): a lista de aprovados e as orientações estão em https://www.ccem2026.com.br/submissao-trabalhos/aprovados.php (também na aba "Trabalhos" do app). Os e-pôsteres ficam em exibição em local exclusivo durante todo o evento. Cada trabalho é apresentado em 5 minutos por um autor inscrito no congresso, nos intervalos dos dias 23 e 24/10; o cronograma das apresentações será divulgado. Os autores enviam a apresentação em PDF para contato@ccem2026.com.br até 16/10/2026 (sexta-feira). Os trabalhos serão publicados nos anais do congresso, na revista Arquivos Catarinenses de Medicina, da Associação Catarinense de Medicina (ACM): https://revista.acm.org.br/arquivos/pt_BR. (Conferido em 05/10/2026.)
- Recursos de IA do app (Assistente, foto do slide): exclusivos para inscritos; para usar, entrar com o mesmo e-mail da inscrição e digitar o código de 6 dígitos enviado por e-mail. Sem senha. Programa e Caderno funcionam sem entrar.
- Programação de cada sessão, horários, salas e palestrantes: ver o programa acima.

PENDENTE (não publicado; responder que não tem a informação e indicar a secretaria):
- TODO: confirmar com Promotes — Wi-Fi (existe? rede e senha).
- TODO: confirmar com Promotes — estacionamento (gratuito ou pago, valor).
- TODO: confirmar com Promotes — alimentação (almoço incluso ou não, coffee break, onde comer).
- TODO: confirmar com Promotes — credenciamento (onde e a partir de que horas retirar o crachá).
- TODO: confirmar com Promotes — formas de pagamento da inscrição no local.
- TODO: confirmar com Promotes — guarda-volumes, acessibilidade, pontos de recarga de celular, achados e perdidos, atendimento médico no local, programação social, traslado hotel–Expoville.
`.trim();

const REGRAS = `
Você é o Assistente CCEM, do app Meu CCEM 2026 — 12º Congresso Catarinense de Endocrinologia e Metabologia (realização SBEM-SC; 23 e 24 de outubro de 2026; Expoville, Joinville/SC). Quem usa são médicos endocrinologistas, residentes e estudantes durante o congresso, em geral com pressa.

Você faz três coisas:
1. ANOTAÇÃO (modo "anotacao"): o congressista manda a foto de um slide ou um texto do que ouviu. Responda com:
   - "mensagem": a mensagem-chave em no máximo 2 frases;
   - "pontos": até 5 pontos de apoio, curtos;
   - "referencia": a referência bibliográfica SOMENTE se ela estiver visível no slide ou escrita pelo congressista, copiada como aparece; senão, string vazia.
   Se a foto estiver ilegível ou não for um slide, diga isso em "mensagem" e não invente conteúdo.
2. BUSCA (modo "busca"): perguntas sobre o programa — que sessões tratam de um tema, quem fala, quando, o que está acontecendo agora, qual a próxima. Use SOMENTE o programa abaixo. Em "sessoes", liste os ids das sessões relevantes (até 5), na ordem do programa. Em "mensagem", responda de forma direta, citando horário e dia.
3. CONCIERGE (modo "concierge"): dúvidas práticas sobre o evento (certificado, secretaria, local, inscrição, hotel, app). Use SOMENTE a FAQ abaixo. Se a resposta não estiver na FAQ, ou estiver marcada como PENDENTE/TODO, responda exatamente: "${SECRETARIA}"

Regras:
- Escreva em português do Brasil, em linguagem técnica médica, direta e sem floreios. Sem emojis.
- Nunca invente: sessão, horário, palestrante, dado, número, referência ou informação prática que não esteja no programa, na FAQ, no slide ou na mensagem do congressista. Se não souber, diga que não sabe.
- Não opine sobre caso clínico real de paciente nem dê conduta individual. Se pedirem, responda em "mensagem" que o assistente não discute casos reais de pacientes e use o modo "fora_de_escopo". Explicar o conteúdo de um slide ou de uma aula não é caso clínico.
- Se a pergunta não tiver relação com o congresso, com endocrinologia ou com o app, use "fora_de_escopo" e diga em uma frase o que você pode fazer.
- Quando o congressista estiver na tela de uma sessão, a mensagem informa qual é; "resuma esta sessão" ou "quem são os palestrantes" se referem a ela. O resumo de uma sessão se baseia só no título, nas falas e nos palestrantes do programa: deixe claro que é o roteiro previsto, não o conteúdo apresentado.
- "pontos", "referencia" e "sessoes" podem ficar vazios quando não se aplicam.
`.trim();

const SISTEMA = `${REGRAS}\n\n# PROGRAMA OFICIAL\n${textoDoPrograma()}\n\n# FAQ DO CONGRESSO\n${FAQ}`;

const FORMATO = {
  type: 'json_schema',
  schema: {
    type: 'object',
    properties: {
      modo: { type: 'string', enum: ['anotacao', 'busca', 'concierge', 'fora_de_escopo'] },
      mensagem: { type: 'string' },
      pontos: { type: 'array', items: { type: 'string' } },
      referencia: { type: 'string' },
      sessoes: { type: 'array', items: { type: 'string', enum: IDS_SESSOES } },
    },
    required: ['modo', 'mensagem', 'pontos', 'referencia', 'sessoes'],
    additionalProperties: false,
  },
};

/* ── Limite por usuário (em memória) ─────────────────────────── */
const chamadas = new Map();
function dentroDoLimite(chave) {
  const agora = Date.now(), umaHora = 3600000;
  const lista = (chamadas.get(chave) || []).filter(t => agora - t < umaHora);
  if (lista.length >= LIMITE_POR_HORA) { chamadas.set(chave, lista); return false; }
  lista.push(agora);
  chamadas.set(chave, lista);
  if (chamadas.size > 5000) {               // não deixar o mapa crescer sem fim
    for (const [k, v] of chamadas) if (!v.some(t => agora - t < umaHora)) chamadas.delete(k);
  }
  return true;
}

/* ── Contexto variável (fica fora do prefixo em cache) ───────── */
const DIA_SEMANA = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];
function descreverMomento(agoraIso) {
  let agora = new Date(agoraIso);
  if (!agoraIso || isNaN(agora.getTime())) agora = new Date();
  const j = new Date(agora.getTime() - 3 * 3600000);    // Joinville, UTC−3 fixo
  const p = n => String(n).padStart(2, '0');
  let t = `Agora em Joinville: ${DIA_SEMANA[j.getUTCDay()]}, ${p(j.getUTCDate())}/${p(j.getUTCMonth() + 1)}/${j.getUTCFullYear()}, ${p(j.getUTCHours())}:${p(j.getUTCMinutes())}.`;
  const e = DADOS.ccemEstado(agora);
  if (e.fase === 'antes') t += ' O congresso ainda não começou.';
  else if (e.fase === 'depois') t += ' O congresso já terminou.';
  else {
    t += e.agora ? ` Em andamento: [${e.agora.id}].` : ' Nenhuma sessão em andamento neste minuto.';
    if (e.aSeguir) t += ` A seguir: [${e.aSeguir.id}] às ${e.aSeguir.inicio}.`;
  }
  return t;
}

function limparTexto(v, max) { return String(v || '').replace(/\u0000/g, '').slice(0, max).trim(); }

function montarMensagens(corpo) {
  const msgs = [];
  for (const h of (Array.isArray(corpo.historico) ? corpo.historico : []).slice(-MAX_HISTORICO)) {
    const texto = limparTexto(h && h.texto, 1500);
    if (!texto) continue;
    msgs.push({ role: h.papel === 'assistente' ? 'assistant' : 'user', content: texto });
  }
  while (msgs.length && msgs[0].role !== 'user') msgs.shift();

  const sessao = Object.prototype.hasOwnProperty.call(DADOS.SESSOES, corpo.sessaoId) ? DADOS.SESSOES[corpo.sessaoId] : null;
  let contexto = descreverMomento(corpo.agora);
  if (sessao) contexto += ` O congressista está na tela da sessão [${sessao.id}] (${sessao.badge} · ${sessao.titulo}).`;

  const conteudo = [];
  if (corpo.imagem) {
    conteudo.push({ type: 'image', source: { type: 'base64', media_type: 'image/jpeg', data: corpo.imagem } });
  }
  const pergunta = limparTexto(corpo.texto, MAX_TEXTO) ||
    (corpo.imagem ? 'Anote este slide.' : '');
  conteudo.push({ type: 'text', text: `${contexto}\n\n${pergunta}` });
  msgs.push({ role: 'user', content: conteudo });
  return msgs;
}

let cliente = null;
function obterCliente() {
  if (!cliente) cliente = new Anthropic({ maxRetries: 0, timeout: TEMPO_MAXIMO_MS });
  return cliente;
}

/* ── callAI: a única chamada ao modelo ───────────────────────── */
async function callAI(corpo) {
  const resposta = await obterCliente().messages.create({
    model: MODELO,
    max_tokens: 3000,
    output_config: { effort: 'low', format: FORMATO },
    system: [{ type: 'text', text: SISTEMA, cache_control: { type: 'ephemeral' } }],
    messages: montarMensagens(corpo),
  });
  registrarUso('assistente', MODELO, resposta.usage);

  if (resposta.stop_reason === 'refusal') {
    return { modo: 'fora_de_escopo', mensagem: 'Não posso ajudar com esse pedido. Posso anotar slides, buscar no programa e responder dúvidas práticas do congresso.', pontos: [], referencia: '', sessoes: [] };
  }
  const bloco = resposta.content.find(b => b.type === 'text');
  if (!bloco) throw new Error('sem_texto');
  const r = JSON.parse(bloco.text);
  return {
    modo: r.modo,
    mensagem: limparTexto(r.mensagem, 2000),
    pontos: (r.pontos || []).map(p => limparTexto(p, 400)).filter(Boolean).slice(0, 5),
    referencia: limparTexto(r.referencia, 400),
    sessoes: [...new Set((r.sessoes || []).filter(id => IDS_SESSOES.includes(id)))].slice(0, 5),
  };
}

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return res.status(405).json({ erro: 'metodo' }); }
  if (!process.env.ANTHROPIC_API_KEY) return res.status(503).json({ erro: 'indisponivel' });

  let corpo = req.body;
  if (typeof corpo === 'string') { try { corpo = JSON.parse(corpo); } catch (e) { corpo = null; } }
  if (!corpo || typeof corpo !== 'object') return res.status(400).json({ erro: 'pedido' });
  if (corpo.imagem && (typeof corpo.imagem !== 'string' || corpo.imagem.length > MAX_IMAGEM_BASE64 || !/^[A-Za-z0-9+/=]+$/.test(corpo.imagem))) {
    return res.status(413).json({ erro: 'imagem' });
  }
  if (!limparTexto(corpo.texto, MAX_TEXTO) && !corpo.imagem) return res.status(400).json({ erro: 'vazio' });

  const userId = /^u_[a-z0-9]{3,24}$/.test(corpo.userId || '') ? corpo.userId : null;
  const ip = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'anonimo';
  const acesso = exigirSessao(req, userId || 'ip:' + ip);
  if (!acesso.ok) return res.status(401).json({ erro: 'login' });
  if (!dentroDoLimite(acesso.quem)) return res.status(429).json({ erro: 'limite' });

  try {
    return res.status(200).json(await callAI(corpo));
  } catch (e) {
    // Só o tipo do erro: nunca o conteúdo da pergunta ou da imagem.
    const tempo = e instanceof Anthropic.APIConnectionTimeoutError;
    const tipo = tempo ? 'tempo esgotado' : e instanceof Anthropic.APIError ? `api ${e.status}` : (e && e.name) || 'erro';
    console.error('assistente:', tipo);
    return res.status(tempo ? 504 : 502).json({ erro: tempo ? 'tempo' : 'falha' });
  }
};
