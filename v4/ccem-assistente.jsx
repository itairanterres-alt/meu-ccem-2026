/* ============================================================
   Meu CCEM 2026 — Assistente CCEM (Etapa 5)
   ------------------------------------------------------------
   Conversa, tela Assistente, painel deslizante e botão "8".
   A IA roda em /api/assistente (função do Vercel). Aqui só se
   reduz a foto, envia, e mostra a resposta como TEXTO — nunca
   como HTML, para que nada vindo da IA vire código na página.
   A conversa fica só na memória desta aba: não vai para o
   localStorage nem para servidor algum além da própria pergunta.
   ============================================================ */

const CCEM_AVATAR      = 'v4/avatar-assistente.png';
const CCEM_RODAPE_IA   = 'Gerado por IA — confira na fonte';
const CCEM_EM_TESTES   = 'Assistente em fase de testes — disponível em breve';
const CCEM_PRIVACIDADE = 'Perguntas e fotos enviadas aqui são processadas pela Anthropic (EUA); o app não guarda cópia no servidor. Não envie dados de pacientes.';

/* Três sugestões por tela. foto:true abre a câmera em vez de perguntar. */
const CCEM_SUGESTOES = {
  home:     [{ rotulo:'O que está acontecendo agora?' }, { rotulo:'Onde pego o certificado?' }, { rotulo:'Quais sessões falam de tireoide?' }],
  programa: [{ rotulo:'O que está acontecendo agora?' }, { rotulo:'Qual é a próxima sessão?' }, { rotulo:'Quais sessões falam de obesidade?' }],
  info:     [{ rotulo:'Onde pego o certificado?' }, { rotulo:'Como instalo o app no celular?' }, { rotulo:'Como exporto meu caderno?' }],
  sessao:   [{ rotulo:'Resuma esta sessão' }, { rotulo:'Anotar um slide', foto:true }, { rotulo:'Quem são os palestrantes?' }],
};

/* ── Conversa em memória, compartilhada entre a aba e o painel ── */
const _conversa = { msgs: [], carregando: false };
const _ouvintesConversa = new Set();
function _mudouConversa() { _ouvintesConversa.forEach(fn => fn()); }
function useConversa() {
  const [, forcar] = useState(0);
  useEffect(() => {
    const fn = () => forcar(n => n + 1);
    _ouvintesConversa.add(fn);
    return () => _ouvintesConversa.delete(fn);
  }, []);
  return _conversa;
}

/* Resposta da IA em texto corrido — para o histórico e para o Caderno. */
function ccemRespostaEmTexto(r) {
  const partes = [r.mensagem];
  if (r.pontos && r.pontos.length) partes.push(r.pontos.map(p => '• ' + p).join('\n'));
  if (r.referencia) partes.push('Referência: ' + r.referencia);
  const sess = (r.sessoes || []).map(id => SESSOES[id]).filter(Boolean);
  if (sess.length) partes.push(sess.map(s => `${s.inicio} · ${ccemRotulo(s)}`).join('\n'));
  return partes.filter(Boolean).join('\n\n');
}

/* ── Envio ao servidor ───────────────────────────────────────── */
// TODO: integrar com API real — já integrado: /api/assistente (Claude via Vercel).
async function ccemPerguntarAoAssistente({ texto, imagem, sessaoId, semHistorico }) {
  const historico = semHistorico ? [] : _conversa.msgs
    .filter(m => (m.papel === 'usuario' && m.texto) || (m.papel === 'assistente' && m.resposta))
    .slice(-6)
    .map(m => ({ papel: m.papel, texto: m.papel === 'usuario' ? m.texto : ccemRespostaEmTexto(m.resposta) }));
  const ctl = new AbortController();
  const relogio = setTimeout(() => ctl.abort(), 28000);
  try {
    const res = await fetch('/api/assistente', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ texto, imagem, sessaoId, historico, agora: ccemAgora().toISOString(), userId: window.CCEM_USER_ID }),
      signal: ctl.signal,
    });
    if (res.ok) return { resposta: await res.json() };
    if ([404, 405, 501, 503].includes(res.status)) return { aviso: CCEM_EM_TESTES };
    if (res.status === 429) return { aviso: 'Você chegou ao limite de 20 perguntas por hora. Tente de novo mais tarde.' };
    if (res.status === 504) return { aviso: 'O assistente demorou demais para responder. Tente de novo.' };
    if (res.status === 413) return { aviso: 'A foto ficou grande demais. Tente fotografar de novo.' };
    return { aviso: 'Não foi possível responder agora. Tente de novo.' };
  } catch (e) {
    return { aviso: e && e.name === 'AbortError'
      ? 'O assistente demorou demais para responder. Tente de novo.'
      : 'Sem conexão com a internet. Tente de novo quando a rede voltar.' };
  } finally {
    clearTimeout(relogio);
  }
}

