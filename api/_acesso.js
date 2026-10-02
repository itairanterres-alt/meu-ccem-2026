/* ============================================================
   Meu CCEM 2026 — acesso à IA só para inscritos
   ------------------------------------------------------------
   Sem senha e sem cadastro: a pessoa digita o e-mail da inscrição,
   recebe um código de 6 dígitos e fica conectada até 31/12/2026.

   - Quem pode: inscritos confirmados (API da organização, que se
     atualiza de hora em hora) + lista extra de convidados
     (ACESSO_EXTRA: palestrantes, comissões, diretoria, equipe).
   - Sem banco de dados: o desafio do código e a sessão são
     assinados (HMAC) com SESSAO_SEGREDO.
   - A lista de inscritos fica só em memória, para conferir o
     e-mail; não é gravada, não usa o nome e não vai para o log.
   - Se a lista estiver indisponível, o acesso é liberado (decisão
     da Comissão), com sessão curta (24 h) para conferir depois.

   O login só vale quando SESSAO_SEGREDO, SMTP_USER e SMTP_PASS
   estão cadastrados no Vercel. Sem eles, a IA segue como antes.
   ============================================================ */
const crypto = require('crypto');

const INSCRITOS_URL = process.env.INSCRITOS_URL || 'https://www.ccem2026.com.br/api_inscritos/public/inscritos.php';
const FIM_DO_APP = Date.parse('2026-12-31T23:59:59-03:00');
const DEZ_MIN = 10 * 60 * 1000;
const UM_DIA = 24 * 60 * 60 * 1000;
const CACHE_LISTA = 15 * 60 * 1000;

const loginAtivo = () => !!(process.env.SESSAO_SEGREDO && process.env.SMTP_USER && process.env.SMTP_PASS);

const normalizarEmail = e => String(e || '').trim().toLowerCase();
const emailValido = e => e.length <= 200 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

/* ── Assinatura ───────────────────────────────────────────────── */
const b64 = s => Buffer.from(s).toString('base64url');
const hmac = texto => crypto.createHmac('sha256', process.env.SESSAO_SEGREDO).update(texto).digest('base64url');
const iguais = (a, b) => a.length === b.length && crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b));

function assinar(dados) {
  const corpo = b64(JSON.stringify(dados));
  return corpo + '.' + hmac(corpo);
}
function abrir(token) {
  if (typeof token !== 'string' || token.length > 1000) return null;
  const [corpo, assinatura] = token.split('.');
  if (!corpo || !assinatura || !iguais(assinatura, hmac(corpo))) return null;
  try {
    const dados = JSON.parse(Buffer.from(corpo, 'base64url').toString());
    return dados && dados.exp > Date.now() ? dados : null;
  } catch (e) { return null; }
}

/* Identificador da pessoa para os limites de uso: derivado do e-mail, sem revelá-lo. */
const idPessoa = email => 'p_' + hmac('pessoa:' + email).slice(0, 22);

/* ── Quem pode entrar ─────────────────────────────────────────── */
function listaExtra() {
  return new Set(String(process.env.ACESSO_EXTRA || '').split(/[\s,;]+/).map(normalizarEmail).filter(Boolean));
}

