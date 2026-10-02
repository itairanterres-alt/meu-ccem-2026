/* ============================================================
   Meu CCEM 2026 — utilidades comuns das funções do servidor
   ------------------------------------------------------------
   Arquivos de api/ que começam com "_" não viram endpoints no
   Vercel: este é só um módulo compartilhado.
   - Limites por pessoa (em memória; cada instância do Vercel tem
     o seu contador, então são aproximados — o teto efetivo de
     gasto é o crédito da Anthropic).
   - Registro de consumo por função: modelo, tokens e custo
     estimado. NUNCA o conteúdo da pergunta, da foto ou da resposta.
   ============================================================ */
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const Anthropic = require('@anthropic-ai/sdk');

const SONNET = process.env.ANTHROPIC_MODEL || 'claude-sonnet-5-5';
const HAIKU  = 'claude-haiku-4-5';
const MAX_IMAGEM_BASE64 = 2500000;   // a foto chega reduzida a 1600 px no aparelho

/* Preço por milhão de tokens (US$): entrada, saída, leitura e gravação de cache (5 min). */
const PRECOS = {
  'claude-sonnet-5-5': { ent: 2, sai: 10, lida: 0.20, grav: 2.50 },
  'claude-haiku-4-5':  { ent: 1, sai: 5,  lida: 0.10, grav: 1.25 },
};

function carregarDados() {
  const codigo = fs.readFileSync(path.join(process.cwd(), 'v4', 'ccem-data.js'), 'utf8');
  const janela = { location: { search: '', hash: '' } };
  const contexto = { window: janela, URLSearchParams, Date, console: { log() {}, warn() {}, error() {} } };
  vm.createContext(contexto);
  vm.runInContext(codigo, contexto, { filename: 'ccem-data.js' });
  return janela;
}

let _cliente = null;
function cliente() {
  if (!_cliente) _cliente = new Anthropic({ maxRetries: 0, timeout: 20000 });
  return _cliente;
}

/* Registro de consumo: uma linha por chamada, só números. */
function registrarUso(funcao, modelo, uso) {
  if (!uso) return;
  const p = PRECOS[modelo] || PRECOS[SONNET] || { ent: 2, sai: 10, lida: 0.2, grav: 2.5 };
  const ent = uso.input_tokens || 0, sai = uso.output_tokens || 0;
  const lida = uso.cache_read_input_tokens || 0, grav = uso.cache_creation_input_tokens || 0;
  const usd = (ent * p.ent + sai * p.sai + lida * p.lida + grav * p.grav) / 1e6;
  console.log(JSON.stringify({ uso: funcao, modelo, ent, sai, cache_lida: lida, cache_grav: grav, usd: Math.round(usd * 100000) / 100000 }));
}

/* Limite por pessoa e janela de tempo, em memória. */
const _contadores = new Map();
function dentroDoLimite(chave, limite, janelaMs) {
  const agora = Date.now();
  const lista = (_contadores.get(chave) || []).filter(t => agora - t < janelaMs);
  if (lista.length >= limite) { _contadores.set(chave, lista); return false; }
  lista.push(agora);
  _contadores.set(chave, lista);
  if (_contadores.size > 20000) {
    for (const [k, v] of _contadores) if (!v.some(t => agora - t < 86400000)) _contadores.delete(k);
  }
  return true;
}

function quemPede(req, corpo) {
  if (/^u_[a-z0-9]{3,24}$/.test((corpo && corpo.userId) || '')) return corpo.userId;
  return 'ip:' + (String(req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'anonimo');
}

function lerCorpo(req) {
  let corpo = req.body;
  if (typeof corpo === 'string') { try { corpo = JSON.parse(corpo); } catch (e) { corpo = null; } }
  return corpo && typeof corpo === 'object' ? corpo : null;
}

function imagemValida(b64) {
  return typeof b64 === 'string' && b64.length > 0 && b64.length <= MAX_IMAGEM_BASE64 && /^[A-Za-z0-9+/=]+$/.test(b64);
}

function texto(v, max) { return String(v || '').replace(/\u0000/g, '').slice(0, max).trim(); }

/* Uma chamada com saída estruturada; devolve o JSON já interpretado. */
async function chamarEstruturado({ funcao, modelo, sistema, conteudo, esquema, maxTokens, esforco }) {
  const params = {
    model: modelo,
    max_tokens: maxTokens || 2000,
    system: [{ type: 'text', text: sistema, cache_control: { type: 'ephemeral' } }],
    messages: [{ role: 'user', content: conteudo }],
    output_config: { format: { type: 'json_schema', schema: esquema } },
  };
  if (esforco && modelo === SONNET) params.output_config.effort = esforco;
  const r = await cliente().messages.create(params);
  registrarUso(funcao, modelo, r.usage);
  if (r.stop_reason === 'refusal') return { recusa: true };
  const bloco = r.content.find(b => b.type === 'text');
  if (!bloco) throw new Error('sem_texto');
  return JSON.parse(bloco.text);
}

/* Erros da IA viram respostas HTTP, sem registrar conteúdo. */
function responderErro(res, e, funcao) {
  const tempo = e instanceof Anthropic.APIConnectionTimeoutError;
  const tipo = tempo ? 'tempo esgotado' : e instanceof Anthropic.APIError ? `api ${e.status}` : (e && e.name) || 'erro';
  console.error(funcao + ':', tipo);
  return res.status(tempo ? 504 : 502).json({ erro: tempo ? 'tempo' : 'falha' });
}

module.exports = {
  Anthropic, SONNET, HAIKU, carregarDados, cliente, registrarUso, dentroDoLimite, quemPede,
  lerCorpo, imagemValida, texto, chamarEstruturado, responderErro,
};
