/* ============================================================
   Meu CCEM 2026 — POST /api/entrar
   ------------------------------------------------------------
   { acao: 'pedir', email }              → envia o código por e-mail
                                           e devolve { desafio }
   { acao: 'confirmar', desafio, codigo } → { sessao, validade }
   Regras em api/_acesso.js. Nada de e-mail ou código no log.
   ============================================================ */
const crypto = require('crypto');
const C = require('./_comum');
const A = require('./_acesso');

const HORA = 60 * 60 * 1000;

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return res.status(405).json({ erro: 'metodo' }); }
  if (!A.loginAtivo()) return res.status(503).json({ erro: 'desligado' });

  const corpo = C.lerCorpo(req);
  if (!corpo) return res.status(400).json({ erro: 'pedido' });
  const ip = 'ip:' + (String(req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'anonimo');

  if (corpo.acao === 'pedir') {
    const email = A.normalizarEmail(corpo.email);
    if (!A.emailValido(email)) return res.status(400).json({ erro: 'email' });
    if (!C.dentroDoLimite('entrar:' + ip, 15, HORA) || !C.dentroDoLimite('entrar:' + email, 5, HORA)) {
      return res.status(429).json({ erro: 'limite' });
    }
    const sit = await A.situacao(email);
    if (!sit) return res.status(403).json({ erro: 'nao_inscrito' });
    const { codigo, desafio } = A.novoDesafio(email, sit);
    try {
      await A.enviarCodigo(email, codigo);
    } catch (e) {
      console.error('entrar: falha no envio do e-mail', (e && e.code) || '');
      return res.status(502).json({ erro: 'envio' });
    }
    console.log(JSON.stringify({ uso: 'entrar:codigo', situacao: sit }));
    return res.status(200).json({ desafio });
  }

  if (corpo.acao === 'confirmar') {
    const desafio = String(corpo.desafio || '');
    const chave = 'tent:' + crypto.createHash('sha256').update(desafio).digest('hex').slice(0, 24);
    if (!C.dentroDoLimite(chave, 6, 15 * 60 * 1000) || !C.dentroDoLimite('conf:' + ip, 40, HORA)) {
      return res.status(429).json({ erro: 'limite' });
    }
    const r = A.confirmarCodigo(desafio, corpo.codigo);
    if (r.erro) return res.status(400).json({ erro: r.erro });
    console.log(JSON.stringify({ uso: 'entrar:ok' }));
    return res.status(200).json(r);
  }

  return res.status(400).json({ erro: 'acao' });
};
