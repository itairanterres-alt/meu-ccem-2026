/* ============================================================
   Meu CCEM 2026 — entrar para usar a IA
   ------------------------------------------------------------
   A IA é exclusiva para inscritos. Na primeira vez que alguém usa
   um recurso de IA, o servidor responde 401 e o app pede o e-mail
   da inscrição; um código de 6 dígitos chega por e-mail e a pessoa
   fica conectada até 31/12/2026. Sem senha e sem cadastro.
   Programa, Caderno e Info nunca pedem login.
   Enquanto o login estiver desligado no servidor, nada disto aparece.
   ============================================================ */

const CCEM_SESSAO = 'ccem2026:sessao';
const CCEM_AVISO_LOGIN = 'Os recursos de IA são exclusivos para inscritos. Toque de novo e entre com o e-mail da sua inscrição.';

function ccemSessao() {
  let s = window.__ccemSessao;
  if (s === undefined) { try { s = JSON.parse(localStorage.getItem(CCEM_SESSAO) || 'null'); } catch (e) { s = null; } }
  return s && s.token && s.validade > Date.now() ? s : null;
}
function ccemGuardarSessao(s) {
  window.__ccemSessao = s;
  try { s ? localStorage.setItem(CCEM_SESSAO, JSON.stringify(s)) : localStorage.removeItem(CCEM_SESSAO); } catch (e) {}
  window.dispatchEvent(new Event('ccem:sessao'));
}
function useSessao() {
  const [s, setS] = useState(ccemSessao);
  useEffect(() => {
    const fn = () => setS(ccemSessao());
    window.addEventListener('ccem:sessao', fn);
    return () => window.removeEventListener('ccem:sessao', fn);
  }, []);
  return s;
}

/* Abre a folha de entrada; resolve true se a pessoa entrou. */
let _pedidoLogin = null;
function ccemPedirLogin() {
  if (_pedidoLogin) return _pedidoLogin.promessa;
  let resolver;
  const promessa = new Promise(r => { resolver = r; });
  _pedidoLogin = { promessa, concluir: ok => { _pedidoLogin = null; resolver(ok); } };
  window.dispatchEvent(new Event('ccem:entrar'));
  return promessa;
}

/* POST para as funções de IA, com a sessão. Sem sessão válida, pede
   o login uma vez e repete o pedido. O tempo limite vale por tentativa,
   para não contar o tempo em que a pessoa digita o código. */
async function ccemFetchIA(url, corpo, tempoMs) {
  const tentar = async () => {
    const ctl = new AbortController();
    const relogio = setTimeout(() => ctl.abort(), tempoMs || 32000);
    const s = ccemSessao();
    try {
      return await fetch(url, { method: 'POST', signal: ctl.signal, body: JSON.stringify(corpo),
        headers: { 'Content-Type': 'application/json', ...(s ? { Authorization: 'Bearer ' + s.token } : {}) } });
    } finally { clearTimeout(relogio); }
  };
  let res = await tentar();
  if (res.status === 401) {
    if (ccemSessao()) ccemGuardarSessao(null);   // sessão recusada: pede de novo
    if (await ccemPedirLogin()) res = await tentar();
  }
  return res;
}

const CCEM_ERROS_ENTRAR = {
  email: 'Confira o e-mail digitado.',
  nao_inscrito: 'Não encontramos este e-mail entre os inscritos confirmados. Use o mesmo e-mail da inscrição; se ela acabou de ser confirmada, tente de novo em uma hora. Palestrantes e convidados: procurem a secretaria.',
  limite: 'Muitas tentativas. Aguarde alguns minutos e tente de novo.',
  envio: 'Não conseguimos enviar o e-mail agora. Tente de novo em instantes.',
  codigo: 'Código incorreto. Confira o e-mail mais recente.',
  expirado: 'O código expirou. Peça um novo.',
  desligado: 'O acesso está em manutenção. Tente mais tarde.',
};