async function ccemEnviarAoAssistente({ texto, arquivo, sessaoId }) {
  if (_conversa.carregando) return;
  texto = (texto || '').trim();
  let imagem = null, previa = null;
  if (arquivo) {
    try { ({ base64: imagem, previa } = await ccemReduzirFoto(arquivo)); }
    catch (e) { showToast('Não foi possível ler a foto'); return; }
  }
  if (!texto && !imagem) return;
  _conversa.msgs.push({ id: Date.now() + 'u', papel: 'usuario', texto, previa, sessaoId, ts: Date.now() });
  _conversa.carregando = true;
  _mudouConversa();
  const r = await ccemPerguntarAoAssistente({ texto, imagem, sessaoId });
  _conversa.msgs.push(r.resposta
    ? { id: Date.now() + 'a', papel: 'assistente', resposta: r.resposta, sessaoId, foto: !!imagem, previa, pergunta: texto, ts: Date.now() }
    : { id: Date.now() + 'v', papel: 'aviso', texto: r.aviso, ts: Date.now() });
  _conversa.carregando = false;
  _mudouConversa();
}

async function ccemSalvarNoCaderno(m) {
  // Pergunta e foto originais ficam na nota; a resposta vai em "Resumo da IA", separada.
  m.salvo = true;
  _mudouConversa();
  const sessaoId = SESSOES[m.sessaoId] ? m.sessaoId : '';
  const { ok, id } = await ccemGravarNota({ texto: m.pergunta || '', foto: m.previa || undefined, sessaoId,
                                            resumoIA: ccemRespostaEmTexto(m.resposta) });
  if (!ok) { m.salvo = false; _mudouConversa(); }
  return id;
}

/* ── Cabeçalho: identidade do assistente (5.6) ───────────────── */
function CabecalhoAssistente({ aoFechar }) {
  return (
    <div style={{display:'flex',alignItems:'center',gap:10,padding:'8px 8px 8px 14px',background:'#fff',borderBottom:`1px solid ${C.linhaSoft}`,flexShrink:0}}>
      <img src={CCEM_AVATAR} alt="" width="32" height="32" style={{width:32,height:32,borderRadius:'50%',background:C.azul,flexShrink:0}}/>
      <div style={{flex:1,minWidth:0}}>
        <div style={{display:'flex',alignItems:'center',gap:6}}>
          <span style={{fontSize:14,fontWeight:700,color:C.tinta}}>Assistente CCEM</span>
          <span style={{fontFamily:'DM Sans,system-ui,sans-serif',fontSize:12,fontWeight:600,color:C.ouroTxt,background:C.ouroBg,padding:'0 7px',borderRadius:8,letterSpacing:'0.04em'}}>beta</span>
        </div>
        <div style={{fontFamily:'DM Sans,system-ui,sans-serif',fontSize:12,color:C.cinza}}>IA · respostas podem conter erros</div>
      </div>
      {aoFechar&&(
        <button autoFocus onClick={aoFechar} aria-label="Fechar o assistente"
          style={{width:44,height:44,display:'flex',alignItems:'center',justifyContent:'center',background:'none',border:'none',cursor:'pointer',color:C.cinza,flexShrink:0,padding:0}}>
          <IcoX size={20}/>
        </button>
      )}
    </div>
  );
}