let _lista = null, _listaEm = 0;
async function listaInscritos() {
  if (_lista && Date.now() - _listaEm < CACHE_LISTA) return _lista;
  if (!process.env.INSCRITOS_TOKEN) return _lista;
  try {
    const res = await fetch(INSCRITOS_URL, {
      headers: { Authorization: 'Bearer ' + process.env.INSCRITOS_TOKEN },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) throw new Error('http ' + res.status);
    const dados = await res.json();
    if (!Array.isArray(dados.inscritos)) throw new Error('formato');
    _lista = new Set(dados.inscritos.map(i => normalizarEmail(i && i.email)).filter(Boolean));
    _listaEm = Date.now();
  } catch (e) {
    console.error('acesso: lista de inscritos indisponivel', (e && e.message) || '');   // segue com a última lista boa
  }
  return _lista;
}

/* 'inscrito' | 'liberado' (lista indisponível) | null (não encontrado) */
async function situacao(email) {
  if (listaExtra().has(email)) return 'inscrito';
  const lista = await listaInscritos();
  if (!lista) return 'liberado';
  return lista.has(email) ? 'inscrito' : null;
}

/* ── Código de 6 dígitos ──────────────────────────────────────── */
function novoDesafio(email, sit) {
  const codigo = String(crypto.randomInt(0, 1000000)).padStart(6, '0');
  const exp = Date.now() + DEZ_MIN;
  const desafio = assinar({ t: 'desafio', email, sit, exp, h: hmac(['codigo', email, codigo, exp].join(':')) });
  return { codigo, desafio };
}

/* Devolve { sessao, validade } ou { erro: 'codigo' | 'expirado' }. */
function confirmarCodigo(desafio, codigo) {
  const d = abrir(desafio);
  if (!d || d.t !== 'desafio') return { erro: 'expirado' };
  codigo = String(codigo || '').replace(/\D/g, '');
  if (codigo.length !== 6 || !iguais(hmac(['codigo', d.email, codigo, d.exp].join(':')), d.h)) return { erro: 'codigo' };
  const validade = d.sit === 'liberado' ? Math.min(Date.now() + UM_DIA, FIM_DO_APP) : FIM_DO_APP;
  return { sessao: assinar({ t: 'sessao', p: idPessoa(d.email), exp: validade }), validade };
}

/* ── Nas funções da IA ────────────────────────────────────────── */
/* { ok: true, quem } — quem é a chave dos limites de uso. */
function exigirSessao(req, quemSemLogin) {
  if (!loginAtivo()) return { ok: true, quem: quemSemLogin };
  const cab = String(req.headers.authorization || '');
  const s = abrir(cab.startsWith('Bearer ') ? cab.slice(7) : '');
  if (!s || s.t !== 'sessao') return { ok: false };
  return { ok: true, quem: s.p };
}

/* ── Envio do e-mail ──────────────────────────────────────────── */
let _correio = null;
function correio() {
  if (!_correio) {
    const nodemailer = require('nodemailer');
    const porta = Number(process.env.SMTP_PORT || 465);
    _correio = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.hostinger.com',
      port: porta,
      secure: porta === 465,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
      connectionTimeout: 8000, greetingTimeout: 8000, socketTimeout: 10000,
    });
  }
  return _correio;
}

async function enviarCodigo(email, codigo) {
  const de = process.env.SMTP_FROM || `"Meu CCEM 2026" <${process.env.SMTP_USER}>`;
  await correio().sendMail({
    from: de,
    to: email,
    subject: `${codigo} é o seu código de acesso · Meu CCEM 2026`,
    text: `Seu código de acesso ao Meu CCEM 2026 é ${codigo}.\n\n` +
          `Digite-o no app para usar o Assistente e os recursos de IA. Ele vale por 10 minutos.\n\n` +
          `Se você não pediu este código, ignore esta mensagem.\n\n` +
          `12º Congresso Catarinense de Endocrinologia e Metabologia · SBEM-SC`,
    html: `<div style="font-family:Arial,sans-serif;color:#1a2440;max-width:420px">` +
          `<p>Seu código de acesso ao <b>Meu CCEM 2026</b>:</p>` +
          `<p style="font-size:30px;font-weight:bold;letter-spacing:6px;color:#1d3e8a;margin:12px 0">${codigo}</p>` +
          `<p>Digite-o no app para usar o Assistente e os recursos de IA. Ele vale por 10 minutos.</p>` +
          `<p style="color:#5a6478;font-size:13px">Se você não pediu este código, ignore esta mensagem.<br>` +
          `12º Congresso Catarinense de Endocrinologia e Metabologia · SBEM-SC</p></div>`,
  });
}

module.exports = {
  loginAtivo, normalizarEmail, emailValido, situacao, novoDesafio, confirmarCodigo, exigirSessao, enviarCodigo,
  _teste: { listaInscritos, zerarLista: () => { _lista = null; _listaEm = 0; }, trocarCorreio: c => { _correio = c; } },
};