async function ccemPostEntrar(corpo) {
  try {
    const res = await fetch('/api/entrar', { method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(corpo), signal: AbortSignal.timeout ? AbortSignal.timeout(25000) : undefined });
    let dados = {};
    try { dados = await res.json(); } catch (e) {}
    if (res.ok) return { dados };
    return { erro: CCEM_ERROS_ENTRAR[dados.erro] || 'Não foi possível continuar agora. Tente de novo.' };
  } catch (e) {
    return { erro: 'Sem conexão com a internet. Tente de novo quando a rede voltar.' };
  }
}

let _ultimoEmail = '';
function FolhaEntrar({ aoConcluir }) {
  const [etapa, setEtapa] = useState('email');
  const [email, setEmail] = useState(_ultimoEmail);
  const [codigo, setCodigo] = useState('');
  const [desafio, setDesafio] = useState(null);
  const [ocupado, setOcupado] = useState(false);
  const [erro, setErro] = useState('');
  const codigoRef = useRef(null);

  async function pedir(e) {
    if (e) e.preventDefault();
    const em = email.trim();
    if (!em || ocupado) return;
    _ultimoEmail = em;
    setOcupado(true); setErro('');
    const r = await ccemPostEntrar({ acao: 'pedir', email: em });
    setOcupado(false);
    if (r.erro) { setErro(r.erro); return; }
    setDesafio(r.dados.desafio); setCodigo(''); setEtapa('codigo');
    setTimeout(() => codigoRef.current && codigoRef.current.focus(), 50);
  }
  async function confirmar(e) {
    if (e) e.preventDefault();
    if (codigo.length !== 6 || ocupado) return;
    setOcupado(true); setErro('');
    const r = await ccemPostEntrar({ acao: 'confirmar', desafio, codigo });
    setOcupado(false);
    if (r.erro) { setErro(r.erro); return; }
    ccemGuardarSessao({ token: r.dados.sessao, validade: r.dados.validade, email: _ultimoEmail.trim().toLowerCase() });
    showToast('Pronto! Você já pode usar a IA.');
    aoConcluir(true);
  }

  const CAMPO = { width:'100%', boxSizing:'border-box', minHeight:48, padding:'10px 12px', border:`1px solid ${C.linha}`, borderRadius:10,
    fontSize:16, fontFamily:'DM Sans,system-ui,sans-serif', color:C.tinta, background:'#fff' };
  const BOTAO = { width:'100%', minHeight:48, marginTop:10, border:'none', borderRadius:10, background:C.azul, color:'#fff',
    fontFamily:'DM Sans,sans-serif', fontSize:15, fontWeight:700, cursor:'pointer' };
  const LINK = { minHeight:44, padding:'0 6px', background:'none', border:'none', color:C.azul, fontFamily:'DM Sans,sans-serif',
    fontSize:13, fontWeight:600, cursor:'pointer' };

  return (
    <FolhaBase titulo="Entrar para usar a IA" altura="auto" aoFechar={() => aoConcluir(false)}>
      {etapa === 'email' ? (
        <form onSubmit={pedir}>
          <p style={{fontSize:14,color:C.tinta,lineHeight:1.5,margin:'0 0 12px'}}>
            O Assistente e os recursos de IA são exclusivos para inscritos do CCEM 2026. Digite o e-mail usado na inscrição: enviaremos um código de 6 dígitos. Sem senha.
          </p>
          <label htmlFor="ccem-entrar-email" style={{display:'block',fontSize:13,fontWeight:600,color:C.tinta,marginBottom:6}}>E-mail da inscrição</label>
          <input id="ccem-entrar-email" type="email" inputMode="email" autoComplete="email" autoCapitalize="none" spellCheck={false}
            value={email} onChange={e => setEmail(e.target.value)} style={CAMPO} placeholder="nome@exemplo.com"/>
          <button type="submit" disabled={ocupado || !email.trim()} style={{...BOTAO, opacity:(ocupado || !email.trim()) ? 0.55 : 1}}>
            {ocupado ? 'Enviando…' : 'Enviar código'}
          </button>
        </form>
      ) : (
        <form onSubmit={confirmar}>
          <p style={{fontSize:14,color:C.tinta,lineHeight:1.5,margin:'0 0 12px'}}>
            Enviamos um código para <b>{_ultimoEmail}</b>. Pode levar um minuto; se não chegar, confira o spam.
          </p>
          <label htmlFor="ccem-entrar-codigo" style={{display:'block',fontSize:13,fontWeight:600,color:C.tinta,marginBottom:6}}>Código de 6 dígitos</label>
          <input id="ccem-entrar-codigo" ref={codigoRef} inputMode="numeric" autoComplete="one-time-code"
            value={codigo} onChange={e => setCodigo(e.target.value.replace(/\D/g, '').slice(0, 6))}
            style={{...CAMPO, fontSize:24, letterSpacing:8, textAlign:'center', fontWeight:700}}/>
          <button type="submit" disabled={ocupado || codigo.length !== 6} style={{...BOTAO, opacity:(ocupado || codigo.length !== 6) ? 0.55 : 1}}>
            {ocupado ? 'Conferindo…' : 'Entrar'}
          </button>
          <div style={{display:'flex',justifyContent:'space-between',marginTop:6}}>
            <button type="button" onClick={() => { setEtapa('email'); setErro(''); }} style={LINK}>Usar outro e-mail</button>
            <button type="button" onClick={() => pedir()} disabled={ocupado} style={LINK}>Reenviar código</button>
          </div>
        </form>
      )}
      <div role="alert">
        {erro && <p style={{margin:'12px 0 0',padding:'9px 11px',background:'#fff4ec',border:'1px solid #f3c9a8',borderRadius:9,fontSize:13,color:'#8a3a0c',lineHeight:1.45}}>{erro}</p>}
      </div>
      <p style={{fontSize:12,color:C.cinza,lineHeight:1.5,margin:'14px 0 4px'}}>
        Seu e-mail é usado só para conferir a inscrição na lista da organização. Você fica conectado neste aparelho até 31/12/2026. Programa e Caderno funcionam sem entrar.
      </p>
    </FolhaBase>
  );
}