/* ── Uma resposta da IA, sempre como texto ───────────────────── */
function RespostaIA({ m, aoNavegar }) {
  const r = m.resposta;
  const sessoes = (r.sessoes || []).map(id => SESSOES[id]).filter(Boolean);
  return (
    <div style={{maxWidth:'92%',background:'#fff',border:`1px solid ${C.linhaSoft}`,borderRadius:'14px 14px 14px 4px',padding:'10px 12px',fontSize:13,lineHeight:1.5,color:C.tinta,boxShadow:'0 1px 6px rgba(29,62,138,.06)'}}>
      <p style={{margin:0,whiteSpace:'pre-wrap',fontWeight:r.modo==='anotacao'?600:400}}>{r.mensagem}</p>
      {r.pontos&&r.pontos.length>0&&(
        <ul style={{margin:'8px 0 0',paddingLeft:18}}>
          {r.pontos.map((p,i)=><li key={i} style={{marginBottom:3}}>{p}</li>)}
        </ul>
      )}
      {r.referencia&&<p style={{margin:'8px 0 0',fontSize:12,color:C.cinza}}>Referência: {r.referencia}</p>}
      {sessoes.length>0&&(
        <div style={{display:'flex',flexDirection:'column',gap:6,marginTop:10}}>
          {sessoes.map(s=>(
            <button key={s.id} onClick={()=>{ if(aoNavegar) aoNavegar(); go('#/sessao/'+s.id); }}
              style={{minHeight:44,display:'flex',alignItems:'center',gap:8,textAlign:'left',background:C.azulBg,border:'none',borderRadius:9,padding:'6px 10px',cursor:'pointer',fontFamily:'inherit'}}>
              <span style={{fontFamily:'DM Sans,system-ui,sans-serif',fontSize:12,fontWeight:700,color:C.azul,flexShrink:0}}>{s.dia===DIAS[0]?'sex':'sáb'} {s.inicio}</span>
              <span style={{flex:1,fontSize:12.5,fontWeight:600,color:C.tinta,lineHeight:1.3}}>{ccemRotulo(s)}</span>
              <IcoChevR size={14} color={C.azul}/>
            </button>
          ))}
        </div>
      )}
      <div style={{display:'flex',alignItems:'center',gap:8,marginTop:10,paddingTop:8,borderTop:`1px solid ${C.linhaSoft}`}}>
        <span style={{flex:1,fontFamily:'DM Sans,system-ui,sans-serif',fontSize:12,color:C.cinza}}>{CCEM_RODAPE_IA}</span>
        <button onClick={()=>!m.salvo&&ccemSalvarNoCaderno(m)} disabled={m.salvo}
          style={{minHeight:44,display:'flex',alignItems:'center',gap:5,background:'none',border:'none',padding:'0 4px',cursor:m.salvo?'default':'pointer',fontFamily:'DM Sans,sans-serif',fontSize:12,fontWeight:600,color:m.salvo?C.cinza:C.azul,flexShrink:0}}>
          {m.salvo?<><IcoCheck size={14}/>No caderno</>:<><IcoBook size={14}/>Salvar no caderno</>}
        </button>
      </div>
    </div>
  );
}

/* Dica de instalação no início da conversa: só no celular, fora do app instalado. */
function DicaInstalar() {
  const appState = useAppState();
  const { instalado, plataforma, nativo } = useInstalacao();
  const [folha, setFolha] = useState(false);
  if (instalado || plataforma === 'outro') return null;
  const temDados = Object.keys(appState.marks || {}).length > 0 || (appState.captures || []).length > 0;
  return (
    <div style={{display:'flex',gap:10,alignItems:'center',background:'#fff',border:`1px solid ${C.linhaSoft}`,borderLeft:`3px solid ${C.azul}`,borderRadius:12,padding:'10px 12px',marginBottom:12}}>
      <img src="icon-192.png" alt="" width="36" height="36" style={{borderRadius:9,flexShrink:0}}/>
      <div style={{flex:1,minWidth:0}}>
        <div style={{fontSize:13,fontWeight:700,color:C.tinta}}>Dica: instale o app na tela inicial</div>
        <div style={{fontSize:12,color:C.cinza,lineHeight:1.4}}>Abre pelo ícone, em tela cheia, e funciona sem internet.{plataforma==='ios'?' No iPhone, instale antes de começar a anotar.':''}</div>
      </div>
      <button onClick={async()=>{ if (!(plataforma==='android' && nativo && await ccemInstalarNativo())) setFolha(true); }}
        style={{minHeight:44,padding:'0 12px',background:C.azul,color:'#fff',border:'none',borderRadius:9,fontFamily:'DM Sans,sans-serif',fontSize:12.5,fontWeight:700,cursor:'pointer',flexShrink:0}}>
        {plataforma==='android'&&nativo?'Instalar':'Como instalar'}
      </button>
      {folha && <FolhaInstalar temDados={temDados} aoFechar={()=>setFolha(false)}/>}
    </div>
  );
}