/* Fica montado no App e abre a folha quando algum recurso de IA pede login. */
function HostEntrar() {
  const [aberto, setAberto] = useState(false);
  useEffect(() => {
    const abrir = () => setAberto(true);
    window.addEventListener('ccem:entrar', abrir);
    return () => window.removeEventListener('ccem:entrar', abrir);
  }, []);
  if (!aberto) return null;
  return <FolhaEntrar aoConcluir={ok => { setAberto(false); if (_pedidoLogin) _pedidoLogin.concluir(ok); }}/>;
}

/* Em Info › Privacidade e dados: quem está conectado e "Sair". */
function SessaoInfo() {
  const s = useSessao();
  if (!s) return null;
  return (
    <div style={{display:'flex',alignItems:'center',gap:8,padding:'8px 0',borderTop:`1px solid ${C.linhaSoft}`,marginBottom:10}}>
      <span style={{flex:1,minWidth:0,fontSize:12.5,color:C.tinta,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>
        IA liberada para <b>{s.email || 'este aparelho'}</b>
      </span>
      <button onClick={() => { ccemGuardarSessao(null); showToast('Você saiu. Programa e Caderno continuam disponíveis.'); }}
        style={{minHeight:44,padding:'0 14px',background:'#fff',border:`1px solid ${C.linha}`,borderRadius:9,fontFamily:'DM Sans,sans-serif',fontSize:13,fontWeight:600,color:C.azul,cursor:'pointer'}}>Sair</button>
    </div>
  );
}

Object.assign(window, {
  CCEM_AVISO_LOGIN, ccemSessao, ccemGuardarSessao, ccemPedirLogin, ccemFetchIA, FolhaEntrar, HostEntrar, SessaoInfo,
});