/* ── Conversa: mensagens + sugestões + campo de texto ────────── */
function ConversaAssistente({ sessaoId, tela, aoNavegar }) {
  const conversa = useConversa();
  const [texto, setTexto] = useState('');
  const fotoRef = useRef(null);
  const fimRef  = useRef(null);
  const sessao  = SESSOES[sessaoId] || null;
  const sugestoes = CCEM_SUGESTOES[tela] || CCEM_SUGESTOES.home;

  useEffect(()=>{
    const el = fimRef.current;
    if (el && el.parentNode) el.parentNode.scrollTop = el.parentNode.scrollHeight;
  },[conversa.msgs.length, conversa.carregando]);

  function enviar(t){
    const v = (t!==undefined ? t : texto).trim();
    if (!v || conversa.carregando) return;
    if (t===undefined) setTexto('');
    ccemEnviarAoAssistente({ texto:v, sessaoId });
  }
  function usarSugestao(s){
    if (s.foto) { fotoRef.current && fotoRef.current.click(); return; }
    enviar(s.rotulo);
  }

  const vazia = conversa.msgs.length === 0;
  return (
    <div style={{flex:1,display:'flex',flexDirection:'column',minHeight:0,background:'#f3f6fc'}}>
      {sessao&&(
        <div style={{flexShrink:0,padding:'7px 14px',background:C.azulBg,fontFamily:'DM Sans,system-ui,sans-serif',fontSize:12,color:C.azul}}>
          Sobre <strong>{ccemRotulo(sessao)}</strong> · {sessao.inicio}
        </div>
      )}
      <div aria-busy={conversa.carregando} style={{flex:1,overflowY:'auto',padding:'12px 12px 4px'}}>
        {vazia&&(
          <div style={{padding:'6px 2px 4px'}}>
            <div style={{fontSize:15,fontWeight:700,color:C.tinta,marginBottom:4}}>Como posso ajudar?</div>
            <div style={{fontSize:12.5,color:C.cinza,lineHeight:1.5,marginBottom:12}}>
              Anoto slides (foto ou texto), busco no programa e respondo dúvidas práticas do congresso.
              Não discuto casos reais de pacientes.
            </div>
            <DicaInstalar/>
          </div>
        )}
        {conversa.msgs.map(m=>(
          <div key={m.id} style={{display:'flex',flexDirection:'column',alignItems:m.papel==='usuario'?'flex-end':'flex-start',marginBottom:10}}>
            {m.papel==='usuario'&&(
              <div style={{maxWidth:'86%',background:C.azul,color:'#fff',borderRadius:'14px 14px 4px 14px',padding:'9px 12px',fontSize:13,lineHeight:1.5}}>
                {m.previa&&<img src={m.previa} alt="Slide enviado" style={{display:'block',maxWidth:180,maxHeight:180,borderRadius:8,marginBottom:m.texto?6:0}}/>}
                {m.texto&&<span style={{whiteSpace:'pre-wrap'}}>{m.texto}</span>}
              </div>
            )}
            {m.papel==='assistente'&&<RespostaIA m={m} aoNavegar={aoNavegar}/>}
            {m.papel==='aviso'&&(
              <div style={{maxWidth:'92%',background:'#fff',border:`1px dashed ${C.linha}`,borderRadius:12,padding:'9px 12px',fontSize:12.5,color:C.cinza,lineHeight:1.45}}>{m.texto}</div>
            )}
          </div>
        ))}
        {conversa.carregando&&(
          <div role="status" style={{display:'inline-flex',alignItems:'center',gap:4,padding:'8px 12px',background:'#fff',borderRadius:'14px 14px 14px 4px',border:`1px solid ${C.linhaSoft}`,marginBottom:10}}>
            {[0,1,2].map(i=><span key={i} className="ccem-ponto" aria-hidden="true" style={{width:7,height:7,borderRadius:'50%',background:C.cinza,display:'inline-block',animation:`ccem-bounce .9s ${i*.2}s ease-in-out infinite`}}/>)}
            <span style={{marginLeft:6,fontFamily:'DM Sans,system-ui,sans-serif',fontSize:12,color:C.cinza}}>Preparando resposta…</span>
          </div>
        )}
        {!conversa.carregando&&(
          <div style={{display:'flex',flexWrap:'wrap',gap:6,margin:'4px 0 8px'}}>
            {sugestoes.map(s=>(
              <button key={s.rotulo} onClick={()=>usarSugestao(s)}
                style={{minHeight:44,display:'flex',alignItems:'center',gap:6,background:'#fff',border:`1px solid ${C.linha}`,borderRadius:22,padding:'0 14px',cursor:'pointer',fontFamily:'DM Sans,sans-serif',fontSize:12.5,fontWeight:500,color:C.azul}}>
                {s.foto&&<IcoCam size={15} color={C.azul}/>}{s.rotulo}
              </button>
            ))}
          </div>
        )}
        <div ref={fimRef}/>
      </div>

      <div style={{flexShrink:0,background:'#fff',borderTop:`1px solid ${C.linhaSoft}`,padding:'6px 10px 10px'}}>
        <div style={{fontFamily:'DM Sans,system-ui,sans-serif',fontSize:12,color:C.cinza,lineHeight:1.4,margin:'0 2px 6px'}}>{CCEM_PRIVACIDADE}</div>
        <div style={{display:'flex',alignItems:'center',gap:7}}>
          <input type="file" accept="image/*" capture="environment" ref={fotoRef} style={{display:'none'}}
            onChange={e=>{
              const f = e.target.files && e.target.files[0];
              e.target.value = '';
              if (!f) return;
              ccemEnviarAoAssistente({ arquivo:f, texto, sessaoId });
              setTexto('');
            }}/>
          <button onClick={()=>fotoRef.current&&fotoRef.current.click()} aria-label="Fotografar um slide" disabled={conversa.carregando}
            style={{width:44,height:44,display:'flex',alignItems:'center',justifyContent:'center',border:`1px solid ${C.linha}`,background:'#f8fafd',borderRadius:12,cursor:'pointer',flexShrink:0,padding:0}}>
            <IcoCam size={19} color={C.azul}/>
          </button>
          <input value={texto} onChange={e=>setTexto(e.target.value)} onKeyDown={e=>e.key==='Enter'&&!e.shiftKey&&enviar()}
            placeholder="Pergunte ou anote…" aria-label="Pergunta ao assistente" maxLength={2000}
            style={{flex:1,minWidth:0,minHeight:44,padding:'8px 14px',border:`1px solid ${C.linha}`,borderRadius:24,fontFamily:'DM Sans,sans-serif',fontSize:16,color:C.tinta,background:'#f8fafd',outline:'none'}}/>
          <button onClick={()=>enviar()} aria-label="Enviar" disabled={conversa.carregando||!texto.trim()}
            style={{width:44,height:44,display:'flex',alignItems:'center',justifyContent:'center',border:'none',background:C.azul,opacity:(conversa.carregando||!texto.trim())?0.45:1,borderRadius:12,cursor:'pointer',flexShrink:0,padding:0}}>
            <IcoSend size={17} color="#fff"/>
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Aba Assistente ──────────────────────────────────────────── */
function AssistenteScreen() {
  return (
    <div style={{display:'flex',flexDirection:'column',height:'100%',overflow:'hidden'}}>
      <CabecalhoAssistente/>
      <ConversaAssistente tela="home"/>
    </div>
  );
}

/* ── 5.7 · Painel que sobe sobre a tela atual (~85% da altura) ─ */
function PainelAssistente({ sessaoId, tela, aoFechar }) {
  const [entrou, setEntrou] = useState(false);
  useEffect(()=>{
    const id = requestAnimationFrame(()=>setEntrou(true));
    const esc = e => { if (e.key==='Escape') aoFechar(); };
    window.addEventListener('keydown', esc);
    return ()=>{ cancelAnimationFrame(id); window.removeEventListener('keydown', esc); };
  },[]);
  return (
    <div className="ccem-painel" onClick={aoFechar}
      style={{position:'fixed',inset:0,zIndex:300,background:entrou?'rgba(10,18,50,.38)':'rgba(10,18,50,0)',transition:'background .2s',display:'flex',flexDirection:'column',justifyContent:'flex-end'}}>
      <div role="dialog" aria-modal="true" aria-label="Assistente CCEM" onClick={e=>e.stopPropagation()}
        style={{height:'85%',width:'100%',maxWidth:560,margin:'0 auto',display:'flex',flexDirection:'column',overflow:'hidden',background:'#fff',
          borderRadius:'18px 18px 0 0',boxShadow:'0 -6px 32px rgba(10,18,50,.22)',
          transform:entrou?'translateY(0)':'translateY(100%)',transition:'transform .25s ease-out',
          paddingBottom:'env(safe-area-inset-bottom)'}}>
        <CabecalhoAssistente aoFechar={aoFechar}/>
        <ConversaAssistente sessaoId={sessaoId} tela={tela} aoNavegar={aoFechar}/>
      </div>
    </div>
  );
}

/* ── 5.7 · Botão "8" ─────────────────────────────────────────────
   Nunca abre sozinho, não pisca e, em repouso, fica parado.
   Movimento (experimento reversível): cinco gestos breves, locais e
   sem custo de IA — o CSS está em index.html (.ccem-fab-mov).
   - entrance/welcome: uma vez, na primeira apresentação, com o balão;
   - toque: compressão por :active, sem atrasar a abertura;
   - loading: brilho só com requisição real pendente há mais de 300 ms
     (visível quando o painel foi fechado durante a resposta);
   - success: uma vez, quando a resposta chega; erro não comemora.
   Desligar tudo: CCEM_MOVIMENTO_ASSISTENTE = false (os textos de estado
   continuam). "Reduzir movimento" do aparelho também desliga. */
const CCEM_MOVIMENTO_ASSISTENTE = true;
const _movimento = { apresentou: false };   // em memória: não repete ao navegar nem ao reabrir

function BotaoAssistente({ aoTocar, apresentando }) {
  const conversa = useConversa();
  const [estado, setEstado] = useState(() =>
    apresentando && !_movimento.apresentou && !_conversa.carregando ? 'entrance' : 'idle');
  const [aviso, setAviso] = useState('');   // estado em texto, também para leitor de tela
  const [oculto, setOculto] = useState(() => document.hidden);
  const timers = useRef([]);
  const carregavaAntes = useRef(_conversa.carregando);
  const limpar = () => { timers.current.forEach(clearTimeout); timers.current = []; };
  const depois = (ms, fn) => { timers.current.push(setTimeout(fn, ms)); };

  useEffect(() => {
    const vis = () => setOculto(document.hidden);
    document.addEventListener('visibilitychange', vis);
    return () => { document.removeEventListener('visibilitychange', vis); limpar(); };
  }, []);

  // Primeira apresentação: a entrada termina antes do gesto de boas-vindas.
  useEffect(() => {
    if (!apresentando || _movimento.apresentou || _conversa.carregando) return;
    _movimento.apresentou = true;
    limpar();
    setEstado('entrance');
    depois(320, () => setEstado('welcome'));
    depois(1120, () => setEstado('idle'));
  }, [apresentando]);

  // Requisição real do assistente.
  useEffect(() => {
    const antes = carregavaAntes.current;
    carregavaAntes.current = conversa.carregando;
    if (conversa.carregando) {
      limpar(); setEstado('idle'); setAviso('');
      depois(300, () => { setEstado('loading'); setAviso('Preparando resposta…'); });
      return;
    }
    if (!antes) return;
    limpar();
    const ultima = conversa.msgs[conversa.msgs.length - 1];
    if (ultima && ultima.papel === 'assistente') {
      setEstado('success'); setAviso('Resposta pronta · toque para ver');
      depois(480, () => setEstado('idle'));
    } else {
      setEstado('error'); setAviso('Sem resposta · toque para ver');
    }
    depois(4000, () => setAviso(''));
  }, [conversa.carregando]);

  return (
    <>
      <span className="ccem-sr" aria-live="polite">{aviso}</span>
      {aviso&&(
        <div aria-hidden="true"
          style={{position:'absolute',right:76,bottom:28,zIndex:40,maxWidth:'calc(100% - 100px)',padding:'5px 10px',background:'#fff',border:`1px solid ${C.linha}`,
            borderRadius:14,boxShadow:'0 2px 8px rgba(10,18,50,.12)',fontFamily:'DM Sans,system-ui,sans-serif',fontSize:12,fontWeight:600,color:C.azul,
            whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis',pointerEvents:'none'}}>{aviso}</div>
      )}
      <button className={'ccem-fab' + (CCEM_MOVIMENTO_ASSISTENTE ? ' ccem-fab-mov' : '') + (oculto ? ' ccem-fab-pausado' : '')}
        data-estado={estado} onClick={aoTocar} aria-label="Abrir o Assistente CCEM"
        style={{position:'absolute',right:16,bottom:16,zIndex:40,width:52,height:52,padding:0,border:'none',borderRadius:'50%',
          background:C.azul,cursor:'pointer',boxShadow:'0 4px 14px rgba(10,18,50,.28)',touchAction:'manipulation'}}>
        <span className="ccem-fab-corpo">
          <img src={CCEM_AVATAR} alt="" width="52" height="52" style={{display:'block',width:52,height:52,borderRadius:'50%'}}/>
          <span className="ccem-fab-brilho" aria-hidden="true"/>
        </span>
      </button>
    </>
  );
}

/* ── Apresentação no primeiro acesso ───────────────────────────
   Uma vez por aparelho, na Home ou no Programa, um balão sai do "8"
   dizendo o que o assistente faz. Não abre o painel sozinho: só com
   "Experimentar" ou tocando no "8". Fechado, não volta. */
const CCEM_APRESENTADO = 'ccem2026:assistenteApresentado';
function useApresentacaoAssistente() {
  const [pendente, setPendente] = useState(() => {
    try { return !localStorage.getItem(CCEM_APRESENTADO); } catch (e) { return !window.__ccemApresentado; }
  });
  const concluir = () => {
    try { localStorage.setItem(CCEM_APRESENTADO, '1'); } catch (e) {}
    window.__ccemApresentado = true;
    setPendente(false);
  };
  return [pendente, concluir];
}

function BalaoAssistente({ aoExperimentar, aoFechar }) {
  const appState = useAppState();
  const { instalado, plataforma, nativo } = useInstalacao();
  const [folha, setFolha] = useState(false);
  const podeInstalar = !instalado && plataforma !== 'outro';
  const temDados = Object.keys(appState.marks || {}).length > 0 || (appState.captures || []).length > 0;
  async function instalar() {
    if (plataforma === 'android' && nativo && await ccemInstalarNativo()) { aoFechar(); return; }
    setFolha(true);
  }
  const ITEM = { display:'flex', gap:8, alignItems:'flex-start', fontSize:13, color:C.tinta, lineHeight:1.4, marginBottom:5 };
  return (
    <div className="ccem-balao" role="dialog" aria-label="Conheça o Assistente CCEM"
      style={{position:'absolute',right:16,bottom:80,zIndex:41,width:'min(312px, calc(100% - 32px))',background:'#fff',
        borderRadius:14,border:`1px solid ${C.linha}`,boxShadow:'0 8px 28px rgba(10,18,50,.22)',padding:'12px 14px 10px'}}>
      <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:8}}>
        <img src={CCEM_AVATAR} alt="" width="32" height="32" style={{width:32,height:32,borderRadius:'50%'}}/>
        <div style={{flex:1}}>
          <div style={{display:'flex',alignItems:'center',gap:6}}>
            <span style={{fontSize:14,fontWeight:700,color:C.tinta}}>Assistente CCEM</span>
            <span style={{fontFamily:'DM Sans,system-ui,sans-serif',fontSize:12,fontWeight:600,color:C.ouroTxt,background:C.ouroBg,padding:'0 7px',borderRadius:8}}>beta</span>
          </div>
          <div style={{fontFamily:'DM Sans,system-ui,sans-serif',fontSize:12,color:C.cinza}}>IA · respostas podem conter erros</div>
        </div>
      </div>
      <div style={{fontSize:13,fontWeight:600,color:C.tinta,marginBottom:6}}>Posso ajudar durante o congresso:</div>
      <div style={ITEM}><IcoCam size={16} color={C.azul}/><span>Anotar um slide pela foto: mensagem-chave e pontos principais</span></div>
      <div style={ITEM}><IcoSearch size={16} color={C.azul}/><span>Encontrar sessões, temas e palestrantes</span></div>
      <div style={ITEM}><IcoChat size={16} color={C.azul}/><span>Responder dúvidas práticas: certificado, secretaria, local</span></div>
      {podeInstalar&&(
        <button onClick={instalar}
          style={{width:'100%',minHeight:44,display:'flex',alignItems:'center',gap:8,marginTop:4,padding:'6px 10px',background:C.azulBg,border:'none',borderRadius:10,cursor:'pointer',textAlign:'left',fontFamily:'DM Sans,sans-serif',fontSize:13,color:C.azul,fontWeight:600}}>
          <img src="icon-192.png" alt="" width="24" height="24" style={{borderRadius:6,flexShrink:0}}/>
          <span style={{flex:1}}>Instale o app na tela inicial{plataforma==='ios'?' antes de começar a usar':''}</span>
          <IcoChevR size={15} color={C.azul}/>
        </button>
      )}
      <div style={{display:'flex',gap:8,marginTop:10}}>
        <button onClick={aoFechar} style={{flex:1,minHeight:44,background:'#fff',border:`1px solid ${C.linha}`,borderRadius:10,fontFamily:'DM Sans,sans-serif',fontSize:13,fontWeight:600,color:C.cinza,cursor:'pointer'}}>Agora não</button>
        <button onClick={aoExperimentar} style={{flex:1,minHeight:44,background:C.azul,border:'none',borderRadius:10,fontFamily:'DM Sans,sans-serif',fontSize:13,fontWeight:700,color:'#fff',cursor:'pointer'}}>Experimentar</button>
      </div>
      <div style={{fontFamily:'DM Sans,system-ui,sans-serif',fontSize:12,color:C.cinza,textAlign:'center',marginTop:8}}>Depois, toque neste botão para falar comigo.</div>
      {folha && <FolhaInstalar temDados={temDados} aoFechar={()=>{ setFolha(false); aoFechar(); }}/>}
      {/* ponta do balão apontando para o "8" */}
      <span aria-hidden="true" style={{position:'absolute',right:20,bottom:-7,width:14,height:14,background:'#fff',borderRight:`1px solid ${C.linha}`,borderBottom:`1px solid ${C.linha}`,transform:'rotate(45deg)'}}/>
    </div>
  );
}

/* Teclado aberto no celular: some o botão para não disputar espaço. */
function useTecladoAberto() {
  const [aberto, setAberto] = useState(false);
  useEffect(()=>{
    const toque = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
    if (!toque) return;
    const ehCampo = el => !!el && (el.tagName==='TEXTAREA' ||
      (el.tagName==='INPUT' && !/^(file|button|checkbox|radio|submit|range)$/i.test(el.type)));
    const vv = window.visualViewport;
    const atualizar = () => setAberto(ehCampo(document.activeElement) || (vv ? window.innerHeight - vv.height > 150 : false));
    const depois = () => setTimeout(atualizar, 60);
    document.addEventListener('focusin', atualizar);
    document.addEventListener('focusout', depois);
    if (vv) vv.addEventListener('resize', atualizar);
    return ()=>{
      document.removeEventListener('focusin', atualizar);
      document.removeEventListener('focusout', depois);
      if (vv) vv.removeEventListener('resize', atualizar);
    };
  },[]);
  return aberto;
}

/* Outras telas pedem o painel por evento (ex.: "Anotar" na sessão). */
function ccemAbrirAssistente() { window.dispatchEvent(new CustomEvent('ccem:abrir-assistente')); }

Object.assign(window, {
  AssistenteScreen, PainelAssistente, BotaoAssistente, BalaoAssistente, useApresentacaoAssistente, useTecladoAberto, ccemAbrirAssistente,
  ccemRespostaEmTexto, CCEM_SUGESTOES,
});
